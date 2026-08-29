"""
MediKiosk — Lab Result Extractor

Parses Document AI Form Parser output to extract structured biomarker
key-value pairs from printed laboratory diagnostic reports.

Key design decisions:
1. Reference ranges printed in the document ALWAYS take priority over hardcoded normals.
2. Both the document's own reference range AND the hardcoded critical thresholds are used.
3. Unit conversion is applied to normalise values to standard units before comparison.
4. Only printed lab reports are processed; handwritten documents are rejected upstream.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any

from app.models.clinical import AnomalyStatus, LabResult, LabTimePoint

logger = logging.getLogger(__name__)

# ── Biomarker Registry ────────────────────────────────────────────────────────

@dataclass
class BiomarkerDef:
    key: str                        # Internal identifier
    display_name: str               # Human-readable label
    loinc_code: str | None
    regex_pattern: str              # Regex to match the biomarker name in document text
    normal_range: tuple[float, float]
    critical_high: float | None = None
    critical_low: float | None = None
    unit_conversions: dict[str, float] = field(default_factory=dict)  # from_unit → multiplier
    sex_specific: bool = False
    normal_range_male: tuple[float, float] | None = None
    normal_range_female: tuple[float, float] | None = None


BIOMARKER_REGISTRY: list[BiomarkerDef] = [
    BiomarkerDef(
        key="fasting_blood_sugar",
        display_name="Fasting Blood Sugar",
        loinc_code="1558-6",
        regex_pattern=r"(?i)fasting\s+blood\s+sugar|FBS|fasting\s+glucose",
        normal_range=(70.0, 100.0),
        critical_high=350.0,
        critical_low=50.0,
        unit_conversions={"mmol/l": 18.02, "mmol/L": 18.02},
    ),
    BiomarkerDef(
        key="random_blood_sugar",
        display_name="Random Blood Sugar",
        loinc_code="2339-0",
        regex_pattern=r"(?i)random\s+blood\s+sugar|RBS|post\s+prandial\s+glucose|PP\s+glucose",
        normal_range=(70.0, 140.0),
        critical_high=450.0,
        unit_conversions={"mmol/l": 18.02},
    ),
    BiomarkerDef(
        key="hba1c",
        display_name="HbA1c (Glycated Haemoglobin)",
        loinc_code="4548-4",
        regex_pattern=r"(?i)HbA1c|glycated\s+h[ae]moglobin|A1C",
        normal_range=(4.0, 5.7),
        critical_high=12.0,
        unit_conversions={},
    ),
    BiomarkerDef(
        key="ldl_cholesterol",
        display_name="LDL Cholesterol",
        loinc_code="2089-1",
        regex_pattern=r"(?i)LDL|low\s+density\s+lipoprotein|LDL-C",
        normal_range=(0.0, 100.0),
        critical_high=190.0,
        unit_conversions={"mmol/l": 38.67},
    ),
    BiomarkerDef(
        key="hdl_cholesterol",
        display_name="HDL Cholesterol",
        loinc_code="2085-9",
        regex_pattern=r"(?i)HDL|high\s+density\s+lipoprotein|HDL-C",
        normal_range=(40.0, 999.0),
        critical_low=25.0,
        unit_conversions={"mmol/l": 38.67},
    ),
    BiomarkerDef(
        key="total_cholesterol",
        display_name="Total Cholesterol",
        loinc_code="2093-3",
        regex_pattern=r"(?i)total\s+cholesterol|T\.?\s*Chol",
        normal_range=(0.0, 200.0),
        critical_high=300.0,
        unit_conversions={"mmol/l": 38.67},
    ),
    BiomarkerDef(
        key="triglycerides",
        display_name="Triglycerides",
        loinc_code="2571-8",
        regex_pattern=r"(?i)triglycerides?|TG|triacylglycerol",
        normal_range=(0.0, 150.0),
        critical_high=500.0,
        unit_conversions={"mmol/l": 88.57},
    ),
    BiomarkerDef(
        key="serum_creatinine",
        display_name="Serum Creatinine",
        loinc_code="2160-0",
        regex_pattern=r"(?i)serum\s+creatinine|s\.?\s*cr(?:eatinine)?|creatinine\s+serum",
        normal_range=(0.7, 1.3),
        critical_high=5.0,
        sex_specific=True,
        normal_range_male=(0.7, 1.3),
        normal_range_female=(0.5, 1.1),
        unit_conversions={"μmol/l": 0.0113, "umol/l": 0.0113},
    ),
    BiomarkerDef(
        key="uric_acid",
        display_name="Uric Acid",
        loinc_code="3084-1",
        regex_pattern=r"(?i)uric\s+acid|serum\s+urate",
        normal_range=(3.4, 7.0),
        critical_high=10.0,
        sex_specific=True,
        normal_range_male=(3.4, 7.0),
        normal_range_female=(2.4, 6.0),
        unit_conversions={"μmol/l": 0.0168},
    ),
    BiomarkerDef(
        key="haemoglobin",
        display_name="Haemoglobin",
        loinc_code="718-7",
        regex_pattern=r"(?i)h[ae]moglobin|Hb(?!\w)|Hgb",
        normal_range=(11.5, 17.5),
        critical_low=6.0,
        sex_specific=True,
        normal_range_male=(13.5, 17.5),
        normal_range_female=(11.5, 15.5),
        unit_conversions={"g/dl": 1.0, "g/L": 0.1},
    ),
    BiomarkerDef(
        key="tsh",
        display_name="TSH (Thyroid Stimulating Hormone)",
        loinc_code="3016-3",
        regex_pattern=r"(?i)TSH|thyroid\s+stimulating\s+hormone",
        normal_range=(0.5, 4.5),
        critical_high=20.0,
        critical_low=0.01,
        unit_conversions={},
    ),
    BiomarkerDef(
        key="alt",
        display_name="ALT (SGPT / Liver Enzyme)",
        loinc_code="1742-6",
        regex_pattern=r"(?i)ALT|SGPT|alanine\s+aminotransferase",
        normal_range=(0.0, 40.0),
        critical_high=200.0,
        unit_conversions={},
    ),
    BiomarkerDef(
        key="ast",
        display_name="AST (SGOT / Liver Enzyme)",
        loinc_code="1920-8",
        regex_pattern=r"(?i)AST|SGOT|aspartate\s+aminotransferase",
        normal_range=(0.0, 40.0),
        critical_high=200.0,
        unit_conversions={},
    ),
    BiomarkerDef(
        key="serum_sodium",
        display_name="Serum Sodium",
        loinc_code="2951-2",
        regex_pattern=r"(?i)serum\s+sodium|Na\+?|sodium",
        normal_range=(136.0, 146.0),
        critical_high=155.0,
        critical_low=125.0,
        unit_conversions={},
    ),
    BiomarkerDef(
        key="serum_potassium",
        display_name="Serum Potassium",
        loinc_code="2823-3",
        regex_pattern=r"(?i)serum\s+potassium|K\+?|potassium",
        normal_range=(3.5, 5.0),
        critical_high=6.5,
        critical_low=2.5,
        unit_conversions={},
    ),
]

# Lookup by key
BIOMARKER_BY_KEY: dict[str, BiomarkerDef] = {b.key: b for b in BIOMARKER_REGISTRY}


# ── Value Parser ──────────────────────────────────────────────────────────────

_NUMERIC_RE = re.compile(r"[-+]?\d+\.?\d*")


def _extract_numeric(text: str) -> float | None:
    """Extract the first numeric value from a text string."""
    match = _NUMERIC_RE.search(str(text))
    if match:
        try:
            return float(match.group())
        except ValueError:
            return None
    return None


def _normalise_unit(value: float, unit: str, biomarker: BiomarkerDef) -> float:
    """Convert value to standard unit (mg/dL for glucose, % for HbA1c, etc.)."""
    unit_lower = unit.lower().strip()
    for from_unit, multiplier in biomarker.unit_conversions.items():
        if from_unit.lower() == unit_lower:
            return value * multiplier
    return value  # Already in standard unit


def _determine_status(
    value: float,
    biomarker: BiomarkerDef,
    ref_low: float | None,
    ref_high: float | None,
) -> AnomalyStatus:
    """
    Determine anomaly status.
    Document's own reference range takes priority over hardcoded normals.
    Critical thresholds always applied from hardcoded registry.
    """
    # Apply hardcoded critical thresholds first (always authoritative)
    if biomarker.critical_high is not None and value > biomarker.critical_high:
        return AnomalyStatus.CRITICAL_HIGH
    if biomarker.critical_low is not None and value < biomarker.critical_low:
        return AnomalyStatus.CRITICAL_LOW

    # Use document's own reference range if available
    low = ref_low if ref_low is not None else biomarker.normal_range[0]
    high = ref_high if ref_high is not None else biomarker.normal_range[1]

    if low is None and high is None:
        return AnomalyStatus.UNKNOWN_RANGE

    if high is not None and value > high:
        return AnomalyStatus.HIGH
    if low is not None and value < low:
        return AnomalyStatus.LOW

    return AnomalyStatus.NORMAL


# ── Main Extraction Function ──────────────────────────────────────────────────

def extract_lab_results(
    doc_ai_response: dict[str, Any],
    report_date: str | None = None,
) -> list[LabResult]:
    """
    Extract structured biomarker results from a Google Document AI
    Form Parser response.

    Args:
        doc_ai_response: Parsed JSON from Document AI API
        report_date: ISO date string (extracted by temporal_normalizer)

    Returns:
        List of LabResult objects for confirmed biomarkers
    """
    results: list[LabResult] = []

    # Extract all form fields from Document AI response
    pages = doc_ai_response.get("document", {}).get("pages", [])

    # Collect all (key, value, ref_range, unit) tuples from all tables/form fields
    raw_pairs: list[dict[str, str]] = []

    for page in pages:
        # Process form fields
        for field_obj in page.get("formFields", []):
            key_text = _get_text(field_obj.get("fieldName", {}), doc_ai_response)
            val_text = _get_text(field_obj.get("fieldValue", {}), doc_ai_response)
            raw_pairs.append({"key": key_text, "value": val_text, "unit": "", "ref": ""})

        # Process tables (standard lab report format)
        for table in page.get("tables", []):
            header_row = table.get("headerRows", [])
            body_rows = table.get("bodyRows", [])

            # Identify column positions from header
            col_indices = _identify_columns(header_row, doc_ai_response)

            for row in body_rows:
                cells = row.get("cells", [])
                pair = _extract_row_values(cells, col_indices, doc_ai_response)
                if pair:
                    raw_pairs.append(pair)

    # Match raw pairs against biomarker registry
    for pair in raw_pairs:
        key_text = pair.get("key", "")
        val_text = pair.get("value", "")
        unit_text = pair.get("unit", "")
        ref_text = pair.get("ref", "")

        for biomarker in BIOMARKER_REGISTRY:
            if re.search(biomarker.regex_pattern, key_text):
                numeric_value = _extract_numeric(val_text)
                if numeric_value is None:
                    continue

                # Unit normalisation
                normalised_value = _normalise_unit(numeric_value, unit_text, biomarker)

                # Reference range extraction from doc
                ref_low, ref_high = _parse_reference_range(ref_text)

                status = _determine_status(normalised_value, biomarker, ref_low, ref_high)

                # Check if this biomarker already has an entry (take latest)
                existing = next((r for r in results if r.biomarker == biomarker.key), None)

                time_point = LabTimePoint(
                    date=report_date or "unknown",
                    value=normalised_value,
                    unit=unit_text or "mg/dL",
                    status=status,
                )

                if existing:
                    existing.timeline.append(time_point)
                    # Update latest if this date is newer
                    existing.latest_value = normalised_value
                    existing.status = status
                else:
                    results.append(LabResult(
                        biomarker=biomarker.key,
                        display_name=biomarker.display_name,
                        loinc_code=biomarker.loinc_code,
                        latest_value=normalised_value,
                        unit=unit_text or "mg/dL",
                        status=status,
                        reference_low=ref_low,
                        reference_high=ref_high,
                        timeline=[time_point],
                    ))
                break  # Only match first biomarker per key

    logger.info("Lab extractor: %d biomarkers found from document.", len(results))
    return results


def _get_text(element: dict, full_doc: dict) -> str:
    """Extract text from a Document AI layout element."""
    try:
        text_anchor = element.get("textAnchor", {})
        text_segments = text_anchor.get("textSegments", [])
        full_text = full_doc.get("document", {}).get("text", "")
        result = ""
        for seg in text_segments:
            start = int(seg.get("startIndex", 0))
            end = int(seg.get("endIndex", 0))
            result += full_text[start:end]
        return result.strip()
    except Exception:
        return ""


def _identify_columns(header_rows: list, full_doc: dict) -> dict[str, int]:
    """
    Identify column indices for: test_name, value, unit, reference_range.
    Returns dict: {"name": 0, "value": 1, "unit": 2, "ref": 3}
    """
    indices = {"name": 0, "value": 1, "unit": 2, "ref": 3}
    if not header_rows:
        return indices

    try:
        header_cells = header_rows[0].get("cells", [])
        for i, cell in enumerate(header_cells):
            text = _get_text(cell, full_doc).lower()
            if any(k in text for k in ["test", "parameter", "analyte", "investigation"]):
                indices["name"] = i
            elif any(k in text for k in ["result", "value", "found"]):
                indices["value"] = i
            elif any(k in text for k in ["unit"]):
                indices["unit"] = i
            elif any(k in text for k in ["reference", "normal", "range", "ref"]):
                indices["ref"] = i
    except Exception:
        pass
    return indices


def _extract_row_values(
    cells: list,
    col_indices: dict[str, int],
    full_doc: dict,
) -> dict[str, str] | None:
    """Extract key-value pair from a table row."""
    if len(cells) <= max(col_indices.values()):
        return None
    try:
        return {
            "key": _get_text(cells[col_indices["name"]], full_doc),
            "value": _get_text(cells[col_indices["value"]], full_doc),
            "unit": _get_text(cells[col_indices.get("unit", 2)], full_doc) if len(cells) > 2 else "",
            "ref": _get_text(cells[col_indices.get("ref", 3)], full_doc) if len(cells) > 3 else "",
        }
    except (IndexError, KeyError):
        return None


def _parse_reference_range(ref_text: str) -> tuple[float | None, float | None]:
    """
    Parse reference range text like '70-100', '< 140', '> 40', '3.5 - 5.0'.
    Returns (low, high) tuple.
    """
    if not ref_text:
        return None, None

    # Range with dash: "70 - 100" or "70-100"
    range_match = re.search(r"([\d.]+)\s*[-–]\s*([\d.]+)", ref_text)
    if range_match:
        return float(range_match.group(1)), float(range_match.group(2))

    # Less than: "< 140"
    lt_match = re.search(r"<\s*([\d.]+)", ref_text)
    if lt_match:
        return None, float(lt_match.group(1))

    # Greater than: "> 40"
    gt_match = re.search(r">\s*([\d.]+)", ref_text)
    if gt_match:
        return float(gt_match.group(1)), None

    return None, None
