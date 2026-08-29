"""
Unit tests for the Lab Result Extractor.
Tests biomarker extraction, reference range parsing, unit conversion,
and anomaly status classification.
"""
import pytest

from app.documents.lab_extractor import (
    extract_lab_results,
    _extract_numeric,
    _parse_reference_range,
    _determine_status,
    _normalise_unit,
    BIOMARKER_BY_KEY,
)
from app.models.clinical import AnomalyStatus


class TestNumericExtraction:
    def test_basic_integer(self):
        assert _extract_numeric("185") == 185.0

    def test_decimal_value(self):
        assert _extract_numeric("8.4") == 8.4

    def test_value_with_unit(self):
        assert _extract_numeric("8.4 %") == 8.4

    def test_value_with_trailing_text(self):
        assert _extract_numeric("185 mg/dL (High)") == 185.0

    def test_empty_string_returns_none(self):
        assert _extract_numeric("N/A") is None

    def test_arrow_format(self):
        assert _extract_numeric(">350") == 350.0


class TestReferenceRangeParsing:
    def test_dash_range(self):
        low, high = _parse_reference_range("70-100")
        assert low == 70.0 and high == 100.0

    def test_dash_range_with_spaces(self):
        low, high = _parse_reference_range("70 - 100")
        assert low == 70.0 and high == 100.0

    def test_less_than_format(self):
        low, high = _parse_reference_range("< 140")
        assert low is None and high == 140.0

    def test_greater_than_format(self):
        low, high = _parse_reference_range("> 40")
        assert low == 40.0 and high is None

    def test_empty_string(self):
        low, high = _parse_reference_range("")
        assert low is None and high is None

    def test_decimal_range(self):
        low, high = _parse_reference_range("3.5 - 5.0")
        assert low == 3.5 and high == 5.0


class TestAnomalyStatusDetermination:
    def setup_method(self):
        self.hba1c = BIOMARKER_BY_KEY["hba1c"]
        self.fbs = BIOMARKER_BY_KEY["fasting_blood_sugar"]
        self.haemoglobin = BIOMARKER_BY_KEY["haemoglobin"]

    def test_normal_hba1c(self):
        status = _determine_status(5.5, self.hba1c, 4.0, 5.7)
        assert status == AnomalyStatus.NORMAL

    def test_high_hba1c(self):
        status = _determine_status(8.4, self.hba1c, 4.0, 5.7)
        assert status == AnomalyStatus.HIGH

    def test_critical_high_fbs(self):
        status = _determine_status(400.0, self.fbs, 70.0, 100.0)
        assert status == AnomalyStatus.CRITICAL_HIGH

    def test_critical_low_hb(self):
        status = _determine_status(4.5, self.haemoglobin, 11.5, 17.5)
        assert status == AnomalyStatus.CRITICAL_LOW

    def test_low_hb_without_critical(self):
        status = _determine_status(9.0, self.haemoglobin, 11.5, 17.5)
        assert status == AnomalyStatus.LOW

    def test_no_reference_range_uses_biomarker_defaults(self):
        # Without reference range, uses biomarker normal_range
        status = _determine_status(8.4, self.hba1c, None, None)
        assert status == AnomalyStatus.HIGH


class TestUnitConversion:
    def test_mmol_l_to_mg_dl_glucose(self):
        bm = BIOMARKER_BY_KEY["fasting_blood_sugar"]
        # 10 mmol/L × 18.02 = 180.2 mg/dL
        result = _normalise_unit(10.0, "mmol/l", bm)
        assert abs(result - 180.2) < 0.1

    def test_unchanged_if_no_conversion(self):
        bm = BIOMARKER_BY_KEY["hba1c"]
        result = _normalise_unit(8.4, "%", bm)
        assert result == 8.4

    def test_ldl_mmol_conversion(self):
        bm = BIOMARKER_BY_KEY["ldl_cholesterol"]
        # 4.0 mmol/L × 38.67 = 154.68 mg/dL
        result = _normalise_unit(4.0, "mmol/l", bm)
        assert abs(result - 154.68) < 0.1


class TestFullExtraction:
    """Integration test using mock Document AI response."""

    def _mock_doc_ai(self, text: str) -> dict:
        return {"document": {"text": text, "pages": [{"formFields": [], "tables": []}]}}

    def test_empty_response_returns_empty_list(self):
        response = self._mock_doc_ai("")
        results = extract_lab_results(response)
        assert results == []

    def test_single_form_field_extraction(self):
        """Test that BM-level extraction doesn't throw on minimal input."""
        response = {
            "document": {
                "text": "HbA1c 8.4 % 4.0-5.7",
                "pages": [{"formFields": [], "tables": []}],
            }
        }
        # No form fields or table rows — should return empty list without crashing
        results = extract_lab_results(response)
        assert isinstance(results, list)
