"""
MediKiosk — FHIR R4 Bundle Builder

Assembles a FHIR R4 Bundle (type: document / transaction) from a completed ClinicalSynthesis.

Resources generated:
  - Composition        (Clinical Document header with structured section references)
  - Patient            (de-identified — no PHI; uses session hash as ID)
  - Encounter          (OPD encounter with kiosk-generated identifier)
  - Condition          (Chief complaint coded with ICD-11 + NAMASTE)
  - Observation (Dosha) (Structured Dashavidha assessment with quantitative components)
  - Observation×N      (One per LabResult with LOINC coding)
  - QuestionnaireResponse (Full SOCRATES + Ayush structured responses)
  - DocumentReference  (Pointer to scanned lab document, if present)
  - Observation (Quality) (SOCRATES completeness F1 score)

Compliant with:
  - FHIR R4 (HL7 v4.0.1)
  - ABDM NDHM Profile (India-specific FHIR Implementation Guide)
  - SNOMED CT integration for procedure codes
"""
from __future__ import annotations

import logging
import time
import uuid
from typing import Any

from app.models.clinical import (
    AnomalyStatus,
    ClinicalSynthesis,
    LabResult,
)

logger = logging.getLogger(__name__)

FHIR_VERSION = "4.0.1"
NAMASTE_SYSTEM = "urn:oid:2.16.840.1.113883.2.1.3.2.4.15"  # NAMASTE system OID
ICD11_SYSTEM = "http://id.who.int/icd/release/11/mms"
LOINC_SYSTEM = "http://loinc.org"
SNOMED_SYSTEM = "http://snomed.info/sct"
ABDM_SYSTEM = "https://ndhm.gov.in/fhir"


def _uuid() -> str:
    return str(uuid.uuid4())


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S+05:30")  # IST


# ── Resource Builders ──────────────────────────────────────────────────────────

def _build_patient(synthesis: ClinicalSynthesis) -> dict[str, Any]:
    """De-identified patient resource using session hash as identifier."""
    return {
        "resourceType": "Patient",
        "id": synthesis.session_hash[:16],
        "meta": {
            "profile": [f"{ABDM_SYSTEM}/StructureDefinition/ABDMPatient"]
        },
        "identifier": [
            {
                "system": f"{ABDM_SYSTEM}/session-hash",
                "value": synthesis.session_hash,
            }
        ],
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">De-identified kiosk patient</div>"
        }
    }


def _build_encounter(synthesis: ClinicalSynthesis, patient_ref: str) -> dict[str, Any]:
    return {
        "resourceType": "Encounter",
        "id": _uuid(),
        "status": "finished",
        "class": {
            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            "code": "AMB",
            "display": "ambulatory"
        },
        "type": [
            {
                "coding": [
                    {
                        "system": SNOMED_SYSTEM,
                        "code": "11429006",
                        "display": "Consultation (procedure)"
                    }
                ]
            }
        ],
        "subject": {"reference": patient_ref},
        "period": {"start": synthesis.generated_at, "end": synthesis.generated_at},
        "serviceType": {
            "coding": [{"system": SNOMED_SYSTEM, "code": "394802001", "display": "General medicine"}]
        },
        "location": [
            {
                "location": {"display": "OPD Kiosk"},
                "status": "completed"
            }
        ]
    }


