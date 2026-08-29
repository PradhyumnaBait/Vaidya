"""
Unit tests for security, JWT authentication, and rate limiting.
"""
import pytest
from fastapi import HTTPException
from jose import jwt

from app.core import security
from app.config import get_settings

settings = get_settings()


class TestHMACSecurity:
    def test_hmac_2_args_compute_and_verify(self):
        payload = "session-123:touch_input:1725000000"
        sig = security.compute_hmac(payload)
        assert len(sig) == 64
        assert security.verify_hmac(payload, sig) is True
        assert security.verify_hmac(payload, "invalid_sig") is False

    def test_hmac_4_args_compute_and_verify(self):
        sid = "test-session"
        turn = 2
        data = {"slot": "site", "value": "chest"}
        sig = security.compute_hmac(data, session_id=sid, turn_index=turn)
        assert security.verify_hmac(sid, turn, data, sig) is True
        assert security.verify_hmac(sid, turn, data, "tampered_sig") is False


class TestJWTAuth:
    def test_create_and_verify_token(self):
        claims = {"sub": "dr_patel_001", "role": "physician", "name": "Dr. Patel"}
        token = security.create_access_token(claims)
        assert isinstance(token, str)

        decoded = security.verify_jwt_token(token)
        assert decoded["sub"] == "dr_patel_001"
        assert decoded["role"] == "physician"
        assert "exp" in decoded

    def test_tampered_token_raises(self):
        claims = {"sub": "dr_patel_001", "role": "physician"}
        token = security.create_access_token(claims)
        tampered = token[:-4] + "abcd"
        with pytest.raises(HTTPException) as exc_info:
            security.verify_jwt_token(tampered)
        assert exc_info.value.status_code == 401


@pytest.mark.asyncio
class TestRateLimiting:
    async def test_rate_limit_allows_under_threshold(self):
        key = "test-client-allowed"
        for _ in range(5):
            allowed = await security.check_rate_limit(key, limit=10, window_seconds=60)
            assert allowed is True

    async def test_rate_limit_blocks_over_threshold(self):
        key = "test-client-blocked"
        for _ in range(5):
            await security.check_rate_limit(key, limit=5, window_seconds=60)
        # 6th request must be blocked
        blocked = await security.check_rate_limit(key, limit=5, window_seconds=60)
        assert blocked is False
