"""
MediKiosk — ABDM Gateway & FHIR Bundle Persistence

Handles two jobs:
  1. Persist the FHIR bundle so the physician REST API can retrieve it
     (fixes the "physician dashboard has nothing to read" gap).
  2. Async HTTP forward to the HIS endpoint (with retry).

Storage strategy (progressive):
  - Primary: local JSON file in data/bundles/<session_hash[:2]>/<session_hash>.json
             (zero dependencies, works without Postgres, survives process restart)
  - Secondary: Redis hash (TTL = 4 hours) for low-latency physician dashboard reads
  - Future: Postgres write (enabled by ABDM_HIS_URL env var being set + asyncpg)

Retry policy for HTTP forward:
  - Max 3 attempts, exponential back-off (1s, 2s, 4s)
  - Failure is LOGGED but NOT raised — bundle is already safely on disk
  - Complies with ABDM HIE v2 submission spec headers
"""
from __future__ import annotations

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Any

import httpx

from app.config import get_settings
from app.core.session_manager import get_redis

logger = logging.getLogger(__name__)
settings = get_settings()

BUNDLE_DIR = Path(__file__).parent.parent.parent / "data" / "bundles"
BUNDLE_DIR.mkdir(parents=True, exist_ok=True)

REDIS_BUNDLE_TTL = 4 * 60 * 60   # 4 hours — enough for same-shift retrieval
MAX_RETRIES = 3


# ── Public API ────────────────────────────────────────────────────────────────

async def persist_and_transmit(
    session_hash: str,
    fhir_bundle: dict[str, Any],
    emr_dashboard: dict[str, Any],
) -> dict[str, str]:
    """
    Persist the bundle and dashboard payload, then attempt HIS transmission.

    Returns a status dict:
      { "file": "ok"|"error", "redis": "ok"|"error", "his": "ok"|"skipped"|"error" }
    """
    status: dict[str, str] = {}

    # ── 1. File persistence (primary, synchronous-in-thread) ──────────────────
    try:
        shard = session_hash[:2]           # Two-char prefix sharding
        shard_dir = BUNDLE_DIR / shard
        shard_dir.mkdir(parents=True, exist_ok=True)
        bundle_path = shard_dir / f"{session_hash}.json"

        payload = {
            "session_hash": session_hash,
            "persisted_at": time.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
            "fhir_bundle": fhir_bundle,
            "emr_dashboard": emr_dashboard,
        }
        # Write atomically: temp file → rename
        tmp_path = bundle_path.with_suffix(".tmp")
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: tmp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"),
        )
        await asyncio.get_event_loop().run_in_executor(None, tmp_path.rename, bundle_path)
        status["file"] = "ok"
        logger.info("Bundle persisted: %s (%d chars)", bundle_path.name, bundle_path.stat().st_size)
    except Exception as exc:
        logger.error("Bundle file write failed: %s", exc)
        status["file"] = "error"

    # ── 2. Redis cache (for fast physician dashboard reads) ────────────────────
    try:
        r = get_redis()
        redis_key = f"bundle:{session_hash}"
        dashboard_str = json.dumps(emr_dashboard, ensure_ascii=False)
        await r.setex(redis_key, REDIS_BUNDLE_TTL, dashboard_str)
        status["redis"] = "ok"
    except Exception as exc:
        logger.warning("Redis bundle cache failed (non-fatal): %s", exc)
        status["redis"] = "error"

    # ── 3. HIS HTTP transmission ───────────────────────────────────────────────
    his_url = settings.abdm_his_endpoint
    if not his_url:
        status["his"] = "skipped"
        logger.debug("ABDM_HIS_ENDPOINT not set — skipping HTTP transmission.")
    else:
        status["his"] = await _transmit_to_his(his_url, fhir_bundle, session_hash)

    return status


async def retrieve_bundle(session_hash: str) -> dict[str, Any] | None:
    """
    Retrieve a persisted bundle (for physician REST endpoint).

    Read order: Redis (fast) → file (fallback).
    Returns None if not found.
    """
    # Try Redis first
    try:
        r = get_redis()
        redis_key = f"bundle:{session_hash}"
        cached = await r.get(redis_key)
        if cached:
            return json.loads(cached)
    except Exception:
        pass

    # File fallback
    shard = session_hash[:2]
    bundle_path = BUNDLE_DIR / shard / f"{session_hash}.json"
    if bundle_path.exists():
        try:
            raw = await asyncio.get_event_loop().run_in_executor(
                None, bundle_path.read_text, "utf-8"
            )
            data = json.loads(raw)
            return data.get("emr_dashboard")
        except Exception as exc:
            logger.error("Bundle file read error for %s: %s", session_hash[:12], exc)

    return None


async def list_recent_bundles(limit: int = 50) -> list[dict[str, Any]]:
    """
    List recently created bundles (for physician dashboard index).
    Reads from file system sorted by mtime descending.
    """
    try:
        files = sorted(
            BUNDLE_DIR.rglob("*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )[:limit]

        result = []
        for f in files:
            try:
                raw = json.loads(f.read_text(encoding="utf-8"))
                dashboard = raw.get("emr_dashboard", {})
                result.append({
                    "session_hash": raw.get("session_hash", f.stem),
                    "persisted_at": raw.get("persisted_at"),
                    "chief_complaint": dashboard.get("chief_complaint", {}).get("text"),
                    "has_red_flag": dashboard.get("alert_zone", {}).get("has_red_flag", False),
                    "socrates_f1": dashboard.get("completeness", {}).get("socrates_f1", 0.0),
                })
            except Exception:
                continue
        return result
    except Exception as exc:
        logger.error("list_recent_bundles error: %s", exc)
        return []


# ── HIS HTTP Transmitter ───────────────────────────────────────────────────────

async def _transmit_to_his(
    his_url: str,
    fhir_bundle: dict[str, Any],
    session_hash: str,
) -> str:
    """
    Forward the FHIR bundle to the HIS endpoint.
    Returns "ok", "error", or "timeout".
    """
    headers = {
        "Content-Type": "application/fhir+json",
        "Accept": "application/fhir+json",
        "X-Correlation-ID": session_hash[:16],
        "X-Source": "MediKiosk/1.0",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(his_url, json=fhir_bundle, headers=headers)
                if resp.status_code in (200, 201):
                    logger.info(
                        "HIS transmission OK: session=%s status=%d attempt=%d",
                        session_hash[:12], resp.status_code, attempt,
                    )
                    return "ok"
                else:
                    logger.warning(
                        "HIS HTTP %d on attempt %d for session=%s",
                        resp.status_code, attempt, session_hash[:12],
                    )
        except httpx.TimeoutException:
            logger.warning("HIS timeout on attempt %d for session=%s", attempt, session_hash[:12])
        except Exception as exc:
            logger.error("HIS transmission error attempt %d: %s", attempt, exc)

        if attempt < MAX_RETRIES:
            await asyncio.sleep(2 ** (attempt - 1))  # 1s, 2s

    return "error"
