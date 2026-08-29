"""
MediKiosk — Koshtha (Bowel Nature) Classifier

Classifies the patient's bowel tendency:
  Krura    — Hard/constipated stools (Vata dominance)
  Mridu    — Soft/frequent/laxative-sensitive (Pitta/Kapha)
  Madhyama — Balanced/regular
  Inconclusive — Insufficient evidence
"""
from __future__ import annotations

import logging

from app.config import get_settings
from app.models.clinical import KoshthaClassification
from app.models.session import AyushBeliefState

logger = logging.getLogger(__name__)
settings = get_settings()

KOSHTHA_WEIGHTS: dict[str, dict[str, float]] = {
    # Krura (Vata — constipated)
    "krura - constipated hard stools":    {"krura": 3.0},
    "constipated":                         {"krura": 2.5},
    "hard stools":                         {"krura": 2.5},
    "straining":                           {"krura": 2.0},
    "dry stool":                           {"krura": 2.0},
    "infrequent bowel":                    {"krura": 2.0},

    # Mridu (Pitta/Kapha — loose/frequent)
    "mridu - loose frequent stools":       {"mridu": 3.0},
    "loose stools":                        {"mridu": 2.5},
    "frequent bowel":                      {"mridu": 2.5},
    "diarrhoea":                           {"mridu": 2.5},
    "milk causes loose stool":             {"mridu": 2.0},
    "sensitive to oily food":              {"mridu": 2.0},

    # Madhyama (balanced)
    "madhyama - regular normal":           {"madhyama": 3.0},
    "regular bowel":                       {"madhyama": 2.5},
    "normal stool":                        {"madhyama": 2.0},
    "once daily regular":                  {"madhyama": 2.5},
}

CLASS_KEYS = ["krura", "mridu", "madhyama"]


def classify_koshtha(ayush_state: AyushBeliefState) -> tuple[KoshthaClassification, float]:
    """
    Classify Koshtha from accumulated koshtha indicators.

    Returns:
        (classification: KoshthaClassification, confidence_score: float)
    """
    scores: dict[str, float] = {k: 0.0 for k in CLASS_KEYS}

    for indicator in ayush_state.koshtha_indicators:
        ind_lower = indicator.lower()

        if ind_lower in KOSHTHA_WEIGHTS:
            for cls, w in KOSHTHA_WEIGHTS[ind_lower].items():
                scores[cls] += w
            continue

        for key, weights in KOSHTHA_WEIGHTS.items():
            if key in ind_lower or ind_lower in key:
                for cls, w in weights.items():
                    scores[cls] += w
                break

    max_score = max(scores.values())
    min_confidence = 2.0  # Need at least 2 matching indicators

    if max_score < min_confidence:
        return KoshthaClassification.INCONCLUSIVE, 0.0

    best_class = max(scores, key=lambda k: scores[k])
    confidence = min(max_score / 6.0, 1.0)

    classification_map = {
        "krura": KoshthaClassification.KRURA,
        "mridu": KoshthaClassification.MRIDU,
        "madhyama": KoshthaClassification.MADHYAMA,
    }

    result = classification_map[best_class]
    logger.debug("Koshtha: %s (confidence=%.2f)", result, confidence)
    return result, round(confidence, 2)
