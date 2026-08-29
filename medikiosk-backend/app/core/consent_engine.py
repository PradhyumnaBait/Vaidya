"""
MediKiosk — DPDP Act 2023 Consent Engine

Implements:
- Audio-guided consent delivery (Bhashini TTS pre-recorded text)
- Explicit two-option consent (Agree / Do Not Agree — no timeouts)
- Append-only consent audit log (session hash only, never session ID)
- Consent version pinning for legal reproducibility
"""
from __future__ import annotations

import hashlib
import json
import logging
import time
from typing import Any

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

CONSENT_VERSION = "v1.2"

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


# ── In-memory audit log (in production: replace with asyncpg Postgres write) ─

_AUDIT_LOG: list[dict[str, Any]] = []


async def record_consent_event(
    session_id: str,
    language: str,
    granted: bool,
) -> None:
    """
    Appends a consent event to the audit log.
    ONLY the SHA-256 hash of session_id is stored — the original session_id
    is never written to the audit log, making it non-reversible.
    """
    event: dict[str, Any] = {
        "session_id_hash": _session_hash(session_id),
        "consent_granted": granted,
        "language": language,
        "consent_version": CONSENT_VERSION,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    _AUDIT_LOG.append(event)
    logger.info(
        "Consent event recorded: session_hash=%s granted=%s",
        event["session_id_hash"][:12],
        granted,
    )


async def record_teardown_event(
    session_id: str,
    payload_transmitted: bool,
) -> None:
    """Record session teardown for compliance audit trail."""
    event: dict[str, Any] = {
        "session_id_hash": _session_hash(session_id),
        "event": "SESSION_TEARDOWN",
        "payload_transmitted": payload_transmitted,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    _AUDIT_LOG.append(event)
    logger.info(
        "Teardown event recorded: session_hash=%s transmitted=%s",
        event["session_id_hash"][:12],
        payload_transmitted,
    )


def get_audit_log() -> list[dict[str, Any]]:
    """Return a copy of the in-memory audit log (no PHI contained)."""
    return list(_AUDIT_LOG)
