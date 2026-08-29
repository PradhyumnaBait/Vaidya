"""
MediKiosk — Dosha Imbalance Vector Engine

Computes the Vata/Pitta/Kapha imbalance vector from accumulated
dosha indicator tags extracted during the patient interview.

Mathematical model:
    S_V = Σ (w_v × entity_confidence)   for all Vata indicators
    S_P = Σ (w_p × entity_confidence)   for all Pitta indicators
    S_K = Σ (w_k × entity_confidence)   for all Kapha indicators

Dominance rule:
    If S_P ≥ 1.5 × max(S_V, S_K)  → Pitta-Dominant Vikriti
    If S_V ≥ 1.5 × max(S_P, S_K)  → Vata-Dominant Vikriti
    If S_K ≥ 1.5 × max(S_V, S_P)  → Kapha-Dominant Vikriti
    Else                           → Mixed Vikriti

Note: Only Vikriti (current pathological state) is assessed, NOT Prakriti
(lifelong constitution), as Prakriti requires physical examination.
"""
from __future__ import annotations

import logging

from app.config import get_settings
from app.models.clinical import DoshaVector, VikritLabel
from app.models.session import AyushBeliefState

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Dosha Indicator Weight Registry ───────────────────────────────────────────
# Maps clinical entity tag → {vata, pitta, kapha} weights
# Weights reflect classical Ayurvedic association strength (1.0 = moderate, 3.0 = strong)

DOSHA_WEIGHTS: dict[str, dict[str, float]] = {
    # Pitta-dominant indicators
    "burning_sensation":        {"pitta": 3.0, "vata": 0.5, "kapha": 0.0},
    "heat_intolerance":         {"pitta": 2.5, "vata": 0.5, "kapha": 0.0},
    "skin_eruptions":           {"pitta": 2.5, "kapha": 1.0, "vata": 0.5},
    "excessive_hunger":         {"pitta": 2.0, "vata": 1.0, "kapha": 0.0},
    "hyperacidity":             {"pitta": 3.0, "vata": 0.5, "kapha": 0.0},
    "irritability":             {"pitta": 2.0, "vata": 1.0, "kapha": 0.0},
    "burning_post_meal":        {"pitta": 3.0, "vata": 0.0, "kapha": 0.0},
    "sour_belching":            {"pitta": 2.5, "vata": 0.5, "kapha": 0.0},
    "yellow_stools":            {"pitta": 2.0, "vata": 0.0, "kapha": 0.0},
    "heat_intolerance burning - pitta": {"pitta": 3.0, "vata": 0.0, "kapha": 0.0},

    # Vata-dominant indicators
    "joint_stiffness":          {"vata": 3.0, "pitta": 0.5, "kapha": 1.0},
    "constipation_hard":        {"vata": 3.0, "pitta": 0.0, "kapha": 0.0},
    "anxiety_restlessness":     {"vata": 3.0, "pitta": 1.0, "kapha": 0.0},
    "cold_intolerance":         {"vata": 2.0, "kapha": 2.0, "pitta": 0.0},
    "dry_skin":                 {"vata": 2.5, "pitta": 0.5, "kapha": 0.0},
    "variable_appetite":        {"vata": 2.5, "pitta": 0.5, "kapha": 0.0},
    "insomnia":                 {"vata": 2.5, "pitta": 1.0, "kapha": 0.0},
    "bone_pain":                {"vata": 2.5, "pitta": 0.5, "kapha": 0.5},
    "cold_intolerance joint_pain - vata": {"vata": 3.0, "pitta": 0.0, "kapha": 0.0},

    # Kapha-dominant indicators
    "heaviness_post_meal":      {"kapha": 3.0, "vata": 0.5, "pitta": 0.0},
    "water_retention":          {"kapha": 3.0, "pitta": 0.5, "vata": 0.0},
    "excessive_sleep":          {"kapha": 3.0, "vata": 0.0, "pitta": 0.0},
    "lethargy":                 {"kapha": 2.5, "vata": 1.0, "pitta": 0.0},
    "weight_gain":              {"kapha": 2.5, "vata": 0.0, "pitta": 0.5},
    "congestion":               {"kapha": 2.5, "vata": 1.0, "pitta": 0.5},
    "slow_digestion":           {"kapha": 2.0, "vata": 1.0, "pitta": 0.0},
    "heaviness excessive_sleep lethargy - kapha": {"kapha": 3.0, "vata": 0.0, "pitta": 0.0},

    # Pitta+Kapha
    "spicy_fried_preference - pitta_kapha": {"pitta": 1.5, "kapha": 1.5, "vata": 0.0},

    # Kapha
    "sweet_cold_preference - kapha": {"kapha": 2.0, "vata": 0.5, "pitta": 0.0},

    # Vata
    "light_warm_preference - vata": {"vata": 1.5, "pitta": 0.5, "kapha": 0.0},
}


