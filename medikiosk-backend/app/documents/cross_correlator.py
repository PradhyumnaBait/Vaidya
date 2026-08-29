"""
MediKiosk — Lab Anomaly ↔ Symptom Cross-Correlator

After lab extraction, this module injects relevant lab anomalies
as contextual notes into the active BeliefState, and escalates
compound risk conditions to the red-flag engine.

Cross-correlation rules are deterministic. They do NOT use LLMs.
"""
from __future__ import annotations

from dataclasses import dataclass
import logging
from typing import Any

from app.models.clinical import AnomalyStatus, LabResult

logger = logging.getLogger(__name__)

# ── Cross-Correlation Rule Registry ──────────────────────────────────────────

@dataclass
class CrossCorrelationRule:
    biomarker: str
    operator: str           # ">" | "<" | ">=" | "<="
    threshold: float
    site_keywords: list[str]  # Required symptom site keywords (empty = apply regardless)
    injection_note: str     # Clinical note to inject into BeliefState
    escalate_to_redflag: bool = False


CROSS_CORRELATION_RULES: list[CrossCorrelationRule] = [
    CrossCorrelationRule(
        biomarker="uric_acid",
        operator=">",
        threshold=7.0,
        site_keywords=["joint", "toe", "knee", "ankle", "foot", "limb"],
        injection_note="Elevated uric acid noted — probable hyperuricaemia/gout risk",
    ),
    CrossCorrelationRule(
        biomarker="hba1c",
        operator=">",
        threshold=7.0,
        site_keywords=[],  # Apply regardless of site
        injection_note="HbA1c > 7.0% — uncontrolled diabetes mellitus suspected",
    ),
    CrossCorrelationRule(
        biomarker="serum_creatinine",
        operator=">",
        threshold=1.5,
        site_keywords=["swelling", "oedema", "face", "ankle", "limb"],
        injection_note="Elevated creatinine — CKD/AKI screening recommended",
    ),
    CrossCorrelationRule(
        biomarker="haemoglobin",
        operator="<",
        threshold=10.0,
        site_keywords=[],
        injection_note="Haemoglobin < 10 g/dL — clinically significant anaemia",
    ),
    CrossCorrelationRule(
        biomarker="tsh",
        operator=">",
        threshold=10.0,
        site_keywords=[],
        injection_note="TSH markedly elevated — hypothyroidism likely",
    ),
    CrossCorrelationRule(
        biomarker="ldl_cholesterol",
        operator=">",
        threshold=160.0,
        site_keywords=["chest"],
        injection_note="LDL > 160 mg/dL with chest complaint — compound cardiovascular risk",
        escalate_to_redflag=True,
    ),
    CrossCorrelationRule(
        biomarker="alt",
        operator=">",
        threshold=80.0,
        site_keywords=[],
        injection_note="ALT/SGPT elevated 2×+ — liver involvement possible",
    ),
]


def apply_cross_correlations(
    lab_results: list[LabResult],
    current_site: str | None,
    current_associations: list[str],
) -> list[str]:
    """
    Compare lab anomalies against active symptom context.

    Args:
        lab_results: Extracted LabResult objects from OCR
        current_site: Current SOCRATES site slot value (or None)
        current_associations: Current SOCRATES associations list

    Returns:
        List of clinical injection notes (to be added to BeliefState)
    """
    injections: list[str] = []
    symptom_context = (current_site or "").lower()
    symptom_context += " " + " ".join(current_associations).lower()

    for rule in CROSS_CORRELATION_RULES:
        # Find matching lab result
        lab = next((lr for lr in lab_results if lr.biomarker == rule.biomarker), None)
        if lab is None:
            continue

        # Check threshold condition
        value = lab.latest_value
        if rule.operator == ">" and not (value > rule.threshold):
            continue
        elif rule.operator == "<" and not (value < rule.threshold):
            continue
        elif rule.operator == ">=" and not (value >= rule.threshold):
            continue
        elif rule.operator == "<=" and not (value <= rule.threshold):
            continue

        # Check site keyword requirement
        if rule.site_keywords:
            matched_site = any(kw in symptom_context for kw in rule.site_keywords)
            if not matched_site:
                continue

        injections.append(rule.injection_note)
        logger.info(
            "Cross-correlation: %s %.1f %s %.1f → '%s'",
            rule.biomarker, value, rule.operator, rule.threshold,
            rule.injection_note[:50],
        )

    return injections
