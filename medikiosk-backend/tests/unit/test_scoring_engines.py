"""
Unit tests for the Dosha Engine, Agni Classifier, and Koshtha Classifier.
All tests are pure-Python with no external API dependencies.
"""
import pytest

from app.models.clinical import AgniClassification, KoshthaClassification, VikritLabel
from app.models.session import AyushBeliefState
from app.scoring.agni_classifier import classify_agni
from app.scoring.koshtha_classifier import classify_koshtha
from app.scoring.dosha_engine import compute_dosha_vector


class TestAgniClassifier:
    def test_mandagni_from_low_appetite(self):
        state = AyushBeliefState(agni_indicators=["mandagni - low appetite heavy after eating"])
        cls, conf = classify_agni(state)
        assert cls == AgniClassification.MANDAGNI
        assert conf > 0.3

    def test_tikshnagni_from_excessive_hunger(self):
        state = AyushBeliefState(agni_indicators=["tikshnagni - excessive hunger burning"])
        cls, conf = classify_agni(state)
        assert cls == AgniClassification.TIKSHNAGNI
        assert conf > 0.3

    def test_vishamagni_from_irregular_hunger(self):
        state = AyushBeliefState(agni_indicators=["vishamagni - irregular hunger"])
        cls, conf = classify_agni(state)
        assert cls == AgniClassification.VISHAMAGNI

    def test_samagni_from_normal(self):
        state = AyushBeliefState(agni_indicators=["samagni - normal digestion"])
        cls, conf = classify_agni(state)
        assert cls == AgniClassification.SAMAGNI

    def test_empty_indicators_inconclusive(self):
        state = AyushBeliefState(agni_indicators=[])
        cls, conf = classify_agni(state)
        assert cls == AgniClassification.INCONCLUSIVE
        assert conf == 0.0

    def test_single_ambiguous_word_inconclusive(self):
        state = AyushBeliefState(agni_indicators=["x"])
        cls, conf = classify_agni(state)
        # Single unrecognised tag — expect inconclusive or low score
        assert conf <= 0.5


class TestKoshthaClassifier:
    def test_krura_classification(self):
        state = AyushBeliefState(koshtha_indicators=["krura - constipated hard stools"])
        cls, conf = classify_koshtha(state)
        assert cls == KoshthaClassification.KRURA
        assert conf > 0.3

    def test_mridu_classification(self):
        state = AyushBeliefState(koshtha_indicators=["mridu - loose frequent stools"])
        cls, conf = classify_koshtha(state)
        assert cls == KoshthaClassification.MRIDU

    def test_madhyama_classification(self):
        state = AyushBeliefState(koshtha_indicators=["madhyama - regular normal"])
        cls, conf = classify_koshtha(state)
        assert cls == KoshthaClassification.MADHYAMA

    def test_empty_inconclusive(self):
        state = AyushBeliefState(koshtha_indicators=[])
        cls, conf = classify_koshtha(state)
        assert cls == KoshthaClassification.INCONCLUSIVE


class TestDoshaEngine:
    def test_pitta_dominant_from_heat_intolerance(self):
        state = AyushBeliefState(
            dosha_indicators=[
                {"tag": "heat_intolerance burning - pitta", "confidence": 1.0},
                {"tag": "burning_sensation", "confidence": 1.0},
            ]
        )
        vector = compute_dosha_vector(state)
        assert vector.pitta > vector.vata
        assert vector.pitta > vector.kapha
        assert vector.dominant_label == VikritLabel.PITTA_DOMINANT

    def test_vata_dominant_from_constipation(self):
        state = AyushBeliefState(
            dosha_indicators=[
                {"tag": "cold_intolerance joint_pain - vata", "confidence": 1.0},
                {"tag": "constipation_hard", "confidence": 1.0},
            ]
        )
        vector = compute_dosha_vector(state)
        assert vector.vata > vector.pitta
        assert vector.dominant_label == VikritLabel.VATA_DOMINANT

    def test_kapha_dominant_from_heaviness(self):
        state = AyushBeliefState(
            dosha_indicators=[
                {"tag": "heaviness excessive_sleep lethargy - kapha", "confidence": 1.0},
                {"tag": "weight_gain", "confidence": 1.0},
            ]
        )
        vector = compute_dosha_vector(state)
        assert vector.kapha > vector.pitta
        assert vector.dominant_label == VikritLabel.KAPHA_DOMINANT

    def test_insufficient_with_no_indicators(self):
        state = AyushBeliefState()
        vector = compute_dosha_vector(state)
        assert vector.dominant_label == VikritLabel.INSUFFICIENT

    def test_agni_mandagni_adds_kapha_score(self):
        state = AyushBeliefState(
            agni_indicators=["mandagni - low appetite heavy after eating"]
        )
        vector = compute_dosha_vector(state)
        # Mandagni should add Kapha and Vata
        assert vector.kapha > 0 or vector.vata > 0

    def test_disclaimer_always_present(self):
        state = AyushBeliefState()
        vector = compute_dosha_vector(state)
        assert "Prakriti" in vector.disclaimer
