"""
MediKiosk — DPDP Act 2023 Consent Engine

Audit Log Persistence (Fix #3):
  data/audit_log.jsonl — append-only, survives process restarts.
  No PHI: only SHA-256(session_id) is stored.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import threading
import time
from pathlib import Path
from typing import Any

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

CONSENT_VERSION = "v1.2"

# ── File-backed audit log ─────────────────────────────────────────────────────
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
AUDIT_LOG_PATH = DATA_DIR / "audit_log.jsonl"
_audit_lock = threading.Lock()

# Pre-recorded consent text per language (played via Bhashini TTS)
# These are the exact consent statements that will be read aloud to the patient.
CONSENT_TEXTS: dict[str, str] = {
    "hi": (
        "आपकी चिकित्सा जानकारी आज आपके डॉक्टर के साथ साझा की जाएगी। "
        "इसे स्थायी रूप से यहाँ संग्रहीत नहीं किया जाएगा। "
        "आप कभी भी रुक सकते हैं। क्या आप सहमत हैं?"
    ),
    "mr": (
        "आपची वैद्यकीय माहिती आज आपल्या डॉक्टरांसोबत शेअर केली जाईल. "
        "ती येथे कायमस्वरूपी साठवली जाणार नाही. "
        "तुम्ही कधीही थांबू शकता. तुम्ही सहमत आहात का?"
    ),
    "gu": (
        "તમારી તબીબી માહિતી આજે તમારા ડૉક્ટર સાથે શેર કરવામાં આવશે. "
        "તેને અહીં કાયમ માટે સ્ટોર કરવામાં આવશે નહીં. "
        "તમે ગમે ત્યારે રોકી શકો છો. શું તમે સંમત છો?"
    ),
    "en": (
        "Your medical information will be shared with your doctor today. "
        "It will not be stored here permanently. "
        "You may stop at any time. Do you agree?"
    ),
}


class ConsentDeniedError(Exception):
    """Raised when the patient explicitly denies consent."""


def get_consent_text(language: str) -> str:
    return CONSENT_TEXTS.get(language, CONSENT_TEXTS["en"])


def _session_hash(session_id: str) -> str:
    return hashlib.sha256(session_id.encode()).hexdigest()


# ── In-memory + file audit log ───────────────────────────────────────────────

def _write_audit_event_sync(event: dict[str, Any]) -> None:
    """Thread-safe append of one JSON line to audit_log.jsonl."""
    line = json.dumps(event, ensure_ascii=False) + "\n"
    with _audit_lock:
        with open(AUDIT_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line)


async def _append_audit_event(event: dict[str, Any]) -> None:
    """Async wrapper — offloads file I/O to thread pool."""
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _write_audit_event_sync, event)
    except Exception as exc:
        logger.error("AUDIT LOG WRITE FAILURE (compliance risk): %s | event=%s", exc, event)


async def record_consent_event(
    session_id: str,
    language: str,
    granted: bool,
) -> None:
    """
    Appends a consent event to the persistent JSONL audit log.
    ONLY SHA-256(session_id) is stored — never the session_id itself.
    DPDP Act 2023: must survive process restarts.
    """
    event: dict[str, Any] = {
        "event": "CONSENT_DECISION",
        "session_id_hash": _session_hash(session_id),
        "consent_granted": granted,
        "language": language,
        "consent_version": CONSENT_VERSION,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    await _append_audit_event(event)
    logger.info(
        "Consent event recorded: session_hash=%s granted=%s",
        event["session_id_hash"][:12], granted,
    )


async def record_teardown_event(
    session_id: str,
    payload_transmitted: bool,
) -> None:
    """
    Record session teardown.
    payload_transmitted=True  → synthesis persisted.
    payload_transmitted=False → consent denied or early disconnect.
    """
    event: dict[str, Any] = {
        "event": "SESSION_TEARDOWN",
        "session_id_hash": _session_hash(session_id),
        "payload_transmitted": payload_transmitted,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    await _append_audit_event(event)
    logger.info(
        "Teardown event recorded: session_hash=%s transmitted=%s",
        event["session_id_hash"][:12], payload_transmitted,
    )


def get_audit_log(limit: int = 200) -> list[dict[str, Any]]:
    """Read last `limit` events from persistent audit file. Returns newest-first."""
    if not AUDIT_LOG_PATH.exists():
        return []
    try:
        with _audit_lock:
            lines = AUDIT_LOG_PATH.read_text(encoding="utf-8").strip().splitlines()
        events = []
        for line in reversed(lines[-limit:]):
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        return events
    except Exception as exc:
        logger.error("Audit log read error: %s", exc)
        return []
