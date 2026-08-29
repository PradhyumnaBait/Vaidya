"""
Unit tests for FHIR R4 Bundle Builder and ABDM Gateway persistence.
"""
import pytest
from unittest.mock import AsyncMock, patch

from app.fhir.bundle_builder import build_fhir_bundle
from app.fhir.abdm_gateway import persist_and_transmit, retrieve_bundle, list_recent_bundles
from app.models.clinical import (
    ClinicalSynthesis,
    SOCRATESAssessment,
    AyushAssessment,
    DoshaVector,
    VikritLabel,
    AgniClassification,
    KoshthaClassification,
    LabResult,
    AnomalyStatus,
    LabTimePoint,
)


def _make_sample_synthesis() -> ClinicalSynthesis:
    return ClinicalSynthesis(
        session_hash="test-session-hash-123456",
        generated_at="2026-08-30T02:00:00+05:30",
        language="hi",
        chief_complaint="Chest burning pain",
        socrates=SOCRATESAssessment(
            site="chest/precordial",
            character="burning",
            severity=7,
            icd11_code="MD81.0",
            icd11_display="Chest discomfort",
        ),
        ayush=AyushAssessment(
            agni=AgniClassification.TIKSHNAGNI,
            koshtha=KoshthaClassification.MRIDU,
            dosha_vector=DoshaVector(
                vata=1.0,
                pitta=4.5,
                kapha=0.5,
                dominant_label=VikritLabel.PITTA_DOMINANT,
            ),
            namaste_code="NAM-GAS-004",
            icd11_tm2_code="TM2-PITT-01",
        ),
        lab_results=[
            LabResult(
                biomarker="fasting_blood_sugar",
                display_name="Fasting Blood Sugar",
                latest_value=110.0,
                unit="mg/dL",
                status=AnomalyStatus.HIGH,
                timeline=[
                    LabTimePoint(
                        date="2026-08-01",
                        value=110.0,
                        unit="mg/dL",
                        status=AnomalyStatus.HIGH,
                    )
                ],
            )
        ],
    )


class TestFHIRBundleBuilder:
    def test_bundle_is_document_type(self):
        synth = _make_sample_synthesis()
        bundle = build_fhir_bundle(synth)
        assert bundle["resourceType"] == "Bundle"
        assert bundle["type"] == "document"

    def test_composition_is_first_entry(self):
        synth = _make_sample_synthesis()
        bundle = build_fhir_bundle(synth)
        first_res = bundle["entry"][0]["resource"]
        assert first_res["resourceType"] == "Composition"
        assert "section" in first_res
        assert len(first_res["section"]) >= 1

    def test_dual_coding_in_condition(self):
        synth = _make_sample_synthesis()
        bundle = build_fhir_bundle(synth)
        cond_entries = [e for e in bundle["entry"] if e["resource"]["resourceType"] == "Condition"]
        assert len(cond_entries) == 1
        codings = cond_entries[0]["resource"]["code"]["coding"]
        codes = [c["code"] for c in codings]
        assert "MD81.0" in codes
        assert "NAM-GAS-004" in codes
        assert "TM2-PITT-01" in codes

    def test_structured_dosha_observation(self):
        synth = _make_sample_synthesis()
        bundle = build_fhir_bundle(synth)
        obs_entries = [
            e["resource"]
            for e in bundle["entry"]
            if e["resource"]["resourceType"] == "Observation"
            and e["resource"]["code"]["coding"][0]["code"] == "DOSHA-VIKRITI-VECTOR"
        ]
        assert len(obs_entries) == 1
        obs = obs_entries[0]
        assert obs["valueString"] == VikritLabel.PITTA_DOMINANT.value
        components = {c["code"]["coding"][0]["code"]: c for c in obs["component"]}
        assert "PITTA" in components
        assert components["PITTA"]["valueQuantity"]["value"] == 4.5
        assert components["AGNI"]["valueString"] == "Tikshnagni"


@pytest.mark.asyncio
class TestABDMGatewayPersistence:
    async def test_file_persistence_and_retrieval(self, tmp_path, monkeypatch):
        # Point BUNDLE_DIR to tmp_path
        from app.fhir import abdm_gateway
        monkeypatch.setattr(abdm_gateway, "BUNDLE_DIR", tmp_path)

        synth = _make_sample_synthesis()
        bundle = build_fhir_bundle(synth)
        dashboard = {"chief_complaint": {"text": "Chest burning"}, "completeness": {"socrates_f1": 0.85}}

        # Mock redis failure to test pure file fallback
        with patch("app.fhir.abdm_gateway.get_redis", side_effect=Exception("Redis offline")):
            status = await persist_and_transmit(
                session_hash=synth.session_hash,
                fhir_bundle=bundle,
                emr_dashboard=dashboard,
            )
            assert status["file"] == "ok"

            retrieved = await retrieve_bundle(synth.session_hash)
            assert retrieved is not None
            assert retrieved["chief_complaint"]["text"] == "Chest burning"

            recents = await list_recent_bundles(limit=10)
            assert len(recents) == 1
            assert recents[0]["session_hash"] == synth.session_hash
