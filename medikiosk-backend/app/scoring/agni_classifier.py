"""
MediKiosk — Agni (Digestive Fire) Classifier

Classifies Agni into one of four categories:
  Mandagni   — Slow / hypo-digestive (Kapha/Vata dominance)
  Tikshnagni — Sharp / hyper-digestive (Pitta dominance)
  Vishamagni — Irregular (Vata dominance)
  Samagni    — Balanced (normal)
  Inconclusive — Insufficient evidence

Classification formula:
  Agni_scores[k] = Σ w_i × I(indicator_i → trait_k)
  AgniClassification = argmax(Agni_scores[k])
  If max(scores) < MIN_CONFIDENCE → Inconclusive
"""
from __future__ import annotations

import logging

from app.config import get_settings
from app.models.clinical import AgniClassification
from app.models.session import AyushBeliefState

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Indicator-to-Agni mapping ─────────────────────────────────────────────────
# Each indicator tag maps to weights for each Agni class

AGNI_INDICATOR_WEIGHTS: dict[str, dict[str, float]] = {
    # Mandagni indicators
    "mandagni - low appetite heavy after eating": {"manda": 3.0},
    "low appetite":                                {"manda": 2.0},
    "post_meal_heaviness":                         {"manda": 2.0},
    "heavy after eating":                          {"manda": 2.5},
    "sour belching":                               {"manda": 1.5, "tikshna": 0.5},
    "sour_belching":                               {"manda": 1.5, "tikshna": 0.5},
    "slow digestion":                              {"manda": 2.0},
    "bloating after meals":                        {"manda": 2.0},
    "no hunger":                                   {"manda": 2.5},

    # Tikshnagni indicators
    "tikshnagni - excessive hunger burning":       {"tikshna": 3.0},
    "excessive hunger burning":                    {"tikshna": 3.0},
    "excessive hunger":                            {"tikshna": 2.0},
    "burning post meal":                           {"tikshna": 2.5},
    "burning_post_meal":                           {"tikshna": 2.5},
    "acid reflux":                                 {"tikshna": 2.0},
    "hungry again quickly":                        {"tikshna": 2.0},

    # Vishamagni indicators
    "vishamagni - irregular hunger":               {"vishama": 3.0},
    "irregular hunger":                            {"vishama": 3.0},
    "irregular appetite":                          {"vishama": 2.5},
    "sometimes hungry sometimes not":              {"vishama": 3.0},
    "variable appetite":                           {"vishama": 2.5},

    # Samagni indicators
    "samagni - normal digestion":                  {"sama": 3.0},
    "normal digestion":                            {"sama": 2.5},
    "normal hunger":                               {"sama": 2.0},
    "regular meals no issues":                     {"sama": 2.5},
    "balanced digestion":                          {"sama": 2.5},
}

CLASS_KEYS = ["manda", "tikshna", "vishama", "sama"]


def classify_agni(ayush_state: AyushBeliefState) -> tuple[AgniClassification, float]:
    """
    Classify Agni based on accumulated indicators in the AyushBeliefState.

    Returns:
        (classification: AgniClassification, confidence_score: float)
    """
    scores: dict[str, float] = {k: 0.0 for k in CLASS_KEYS}

    for indicator in ayush_state.agni_indicators:
        ind_lower = indicator.lower()

        # Exact match first
        if ind_lower in AGNI_INDICATOR_WEIGHTS:
            for cls, w in AGNI_INDICATOR_WEIGHTS[ind_lower].items():
                scores[cls] += w
            continue

        # Substring match fallback
        matched = False
        for key, weights in AGNI_INDICATOR_WEIGHTS.items():
            if key in ind_lower or ind_lower in key:
                for cls, w in weights.items():
                    scores[cls] += w
                matched = True
                break

        if not matched:
            logger.debug("Agni: unrecognised indicator '%s'", indicator[:40])

    max_score = max(scores.values())
    min_confidence = settings.min_agni_confidence

    if max_score < min_confidence:
        logger.debug("Agni: inconclusive (max_score=%.2f < threshold=%.2f)", max_score, min_confidence)
        return AgniClassification.INCONCLUSIVE, 0.0

    best_class = max(scores, key=lambda k: scores[k])
    # Normalise confidence to [0,1] relative to maximum possible single-indicator score
    confidence = min(max_score / 6.0, 1.0)

    classification_map = {
        "manda": AgniClassification.MANDAGNI,
        "tikshna": AgniClassification.TIKSHNAGNI,
        "vishama": AgniClassification.VISHAMAGNI,
        "sama": AgniClassification.SAMAGNI,
    }

    result = classification_map[best_class]
    logger.debug("Agni: %s (confidence=%.2f, scores=%s)", result, confidence, scores)
    return result, round(confidence, 2)
