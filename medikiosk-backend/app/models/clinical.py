"""
MediKiosk — Pydantic models for clinical data structures.
These are the canonical data shapes used across all scoring and FHIR modules.
"""
from __future__ import annotations

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


# ── Dosha / Ayush Enumerations ────────────────────────────────────────────────

class AgniClassification(str, Enum):
    MANDAGNI = "Mandagni"      # Slow / hypo-digestive
    TIKSHNAGNI = "Tikshnagni"  # Sharp / hyper-digestive
    VISHAMAGNI = "Vishamagni"  # Irregular
    SAMAGNI = "Samagni"        # Balanced
    INCONCLUSIVE = "Inconclusive"


class KoshthaClassification(str, Enum):
    KRURA = "Krura"          # Hard / constipated (Vata-dominant)
    MRIDU = "Mridu"          # Soft / frequent (Pitta/Kapha-dominant)
    MADHYAMA = "Madhyama"    # Balanced / regular
    INCONCLUSIVE = "Inconclusive"


class VikritLabel(str, Enum):
    VATA_DOMINANT = "Vata-Dominant Vikriti"
    PITTA_DOMINANT = "Pitta-Dominant Vikriti"
    KAPHA_DOMINANT = "Kapha-Dominant Vikriti"
    MIXED = "Mixed Vikriti"
    INSUFFICIENT = "Insufficient Data"


# ── Lab Result ────────────────────────────────────────────────────────────────

class AnomalyStatus(str, Enum):
    NORMAL = "normal"
    HIGH = "high"
    LOW = "low"
    CRITICAL_HIGH = "critical_high"
    CRITICAL_LOW = "critical_low"
    UNKNOWN_RANGE = "unknown_range"


class LabTimePoint(BaseModel):
    date: str                       # ISO 8601 date string
    value: float
    unit: str
    status: AnomalyStatus


class LabResult(BaseModel):
    biomarker: str                  # Internal key (e.g., "hba1c")
    display_name: str               # Human label (e.g., "HbA1c")
    loinc_code: str | None = None
    latest_value: float
    unit: str
    status: AnomalyStatus
    reference_low: float | None = None
    reference_high: float | None = None
    timeline: list[LabTimePoint] = Field(default_factory=list)
    trend: str | None = None        # "worsening" | "improving" | "stable"
    anchor_id: str | None = None


# ── NAMASTE / ICD-11 Ontology ─────────────────────────────────────────────────

class OntologyMapping(BaseModel):
    allopathic_icd11_code: str | None = None
    allopathic_icd11_display: str | None = None
    namaste_code: str | None = None
    namaste_term: str | None = None
    icd11_tm2_code: str | None = None
    dosha_indicators: list[str] = Field(default_factory=list)
    confidence: float = 0.0


# ── Dosha Vector ──────────────────────────────────────────────────────────────

class DoshaVector(BaseModel):
    vata: float = 0.0
    pitta: float = 0.0
    kapha: float = 0.0
    dominant_label: VikritLabel = VikritLabel.INSUFFICIENT
    disclaimer: str = (
        "Vikriti tendency only. Prakriti assessment requires in-person examination."
    )


# ── Ayush Core-4 Assessment ───────────────────────────────────────────────────

class AyushAssessment(BaseModel):
    agni: AgniClassification = AgniClassification.INCONCLUSIVE
    agni_confidence: float = 0.0
    agni_anchor_id: str | None = None

    koshtha: KoshthaClassification = KoshthaClassification.INCONCLUSIVE
    koshtha_confidence: float = 0.0
    koshtha_anchor_id: str | None = None

    dosha_vector: DoshaVector = Field(default_factory=DoshaVector)

    ahara_vihara: dict[str, Any] = Field(
        default_factory=lambda: {"diet_triggers": [], "lifestyle_flags": []}
    )

    namaste_code: str | None = None
    icd11_tm2_code: str | None = None


# ── SOCRATES Slots ────────────────────────────────────────────────────────────

class SOCRATESAssessment(BaseModel):
    site: str | None = None
    site_anchor_id: str | None = None

    onset: str | None = None
    onset_anchor_id: str | None = None

    character: str | None = None
    character_anchor_id: str | None = None

    radiation: str | None = None
    radiation_anchor_id: str | None = None

    associations: list[str] = Field(default_factory=list)
    associations_anchor_ids: list[str] = Field(default_factory=list)

    time_course: str | None = None
    time_course_anchor_id: str | None = None

    exacerbating: list[str] = Field(default_factory=list)
    exacerbating_anchor_ids: list[str] = Field(default_factory=list)

    severity: int | None = None          # 1-10
    severity_anchor_id: str | None = None

    icd11_code: str | None = None
    icd11_display: str | None = None


# ── Red Flag ──────────────────────────────────────────────────────────────────

class RedFlagAlert(BaseModel):
    rule_id: str
    name: str
    priority: str                  # "P0" | "P1"
    action: str                    # "EMERGENCY_TRIAGE" | "PRIORITY_QUEUE" | "ELEVATED_RISK_FLAG"
    triggered_slots: dict[str, str]
    timestamp_iso: str


# ── Synthesis Output ──────────────────────────────────────────────────────────

class CompletenessMetrics(BaseModel):
    socrates_slots_filled: int
    socrates_slots_total: int = 8
    socrates_recall: float
    ayush_slots_filled: int
    ayush_slots_total: int = 4
    ayush_recall: float
    socrates_f1: float


class ClinicalSynthesis(BaseModel):
    """
    The complete synthesised clinical summary produced at session end.
    This is what populates the physician EMR dashboard and forms the basis
    for the FHIR R4 bundle.
    """
    session_hash: str
    generated_at: str
    language: str

    chief_complaint: str
    chief_complaint_anchor_id: str | None = None

    socrates: SOCRATESAssessment = Field(default_factory=SOCRATESAssessment)
    ayush: AyushAssessment = Field(default_factory=AyushAssessment)
    lab_results: list[LabResult] = Field(default_factory=list)
    red_flags: list[RedFlagAlert] = Field(default_factory=list)
    completeness: CompletenessMetrics | None = None

    red_flag_disclaimer: str = "No emergency conditions detected. Standard triage applies."
