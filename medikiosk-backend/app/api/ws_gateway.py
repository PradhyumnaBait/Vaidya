"""
MediKiosk — WebSocket Gateway (Primary Session Controller)

This is the single entry point for all real-time kiosk session traffic.
All voice, touch, and document events arrive and depart through this gateway.

Session FSM lifecycle per connection:
  IDLE → CONSENT_PENDING → CONSENT_GRANTED → INTAKE_ACTIVE
  → [RED_FLAG_TRIAGE | DOCUMENT_INTAKE] → SYNTHESIS_PENDING
  → FHIR_TRANSMISSION → SESSION_TEARDOWN

Inbound message types:
  "consent_response"      — Patient consent decision (agree/deny)
  "touch_input"           — Touch card selection
  "voice_chunk"           — Base64 PCM audio chunk (16kHz, mono, 16-bit)
  "voice_final"           — End-of-utterance signal
  "document_image"        — Base64 document image for OCR
  "request_synthesis"     — Manual synthesis trigger
  "ping"                  — Liveness check

Outbound message types:
  "session_init"          — Session initialised with consent text + audio
  "question"              — Next dialogue question + touch cards + TTS audio
  "confirm_utterance"     — Low-confidence voice: ask patient to confirm
  "red_flag"              — Emergency alert; FSM enters RED_FLAG_TRIAGE
  "document_processed"    — Lab extraction results
  "synthesis"             — Full synthesis payload (EMR dashboard)
  "synthesis_fhir"        — FHIR R4 Bundle
  "session_end"           — Session teardown confirmation
  "error"                 — Error message with recovery hint
  "pong"                  — Liveness response
"""
from __future__ import annotations

import asyncio
import base64
import json
import logging
import time
import uuid
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

from app.config import get_settings
from app.core import session_manager, consent_engine, security
from app.dialogue.arbitration_engine import ArbitrationEngine
from app.dialogue.llm_orchestrator import orchestrate_turn
from app.dialogue.slot_definitions import get_touch_cards
from app.dialogue.state_machine import ClinicalStateMachine
from app.documents.cross_correlator import apply_cross_correlations
from app.documents.lab_extractor import extract_lab_results
from app.documents.ocr_pipeline import classify_document, process_document
from app.documents.temporal_normalizer import extract_report_date, sort_timelines
from app.fhir.synthesis_engine import synthesise, build_emr_dashboard
from app.fhir.abdm_gateway import persist_and_transmit
from app.models.clinical import LabResult
from app.models.session import BeliefState, SessionFSMState
from app.nlp.bhashini_client import transcribe_audio, synthesise_speech
from app.nlp.rag_translator import translate_entity
from app.scoring.red_flag_interceptor import evaluate_red_flags

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()


# ── WebSocket Endpoint ────────────────────────────────────────────────────────

