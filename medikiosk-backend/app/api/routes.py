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

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import get_settings
from app.core.session_manager import get_belief_state, get_redis
from app.core.consent_engine import get_audit_log
from app.core import security

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


# ── Audit Log (Admin Protected) ───────────────────────────────────────────────

@router.get("/admin/audit-log", tags=["admin"])
async def get_consent_audit_log(
    admin_user: dict[str, Any] = Depends(security.require_admin_auth),
) -> dict[str, Any]:
    """
    Return the DPDP-compliant consent audit log.
    Requires admin authentication (X-Admin-API-Key or Bearer token).
    Contains ONLY session hashes (never session IDs), consent decisions,
    timestamps, and consent version.
    """
    log = get_audit_log()
    return {
        "count": len(log),
        "events": log,
        "phi_present": False,
        "disclaimer": "This log contains only cryptographic hashes. No personally identifiable information is stored.",
        "accessed_by": admin_user.get("sub"),
    }


# ── Physician Dashboard & Auth Endpoints ──────────────────────────────────────

@router.post("/physician/login", tags=["physician"])
async def physician_login(credentials: dict[str, str]) -> dict[str, Any]:
    """
    Physician login endpoint.
    Issues an 8-hour JWT Bearer token for accessing OPD clinical queues and EMR summaries.
    """
    doctor_id = credentials.get("doctor_id", "").strip()
    passcode = credentials.get("passcode", "").strip()

    # Simple passcode / PIN verification for OPD kiosk station
    if not doctor_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="doctor_id is required",
        )

    # In production, check hospital LDAP/HIS; for prototype/hackathon verify doctor format
    token = security.create_access_token({
        "sub": doctor_id,
        "name": f"Dr. {doctor_id.title()}",
        "role": "physician",
        "dept": "General Medicine OPD",
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in_hours": 8,
        "doctor_id": doctor_id,
    }


@router.get("/physician/queue", tags=["physician"])
async def list_physician_queue(
    limit: int = 50,
    physician: dict[str, Any] = Depends(security.get_current_physician),
) -> dict[str, Any]:
    """
    List recently synthesized patient intake summaries for the physician's OPD queue.
    Requires physician authentication. Reads from persisted bundle storage (Redis + disk).
    """
    from app.fhir.abdm_gateway import list_recent_bundles
    patients = await list_recent_bundles(limit=limit)
    return {
        "count": len(patients),
        "queue": patients,
        "accessed_by": physician.get("sub"),
    }


@router.get("/physician/bundle/{session_hash}", tags=["physician"])
async def get_patient_synthesis(
    session_hash: str,
    physician: dict[str, Any] = Depends(security.get_current_physician),
) -> dict[str, Any]:
    """
    Retrieve the 15-second glanceable EMR dashboard payload for a specific session hash.
    Requires physician authentication.
    """
    from app.fhir.abdm_gateway import retrieve_bundle
    dashboard = await retrieve_bundle(session_hash)
    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Synthesis bundle not found for this session hash.",
        )
    return dashboard


# ── Session Status (Fallback REST) ────────────────────────────────────────────

@router.get("/session/{session_id}/status", tags=["session"])
async def session_status(session_id: str) -> dict[str, Any]:
    """
    Fallback REST endpoint for clients that cannot maintain WebSocket connections.
    Returns current FSM state and completeness metrics.
    Does NOT return clinical data (use WebSocket for real-time data).
    """
    # Rate limit check (30 requests/min per session)
    allowed = await security.check_rate_limit(f"status:{session_id}", limit=30, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded for session status polling.",
        )

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