def _build_condition(synthesis: ClinicalSynthesis, patient_ref: str, encounter_ref: str) -> dict[str, Any]:
    """Chief complaint as Condition resource, dual-coded with ICD-11 + NAMASTE."""
    codings = []

    # Allopathic ICD-11 coding
    if synthesis.socrates.icd11_code:
        codings.append({
            "system": ICD11_SYSTEM,
            "code": synthesis.socrates.icd11_code,
            "display": synthesis.socrates.icd11_display or synthesis.chief_complaint,
        })

    # NAMASTE Ayush coding
    if synthesis.ayush.namaste_code:
        codings.append({
            "system": NAMASTE_SYSTEM,
            "code": synthesis.ayush.namaste_code,
            "display": synthesis.ayush.namaste_code,
            "_display": {
                "extension": [
                    {
                        "url": f"{ABDM_SYSTEM}/Extension/AyushClassification",
                        "valueString": f"NAMASTE: {synthesis.ayush.namaste_code}"
                    }
                ]
            }
        })

    # ICD-11 TM2 Traditional Medicine code
    if synthesis.ayush.icd11_tm2_code:
        codings.append({
            "system": "http://id.who.int/icd/release/11/mms/tm",
            "code": synthesis.ayush.icd11_tm2_code,
            "display": synthesis.ayush.icd11_tm2_code,
        })

    return {
        "resourceType": "Condition",
        "id": _uuid(),
        "clinicalStatus": {
            "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active"}]
        },
        "verificationStatus": {
            "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-ver-status", "code": "provisional"}]
        },
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                        "code": "problem-list-item",
                        "display": "Problem List Item"
                    }
                ]
            }
        ],
        "code": {"coding": codings, "text": synthesis.chief_complaint},
        "subject": {"reference": patient_ref},
        "encounter": {"reference": encounter_ref},
        "recordedDate": synthesis.generated_at,
        "note": [{"text": f"Chief complaint: {synthesis.chief_complaint}"}],
    }


def _build_dosha_observation(
    synthesis: ClinicalSynthesis,
    patient_ref: str,
    encounter_ref: str,
) -> dict[str, Any] | None:
    """Structured Observation for Dashavidha / Dosha Imbalance Vector & Agni/Koshtha."""
    a = synthesis.ayush
    if not a or not a.dosha_vector:
        return None

    dv = a.dosha_vector
    components = [
        {
            "code": {"coding": [{"system": f"{ABDM_SYSTEM}/CodeSystem/AyushDosha", "code": "VATA", "display": "Vata Score"}]},
            "valueQuantity": {"value": round(dv.vata, 2), "unit": "score", "system": "http://unitsofmeasure.org"},
        },
        {
            "code": {"coding": [{"system": f"{ABDM_SYSTEM}/CodeSystem/AyushDosha", "code": "PITTA", "display": "Pitta Score"}]},
            "valueQuantity": {"value": round(dv.pitta, 2), "unit": "score", "system": "http://unitsofmeasure.org"},
        },
        {
            "code": {"coding": [{"system": f"{ABDM_SYSTEM}/CodeSystem/AyushDosha", "code": "KAPHA", "display": "Kapha Score"}]},
            "valueQuantity": {"value": round(dv.kapha, 2), "unit": "score", "system": "http://unitsofmeasure.org"},
        },
    ]

    if a.agni:
        agni_val = a.agni.value if hasattr(a.agni, "value") else str(a.agni)
        components.append({
            "code": {"coding": [{"system": f"{ABDM_SYSTEM}/CodeSystem/AyushPariksha", "code": "AGNI", "display": "Agni Pariksha"}]},
            "valueString": agni_val,
        })

    if a.koshtha:
        koshtha_val = a.koshtha.value if hasattr(a.koshtha, "value") else str(a.koshtha)
        components.append({
            "code": {"coding": [{"system": f"{ABDM_SYSTEM}/CodeSystem/AyushPariksha", "code": "KOSHTHA", "display": "Koshtha Pariksha"}]},
            "valueString": koshtha_val,
        })

    dom_label = dv.dominant_label.value if hasattr(dv.dominant_label, "value") else str(dv.dominant_label)
    return {
        "resourceType": "Observation",
        "id": _uuid(),
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": "exam",
                        "display": "Exam"
                    }
                ]
            }
        ],
        "code": {
            "coding": [
                {
                    "system": f"{ABDM_SYSTEM}/CodeSystem/AyushClinicalAssessment",
                    "code": "DOSHA-VIKRITI-VECTOR",
                    "display": "Dosha Imbalance Vector Assessment"
                }
            ],
            "text": f"Vikriti: {dom_label}"
        },
        "subject": {"reference": patient_ref},
        "encounter": {"reference": encounter_ref},
        "effectiveDateTime": synthesis.generated_at,
        "valueString": dom_label,
        "component": components,
        "note": [{"text": dv.disclaimer}],
    }