@router.websocket("/ws/session")
async def session_websocket(websocket: WebSocket):
    """
    Main WebSocket session handler.
    One connection per patient session. Maintains its own FSM instance.
    """
    await websocket.accept()
    session_id = security.generate_session_id()
    logger.info("WS accepted: session=%s", session_id[:8])

    # Session objects (per-connection)
    state: BeliefState | None = None
    fsm: ClinicalStateMachine | None = None
    arbiter = ArbitrationEngine()
    lab_results: list[LabResult] = []
    _synthesis_transmitted = False  # Track actual transmission for teardown

    try:
        # ── Initial handshake ─────────────────────────────────────────────────
        # Get language preference from first message
        init_msg = await asyncio.wait_for(websocket.receive_json(), timeout=30.0)
        language = init_msg.get("language", "hi")

        # Provision session in Redis
        state = await session_manager.create_session(session_id, language)
        fsm = ClinicalStateMachine(state)

        # Build and send consent message
        consent_text = consent_engine.get_consent_text(language)
        consent_audio = await synthesise_speech(consent_text, language)

        await _send(websocket, {
            "type": "session_init",
            "session_id": session_id,
            "language": language,
            "consent_text": consent_text,
            "consent_audio_b64": base64.b64encode(consent_audio).decode() if consent_audio else None,
            "consent_options": [
                {"label": _consent_agree_label(language), "value": "agree"},
                {"label": _consent_deny_label(language), "value": "deny"},
            ],
        })

        # ── Main session loop ──────────────────────────────────────────────────
        while True:
            try:
                raw = await asyncio.wait_for(
                    websocket.receive_json(),
                    timeout=settings.max_session_ms / 1000.0,
                )
            except asyncio.TimeoutError:
                logger.warning("Session %s timed out (budget exhausted).", session_id[:8])
                break

            msg_type = raw.get("type", "")
            logger.debug("WS message: session=%s type=%s", session_id[:8], msg_type)

            # ── Ping/Pong ─────────────────────────────────────────────────────
            if msg_type == "ping":
                await _send(websocket, {"type": "pong", "ts": time.time()})
                continue

            # ── Consent Response ──────────────────────────────────────────────
            if msg_type == "consent_response":
                agreed = raw.get("value") == "agree"
                await consent_engine.record_consent_event(session_id, language, agreed)

                if not agreed:
                    fsm.transition(SessionFSMState.CONSENT_DENIED)
                    await _send(websocket, {
                        "type": "session_end",
                        "reason": "consent_denied",
                    })
                    break  # Drop to teardown

                fsm.transition(SessionFSMState.INTAKE_ACTIVE)
                state.consent_granted = True
                await session_manager.save_belief_state(state)

                # Send first question
                await _send_next_question(websocket, fsm, state, language)
                continue

            # ── Guard: require consent before processing inputs ────────────────
            if not state.consent_granted:
                await _send_error(websocket, "Consent not yet granted.", "consent_first")
                continue

            # ── HMAC verification for all clinical input messages ─────────────
            if msg_type in ("touch_input", "voice_final", "document_image", "request_synthesis"):
                hmac_ok = _verify_message_hmac(raw, session_id)
                if not hmac_ok:
                    logger.warning(
                        "HMAC mismatch on msg_type=%s session=%s — terminating.",
                        msg_type, session_id[:8],
                    )
                    await _send_error(websocket, "Message signature invalid. Session terminated.", "hmac_invalid")
                    break

            # ── Touch Input (Preempts any in-flight voice processing) ─────────
            if msg_type == "touch_input":
                slot_id = raw.get("slot_id", "")
                value = raw.get("value", "")
                arbiter.register_touch(value, slot_id)
                # Immediately process touch input (TOUCH_LOCK semantics)
                await _process_touch(
                    websocket, fsm, state, arbiter, language, slot_id, value, lab_results
                )
                continue

            # ── Voice Chunk (ambient noise telemetry) ─────────────────────────
            if msg_type == "voice_chunk":
                audio_b64 = raw.get("audio_b64", "")
                rms_db = float(raw.get("rms_db", 70.0))
                arbiter.update_ambient_noise(rms_db)
                continue

            # ── Voice Final (end of utterance) ───────────────────────────────
            if msg_type == "voice_final":
                audio_b64 = raw.get("audio_b64", "")
                if audio_b64:
                    await _process_voice_final(
                        websocket, fsm, state, arbiter, language, audio_b64, lab_results
                    )
                continue

            # ── Document Image ────────────────────────────────────────────────
            if msg_type == "document_image":
                image_b64 = raw.get("image_b64", "")
                if image_b64:
                    await _process_document(
                        websocket, fsm, state, language, image_b64, lab_results
                    )
                continue

            # ── Manual Synthesis Trigger ──────────────────────────────────────
            if msg_type == "request_synthesis" or fsm.is_budget_exhausted():
                await _run_synthesis(websocket, fsm, state, language, lab_results, session_id)
                _synthesis_transmitted = True
                break  # Session concludes

    except WebSocketDisconnect:
        logger.info("WS disconnected: session=%s", session_id[:8][:8])
    except Exception as exc:
        logger.exception("Unhandled exception in session %s: %s", session_id[:8], exc)
        if websocket.client_state == WebSocketState.CONNECTED:
            await _send_error(websocket, "Internal server error. Session closing.", "server_error")

    finally:
        # ── Guaranteed session teardown ────────────────────────────────────────
        # payload_transmitted reflects whether synthesis was actually sent;
        # it is False if consent was denied or client disconnected early.
        if state:
            await consent_engine.record_teardown_event(
                session_id, payload_transmitted=_synthesis_transmitted
            )
            await session_manager.teardown_session(
                session_id, payload_transmitted=_synthesis_transmitted
            )
        try:
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.close()
        except Exception:
            pass


