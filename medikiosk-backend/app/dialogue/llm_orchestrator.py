"""
MediKiosk — LLM Orchestrator (Groq / Llama-3-8B-Instruct)

Design principles:
- LLM only generates LANGUAGE (questions, extracted entity values).
  It makes ZERO clinical decisions.
- JSON-mode enforced: if the response is not valid JSON, fallback templates are used.
- Hard timeout: 3000ms. Breach triggers the static template fallback immediately.
- The LLM receives ONLY the current BeliefState + last utterance.
  No growing conversation history. This eliminates drift and reduces token cost ~70%.
- Temperature = 0.1 (near-deterministic for slot-filling tasks).
"""
from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any

from groq import AsyncGroq

from app.config import get_settings
from app.models.session import BeliefState
from app.dialogue.slot_definitions import get_question_text, get_touch_cards

logger = logging.getLogger(__name__)
settings = get_settings()

_groq_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.groq_api_key)
    return _groq_client


# ── System Prompt (Immutable) ─────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a clinical history intake assistant for an Indian public hospital kiosk.

ROLE CONSTRAINT:
- Your ONLY function is to extract medical information by asking one targeted question per turn.
- You MUST NEVER suggest diagnoses, treatments, or medications.
- You are a data extractor, not a clinician.
- Write questions in simple, everyday language appropriate for low-literacy patients.

OUTPUT CONTRACT:
Respond ONLY with a valid JSON object matching this EXACT schema:
{
  "next_question_text": "<question in the specified language, simple vocabulary>",
  "next_question_english": "<English translation for logging>",
  "slot_being_filled": "<slot name>",
  "touch_card_options": [
    {"label": "<vernacular label>", "value": "<canonical clinical value>", "icon_key": "<icon_key>"}
  ],
  "extracted_entities": {
    "<slot_name>": {"value": "<canonical value>", "raw_text": "<original patient words>"}
  },
  "red_flag_check": {
    "triggered": false,
    "rule_id": null
  }
}

RULES:
- touch_card_options: provide exactly 3-4 options covering the clinical space of the slot.
- extracted_entities: ONLY include entities newly found in the patient's LAST response.
- red_flag_check.triggered: set to true ONLY if the patient mentions crushing chest pain + radiation, stroke symptoms, or acute crisis. Never guess.
- If the patient's response is unclear, set extracted_entities to {} and ask for clarification.
"""


def _build_user_message(
    state: BeliefState,
    patient_utterance: str,
    target_slot: str,
) -> str:
    """
    Construct the per-turn user message injected into the LLM.
    Deliberately minimal — only BeliefState summary + last utterance.
    """
    null_socrates = state.socrates.null_slots()
    null_ayush = state.ayush.null_slots()

    summary = {
        "current_state": {
            "site": state.socrates.site.value if state.socrates.site else None,
            "onset": state.socrates.onset.value if state.socrates.onset else None,
            "character": state.socrates.character.value if state.socrates.character else None,
            "radiation": state.socrates.radiation.value if state.socrates.radiation else None,
            "severity": state.socrates.severity.value if state.socrates.severity else None,
            "agni_indicators": state.ayush.agni_indicators,
            "koshtha_indicators": state.ayush.koshtha_indicators,
        },
        "missing_slots_priority": null_socrates[:3] + null_ayush[:2],
        "target_slot_to_fill": target_slot,
        "patient_last_response": patient_utterance,
        "turn": f"{state.turn_count} of {settings.max_turns}",
        "language": state.language,
    }
    return json.dumps(summary, ensure_ascii=False)


# ── Main Orchestrator Call ────────────────────────────────────────────────────

async def orchestrate_turn(
    state: BeliefState,
    patient_utterance: str,
    target_slot: str,
) -> dict[str, Any]:
    """
    Call the Groq LLM to process a single dialogue turn.

    Returns the parsed JSON response from the LLM, or a fallback template
    if the LLM is unavailable or exceeds the timeout.

    The caller (ws_gateway) is responsible for:
    - Applying extracted_entities back to the BeliefState via the FSM
    - Dispatching the question to the frontend
    """
    user_msg = _build_user_message(state, patient_utterance, target_slot)

    start = time.time()
    try:
        client = _get_client()
        timeout_sec = settings.llm_timeout_ms / 1000.0

        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_msg},
                ],
                max_tokens=settings.llm_max_tokens,
                temperature=settings.llm_temperature,
                response_format={"type": "json_object"},
            ),
            timeout=timeout_sec,
        )

        raw_content = response.choices[0].message.content or "{}"
        parsed = json.loads(raw_content)

        latency_ms = (time.time() - start) * 1000
        logger.info("LLM turn completed in %.0fms for slot=%s", latency_ms, target_slot)

        # Validate minimal required fields
        if "next_question_text" not in parsed or "slot_being_filled" not in parsed:
            logger.warning("LLM output missing required fields; using fallback.")
            return _build_fallback(state, target_slot)

        # Enrich with touch cards from template bank if LLM didn't provide them
        if not parsed.get("touch_card_options"):
            parsed["touch_card_options"] = get_touch_cards(target_slot, state.language)

        return parsed

    except asyncio.TimeoutError:
        logger.warning(
            "LLM timeout after %dms for slot=%s; using static template.",
            settings.llm_timeout_ms, target_slot,
        )
        return _build_fallback(state, target_slot)

    except json.JSONDecodeError as exc:
        logger.error("LLM returned invalid JSON: %s; using fallback.", exc)
        return _build_fallback(state, target_slot)

    except Exception as exc:
        logger.error("Unexpected LLM error: %s; using fallback.", exc)
        return _build_fallback(state, target_slot)


def _build_fallback(state: BeliefState, slot_id: str) -> dict[str, Any]:
    """
    Static template fallback when the LLM is unavailable.
    Guarantees 100% session continuity regardless of external API availability.
    """
    lang = state.language
    return {
        "next_question_text": get_question_text(slot_id, lang),
        "next_question_english": get_question_text(slot_id, "en"),
        "slot_being_filled": slot_id,
        "touch_card_options": get_touch_cards(slot_id, lang),
        "extracted_entities": {},
        "red_flag_check": {"triggered": False, "rule_id": None},
        "_fallback": True,
    }