def _build_lab_observation(
    lab: LabResult,
    patient_ref: str,
    encounter_ref: str,
) -> dict[str, Any]:
    """FHIR Observation for a single lab result."""
    interpretation_map = {
        AnomalyStatus.NORMAL: ("N", "Normal"),
        AnomalyStatus.HIGH: ("H", "High"),
        AnomalyStatus.LOW: ("L", "Low"),
        AnomalyStatus.CRITICAL_HIGH: ("HH", "Critical high"),
        AnomalyStatus.CRITICAL_LOW: ("LL", "Critical low"),
        AnomalyStatus.UNKNOWN_RANGE: ("N", "Normal"),
    }
    interp_code, interp_display = interpretation_map.get(
        lab.status, ("N", "Normal")
    )

    obs: dict[str, Any] = {
        "resourceType": "Observation",
        "id": lab.anchor_id or _uuid(),
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": "laboratory",
                        "display": "Laboratory"
                    }
                ]
            }
        ],
        "code": {
            "coding": [
                {
                    "system": LOINC_SYSTEM,
                    "code": lab.loinc_code or "unknown",
                    "display": lab.display_name,
                }
            ],
            "text": lab.display_name,
        },
        "subject": {"reference": patient_ref},
        "encounter": {"reference": encounter_ref},
        "effectiveDateTime": lab.timeline[-1].date if lab.timeline else _now_iso(),
        "valueQuantity": {
            "value": lab.latest_value,
            "unit": lab.unit,
            "system": "http://unitsofmeasure.org",
        },
        "interpretation": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                        "code": interp_code,
                        "display": interp_display,
                    }
                ]
            }
        ],
    }

    # Reference range
    if lab.reference_low is not None or lab.reference_high is not None:
        ref_range: dict[str, Any] = {}
        if lab.reference_low is not None:
            ref_range["low"] = {"value": lab.reference_low, "unit": lab.unit}
        if lab.reference_high is not None:
            ref_range["high"] = {"value": lab.reference_high, "unit": lab.unit}
        obs["referenceRange"] = [ref_range]

    # Trend component (FHIR extension)
    if lab.trend:
        obs["extension"] = [
            {
                "url": f"{ABDM_SYSTEM}/Extension/LabTrend",
                "valueString": lab.trend,
            }
        ]

    return obs