# ── Touch Processing ──────────────────────────────────────────────────────────

async def _process_touch(
    websocket: WebSocket,
    fsm: ClinicalStateMachine,
    state: BeliefState,
    arbiter: ArbitrationEngine,
    language: str,
    slot_id: str,
    value: str,
    lab_results: list[LabResult],
) -> None:
    """Handle a confirmed touch card selection."""
    anchor_id = fsm.fill_slot(
        slot_id=slot_id,
        value=value,
        raw_text=value,
        source="touch",
        confidence=1.0,
    )
    await fsm.advance_turn(patient_text=value, source="touch")

    # Concurrently: red-flag check + RAG ontology mapping (Section 2.2)
    lab_dicts = [lr.model_dump() for lr in lab_results]
    (red_flag_triggered, matched_rule), rag_hit = await asyncio.gather(
        evaluate_red_flags(state, lab_dicts),
        translate_entity(value, language),
    )

    # Merge ontology hit into BeliefState
    _merge_rag_hit(state, rag_hit)

    if red_flag_triggered and matched_rule:
        fsm.transition(SessionFSMState.RED_FLAG_TRIAGE)
        await _send_red_flag(websocket, matched_rule, state, language)
        await session_manager.save_belief_state(state)
        # Continue session but mark as elevated
        return

    await session_manager.save_belief_state(state)

    # Continue to next question or synthesis
    if fsm.is_budget_exhausted():
        await _run_synthesis(websocket, fsm, state, language, lab_results, state.session_id)
    else:
        await _send_next_question(websocket, fsm, state, language)


# ── Voice Processing ──────────────────────────────────────────────────────────

async def _process_voice_final(
    websocket: WebSocket,
    fsm: ClinicalStateMachine,
    state: BeliefState,
    arbiter: ArbitrationEngine,
    language: str,
    audio_b64: str,
    lab_results: list[LabResult],
) -> None:
    """
    Process the final voice utterance from the patient.
    Runs ASR → registers with arbitration engine → resolves → LLM slot-fill.
    """
    # ASR transcription
    asr_result = await transcribe_audio(audio_b64, language)
    transcript = asr_result.get("transcript", "")
    confidence = asr_result.get("confidence", 0.0)

    # Register voice result with arbitration engine
    arbiter.register_voice(transcript, confidence)

    # Determine target slot
    target_slot = fsm.next_empty_slot() or "associations"

    # Open arbitration window (it may have already received a TOUCH_LOCK)
    window = arbiter.open_window(target_slot)
    # Give a short window for any concurrent touch event
    result = await window.resolve()

    if result.value == "RETRY_TOUCH":
        # Re-render current question with a prompt to try touch
        question_payload = fsm.next_question_payload(target_slot)
        question_payload["hint"] = "Please tap one of the options below."
        await _send(websocket, {"type": "question", **question_payload})
        return

    if result.value.startswith("CONFIRM_NEEDED:"):
        # Low-confidence voice: ask patient to confirm transcript
        transcribed_text = result.value[len("CONFIRM_NEEDED:"):]
        await _send(websocket, {
            "type": "confirm_utterance",
            "slot_id": target_slot,
            "transcribed_text": transcribed_text,
            "confidence": result.confidence,
            "touch_card_options": get_touch_cards(target_slot, language),
        })
        return

    # Accepted voice input: run LLM turn for entity extraction + next question
    # Concurrently: LLM slot-fill + RAG ontology mapping (Section 2.2)
    llm_response, rag_hit = await asyncio.gather(
        orchestrate_turn(state, result.value, target_slot),
        translate_entity(result.value, language),
    )

    # Merge ontology hit into BeliefState
    _merge_rag_hit(state, rag_hit)

    # Apply extracted entities to BeliefState
    extracted = llm_response.get("extracted_entities", {})
    for ent_slot, ent_data in extracted.items():
        if isinstance(ent_data, dict) and "value" in ent_data:
            anchor_id = fsm.fill_slot(
                slot_id=ent_slot,
                value=ent_data["value"],
                raw_text=ent_data.get("raw_text", result.raw_text),
                source="voice",
                confidence=result.confidence,
            )
            # Per-entity RAG lookup for the extracted value (not just full utterance)
            if ent_data["value"] != result.value:
                entity_hit = await translate_entity(ent_data["value"], language)
                _merge_rag_hit(state, entity_hit)

    await fsm.advance_turn(patient_text=result.raw_text, source="voice")

    # Red flag check (independent — after slot fills are recorded)
    lab_dicts = [lr.model_dump() for lr in lab_results]
    red_flag_triggered, matched_rule = await evaluate_red_flags(state, lab_dicts)
    if red_flag_triggered and matched_rule:
        fsm.transition(SessionFSMState.RED_FLAG_TRIAGE)
        await _send_red_flag(websocket, matched_rule, state, language)

    await session_manager.save_belief_state(state)

    # TTS for next question (async; send audio alongside text)
    next_q_text = llm_response.get("next_question_text", "")
    tts_audio = await synthesise_speech(next_q_text, language) if next_q_text else None

    if fsm.is_budget_exhausted():
        await _run_synthesis(websocket, fsm, state, language, lab_results, state.session_id)
    else:
        question_payload = {
            "type": "question",
            "slot_being_filled": llm_response.get("slot_being_filled", target_slot),
            "question_text": next_q_text,
            "touch_card_options": llm_response.get("touch_card_options", []),
            "turn_index": state.turn_count,
            "audio_b64": base64.b64encode(tts_audio).decode() if tts_audio else None,
        }
        await _send(websocket, question_payload)


