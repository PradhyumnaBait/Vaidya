"""
MediKiosk — Security Utilities

Provides:
- HMAC-SHA256 message envelope verification (all WebSocket messages)
- Session ID generation (cryptographically secure UUID4)
- JWT validation for physician dashboard access
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import secrets
import uuid

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def generate_session_id() -> str:
    """Generate a cryptographically secure session ID."""
    return str(uuid.uuid4())


def compute_hmac(session_id: str, turn_index: int, payload: dict | str) -> str:
    """
    Compute HMAC-SHA256 over (session_id + turn_index + serialised payload).
    Used to sign every outbound WebSocket message and verify every inbound one.
    """
    if isinstance(payload, dict):
        payload_str = json.dumps(payload, sort_keys=True)
    else:
        payload_str = str(payload)

    message = f"{session_id}:{turn_index}:{payload_str}"
    sig = hmac.new(
        settings.secret_key.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()
    return sig


def verify_hmac(
    session_id: str,
    turn_index: int,
    payload: dict | str,
    provided_sig: str,
) -> bool:
    """Constant-time HMAC comparison to prevent timing attacks."""
    expected = compute_hmac(session_id, turn_index, payload)
    return hmac.compare_digest(expected, provided_sig)


def generate_anchor_id() -> str:
    """Generate a short unique anchor ID for traceability pointers."""
    return "anc_" + secrets.token_hex(5)  # e.g., "anc_a3f9b2e1c4"
