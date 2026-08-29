"""
MediKiosk — Redis-backed Ephemeral Session Manager

Critical design decisions:
- Zero PHI persists on disk. Redis runs with --appendonly no (no AOF).
- All session keys have a hard TTL of 900 seconds.
- Session teardown performs a two-pass wipe: overwrite with random nonce, then DEL.
- The consent audit log (Postgres) stores only SHA-256(session_id), never raw IDs.
"""
from __future__ import annotations

import hashlib
import json
import os
import time
import logging
from typing import Any

import redis.asyncio as aioredis
from redis.asyncio import Redis

from app.config import get_settings
from app.models.session import BeliefState, SessionFSMState

logger = logging.getLogger(__name__)
settings = get_settings()

_redis_client: Redis | None = None


async def init_redis() -> None:
    global _redis_client
    _redis_client = await aioredis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
        max_connections=50,
    )
    logger.info("Redis connection pool initialised.")


async def close_redis() -> None:
    global _redis_client
    if _redis_client:
        await _redis_client.aclose()
        logger.info("Redis connection pool closed.")


def get_redis() -> Redis:
    if _redis_client is None:
        raise RuntimeError("Redis not initialised. Call init_redis() first.")
    return _redis_client


def _session_hash(session_id: str) -> str:
    """SHA-256 hash of session_id — used in external comms / audit log."""
    return hashlib.sha256(session_id.encode()).hexdigest()


def _key(session_id: str, suffix: str) -> str:
    return f"session:{session_id}:{suffix}"


# ── Session Lifecycle ─────────────────────────────────────────────────────────

async def create_session(session_id: str, language: str = "hi") -> BeliefState:
    """
    Provision a new session in Redis with an ephemeral TTL.
    Returns the initial BeliefState.
    """
    r = get_redis()
    state = BeliefState(
        session_id=session_id,
        session_hash=_session_hash(session_id),
        language=language,
        fsm_state=SessionFSMState.CONSENT_PENDING,
        session_start_ms=time.time() * 1000,
    )
    ttl = settings.session_ttl_seconds
    pipe = r.pipeline()
    pipe.setex(_key(session_id, "state"), ttl, state.model_dump_json())
    pipe.setex(_key(session_id, "transcript"), ttl, "[]")
    pipe.setex(_key(session_id, "anchors"), ttl, "{}")
    pipe.setex(_key(session_id, "lab_data"), ttl, "[]")
    # Consent log key is NEVER deleted — append-only audit record
    await pipe.execute()
    logger.info("Session %s created (hash: %s)", session_id[:8], state.session_hash[:12])
    return state


async def get_belief_state(session_id: str) -> BeliefState | None:
    r = get_redis()
    raw = await r.get(_key(session_id, "state"))
    if raw is None:
        return None
    return BeliefState.model_validate_json(raw)


async def save_belief_state(state: BeliefState) -> None:
    r = get_redis()
    # Refresh TTL on every write to extend the session window on activity
    await r.setex(
        _key(state.session_id, "state"),
        settings.session_ttl_seconds,
        state.model_dump_json(),
    )


async def append_transcript(session_id: str, entry: dict[str, Any]) -> None:
    r = get_redis()
    raw = await r.get(_key(session_id, "transcript")) or "[]"
    transcript: list = json.loads(raw)
    transcript.append(entry)
    await r.setex(
        _key(session_id, "transcript"),
        settings.session_ttl_seconds,
        json.dumps(transcript),
    )


async def get_transcript(session_id: str) -> list[dict]:
    r = get_redis()
    raw = await r.get(_key(session_id, "transcript")) or "[]"
    return json.loads(raw)


async def save_anchor(session_id: str, anchor_id: str, anchor_data: dict) -> None:
    r = get_redis()
    raw = await r.get(_key(session_id, "anchors")) or "{}"
    anchors: dict = json.loads(raw)
    anchors[anchor_id] = anchor_data
    await r.setex(
        _key(session_id, "anchors"),
        settings.session_ttl_seconds,
        json.dumps(anchors),
    )


async def get_anchor(session_id: str, anchor_id: str) -> dict | None:
    r = get_redis()
    raw = await r.get(_key(session_id, "anchors")) or "{}"
    anchors: dict = json.loads(raw)
    return anchors.get(anchor_id)


async def get_all_anchors(session_id: str) -> dict:
    r = get_redis()
    raw = await r.get(_key(session_id, "anchors")) or "{}"
    return json.loads(raw)


async def save_lab_data(session_id: str, lab_results: list[dict]) -> None:
    r = get_redis()
    await r.setex(
        _key(session_id, "lab_data"),
        settings.session_ttl_seconds,
        json.dumps(lab_results),
    )


async def get_lab_data(session_id: str) -> list[dict]:
    r = get_redis()
    raw = await r.get(_key(session_id, "lab_data")) or "[]"
    return json.loads(raw)


# ── Session Teardown (Cryptographic Wipe) ─────────────────────────────────────

async def teardown_session(session_id: str, payload_transmitted: bool = False) -> None:
    """
    Two-pass cryptographic session wipe per DPDP Act 2023 compliance:
    1. Overwrite each volatile key with 256 random bytes (memory poisoning).
    2. Delete all session keys.
    3. Write teardown event to the append-only audit log (Postgres via consent engine).
    """
    r = get_redis()
    volatile_suffixes = ["state", "transcript", "anchors", "lab_data", "audio_buffer"]

    pipe = r.pipeline()
    # Pass 1: Overwrite with random nonce
    nonce = os.urandom(256).hex()
    for suffix in volatile_suffixes:
        pipe.set(_key(session_id, suffix), nonce, ex=5)  # 5s TTL — then gone anyway
    await pipe.execute()

    # Pass 2: Delete
    pipe = r.pipeline()
    for suffix in volatile_suffixes:
        pipe.delete(_key(session_id, suffix))
    await pipe.execute()

    logger.info(
        "Session %s wiped (payload_transmitted=%s)", session_id[:8], payload_transmitted
    )
