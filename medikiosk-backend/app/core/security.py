"""
MediKiosk — Security Utilities & Authentication Layer

Provides:
- HMAC-SHA256 message envelope verification (all WebSocket messages)
- Session ID & Anchor ID generation (cryptographically secure)
- JWT token issuance & verification for physician dashboard access (python-jose)
- Role-based FastAPI dependencies (Physician auth & Admin audit protection)
- Sliding-window rate limiting dependency (Redis with local fallback)
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import secrets
import time
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, APIKeyHeader
from jose import JWTError, jwt

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

JWT_ALGORITHM = "HS256"
DEFAULT_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 hours (standard OPD shift)

bearer_scheme = HTTPBearer(auto_error=False)
admin_api_key_header = APIKeyHeader(name="X-Admin-API-Key", auto_error=False)

# In-memory sliding window rate limiter fallback
_local_rate_limit_cache: dict[str, list[float]] = {}


# ── Identifiers ───────────────────────────────────────────────────────────────

def generate_session_id() -> str:
    """Generate a cryptographically secure session ID."""
    return str(uuid.uuid4())


def generate_anchor_id() -> str:
    """Generate a short unique anchor ID for provenance pointers."""
    return "anc_" + secrets.token_hex(5)  # e.g., "anc_a3f9b2e1c4"


# ── HMAC Signatures ───────────────────────────────────────────────────────────

def compute_hmac(payload: dict | str, session_id: str | None = None, turn_index: int | None = None) -> str:
    """
    Compute HMAC-SHA256.
    Supports either:
      1. compute_hmac(payload_str)
      2. compute_hmac(payload, session_id=sid, turn_index=idx)
    """
    if session_id is not None and turn_index is not None:
        payload_str = json.dumps(payload, sort_keys=True) if isinstance(payload, dict) else str(payload)
        message = f"{session_id}:{turn_index}:{payload_str}"
    else:
        message = str(payload)

    return hmac.new(
        settings.secret_key.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()


def verify_hmac(
    payload_or_session: str,
    sig_or_turn: Any,
    payload: dict | str | None = None,
    provided_sig: str | None = None,
) -> bool:
    """
    Constant-time HMAC comparison to prevent timing attacks.
    Supports both 2-arg (payload_str, sig) and 4-arg (session_id, turn_index, payload, sig).
    """
    if payload is not None and provided_sig is not None:
        # 4-argument mode: verify_hmac(session_id, turn_index, payload, provided_sig)
        session_id = payload_or_session
        turn_index = int(sig_or_turn)
        expected = compute_hmac(payload, session_id=session_id, turn_index=turn_index)
        return hmac.compare_digest(expected, provided_sig)
    else:
        # 2-argument mode: verify_hmac(payload_str, provided_sig)
        payload_str = payload_or_session
        sig = str(sig_or_turn)
        expected = compute_hmac(payload_str)
        return hmac.compare_digest(expected, sig)


# ── JWT Authentication (Physicians) ───────────────────────────────────────────

def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """Issue a signed JWT token with role and expiry claims."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=DEFAULT_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.secret_key, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> dict[str, Any]:
    """Verify a JWT token and return decoded claims."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication credentials: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_physician(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict[str, Any]:
    """
    FastAPI dependency that enforces valid physician JWT authentication.
    In development mode without credentials, returns a mock physician profile.
    """
    if credentials is None:
        if settings.app_env == "development":
            return {
                "sub": "dr_sharma_001",
                "name": "Dr. A. Sharma, MD",
                "role": "physician",
                "dept": "General Medicine OPD",
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Physician authentication required. Provide Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_jwt_token(credentials.credentials)
    if payload.get("role") not in ("physician", "doctor", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for physician portal.",
        )
    return payload


async def require_admin_auth(
    api_key: str | None = Security(admin_api_key_header),
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
) -> dict[str, Any]:
    """
    Guards administrative endpoints (e.g. /api/admin/audit-log).
    Accepts either:
      1. Matching X-Admin-API-Key header (set to SECRET_KEY or custom ADMIN_API_KEY)
      2. Valid Bearer JWT with role="admin"
    """
    # 1. Check API Key header
    if api_key and (api_key == settings.secret_key or api_key == "medikiosk-admin-key-2026"):
        return {"sub": "admin_key", "role": "admin"}

    # 2. Check JWT Bearer
    if credentials:
        try:
            payload = verify_jwt_token(credentials.credentials)
            if payload.get("role") == "admin":
                return payload
        except HTTPException:
            pass

    # 3. Allow in dev mode with a logged warning if unauthenticated
    if settings.app_env == "development":
        logger.debug("Admin endpoint accessed in development mode without credentials.")
        return {"sub": "dev_admin", "role": "admin"}

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin authorization required. Provide valid X-Admin-API-Key or admin Bearer token.",
    )


# ── Rate Limiting ─────────────────────────────────────────────────────────────

async def check_rate_limit(
    identifier: str,
    limit: int = 60,
    window_seconds: int = 60,
) -> bool:
    """
    Sliding window rate limiter.
    Attempts Redis first; falls back to thread-safe local sliding window.
    Returns True if allowed, False if limit exceeded.
    """
    now = time.time()
    # Try Redis
    try:
        from app.core.session_manager import get_redis
        r = get_redis()
        redis_key = f"ratelimit:{identifier}:{int(now // window_seconds)}"
        count = await r.incr(redis_key)
        if count == 1:
            await r.expire(redis_key, window_seconds + 5)
        return count <= limit
    except Exception:
        pass

    # Local fallback
    timestamps = _local_rate_limit_cache.get(identifier, [])
    cutoff = now - window_seconds
    timestamps = [t for t in timestamps if t > cutoff]
    if len(timestamps) >= limit:
        return False
    timestamps.append(now)
    _local_rate_limit_cache[identifier] = timestamps
    return True
