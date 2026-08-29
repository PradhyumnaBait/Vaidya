"""
MediKiosk — Clinical Synthesis Engine

Orchestrates the final synthesis step at session end:
1. Classify Agni and Koshtha
2. Compute the Dosha Imbalance Vector
3. Compute SOCRATES completeness metrics
4. Compile all data into a ClinicalSynthesis object
5. Build the FHIR R4 Bundle
6. Build the physician EMR dashboard payload (the 15-second glance view)

The "Data-Dumping Triage Paradox" is solved here:
  Raw multi-modal inputs → scored, ranked, visually compressed →
  → Actionable 3-panel layout:
      [ALERT ZONE] | [SOCRATES SUMMARY] | [AYUSH PANEL]
      [LAB TIMELINE SPARKLINES] | [QUALITY BADGE]
"""
from __future__ import annotations

import logging
import time
from typing import Any

from app.models.clinical import (
    AyushAssessment,
    ClinicalSynthesis,
    CompletenessMetrics,
    DoshaVector,
    LabResult,
    RedFlagAlert,
    SOCRATESAssessment,
)
from app.models.session import BeliefState
from app.scoring.agni_classifier import classify_agni
from app.scoring.koshtha_classifier import classify_koshtha
from app.scoring.dosha_engine import compute_dosha_vector
from app.scoring.socrates_completeness import compute_completeness
from app.fhir.bundle_builder import build_fhir_bundle
from app.core import session_manager

logger = logging.getLogger(__name__)


# ── Helper: SlotValue → string ────────────────────────────────────────────────

def _sv(slot_val) -> str | None:
    return slot_val.value if slot_val else None


def _sv_anchor(slot_val) -> str | None:
    return slot_val.anchor_id if slot_val else None


# ── Synthesis Orchestrator ────────────────────────────────────────────────────