def _build_questionnaire_response(
    synthesis: ClinicalSynthesis,
    patient_ref: str,
    encounter_ref: str,
) -> dict[str, Any]:
    """Full SOCRATES + Ayush structured data as QuestionnaireResponse."""
    s = synthesis.socrates
    a = synthesis.ayush

    items = []

    # SOCRATES items
    for field_id, field_text, value in [
        ("socrates.site", "Site of complaint", s.site),
        ("socrates.onset", "Onset", s.onset),
        ("socrates.character", "Character", s.character),
        ("socrates.radiation", "Radiation", s.radiation),
        ("socrates.time_course", "Time course", s.time_course),
        ("socrates.severity", "Severity (1-10)", str(s.severity) if s.severity else None),
    ]:
        if value:
            items.append({
                "linkId": field_id,
                "text": field_text,
                "answer": [{"valueString": value}],
            })

    # List-valued SOCRATES items
    if s.associations:
        items.append({
            "linkId": "socrates.associations",
            "text": "Associated symptoms",
            "answer": [{"valueString": v} for v in s.associations],
        })
    if s.exacerbating:
        items.append({
            "linkId": "socrates.exacerbating",
            "text": "Exacerbating factors",
            "answer": [{"valueString": v} for v in s.exacerbating],
        })

    # Ayush items
    if a.agni:
        agni_str = a.agni.value if hasattr(a.agni, "value") else str(a.agni)
        items.append({
            "linkId": "ayush.agni",
            "text": "Agni (Digestive Fire)",
            "answer": [{"valueString": agni_str}],
        })
    if a.koshtha:
        koshtha_str = a.koshtha.value if hasattr(a.koshtha, "value") else str(a.koshtha)
        items.append({
            "linkId": "ayush.koshtha",
            "text": "Koshtha (Bowel Nature)",
            "answer": [{"valueString": koshtha_str}],
        })
    if a.dosha_vector:
        dom_str = a.dosha_vector.dominant_label.value if hasattr(a.dosha_vector.dominant_label, "value") else str(a.dosha_vector.dominant_label)
        items.append({
            "linkId": "ayush.vikriti",
            "text": "Vikriti (Dosha Imbalance Tendency)",
            "answer": [{"valueString": dom_str}],
        })

    return {
        "resourceType": "QuestionnaireResponse",
        "id": _uuid(),
        "status": "completed",
        "subject": {"reference": patient_ref},
        "encounter": {"reference": encounter_ref},
        "authored": synthesis.generated_at,
        "questionnaire": f"{ABDM_SYSTEM}/Questionnaire/MediKiosk-SOCRATES-Ayush-v1",
        "item": items,
    }


def _build_completeness_observation(
    synthesis: ClinicalSynthesis,
    patient_ref: str,
) -> dict[str, Any] | None:
    """Quality metric as a special Observation (SOCRATES completeness score)."""
    if not synthesis.completeness:
        return None
    return {
        "resourceType": "Observation",
        "id": _uuid(),
        "status": "final",
        "code": {
            "coding": [
                {
                    "system": f"{ABDM_SYSTEM}/CodeSystem/QualityMetric",
                    "code": "SOCRATES-F1",
                    "display": "SOCRATES Clinical Information Completeness F1 Score",
                }
            ]
        },
        "subject": {"reference": patient_ref},
        "valueQuantity": {
            "value": synthesis.completeness.socrates_f1,
            "system": "http://unitsofmeasure.org",
            "unit": "score",
        },
        "component": [
            {
                "code": {"coding": [{"code": "SOCRATES-Recall"}]},
                "valueQuantity": {"value": synthesis.completeness.socrates_recall},
            },
            {
                "code": {"coding": [{"code": "Ayush-Recall"}]},
                "valueQuantity": {"value": synthesis.completeness.ayush_recall},
            },
        ]
    }


def _build_composition(
    synthesis: ClinicalSynthesis,
    patient_ref: str,
    encounter_ref: str,
    condition_ref: str,
    qr_ref: str,
    dosha_ref: str | None,
    lab_refs: list[str],
) -> dict[str, Any]:
    """Clinical Document Composition linking all resources into a coherent ABDM document."""
    sections = [
        {
            "title": "Chief Complaint & History of Presenting Illness (SOCRATES)",
            "code": {
                "coding": [
                    {
                        "system": SNOMED_SYSTEM,
                        "code": "108341000119107",
                        "display": "Chief complaint narrative"
                    }
                ]
            },
            "entry": [{"reference": condition_ref}, {"reference": qr_ref}],
        }
    ]

    if dosha_ref:
        sections.append({
            "title": "Ayush Clinical Assessment (Dashavidha Pariksha)",
            "code": {
                "coding": [
                    {
                        "system": f"{ABDM_SYSTEM}/CodeSystem/DocumentSection",
                        "code": "AYUSH-ASSESSMENT",
                        "display": "Ayush Clinical Evaluation"
                    }
                ]
            },
            "entry": [{"reference": dosha_ref}],
        })

    if lab_refs:
        sections.append({
            "title": "Diagnostic Laboratory Results",
            "code": {
                "coding": [
                    {
                        "system": SNOMED_SYSTEM,
                        "code": "4241000179101",
                        "display": "Laboratory report"
                    }
                ]
            },
            "entry": [{"reference": lr} for lr in lab_refs],
        })

    return {
        "resourceType": "Composition",
        "id": _uuid(),
        "status": "final",
        "type": {
            "coding": [
                {
                    "system": SNOMED_SYSTEM,
                    "code": "371530004",
                    "display": "Clinical consultation report"
                }
            ]
        },
        "category": [
            {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "11488-4",
                        "display": "Consultation note"
                    }
                ]
            }
        ],
        "subject": {"reference": patient_ref},
        "encounter": {"reference": encounter_ref},
        "date": synthesis.generated_at,
        "author": [
            {
                "display": "MediKiosk Autonomous Intake Station v1.0"
            }
        ],
        "title": f"OPD Intake Summary — {synthesis.chief_complaint[:50]}",
        "section": sections,
    }