# ── Document Processing ───────────────────────────────────────────────────────

async def _process_document(
    websocket: WebSocket,
    fsm: ClinicalStateMachine,
    state: BeliefState,
    language: str,
    image_b64: str,
    lab_results: list[LabResult],
) -> None:
    """
    Process an incoming document image:
    1. Classify document type
    2. OCR via Document AI
    3. Extract lab results
    4. Cross-correlate with current symptom context
    5. Inject relevant notes into BeliefState
    """
    fsm.transition(SessionFSMState.DOCUMENT_INTAKE)

    # Quick text-preview OCR for classification (lightweight, not billable)
    doc_ai_response = await process_document(image_b64)
    preview_text = doc_ai_response.get("document", {}).get("text", "")[:500]

    doc_type = classify_document(preview_text)

    if doc_type != "printed_lab_report":
        rejection_msg = {
            "hi": "हम केवल छपे हुए लैब रिपोर्ट स्कैन कर सकते हैं।",
            "mr": "आम्ही फक्त छापील लॅब अहवाल स्कॅन करू शकतो.",
            "en": "Only printed laboratory reports can be scanned.",
        }.get(language, "Only printed laboratory reports can be scanned.")

        await _send(websocket, {
            "type": "document_processed",
            "status": "rejected",
            "reason": doc_type,
            "message": rejection_msg,
        })
        fsm.transition(SessionFSMState.INTAKE_ACTIVE)
        return

    # Full Document AI processing
    report_date = extract_report_date(preview_text)
    extracted = extract_lab_results(doc_ai_response, report_date)
    extracted = sort_timelines(extracted)

    # Cross-correlate with current SOCRATES context
    site_val = state.socrates.site.value if state.socrates.site else None
    associations = [sv.value for sv in state.socrates.associations]
    injections = apply_cross_correlations(extracted, site_val, associations)

    # Inject notes into BeliefState
    for note in injections:
        anchor_id = security.generate_anchor_id()
        fsm.inject_lab_slot(note, anchor_id)
        await session_manager.save_anchor(
            state.session_id,
            anchor_id,
            {"type": "lab_cross_correlation", "note": note},
        )

    # Store lab results in session + local list
    lab_results.extend(extracted)
    lab_dicts = [lr.model_dump() for lr in lab_results]
    await session_manager.save_lab_data(state.session_id, lab_dicts)

    # Red flag check against new lab data
    red_flag_triggered, matched_rule = await evaluate_red_flags(state, lab_dicts)
    if red_flag_triggered and matched_rule:
        fsm.transition(SessionFSMState.RED_FLAG_TRIAGE)
        await _send_red_flag(websocket, matched_rule, state, language)

    await session_manager.save_belief_state(state)

    await _send(websocket, {
        "type": "document_processed",
        "status": "ok",
        "report_date": report_date,
        "biomarkers_found": len(extracted),
        "anomaly_count": sum(1 for lr in extracted if lr.status.value != "normal"),
        "cross_correlation_injections": len(injections),
        "summary": [
            {
                "biomarker": lr.biomarker,
                "display": lr.display_name,
                "value": lr.latest_value,
                "unit": lr.unit,
                "status": lr.status,
                "trend": lr.trend,
            }
            for lr in extracted
        ],
    })

    fsm.transition(SessionFSMState.INTAKE_ACTIVE)