async def synthesise(
    state: BeliefState,
    lab_results: list[LabResult] | None = None,
) -> tuple[ClinicalSynthesis, dict[str, Any]]:
    """
    Main synthesis entry point.

    Args:
        state: Current (final) BeliefState from Redis
        lab_results: Parsed lab results from document pipeline

    Returns:
        (synthesis: ClinicalSynthesis, fhir_bundle: dict)
    """
    lab_results = lab_results or []
    generated_at = time.strftime("%Y-%m-%dT%H:%M:%S+05:30")

    # ── Step 1: Classify Agni and Koshtha ─────────────────────────────────────
    agni_class, agni_conf = classify_agni(state.ayush)
    koshtha_class, koshtha_conf = classify_koshtha(state.ayush)
    agni_anchor = state.ayush.agni_anchor_ids[0] if state.ayush.agni_anchor_ids else None
    koshtha_anchor = state.ayush.koshtha_anchor_ids[0] if state.ayush.koshtha_anchor_ids else None

    # ── Step 2: Compute Dosha Vector ──────────────────────────────────────────
    dosha_vector = compute_dosha_vector(state.ayush)

    # ── Step 3: Build Ayush Assessment ────────────────────────────────────────
    ayush_assessment = AyushAssessment(
        agni=agni_class,
        agni_confidence=agni_conf,
        agni_anchor_id=agni_anchor,
        koshtha=koshtha_class,
        koshtha_confidence=koshtha_conf,
        koshtha_anchor_id=koshtha_anchor,
        dosha_vector=dosha_vector,
        ahara_vihara={
            "diet_triggers": state.ayush.ahara_triggers,
            "lifestyle_flags": state.ayush.lifestyle_flags,
        },
        namaste_code=None,    # Populated below from ontology hits
        icd11_tm2_code=None,
    )

    # Populate NAMASTE/TM2 from best ontology hit in session
    if state.ontology_hits:
        best_hit = sorted(
            state.ontology_hits, key=lambda h: h.get("confidence", 0), reverse=True
        )[0]
        ayush_assessment.namaste_code = best_hit.get("namaste_code")
        ayush_assessment.icd11_tm2_code = best_hit.get("icd11_tm2_code")

    # ── Step 4: Build SOCRATES Assessment ─────────────────────────────────────
    s = state.socrates
    socrates_assessment = SOCRATESAssessment(
        site=_sv(s.site),
        site_anchor_id=_sv_anchor(s.site),
        onset=_sv(s.onset),
        onset_anchor_id=_sv_anchor(s.onset),
        character=_sv(s.character),
        character_anchor_id=_sv_anchor(s.character),
        radiation=_sv(s.radiation),
        radiation_anchor_id=_sv_anchor(s.radiation),
        associations=[sv.value for sv in s.associations],
        associations_anchor_ids=[sv.anchor_id or "" for sv in s.associations],
        time_course=_sv(s.time_course),
        time_course_anchor_id=_sv_anchor(s.time_course),
        exacerbating=[sv.value for sv in s.exacerbating],
        exacerbating_anchor_ids=[sv.anchor_id or "" for sv in s.exacerbating],
        severity=int(s.severity.value) if s.severity else None,
        severity_anchor_id=_sv_anchor(s.severity),
    )

    # ICD-11 from best ontology hit
    if state.ontology_hits:
        best = state.ontology_hits[0]
        socrates_assessment.icd11_code = best.get("allopathic", {}).get("icd11_code")
        socrates_assessment.icd11_display = best.get("allopathic", {}).get("display")

    # ── Step 5: Build Red Flag Alerts ─────────────────────────────────────────
    red_flags: list[RedFlagAlert] = []
    if state.red_flag_triggered and state.red_flag_rule_id:
        # Import rule registry to get the rule name/action
        from app.scoring.red_flag_interceptor import RED_FLAG_RULES
        rule = next(
            (r for r in RED_FLAG_RULES if r.rule_id == state.red_flag_rule_id), None
        )
        if rule:
            red_flags.append(RedFlagAlert(
                rule_id=rule.rule_id,
                name=rule.name,
                priority=rule.priority,
                action=rule.action,
                triggered_slots={},
                timestamp_iso=generated_at,
            ))

    # ── Step 6: SOCRATES Completeness ─────────────────────────────────────────
    completeness = compute_completeness(state)

    # ── Step 7: Chief Complaint ───────────────────────────────────────────────
    chief_complaint = _sv(s.site) or "Chief complaint not specified"
    if _sv(s.character):
        chief_complaint = f"{_sv(s.character)} pain in {_sv(s.site)}"
    chief_complaint_anchor = _sv_anchor(s.site)

    # ── Step 8: Assemble ClinicalSynthesis ────────────────────────────────────
    synthesis = ClinicalSynthesis(
        session_hash=state.session_hash,
        generated_at=generated_at,
        language=state.language,
        chief_complaint=chief_complaint,
        chief_complaint_anchor_id=chief_complaint_anchor,
        socrates=socrates_assessment,
        ayush=ayush_assessment,
        lab_results=lab_results,
        red_flags=red_flags,
        completeness=completeness,
        red_flag_disclaimer=(
            "ALERT: Clinical emergency protocol activated."
            if red_flags else
            "No emergency conditions detected. Standard triage applies."
        ),
    )

    # ── Step 9: Build FHIR Bundle ─────────────────────────────────────────────
    fhir_bundle = build_fhir_bundle(synthesis)

    logger.info(
        "Synthesis complete: session=%s chief='%s' F1=%.2f",
        state.session_hash[:12], chief_complaint[:40], completeness.socrates_f1,
    )

    return synthesis, fhir_bundle


# ── 15-Second EMR Dashboard Payload ──────────────────────────────────────────

