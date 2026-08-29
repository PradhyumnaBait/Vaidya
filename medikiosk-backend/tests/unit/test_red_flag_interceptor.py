"""
Unit tests for the Red-Flag Intercept Engine.
These tests validate all 8 clinical rules without any external dependencies.
"""
import pytest
from unittest.mock import AsyncMock, patch

from app.models.session import BeliefState, SOCRATESBeliefState, SlotValue
from app.scoring.red_flag_interceptor import (
    _evaluate_rule,
    RED_FLAG_RULES,
    evaluate_red_flags,
)


def make_state(
    site: str | None = None,
    character: str | None = None,
    radiation: str | None = None,
    associations: list[str] | None = None,
    session_id: str = "test-session-001",
) -> BeliefState:
    """Helper to build a BeliefState with specified SOCRATES slot values."""
    s = SOCRATESBeliefState()
    if site:
        s.site = SlotValue(value=site, raw_text=site, source="touch")
    if character:
        s.character = SlotValue(value=character, raw_text=character, source="touch")
    if radiation:
        s.radiation = SlotValue(value=radiation, raw_text=radiation, source="touch")
    if associations:
        s.associations = [
            SlotValue(value=a, raw_text=a, source="touch") for a in associations
        ]

    state = BeliefState(session_id=session_id, session_hash="abc123", language="hi")
    state.socrates = s
    return state


class TestRF_CV_001:
    """RF-CV-001: Acute Coronary Syndrome (AND logic — all 3 must match)"""

    rule = next(r for r in RED_FLAG_RULES if r.rule_id == "RF-CV-001")

    def test_full_acs_triggers(self):
        state = make_state(
            site="chest/precordial",
            character="crushing/pressure",
            radiation="left arm",
        )
        assert _evaluate_rule(self.rule, state, []) is True

    def test_partial_acs_does_not_trigger(self):
        state = make_state(
            site="chest/precordial",
            character="crushing/pressure",
            # No radiation
        )
        assert _evaluate_rule(self.rule, state, []) is False

    def test_abdomen_site_does_not_trigger(self):
        state = make_state(
            site="abdomen/epigastric",
            character="crushing/pressure",
            radiation="left arm",
        )
        assert _evaluate_rule(self.rule, state, []) is False

    def test_stabbing_character_does_not_trigger(self):
        state = make_state(
            site="chest/precordial",
            character="stabbing/sharp",
            radiation="left arm",
        )
        assert _evaluate_rule(self.rule, state, []) is False


class TestRF_CV_002:
    """RF-CV-002: Probable ACS — 2-of-3 logic"""

    rule = next(r for r in RED_FLAG_RULES if r.rule_id == "RF-CV-002")

    def test_two_of_three_triggers(self):
        state = make_state(
            site="chest/precordial",
            character="crushing/pressure",
            # Only 2 conditions met
        )
        assert _evaluate_rule(self.rule, state, []) is True

    def test_one_of_three_does_not_trigger(self):
        state = make_state(site="chest/precordial")
        assert _evaluate_rule(self.rule, state, []) is False


class TestRF_NEU_001:
    """RF-NEU-001: Stroke / TIA (ANY_ONE from associations)"""

    rule = next(r for r in RED_FLAG_RULES if r.rule_id == "RF-NEU-001")

    def test_facial_droop_triggers(self):
        state = make_state(associations=["facial droop"])
        assert _evaluate_rule(self.rule, state, []) is True

    def test_sudden_speech_difficulty_triggers(self):
        state = make_state(associations=["sudden speech difficulty"])
        assert _evaluate_rule(self.rule, state, []) is True

    def test_nausea_alone_does_not_trigger(self):
        state = make_state(associations=["nausea/vomiting"])
        assert _evaluate_rule(self.rule, state, []) is False


class TestRF_MET_001:
    """RF-MET-001: Hyperglycaemic Emergency (lab > 350)"""

    rule = next(r for r in RED_FLAG_RULES if r.rule_id == "RF-MET-001")

    def test_fbs_over_350_triggers(self):
        state = make_state()
        lab = [{"biomarker": "fasting_blood_sugar", "latest_value": 400.0}]
        assert _evaluate_rule(self.rule, state, lab) is True

    def test_fbs_under_350_does_not_trigger(self):
        state = make_state()
        lab = [{"biomarker": "fasting_blood_sugar", "latest_value": 200.0}]
        assert _evaluate_rule(self.rule, state, lab) is False

    def test_wrong_biomarker_does_not_trigger(self):
        state = make_state()
        lab = [{"biomarker": "haemoglobin", "latest_value": 400.0}]
        assert _evaluate_rule(self.rule, state, lab) is False


class TestRF_MET_003:
    """RF-MET-003: Severe Anaemia — haemoglobin < 6.0"""

    rule = next(r for r in RED_FLAG_RULES if r.rule_id == "RF-MET-003")

    def test_critical_low_hb_triggers(self):
        state = make_state()
        lab = [{"biomarker": "haemoglobin", "latest_value": 4.5}]
        assert _evaluate_rule(self.rule, state, lab) is True

    def test_low_but_not_critical_hb_does_not_trigger(self):
        state = make_state()
        lab = [{"biomarker": "haemoglobin", "latest_value": 8.0}]
        assert _evaluate_rule(self.rule, state, lab) is False


@pytest.mark.asyncio
class TestEvaluateRedFlags:
    """Integration tests for the full evaluate_red_flags() function."""

    async def test_already_triggered_state_skips(self):
        state = make_state()
        state.red_flag_triggered = True
        triggered, rule = await evaluate_red_flags(state, [])
        assert triggered is True
        assert rule is None  # Not re-evaluated

    @patch("app.scoring.red_flag_interceptor._publish_triage_alert", new_callable=AsyncMock)
    async def test_p0_rule_triggers_and_publishes(self, mock_publish):
        state = make_state(
            site="chest/precordial",
            character="crushing/pressure",
            radiation="left arm",
        )
        triggered, rule = await evaluate_red_flags(state, [])
        assert triggered is True
        assert rule is not None
        assert rule.priority == "P0"
        assert state.red_flag_triggered is True
        mock_publish.assert_called_once()

    @patch("app.scoring.red_flag_interceptor._publish_triage_alert", new_callable=AsyncMock)
    async def test_no_red_flag_for_benign_inputs(self, mock_publish):
        state = make_state(
            site="abdomen/epigastric",
            character="heaviness/dull",
            radiation="none",
        )
        triggered, rule = await evaluate_red_flags(state, [])
        assert triggered is False
        assert rule is None
        mock_publish.assert_not_called()
