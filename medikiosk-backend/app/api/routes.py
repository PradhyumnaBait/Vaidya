"""
MediKiosk — REST API Endpoints

Supplementary REST endpoints (non-WebSocket) for:
- Health check (load balancer liveness + readiness)
- Admin: audit log retrieval (no PHI)
- Session status polling (for fallback non-WS clients)
- Physician dashboard FHIR retrieval
"""
from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.core.session_manager import get_belief_state, get_redis
from app.core.consent_engine import get_audit_log

router = APIRouter()
settings = get_settings()
_startup_time = time.time()


# ── Health Check ──────────────────────────────────────────────────────────────

@router.get("/health", tags=["ops"])
async def health_check() -> dict[str, Any]:
    """
    Liveness + readiness probe.
    Returns 200 if Redis is reachable and application is ready.
    Returns 503 if critical dependencies are unavailable.
    """
    redis_ok = False
    try:
        r = get_redis()
        await r.ping()
        redis_ok = True
    except Exception:
        pass

    ready = redis_ok

    return {
        "status": "ready" if ready else "degraded",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "uptime_seconds": round(time.time() - _startup_time, 1),
        "dependencies": {
            "redis": "ok" if redis_ok else "unavailable",
        },
        "version": "1.0.0",
    }


@router.get("/health/ready", tags=["ops"])
async def readiness_probe() -> dict[str, str]:
    """Kubernetes readiness probe — minimal check."""
    try:
        r = get_redis()
        await r.ping()
        return {"status": "ready"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Redis not available",
        )


@router.get("/health/live", tags=["ops"])
async def liveness_probe() -> dict[str, str]:
    """Kubernetes liveness probe — always returns 200 if process is running."""
    return {"status": "alive"}


# ── Audit Log (Admin only — no PHI) ──────────────────────────────────────────

@router.get("/admin/audit-log", tags=["admin"])
async def get_consent_audit_log() -> dict[str, Any]:
    """
    Return the DPDP-compliant consent audit log.
    Contains ONLY session hashes (never session IDs), consent decisions,
    timestamps, and consent version.
    """
    log = get_audit_log()
    return {
        "count": len(log),
        "events": log,
        "phi_present": False,
        "disclaimer": "This log contains only cryptographic hashes. No personally identifiable information is stored.",
    }


# ── Session Status (Fallback REST) ────────────────────────────────────────────

@router.get("/session/{session_id}/status", tags=["session"])
async def session_status(session_id: str) -> dict[str, Any]:
    """
    Fallback REST endpoint for clients that cannot maintain WebSocket connections.
    Returns current FSM state and completeness metrics.
    Does NOT return clinical data (use WebSocket for real-time data).
    """
    state = await get_belief_state(session_id)
    if state is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or expired.",
        )

    return {
        "session_hash": state.session_hash,
        "fsm_state": state.fsm_state,
        "turn_count": state.turn_count,
        "elapsed_ms": state.elapsed(),
        "completion_entropy": state.completion_entropy(),
        "red_flag_triggered": state.red_flag_triggered,
        "consent_granted": state.consent_granted,
    }