def build_emr_dashboard(
    synthesis: ClinicalSynthesis,
    anchors: dict,
) -> dict[str, Any]:
    """
    Build the compact JSON payload sent to the physician EMR dashboard.

    Designed for 15-second glanceable comprehension:
    - Alert zone (red flags)
    - Chief complaint bar
    - SOCRATES card (slot-value pairs with anchor IDs)
    - Ayush panel (dosha vector + Agni/Koshtha)
    - Lab sparkline data
    - Completeness badge

    The frontend renders this as three columns with colour-coded severity bands.
    """
    s = synthesis.socrates
    a = synthesis.ayush

    # Lab table rows (anomalous only, sorted P0 → critical → high → low)
    def _severity_order(lr: LabResult) -> int:
        from app.models.clinical import AnomalyStatus
        order = {
            AnomalyStatus.CRITICAL_HIGH: 0,
            AnomalyStatus.CRITICAL_LOW: 1,
            AnomalyStatus.HIGH: 2,
            AnomalyStatus.LOW: 3,
            AnomalyStatus.NORMAL: 4,
            AnomalyStatus.UNKNOWN_RANGE: 5,
        }
        return order.get(lr.status, 5)

    abnormal_labs = [lr for lr in synthesis.lab_results if lr.status.value != "normal"]
    abnormal_labs.sort(key=_severity_order)

    return {
        "schema_version": "1.0",
        "session_hash": synthesis.session_hash,
        "generated_at": synthesis.generated_at,
        "language": synthesis.language,

        # ── Panel 1: Alert Zone ───────────────────────────────────────────────
        "alert_zone": {
            "has_red_flag": bool(synthesis.red_flags),
            "priority": synthesis.red_flags[0].priority if synthesis.red_flags else None,
            "rule_name": synthesis.red_flags[0].name if synthesis.red_flags else None,
            "action": synthesis.red_flags[0].action if synthesis.red_flags else None,
        },

        # ── Panel 2: Chief Complaint ──────────────────────────────────────────
        "chief_complaint": {
            "text": synthesis.chief_complaint,
            "anchor_id": synthesis.chief_complaint_anchor_id,
        },

        # ── Panel 3: SOCRATES Summary ─────────────────────────────────────────
        "socrates_summary": {
            "site": {"value": s.site, "anchor": s.site_anchor_id},
            "onset": {"value": s.onset, "anchor": s.onset_anchor_id},
            "character": {"value": s.character, "anchor": s.character_anchor_id},
            "radiation": {"value": s.radiation, "anchor": s.radiation_anchor_id},
            "severity": {"value": s.severity, "anchor": s.severity_anchor_id},
            "time_course": {"value": s.time_course, "anchor": s.time_course_anchor_id},
            "associations": s.associations,
            "exacerbating": s.exacerbating,
        },

        # ── Panel 4: Ayush Panel ──────────────────────────────────────────────
        "ayush_panel": {
            "agni": {"classification": a.agni, "confidence": a.agni_confidence},
            "koshtha": {"classification": a.koshtha, "confidence": a.koshtha_confidence},
            "dosha_vector": {
                "vata": a.dosha_vector.vata,
                "pitta": a.dosha_vector.pitta,
                "kapha": a.dosha_vector.kapha,
                "dominant": a.dosha_vector.dominant_label,
                "disclaimer": a.dosha_vector.disclaimer,
            },
            "namaste_code": a.namaste_code,
            "icd11_tm2_code": a.icd11_tm2_code,
        },

        # ── Panel 5: Lab Results (Anomalous Only) ─────────────────────────────
        "lab_anomalies": [
            {
                "biomarker": lr.biomarker,
                "display": lr.display_name,
                "value": lr.latest_value,
                "unit": lr.unit,
                "status": lr.status,
                "trend": lr.trend,
                "loinc": lr.loinc_code,
            }
            for lr in abnormal_labs[:8]  # Cap at 8 for dashboard clarity
        ],

        # ── Panel 6: Quality Badge ────────────────────────────────────────────
        "completeness": {
            "socrates_f1": synthesis.completeness.socrates_f1 if synthesis.completeness else 0.0,
            "socrates_recall": synthesis.completeness.socrates_recall if synthesis.completeness else 0.0,
            "ayush_recall": synthesis.completeness.ayush_recall if synthesis.completeness else 0.0,
        },

        # ── Ontology ──────────────────────────────────────────────────────────
        "ontology": {
            "icd11_code": s.icd11_code,
            "icd11_display": s.icd11_display,
        },

        # ── Anchors ───────────────────────────────────────────────────────────
        "anchors": anchors,
    }