def _resolve_tag(tag: str) -> dict[str, float] | None:
    """
    Find the best matching weight entry for a given indicator tag.
    Tries exact match first, then substring containment.
    """
    tag_lower = tag.lower()

    # Exact match
    if tag_lower in DOSHA_WEIGHTS:
        return DOSHA_WEIGHTS[tag_lower]

    # Substring containment (for composite value tags)
    for key, weights in DOSHA_WEIGHTS.items():
        if key in tag_lower or tag_lower in key:
            return weights

    return None


def compute_dosha_vector(ayush_state: AyushBeliefState) -> DoshaVector:
    """
    Compute the Dosha Imbalance Vector from accumulated indicators.

    Accumulates weights from:
    1. dosha_indicators list (tagged from LLM extraction + RAG)
    2. agni_indicators (Mandagni → Kapha/Vata, Tikshnagni → Pitta)
    3. koshtha_indicators (Krura → Vata, Mridu → Pitta/Kapha)
    """
    s_v = 0.0
    s_p = 0.0
    s_k = 0.0

    # ── Primary dosha indicators ──────────────────────────────────────────────
    for item in ayush_state.dosha_indicators:
        tag = item.get("tag", "")
        confidence = float(item.get("confidence", 1.0))
        weights = _resolve_tag(tag)
        if weights:
            s_v += weights.get("vata", 0.0) * confidence
            s_p += weights.get("pitta", 0.0) * confidence
            s_k += weights.get("kapha", 0.0) * confidence

    # ── Agni-derived dosha signals ────────────────────────────────────────────
    for ind in ayush_state.agni_indicators:
        if "mandagni" in ind.lower() or "low appetite" in ind.lower():
            s_k += 1.5
            s_v += 0.5
        elif "tikshnagni" in ind.lower() or "excessive hunger" in ind.lower():
            s_p += 2.0
        elif "vishamagni" in ind.lower() or "irregular" in ind.lower():
            s_v += 1.5

    # ── Koshtha-derived dosha signals ─────────────────────────────────────────
    for ind in ayush_state.koshtha_indicators:
        if "krura" in ind.lower() or "constipated" in ind.lower():
            s_v += 1.5
        elif "mridu" in ind.lower() or "loose" in ind.lower():
            s_p += 1.0
            s_k += 0.5

    # ── Dominance Classification ──────────────────────────────────────────────
    min_threshold = settings.min_dosha_threshold
    max_score = max(s_v, s_p, s_k)

    if max_score < min_threshold:
        label = VikritLabel.INSUFFICIENT
    elif s_p >= 1.5 * max(s_v, s_k) and s_p >= min_threshold:
        label = VikritLabel.PITTA_DOMINANT
    elif s_v >= 1.5 * max(s_p, s_k) and s_v >= min_threshold:
        label = VikritLabel.VATA_DOMINANT
    elif s_k >= 1.5 * max(s_v, s_p) and s_k >= min_threshold:
        label = VikritLabel.KAPHA_DOMINANT
    else:
        label = VikritLabel.MIXED if max_score >= min_threshold else VikritLabel.INSUFFICIENT

    logger.debug("Dosha vector: V=%.2f P=%.2f K=%.2f → %s", s_v, s_p, s_k, label)

    return DoshaVector(
        vata=round(s_v, 2),
        pitta=round(s_p, 2),
        kapha=round(s_k, 2),
        dominant_label=label,
    )