# ── Synthesis Runner ──────────────────────────────────────────────────────────

async def _run_synthesis(
    websocket: WebSocket,
    fsm: ClinicalStateMachine,
    state: BeliefState,
    language: str,
    lab_results: list[LabResult],
    session_id: str,
) -> None:
    """Execute full synthesis, send EMR payload and FHIR bundle."""
    fsm.transition(SessionFSMState.SYNTHESIS_PENDING)
    await session_manager.save_belief_state(state)

    # Run synthesis
    synthesis, fhir_bundle = await synthesise(state, lab_results)

    # Get anchors from Redis
    anchors = await session_manager.get_all_anchors(session_id)

    # Build EMR dashboard
    emr_dashboard = build_emr_dashboard(synthesis, anchors)

    # ── Persist bundle BEFORE sending over WebSocket (Fix #2) ──────────────────
    # This ensures the physician REST API has the data even if the WS drops.
    fsm.transition(SessionFSMState.FHIR_TRANSMISSION)
    persist_status = await persist_and_transmit(
        session_hash=state.session_hash,
        fhir_bundle=fhir_bundle,
        emr_dashboard=emr_dashboard,
    )
    logger.info(
        "Bundle persist status: file=%s redis=%s his=%s",
        persist_status.get("file"), persist_status.get("redis"), persist_status.get("his"),
    )

    # Send synthesis to connected kiosk WebSocket
    await _send(websocket, {
        "type": "synthesis",
        "data": emr_dashboard,
    })

    # Send FHIR bundle (for kiosk-local use / logging)
    await _send(websocket, {
        "type": "synthesis_fhir",
        "bundle": fhir_bundle,
    })

    # Send session end signal
    fsm.transition(SessionFSMState.SESSION_TEARDOWN)
    await session_manager.save_belief_state(state)

    await _send(websocket, {
        "type": "session_end",
        "reason": "synthesis_complete",
        "session_hash": state.session_hash,
        "quality": {
            "socrates_f1": synthesis.completeness.socrates_f1 if synthesis.completeness else 0.0,
        },
    })


# ── Helper Senders ────────────────────────────────────────────────────────────

async def _send_next_question(
    websocket: WebSocket,
    fsm: ClinicalStateMachine,
    state: BeliefState,
    language: str,
) -> None:
    """Determine and send the next question to the frontend."""
    next_slot = fsm.next_empty_slot()
    if next_slot is None:
        # All slots filled — auto-trigger synthesis
        await _run_synthesis(websocket, fsm, state, language, [], state.session_id)
        return

    payload = fsm.next_question_payload(next_slot)
    payload["type"] = "question"

    # Generate TTS audio for the question
    tts_audio = await synthesise_speech(payload["question_text"], language)
    if tts_audio:
        payload["audio_b64"] = base64.b64encode(tts_audio).decode()

    await _send(websocket, payload)


async def _send_red_flag(
    websocket: WebSocket,
    matched_rule,
    state: BeliefState,
    language: str,
) -> None:
    """Send red-flag alert with localised instructions."""
    instructions = {
        "P0": {
            "hi": "⚠️ कृपया तुरंत नर्स स्टेशन पर जाएं। आपका टोकन प्रिंट हो रहा है।",
            "mr": "⚠️ कृपया ताबडतोब नर्स स्टेशनवर जा. तुमचा टोकन छापत आहे.",
            "en": "⚠️ Please proceed to the nurse station immediately. Your token is printing.",
        },
        "P1": {
            "hi": "आपको प्राथमिकता पर देखा जाएगा। कृपया प्रतीक्षा करें।",
            "mr": "तुम्हाला प्राधान्याने पाहिले जाईल. कृपया थांबा.",
            "en": "You will be seen on priority. Please wait.",
        },
    }
    priority = matched_rule.priority
    instruction = instructions.get(priority, {}).get(language, instructions[priority]["en"])

    await _send(websocket, {
        "type": "red_flag",
        "priority": priority,
        "rule_id": matched_rule.rule_id,
        "name": matched_rule.name,
        "action": matched_rule.action,
        "instruction": instruction,
        "token": state.session_id[-6:].upper(),
    })


