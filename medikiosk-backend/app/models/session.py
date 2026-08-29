"""
MediKiosk — Session and BeliefState Pydantic models.
The BeliefState is the central data structure maintained in Redis throughout
a patient's kiosk session. Every subsystem reads from and writes to it.
"""
from __future__ import annotations

from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field
import time


# ── FSM States ────────────────────────────────────────────────────────────────

class SessionFSMState(str, Enum):
    IDLE = "IDLE"
    CONSENT_PENDING = "CONSENT_PENDING"
    CONSENT_GRANTED = "CONSENT_GRANTED"
    INTAKE_ACTIVE = "INTAKE_ACTIVE"
    RED_FLAG_TRIAGE = "RED_FLAG_TRIAGE"
    DOCUMENT_INTAKE = "DOCUMENT_INTAKE"
    SYNTHESIS_PENDING = "SYNTHESIS_PENDING"
    FHIR_TRANSMISSION = "FHIR_TRANSMISSION"
    SESSION_TEARDOWN = "SESSION_TEARDOWN"
    CONSENT_DENIED = "CONSENT_DENIED"


# ── Slot Value ────────────────────────────────────────────────────────────────

class SlotValue(BaseModel):
    """
    A filled clinical slot with provenance metadata.
    The anchor_id links back to the specific transcript turn or document
    bounding box that produced this value.
    """
    value: str
    raw_text: str
    source: Literal["voice", "touch", "lab_injection", "system"]
    anchor_id: str | None = None
    confidence: float = 1.0          # ASR confidence; always 1.0 for touch/lab


# ── SOCRATES Belief State ─────────────────────────────────────────────────────

class SOCRATESBeliefState(BaseModel):
    site: SlotValue | None = None
    onset: SlotValue | None = None
    character: SlotValue | None = None
    radiation: SlotValue | None = None
    associations: list[SlotValue] = Field(default_factory=list)
    time_course: SlotValue | None = None
    exacerbating: list[SlotValue] = Field(default_factory=list)
    severity: SlotValue | None = None

    def filled_count(self) -> int:
        scalar_slots = [self.site, self.onset, self.character, self.radiation,
                        self.time_course, self.severity]
        list_slots = [self.associations, self.exacerbating]
        scalar_filled = sum(1 for s in scalar_slots if s is not None)
        list_filled = sum(1 for ls in list_slots if len(ls) > 0)
        return scalar_filled + list_filled

    def null_slots(self) -> list[str]:
        """Return slot names that are still unfilled, in priority order."""
        nulls = []
        priority_order = [
            ("site", self.site),
            ("character", self.character),
            ("radiation", self.radiation),
            ("onset", self.onset),
            ("severity", self.severity),
            ("time_course", self.time_course),
        ]
        for name, val in priority_order:
            if val is None:
                nulls.append(name)
        if not self.associations:
            nulls.append("associations")
        if not self.exacerbating:
            nulls.append("exacerbating")
        return nulls


# ── Ayush Belief State ────────────────────────────────────────────────────────

class AyushBeliefState(BaseModel):
    agni_indicators: list[str] = Field(default_factory=list)     # Accumulated tags
    koshtha_indicators: list[str] = Field(default_factory=list)
    dosha_indicators: list[dict] = Field(default_factory=list)   # {tag, vata, pitta, kapha, confidence}
    ahara_triggers: list[str] = Field(default_factory=list)
    lifestyle_flags: list[str] = Field(default_factory=list)
    agni_anchor_ids: list[str] = Field(default_factory=list)
    koshtha_anchor_ids: list[str] = Field(default_factory=list)

    def filled_count(self) -> int:
        count = 0
        if self.agni_indicators:
            count += 1
        if self.koshtha_indicators:
            count += 1
        if self.dosha_indicators:
            count += 1
        if self.ahara_triggers or self.lifestyle_flags:
            count += 1
        return count

    def null_slots(self) -> list[str]:
        nulls = []
        if not self.agni_indicators:
            nulls.append("agni")
        if not self.koshtha_indicators:
            nulls.append("koshtha")
        if not self.dosha_indicators:
            nulls.append("dosha_indicators")
        if not self.ahara_triggers and not self.lifestyle_flags:
            nulls.append("ahara_vihara")
        return nulls


# ── Transcript Entry ──────────────────────────────────────────────────────────

class TranscriptEntry(BaseModel):
    turn: int
    speaker: Literal["patient", "system"]
    text: str
    source: Literal["voice", "touch", "tts", "system"]
    offset_ms: int = 0          # Audio offset from session start
    anchor_id: str | None = None


# ── Main BeliefState ──────────────────────────────────────────────────────────

class BeliefState(BaseModel):
    """
    Central session state object stored in Redis.
    Serialised as JSON; every subsystem reads/writes via session_manager.
    """
    session_id: str
    session_hash: str            # SHA-256(session_id) — used in external comms
    language: str = "hi"         # BCP-47 language code selected by patient

    fsm_state: SessionFSMState = SessionFSMState.IDLE
    turn_count: int = 0
    session_start_ms: float = Field(default_factory=lambda: time.time() * 1000)
    elapsed_ms: float = 0.0

    # ── Clinical Tracks ───────────────────────────────────────────────────────
    socrates: SOCRATESBeliefState = Field(default_factory=SOCRATESBeliefState)
    ayush: AyushBeliefState = Field(default_factory=AyushBeliefState)

    # ── Red Flag ──────────────────────────────────────────────────────────────
    red_flag_triggered: bool = False
    red_flag_rule_id: str | None = None

    # ── Transcript ────────────────────────────────────────────────────────────
    transcript: list[TranscriptEntry] = Field(default_factory=list)

    # ── Ontology Mappings accumulated during session ──────────────────────────
    ontology_hits: list[dict] = Field(default_factory=list)

    # ── Document / Lab context ────────────────────────────────────────────────
    lab_results: list[dict] = Field(default_factory=list)   # LabResult dicts
    doc_anomalies_injected: list[str] = Field(default_factory=list)  # Slot names already injected

    # ── Consent ───────────────────────────────────────────────────────────────
    consent_granted: bool = False
    consent_version: str = ""

    # ── ABHA (masked) ─────────────────────────────────────────────────────────
    abha_token_hash: str = "[ABHA OMITTED]"

    def elapsed(self) -> float:
        """Return elapsed milliseconds since session start."""
        return time.time() * 1000 - self.session_start_ms

    def completion_entropy(self) -> float:
        """Fraction of all mandatory slots filled (0.0 → 1.0)."""
        socrates_filled = self.socrates.filled_count()   # max 8
        ayush_filled = self.ayush.filled_count()          # max 4
        return (socrates_filled + ayush_filled) / 12.0
