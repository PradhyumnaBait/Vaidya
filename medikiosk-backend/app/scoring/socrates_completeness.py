"""
MediKiosk — SOCRATES Completeness Scoring

Implements the F1-based information-gathering efficiency metric
from the Note2Chat research framework (arXiv Jan 2026).

Metrics:
    Precision  = |E ∩ T| / |E|
    Recall     = |E ∩ T| / |T|
    F1_SOCRATES = 2 × (P × R) / (P + R)

Where:
    T = Target Findings: the 8 mandatory SOCRATES slots
    E = Elicited Findings: slots with non-null SlotValues at session end

A session with Recall < 0.625 (5/8 slots) triggers a quality flag
in the operational analytics pipeline.

Also computes:
    Recall_Ayush = |Filled_Ayush_Slots| / 4
"""
from __future__ import annotations

import logging

from app.models.clinical import CompletenessMetrics
from app.models.session import BeliefState

logger = logging.getLogger(__name__)

# Target slots
SOCRATES_TARGET_SLOTS = {
    "site", "onset", "character", "radiation",
    "associations", "time_course", "exacerbating", "severity"
}
AYUSH_TARGET_SLOTS = {"agni", "koshtha", "dosha_indicators", "ahara_vihara"}
QUALITY_RECALL_THRESHOLD = 0.625   # 5/8 SOCRATES slots


def compute_completeness(state: BeliefState) -> CompletenessMetrics:
    """
    Compute SOCRATES and Ayush completeness metrics for the session.

    Returns a CompletenessMetrics object embedded in the synthesis output
    and the FHIR bundle as a quality extension.
    """
    s = state.socrates
    a = state.ayush

    # ── SOCRATES Elicited Set ─────────────────────────────────────────────────
    elicited: set[str] = set()
    if s.site is not None:
        elicited.add("site")
    if s.onset is not None:
        elicited.add("onset")
    if s.character is not None:
        elicited.add("character")
    if s.radiation is not None:
        elicited.add("radiation")
    if s.associations:
        elicited.add("associations")
    if s.time_course is not None:
        elicited.add("time_course")
    if s.exacerbating:
        elicited.add("exacerbating")
    if s.severity is not None:
        elicited.add("severity")

    # ── SOCRATES Precision / Recall / F1 ─────────────────────────────────────
    intersection = elicited & SOCRATES_TARGET_SLOTS

    precision = len(intersection) / len(elicited) if elicited else 0.0
    recall = len(intersection) / len(SOCRATES_TARGET_SLOTS)
    f1 = (
        2 * precision * recall / (precision + recall)
        if (precision + recall) > 0 else 0.0
    )

    # ── Ayush Completeness ────────────────────────────────────────────────────
    ayush_filled = 0
    if a.agni_indicators:
        ayush_filled += 1
    if a.koshtha_indicators:
        ayush_filled += 1
    if a.dosha_indicators:
        ayush_filled += 1
    if a.ahara_triggers or a.lifestyle_flags:
        ayush_filled += 1

    ayush_recall = ayush_filled / 4.0

    # ── Quality Flag ──────────────────────────────────────────────────────────
    if recall < QUALITY_RECALL_THRESHOLD:
        logger.warning(
            "Session %s: SOCRATES recall %.2f below threshold %.2f (turn_count=%d)",
            state.session_id[:8], recall, QUALITY_RECALL_THRESHOLD, state.turn_count,
        )

    return CompletenessMetrics(
        socrates_slots_filled=len(intersection),
        socrates_slots_total=8,
        socrates_recall=round(recall, 3),
        ayush_slots_filled=ayush_filled,
        ayush_slots_total=4,
        ayush_recall=round(ayush_recall, 3),
        socrates_f1=round(f1, 3),
    )