# ── Main Bundle Builder ────────────────────────────────────────────────────────

def build_fhir_bundle(synthesis: ClinicalSynthesis) -> dict[str, Any]:
    """
    Assemble the complete FHIR R4 Bundle from a ClinicalSynthesis.

    Returns a FHIR document transaction Bundle ready for submission to the HIS endpoint.
    """
    bundle_id = _uuid()
    patient = _build_patient(synthesis)
    patient_ref = f"Patient/{patient['id']}"

    encounter = _build_encounter(synthesis, patient_ref)
    encounter_ref = f"Encounter/{encounter['id']}"

    condition = _build_condition(synthesis, patient_ref, encounter_ref)
    condition_ref = f"Condition/{condition['id']}"

    qr = _build_questionnaire_response(synthesis, patient_ref, encounter_ref)
    qr_ref = f"QuestionnaireResponse/{qr['id']}"

    # Structured Dosha Observation
    dosha_obs = _build_dosha_observation(synthesis, patient_ref, encounter_ref)
    dosha_ref = f"Observation/{dosha_obs['id']}" if dosha_obs else None

    # Lab Observations
    lab_entries = []
    lab_refs = []
    for lab in synthesis.lab_results:
        obs = _build_lab_observation(lab, patient_ref, encounter_ref)
        lab_ref = f"Observation/{obs['id']}"
        lab_refs.append(lab_ref)
        lab_entries.append({"resource": obs, "request": {"method": "POST", "url": "Observation"}})

    # Quality metric observation
    quality_obs = _build_completeness_observation(synthesis, patient_ref)

    # Composition header referencing child resources
    composition = _build_composition(
        synthesis,
        patient_ref,
        encounter_ref,
        condition_ref,
        qr_ref,
        dosha_ref,
        lab_refs,
    )
    composition_ref = f"Composition/{composition['id']}"

    entries = [
        {"resource": composition, "request": {"method": "POST", "url": "Composition"}},
        {"resource": patient, "request": {"method": "PUT", "url": patient_ref}},
        {"resource": encounter, "request": {"method": "POST", "url": "Encounter"}},
        {"resource": condition, "request": {"method": "POST", "url": "Condition"}},
        {"resource": qr, "request": {"method": "POST", "url": "QuestionnaireResponse"}},
    ]

    if dosha_obs:
        entries.append({"resource": dosha_obs, "request": {"method": "POST", "url": "Observation"}})

    entries.extend(lab_entries)

    if quality_obs:
        entries.append({"resource": quality_obs, "request": {"method": "POST", "url": "Observation"}})

    bundle = {
        "resourceType": "Bundle",
        "id": bundle_id,
        "meta": {
            "profile": [f"{ABDM_SYSTEM}/StructureDefinition/MediKioskBundle"]
        },
        "type": "document",
        "timestamp": _now_iso(),
        "entry": entries,
    }

    logger.info(
        "FHIR Document Bundle %s built: %d entries for session_hash=%s",
        bundle_id[:8], len(entries), synthesis.session_hash[:12],
    )
    return bundle
