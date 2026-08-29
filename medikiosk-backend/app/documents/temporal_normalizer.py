"""
MediKiosk — Temporal Normalizer & Lab Timeline Builder

Extracts dates from lab report headers and chronologically sorts
biomarker results to build a multi-year progression timeline.

Also computes trend direction (improving / worsening / stable)
for each biomarker based on the last 2+ data points.
"""
from __future__ import annotations

import logging
import re
from datetime import date, datetime

from app.models.clinical import LabResult

logger = logging.getLogger(__name__)

# ── Hindi/Devanagari month name lookup ────────────────────────────────────────
DEVANAGARI_MONTHS = {
    "जनवरी": 1, "फरवरी": 2, "मार्च": 3, "अप्रैल": 4,
    "मई": 5, "जून": 6, "जुलाई": 7, "अगस्त": 8,
    "सितंबर": 9, "अक्टूबर": 10, "नवंबर": 11, "दिसंबर": 12,
}

ENGLISH_MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}


def extract_report_date(raw_text: str) -> str | None:
    """
    Extract and normalise the report date from raw document text.
    Returns ISO 8601 date string (YYYY-MM-DD) or None.

    Handles formats:
      - "12-May-2024" / "12 May 2024"
      - "12/05/2024" (day-first, Indian convention)
      - "12.05.24" / "12.05.2024"
      - "May 12, 2024"
      - "12 मई 2024" (Devanagari month)
    """
    text = raw_text.strip()

    # Format: "12-May-2024" or "12 May 2024" or "12/May/2024"
    m = re.search(
        r"(\d{1,2})[\s/-]([A-Za-z]{3,})[\s/-](\d{2,4})", text
    )
    if m:
        day = int(m.group(1))
        month_str = m.group(2).lower()[:3]
        year = _normalise_year(m.group(3))
        month = ENGLISH_MONTHS.get(month_str)
        if month:
            return _to_iso(year, month, day)

    # Devanagari: "12 मई 2024"
    for deva_month, month_num in DEVANAGARI_MONTHS.items():
        m = re.search(r"(\d{1,2})\s+" + re.escape(deva_month) + r"\s+(\d{4})", text)
        if m:
            return _to_iso(int(m.group(2)), month_num, int(m.group(1)))

    # Format: "12/05/2024" — Indian convention: DD/MM/YYYY
    m = re.search(r"(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})", text)
    if m:
        day = int(m.group(1))
        month = int(m.group(2))
        year = _normalise_year(m.group(3))
        if 1 <= month <= 12 and 1 <= day <= 31:
            return _to_iso(year, month, day)

    # Format: "May 12, 2024"
    m = re.search(r"([A-Za-z]{3,})\s+(\d{1,2})[,\s]+(\d{4})", text)
    if m:
        month_str = m.group(1).lower()[:3]
        day = int(m.group(2))
        year = int(m.group(3))
        month = ENGLISH_MONTHS.get(month_str)
        if month:
            return _to_iso(year, month, day)

    return None


def _normalise_year(year_str: str) -> int:
    year = int(year_str)
    if year < 100:
        year += 2000 if year < 50 else 1900
    return year


def _to_iso(year: int, month: int, day: int) -> str:
    try:
        d = date(year, month, day)
        return d.isoformat()
    except ValueError:
        return "unknown"


# ── Timeline Sorting & Trend Analysis ────────────────────────────────────────

def sort_timelines(lab_results: list[LabResult]) -> list[LabResult]:
    """
    Sort each biomarker's timeline chronologically (oldest → newest).
    Compute trend direction for biomarkers with 2+ data points.
    """
    for result in lab_results:
        # Sort timeline by date
        def sort_key(tp):
            try:
                return datetime.strptime(tp.date, "%Y-%m-%d")
            except ValueError:
                return datetime.min

        result.timeline.sort(key=sort_key)

        # Compute trend
        if len(result.timeline) >= 2:
            oldest_val = result.timeline[0].value
            newest_val = result.timeline[-1].value

            if oldest_val == 0:
                result.trend = "stable"
            else:
                change_pct = (newest_val - oldest_val) / oldest_val * 100
                if change_pct > 5:
                    result.trend = "worsening"
                elif change_pct < -5:
                    result.trend = "improving"
                else:
                    result.trend = "stable"
        else:
            result.trend = None  # Single data point — no trend

    return lab_results
