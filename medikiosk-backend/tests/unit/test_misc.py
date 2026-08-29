"""
Unit tests for arbitration engine, temporal normalizer, and SOCRATES completeness scorer.
"""
import pytest

from app.documents.temporal_normalizer import extract_report_date
from app.models.session import (
    BeliefState, SOCRATESBeliefState, AyushBeliefState, SlotValue
)
from app.scoring.socrates_completeness import compute_completeness


class TestTemporalNormalizer:
    def test_iso_format_dd_mmm_yyyy(self):
        assert extract_report_date("12-May-2024") == "2024-05-12"

    def test_numeric_indian_format(self):
        assert extract_report_date("15/08/2025") == "2025-08-15"

    def test_with_spaces(self):
        assert extract_report_date("12 Aug 2025") == "2025-08-12"

    def test_month_year_comma(self):
        assert extract_report_date("August 12, 2024") == "2024-08-12"

    def test_hindi_month(self):
        result = extract_report_date("15 अगस्त 2025")
        assert result == "2025-08-15"

    def test_no_date_returns_none(self):
        result = extract_report_date("Laboratory Report — Patient Copy")
        assert result is None

    def test_two_digit_year(self):
        # 24 → 2024
        result = extract_report_date("12/05/24")
        assert result == "2024-05-12"


class TestSOCRATESCompleteness:
    def _make_state_with_slots(self, filled_slots: set) -> BeliefState:
        s = SOCRATESBeliefState()
        sv = lambda: SlotValue(value="test", raw_text="test", source="touch")

        if "site" in filled_slots:
            s.site = sv()
        if "onset" in filled_slots:
            s.onset = sv()
        if "character" in filled_slots:
            s.character = sv()
        if "radiation" in filled_slots:
            s.radiation = sv()
        if "associations" in filled_slots:
            s.associations = [sv()]
        if "time_course" in filled_slots:
            s.time_course = sv()
        if "exacerbating" in filled_slots:
            s.exacerbating = [sv()]
        if "severity" in filled_slots:
            s.severity = sv()

        state = BeliefState(session_id="test", session_hash="h", language="hi")
        state.socrates = s
        return state

    def test_perfect_completeness(self):
        all_slots = {"site", "onset", "character", "radiation",
                     "associations", "time_course", "exacerbating", "severity"}
        state = self._make_state_with_slots(all_slots)
        metrics = compute_completeness(state)
        assert metrics.socrates_slots_filled == 8
        assert metrics.socrates_recall == 1.0
        assert abs(metrics.socrates_f1 - 1.0) < 0.01

    def test_half_completeness(self):
        state = self._make_state_with_slots({"site", "character", "onset", "severity"})
        metrics = compute_completeness(state)
        assert metrics.socrates_slots_filled == 4
        assert abs(metrics.socrates_recall - 0.5) < 0.01

    def test_zero_completeness(self):
        state = self._make_state_with_slots(set())
        metrics = compute_completeness(state)
        assert metrics.socrates_slots_filled == 0
        assert metrics.socrates_recall == 0.0
        assert metrics.socrates_f1 == 0.0

    def test_f1_is_harmonic_mean_when_precision_equals_recall(self):
        """When all filled slots are in target set, P == R, so F1 == R."""
        state = self._make_state_with_slots({"site", "character", "radiation"})
        metrics = compute_completeness(state)
        # precision = 3/3 = 1.0; recall = 3/8 = 0.375
        assert abs(metrics.socrates_recall - 0.375) < 0.01
        # F1 = 2 * 1.0 * 0.375 / (1.0 + 0.375)
        expected_f1 = 2 * 1.0 * 0.375 / (1.0 + 0.375)
        assert abs(metrics.socrates_f1 - expected_f1) < 0.01

    def test_ayush_completeness_from_indicators(self):
        state = BeliefState(session_id="x", session_hash="y", language="hi")
        state.ayush = AyushBeliefState(
            agni_indicators=["mandagni"],
            koshtha_indicators=["krura"],
        )
        metrics = compute_completeness(state)
        assert metrics.ayush_slots_filled == 2
        assert abs(metrics.ayush_recall - 0.5) < 0.01


class TestArbitrationEngine:
    """Unit tests for the arbitration engine's threshold formula."""

    def test_threshold_at_60db(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        w = ArbitrationWindow("site", ambient_rms_db=60.0)
        # threshold = 0.70 + 0.15 × (60/95) ≈ 0.795
        expected = 0.70 + 0.15 * (60.0 / 95.0)
        assert abs(w._alpha_threshold - expected) < 0.001

    def test_threshold_at_95db(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        w = ArbitrationWindow("site", ambient_rms_db=95.0)
        # Max threshold = 0.85
        assert abs(w._alpha_threshold - 0.85) < 0.001

    def test_threshold_caps_at_95db(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        # 120 dB should be capped to 95
        w = ArbitrationWindow("site", ambient_rms_db=120.0)
        assert abs(w._alpha_threshold - 0.85) < 0.001

    @pytest.mark.asyncio
    async def test_touch_wins_over_voice(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        w = ArbitrationWindow("site", ambient_rms_db=70.0, window_ms=100)
        w.register_touch("chest/precordial", "site")
        w.register_voice_result("chest area pain", 0.9)  # High confidence voice
        result = await w.resolve()
        # Touch should still win (TOUCH_LOCK semantics)
        assert result.source == "touch"
        assert result.value == "chest/precordial"

    @pytest.mark.asyncio
    async def test_high_confidence_voice_accepted(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        w = ArbitrationWindow("site", ambient_rms_db=70.0, window_ms=50)
        w.register_voice_result("chest", 0.95)
        result = await w.resolve()
        assert result.source == "voice"
        assert "CONFIRM_NEEDED" not in result.value
        assert "RETRY" not in result.value

    @pytest.mark.asyncio
    async def test_low_confidence_voice_returns_confirm_needed(self):
        from app.dialogue.arbitration_engine import ArbitrationWindow
        w = ArbitrationWindow("site", ambient_rms_db=70.0, window_ms=50)
        w.register_voice_result("some unclear speech", 0.60)
        result = await w.resolve()
        assert "CONFIRM_NEEDED" in result.value
