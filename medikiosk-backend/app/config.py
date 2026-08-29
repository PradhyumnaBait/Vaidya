"""
MediKiosk Backend — Configuration
Pydantic Settings reads from .env file and environment variables.
All secrets are loaded from the environment; never hard-coded.
"""
from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Core ──────────────────────────────────────────────────────────────────
    # "test" is used by the pytest conftest to prevent real I/O during unit tests.
    app_env: Literal["development", "production", "test"] = "development"
    secret_key: str = "INSECURE-CHANGE-IN-PRODUCTION-32+"
    session_ttl_seconds: int = 900

    # ── Redis ─────────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"

    # ── Audit Database ────────────────────────────────────────────────────────
    # Optional Postgres URL for persistent DPDP audit log.
    # If empty, audit events are written to data/audit_log.jsonl (file fallback).
    # Full Postgres support: set AUDIT_DATABASE_URL and run alembic migrations.
    audit_database_url: str = ""    # empty = use file-backed audit log

    # ── LLM / Groq ────────────────────────────────────────────────────────────
    groq_api_key: str = ""
    groq_model: str = "llama3-8b-8192"
    llm_max_tokens: int = 512
    llm_temperature: float = 0.1
    llm_timeout_ms: int = 3000

    # ── Bhashini ──────────────────────────────────────────────────────────────
    bhashini_api_key: str = ""
    bhashini_user_id: str = ""
    bhashini_asr_endpoint: str = (
        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    )
    bhashini_tts_endpoint: str = (
        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    )
    bhashini_confidence_threshold: float = 0.70
    bhashini_arbitration_window_ms: int = 2500

    # ── Pinecone ──────────────────────────────────────────────────────────────
    pinecone_api_key: str = ""
    pinecone_index_name: str = "medikiosk-ontology"
    pinecone_environment: str = "us-east-1"

    # ── Google Cloud Document AI ──────────────────────────────────────────────
    google_application_credentials: str = ""
    gcp_project_id: str = ""
    document_ai_processor_id: str = ""
    document_ai_location: str = "us"

    # ── Hospital HIS / ABDM ───────────────────────────────────────────────────
    # Set ABDM_HIS_ENDPOINT to a real URL to enable live transmission;
    # leave empty for file-only persistence (suitable for hackathon demo).
    abdm_his_endpoint: str = ""                    # empty = skip HTTP forward
    abdm_mock: bool = True

    # ── Triage Pub/Sub ────────────────────────────────────────────────────────
    triage_pubsub_channel: str = "triage:alerts"

    # ── Dialogue State Machine ────────────────────────────────────────────────
    max_turns: int = 6
    max_session_ms: int = 180_000  # 3 minutes
    min_dosha_threshold: float = 3.0
    min_agni_confidence: float = 2.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
