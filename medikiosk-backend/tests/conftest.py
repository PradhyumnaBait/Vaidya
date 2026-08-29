"""
MediKiosk — pytest conftest.py

Sets up shared fixtures:
- Mock settings (no real env vars required for unit tests)
- Mock Redis
- Sample BeliefState factories
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.fixture(autouse=True)
def mock_settings(monkeypatch):
    """
    Patch get_settings() to return test-safe defaults.
    Prevents tests from requiring actual .env files.
    """
    test_env = {
        "APP_ENV": "test",
        "SECRET_KEY": "test-secret-key-32-chars-minimum!!",
        "REDIS_URL": "redis://localhost:6379/1",
        "GROQ_API_KEY": "gsk_test_key",
        "BHASHINI_API_KEY": "test-bhashini-key",
        "BHASHINI_USER_ID": "test-user-id",
        "PINECONE_API_KEY": "test-pinecone-key",
        "PINECONE_INDEX_NAME": "medikiosk-test",
        "GCP_PROJECT_ID": "test-project",
        "DOCUMENT_AI_PROCESSOR_ID": "test-processor",
        "DOCUMENT_AI_LOCATION": "us",
        "MAX_TURNS": "12",
        "MAX_SESSION_MS": "300000",
        "SESSION_TTL_SECONDS": "900",
        "MIN_DOSHA_THRESHOLD": "2.5",
        "MIN_AGNI_CONFIDENCE": "2.0",
        "LLM_TIMEOUT_MS": "3000",
        "BHASHINI_ARBITRATION_WINDOW_MS": "1500",
    }
    for k, v in test_env.items():
        monkeypatch.setenv(k, v)

    # Force settings cache to reload
    from app.config import get_settings
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
