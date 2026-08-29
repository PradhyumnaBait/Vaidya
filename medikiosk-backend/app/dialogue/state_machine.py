"""
MediKiosk — Clinical State Machine

Manages all FSM state transitions for a patient session.
The FSM is the single source of truth for what state the session is in.
All other modules read from and write to the BeliefState via session_manager.

Priority-ordered slot selection ensures high-clinical-value gaps are filled first,
mirroring a physician's clinical reasoning pattern.
"""
from __future__ import annotations

import logging
import time
from typing import Any

from app.config import get_settings
from app.models.session import (
    BeliefState,
    SessionFSMState,
    SlotValue,
    TranscriptEntry,
)
from app.core.session_manager import save_belief_state, append_transcript
from app.core.security import generate_anchor_id
from app.dialogue.slot_definitions import get_touch_cards, get_question_text

logger = logging.getLogger(__name__)
settings = get_settings()

# Ordered priority list across both tracks.
# The FSM will select the first unfilled slot from this list each turn.
SLOT_PRIORITY_ORDER = [
    # Tier 1: Critical (Red-Flag Sensitive)
    "site", "character", "radiation", "associations",
    # Tier 2: Important
    "onset", "severity", "time_course", "exacerbating",
    # Tier 3: Ayush Core-4
    "agni", "koshtha", "dosha_indicators", "ahara_vihara",
]


class ClinicalStateMachine:
    """
    Controls the session FSM lifecycle and belief state transitions.
    One instance is created per WebSocket session.
    """

    def __init__(self, state: BeliefState):
        self.state = state

    # ── State Transitions ─────────────────────────────────────────────────────

    def transition(self, new_state: SessionFSMState) -> None:
        old = self.state.fsm_state
        self.state.fsm_state = new_state
        logger.info(
            "Session %s FSM: %s → %s", self.state.session_id[:8], old, new_state
        )

    def is_budget_exhausted(self) -> bool:
        """Check if either the turn count or time budget is exceeded."""
        return (
            self.state.turn_count >= settings.max_turns
            or self.state.elapsed() >= settings.max_session_ms
        )

    # ── Slot Selection ────────────────────────────────────────────────────────

    def next_empty_slot(self) -> str | None:
        """
        Return the highest-priority unfilled slot across both tracks.
        Returns None if all mandatory slots are filled or budget is exhausted.
        """
        null_socrates = self.state.socrates.null_slots()
        null_ayush = self.state.ayush.null_slots()
        all_null = set(null_socrates + null_ayush)

        for slot_id in SLOT_PRIORITY_ORDER:
            if slot_id in all_null:
                return slot_id
        return None

    # ── Slot Filling ──────────────────────────────────────────────────────────

    def fill_slot(
        self,
        slot_id: str,
        value: str,
        raw_text: str,
        source: str,
        confidence: float = 1.0,
        anchor_id: str | None = None,
    ) -> str:
        """
        Write a confirmed slot value into the BeliefState.
        Returns the anchor_id that was used.
        """
        if anchor_id is None:
            anchor_id = generate_anchor_id()

        sv = SlotValue(
            value=value,
            raw_text=raw_text,
            source=source,  # type: ignore[arg-type]
            anchor_id=anchor_id,
            confidence=confidence,
        )

        # ── SOCRATES track ──────────────────────────────────────────────────
        s = self.state.socrates
        if slot_id == "site":
            s.site = sv
        elif slot_id == "onset":
            s.onset = sv
        elif slot_id == "character":
            s.character = sv
        elif slot_id == "radiation":
            s.radiation = sv
        elif slot_id == "associations":
            s.associations.append(sv)
        elif slot_id == "time_course":
            s.time_course = sv
        elif slot_id == "exacerbating":
            s.exacerbating.append(sv)
        elif slot_id == "severity":
            s.severity = sv
        # ── Ayush track ─────────────────────────────────────────────────────
        elif slot_id == "agni":
            self.state.ayush.agni_indicators.append(value)
            self.state.ayush.agni_anchor_ids.append(anchor_id)
        elif slot_id == "koshtha":
            self.state.ayush.koshtha_indicators.append(value)
            self.state.ayush.koshtha_anchor_ids.append(anchor_id)
        elif slot_id == "dosha_indicators":
            self.state.ayush.dosha_indicators.append(
                {"tag": value, "confidence": confidence, "anchor_id": anchor_id}
            )
        elif slot_id == "ahara_vihara":
            self.state.ayush.ahara_triggers.append(value)

        return anchor_id

    def inject_lab_slot(self, context_note: str, anchor_id: str) -> None:
        """
        Inject a lab-derived context note into the associations list.
        Marks it as source='lab_injection' for traceability.
        """
        sv = SlotValue(
            value=context_note,
            raw_text=context_note,
            source="lab_injection",
            anchor_id=anchor_id,
            confidence=1.0,
        )
        self.state.socrates.associations.append(sv)
        self.state.doc_anomalies_injected.append(context_note)

    # ── Turn Advance ──────────────────────────────────────────────────────────

    async def advance_turn(self, patient_text: str, source: str) -> None:
        """
        Increment turn counter, update elapsed time, and append transcript entry.
        Called after every confirmed patient input (voice or touch).
        """
        self.state.turn_count += 1
        self.state.elapsed_ms = self.state.elapsed()

        entry = TranscriptEntry(
            turn=self.state.turn_count,
            speaker="patient",
            text=patient_text,
            source=source,  # type: ignore[arg-type]
            offset_ms=int(self.state.elapsed_ms),
        )
        self.state.transcript.append(entry)
        await append_transcript(
            self.state.session_id,
            entry.model_dump(),
        )

    # ── Synthesis Summary Builder ─────────────────────────────────────────────

    def build_quick_summary(self) -> dict[str, Any]:
        """
        Build a compact JSON summary of the current belief state.
        Used internally; full synthesis happens in the scoring engines.
        """
        s = self.state.socrates
        a = self.state.ayush

        def sv_str(sv: SlotValue | None) -> str | None:
            return sv.value if sv else None

        return {
            "session_hash": self.state.session_hash,
            "language": self.state.language,
            "turn_count": self.state.turn_count,
            "fsm_state": self.state.fsm_state,
            "red_flag_triggered": self.state.red_flag_triggered,
            "socrates": {
                "site": sv_str(s.site),
                "onset": sv_str(s.onset),
                "character": sv_str(s.character),
                "radiation": sv_str(s.radiation),
                "associations": [sv.value for sv in s.associations],
                "time_course": sv_str(s.time_course),
                "exacerbating": [sv.value for sv in s.exacerbating],
                "severity": sv_str(s.severity),
            },
            "ayush": {
                "agni_indicators": a.agni_indicators,
                "koshtha_indicators": a.koshtha_indicators,
                "dosha_indicators": a.dosha_indicators,
                "ahara_triggers": a.ahara_triggers,
            },
        }

    def next_question_payload(self, slot_id: str) -> dict[str, Any]:
        """
        Build the WebSocket question payload for the frontend to render.
        """
        lang = self.state.language
        return {
            "slot_being_filled": slot_id,
            "question_text": get_question_text(slot_id, lang),
            "touch_card_options": get_touch_cards(slot_id, lang),
            "turn_index": self.state.turn_count + 1,
        }