async def _send(websocket: WebSocket, data: dict[str, Any]) -> None:
    if websocket.client_state == WebSocketState.CONNECTED:
        try:
            await websocket.send_json(data)
        except Exception as exc:
            logger.error("WS send error: %s", exc)


async def _send_error(websocket: WebSocket, message: str, code: str) -> None:
    await _send(websocket, {"type": "error", "message": message, "code": code})


def _consent_agree_label(language: str) -> str:
    return {"hi": "हाँ, मैं सहमत हूँ", "mr": "होय, मी सहमत आहे", "en": "Yes, I Agree"}.get(language, "Yes, I Agree")


def _consent_deny_label(language: str) -> str:
    return {"hi": "नहीं, मैं सहमत नहीं हूँ", "mr": "नाही, मी सहमत नाही", "en": "No, I Do Not Agree"}.get(language, "No, I Do Not Agree")


# ── RAG Hit Merger ────────────────────────────────────────────────────────────

def _merge_rag_hit(state: BeliefState, hit: dict[str, Any]) -> None:
    """
    Merge a translate_entity() result into state.ontology_hits.

    Only stores hits that crossed the RRF_THRESHOLD (hit["mapped"] == True).
    Keeps the list sorted by confidence descending and deduplicates on NAMASTE code.
    Also injects dosha_indicators into AyushBeliefState for downstream scoring.
    """
    if not hit.get("mapped"):
        return

    # Normalise into the dict shape expected by synthesis_engine
    entry = {
        "confidence": hit["confidence"],
        "raw_phrase": hit.get("raw_phrase", ""),
        "allopathic": hit.get("allopathic", {}),
        "namaste_code": (hit.get("ayush") or {}).get("namaste_code"),
        "icd11_tm2_code": (hit.get("ayush") or {}).get("icd11_tm2_code"),
    }

    # Deduplicate: skip if this NAMASTE code is already present
    existing_codes = {h.get("namaste_code") for h in state.ontology_hits}
    if entry["namaste_code"] and entry["namaste_code"] in existing_codes:
        return

    state.ontology_hits.append(entry)
    # Keep sorted: best confidence first
    state.ontology_hits.sort(key=lambda h: h.get("confidence", 0.0), reverse=True)

    # Inject dosha indicators into AyushBeliefState for scoring engines
    for indicator in hit.get("dosha_indicators", []):
        if indicator and indicator not in state.ayush.dosha_indicators:
            state.ayush.dosha_indicators.append({"tag": indicator, "confidence": hit["confidence"]})

    logger.debug(
        "RAG hit merged: NAMASTE=%s ICD11=%s conf=%.2f",
        entry.get("namaste_code"), (entry.get("allopathic") or {}).get("icd11_code"), hit["confidence"],
    )


# ── HMAC Verification ─────────────────────────────────────────────────────────

def _verify_message_hmac(raw: dict[str, Any], session_id: str) -> bool:
    """
    Verify the per-message HMAC signature.

    The frontend must include:
      { ..., "_sig": "<hmac_hex>", "_ts": <unix_ms> }

    The signature covers: f"{session_id}:{msg_type}:{_ts}"
    A missing signature is accepted in development mode (APP_ENV=development)
    so that Postman / browser WS clients work without signing.

    Per plan Section 1.1: "mismatched signatures trigger immediate session termination."
    """
    if settings.app_env == "development":
        # In dev, accept unsigned messages so manual testing is friction-free
        return True

    sig = raw.get("_sig", "")
    ts = raw.get("_ts", "")
    msg_type = raw.get("type", "")

    if not sig or not ts:
        logger.warning("Missing HMAC fields on msg_type=%s", msg_type)
        return False

    payload_str = f"{session_id}:{msg_type}:{ts}"
    return security.verify_hmac(payload_str, sig)

