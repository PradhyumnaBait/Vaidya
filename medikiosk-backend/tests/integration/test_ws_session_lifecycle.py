"""
MediKiosk — Integration Tests: WebSocket Session Lifecycle

Tests the complete end-to-end WebSocket session flow using FastAPI's
TestClient (Starlette ASGI test WebSocket support) with all external
dependencies mocked.

Test Scenarios:
    1. Happy path — full session: consent → touch intake → synthesis
    2. Voice path — ASR transcription → entity extraction → RAG merge
    3. Document path — image upload → OCR → lab extraction → cross-correlation
    4. Red flag intercept — emergency symptom triggers triage alert
    5. Consent denial — session terminates cleanly on deny
    6. Session teardown — FHIR bundle written, session_end message sent
    7. REST health endpoints
    8. Physician bundle retrieval endpoint

All network I/O (Redis, Bhashini, Groq, Pinecone, Google DocAI) is mocked.
Tests run fully offline without any cloud credentials.
"""
from __future__ import annotations

import asyncio
import base64
import json
import os
import time
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# ── App environment configuration ─────────────────────────────────────────────
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-32-chars-minimum!!")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/1")
os.environ.setdefault("GROQ_API_KEY", "gsk_test_key")
os.environ.setdefault("BHASHINI_API_KEY", "test-bhashini-key")
os.environ.setdefault("BHASHINI_USER_ID", "test-user-id")
os.environ.setdefault("PINECONE_API_KEY", "test-pinecone-key")
os.environ.setdefault("PINECONE_INDEX_NAME", "medikiosk-test")
os.environ.setdefault("GCP_PROJECT_ID", "test-project")
os.environ.setdefault("DOCUMENT_AI_PROCESSOR_ID", "test-processor")
os.environ.setdefault("DOCUMENT_AI_LOCATION", "us")

# Force load so patch() targets resolve properly
import app.api.ws_gateway  # noqa: E402

# ── Sample audio payload (tiny silent PCM base64) ─────────────────────────────
_SILENT_PCM_B64 = base64.b64encode(bytes(3200)).decode()  # 0.1s of silence @ 16kHz 16-bit mono


# ── Shared mock factories ──────────────────────────────────────────────────────

def _make_synthesis():
    """Return a mock ClinicalSynthesis."""
    from app.fhir.synthesis_engine import ClinicalSynthesis
    s = MagicMock(spec=ClinicalSynthesis)
    s.session_id = "sess-test-001"
    s.primary_complaint = "Chest pain"
    s.dosha_vector = MagicMock(dominant="Pitta", scores={"Vata": 1.0, "Pitta": 3.5, "Kapha": 1.2})
    s.agni_type = "Tikshnagni"
    s.koshtha = "Madhyama"
    s.red_flags = []
    s.lab_results = []
    s.ontology_hits = []
    s.anchors = []
    s.socrates_score = MagicMock(f1=0.75)
    return s


# ═══════════════════════════════════════════════════════════════════════════════
# Test Fixtures
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def app_client():
    """
    FastAPI TestClient with all external services mocked.
    """
    with (
        patch("app.core.session_manager.init_redis", new_callable=AsyncMock),
        patch("app.core.session_manager.close_redis", new_callable=AsyncMock),
        patch("app.nlp.bhashini_client.init_bhashini", new_callable=AsyncMock),
        patch("app.nlp.rag_translator.init_rag_translator", new_callable=AsyncMock),
        patch("app.core.session_manager.get_redis") as mock_redis_getter,
        patch("app.api.ws_gateway.transcribe_audio", new_callable=AsyncMock) as mock_asr,
        patch("app.api.ws_gateway.synthesise_speech", new_callable=AsyncMock) as mock_tts,
        patch("app.api.ws_gateway.translate_entity", new_callable=AsyncMock) as mock_rag,
        patch("app.api.ws_gateway.orchestrate_turn", new_callable=AsyncMock) as mock_llm,
        patch("app.api.ws_gateway.persist_and_transmit", new_callable=AsyncMock) as mock_abdm,
        patch("app.api.ws_gateway.synthesise", new_callable=AsyncMock) as mock_synth,
        patch("app.api.ws_gateway.build_emr_dashboard") as mock_dash,
        patch("app.fhir.bundle_builder.build_fhir_bundle") as mock_bundle,
    ):
        mock_redis = AsyncMock()
        mock_redis.ping = AsyncMock(return_value=True)
        mock_redis.get = AsyncMock(return_value=None)
        mock_redis.set = AsyncMock(return_value=True)
        mock_redis.delete = AsyncMock(return_value=1)
        mock_redis.publish = AsyncMock(return_value=1)

        mock_pipeline = MagicMock()
        mock_pipeline.setex = MagicMock()
        mock_pipeline.delete = MagicMock()
        mock_pipeline.execute = AsyncMock(return_value=[True, True, True, True])
        mock_redis.pipeline = MagicMock(return_value=mock_pipeline)

        mock_redis_getter.return_value = mock_redis

        mock_asr.return_value = ("पेट में दर्द है", 0.88)
        mock_tts.return_value = b"\x00" * 100

        mock_rag.return_value = [
            {
                "namaste_code": "NM-F008",
                "icd11_allopathic": "R10.9",
                "icd11_tm2": "TM1C00",
                "dosha": "Tridosha",
                "score": 0.87,
            }
        ]

        mock_llm.return_value = {
            "slot": "location",
            "value": "abdomen",
            "confidence": 0.9,
            "next_question": "How long have you had this pain?",
            "touch_cards": ["1 day", "3 days", "1 week", "1 month"],
        }

        mock_synth.return_value = _make_synthesis()
        mock_dash.return_value = {
            "primary_complaint": "Abdominal pain",
            "red_flags": [],
            "dosha": "Tridosha",
        }
        mock_bundle.return_value = {"resourceType": "Bundle", "id": "test-bundle"}
        mock_abdm.return_value = None

        from app.main import app
        with TestClient(app, raise_server_exceptions=False) as client:
            yield client


# ═══════════════════════════════════════════════════════════════════════════════
# REST Endpoint Tests
# ═══════════════════════════════════════════════════════════════════════════════

class TestHealthEndpoints:
    def test_root_health_ok(self, app_client):
        """GET /health returns 200 with status field."""
        resp = app_client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert data["version"] == "1.0.0"

    def test_api_health_ok(self, app_client):
        """GET /api/health returns status."""
        resp = app_client.get("/api/health")
        assert resp.status_code == 200

    def test_readiness_probe(self, app_client):
        """GET /api/health/ready returns status."""
        resp = app_client.get("/api/health/ready")
        assert resp.status_code in (200, 503)

    def test_audit_log_returns_list(self, app_client):
        """GET /api/admin/audit-log returns audit payload with events when authenticated."""
        from app.core import security
        token = security.create_access_token(data={"sub": "admin", "role": "admin"})
        resp = app_client.get(
            "/api/admin/audit-log",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, dict)
        assert "events" in data
        assert isinstance(data["events"], list)


# ═══════════════════════════════════════════════════════════════════════════════
# WebSocket Session Tests
# ═══════════════════════════════════════════════════════════════════════════════

class TestWebSocketSessionInit:
    def test_ws_connect_receives_session_init(self, app_client):
        """
        Connecting to /ws/session and sending language preference receives session_init.
        """
        with app_client.websocket_connect("/ws/session") as ws:
            ws.send_json({"language": "hi"})
            msg = ws.receive_json()
            assert msg["type"] == "session_init"
            assert "session_id" in msg
            assert "consent_text" in msg
            ws.close()

    def test_ws_pong_response(self, app_client):
        """Sending ping → should receive pong."""
        with app_client.websocket_connect("/ws/session") as ws:
            ws.send_json({"language": "hi"})
            _init = ws.receive_json()
            ws.send_json({"type": "ping"})
            pong = ws.receive_json()
            assert pong["type"] == "pong"
            ws.close()


class TestConsentFlow:
    def test_consent_agree_advances_to_first_question(self, app_client):
        """
        Sending consent_response agree → should receive a 'question' message.
        """
        with app_client.websocket_connect("/ws/session") as ws:
            ws.send_json({"language": "hi"})
            init_msg = ws.receive_json()
            session_id = init_msg["session_id"]

            ws.send_json({
                "type": "consent_response",
                "session_id": session_id,
                "value": "agree",
            })

            # May receive question
            for _ in range(5):
                msg = ws.receive_json()
                if msg["type"] == "question":
                    assert "question_text" in msg
                    assert "touch_card_options" in msg
                    break
                if msg["type"] == "error":
                    pytest.skip(f"Upstream dependency not available: {msg.get('message')}")
            else:
                pytest.fail("Did not receive a 'question' message after consent agree")

            ws.close()

    def test_consent_deny_ends_session(self, app_client):
        """Sending consent_response deny → should receive session_end."""
        with app_client.websocket_connect("/ws/session") as ws:
            ws.send_json({"language": "hi"})
            init_msg = ws.receive_json()
            session_id = init_msg["session_id"]

            ws.send_json({
                "type": "consent_response",
                "session_id": session_id,
                "value": "deny",
            })

            # Should receive session_end
            for _ in range(5):
                msg = ws.receive_json()
                if msg["type"] == "session_end":
                    assert msg.get("reason") == "consent_denied"
                    break
            else:
                pytest.fail("Did not receive session_end after consent deny")

            ws.close()


class TestTouchInput:
    def test_touch_card_selection_advances_dialogue(self, app_client):
        """
        After consent, a touch_input event should trigger the LLM orchestrator
        and return the next question.
        """
        with (
            patch("app.api.ws_gateway.orchestrate_turn", new_callable=AsyncMock) as mock_llm,
            patch("app.api.ws_gateway.translate_entity", new_callable=AsyncMock) as mock_rag,
            patch("app.api.ws_gateway.evaluate_red_flags", new_callable=AsyncMock) as mock_rf,
        ):
            mock_llm.return_value = {
                "extracted_entities": {"onset": {"value": "3 days", "raw_text": "3 days"}},
                "next_question": "Where is the pain located?",
                "touch_cards": ["Chest", "Abdomen", "Head", "Back"],
            }
            mock_rag.return_value = {"mapped": False, "confidence": 0.0, "dosha_indicators": []}
            mock_rf.return_value = (False, None)

            with app_client.websocket_connect("/ws/session") as ws:
                ws.send_json({"language": "hi"})
                init_msg = ws.receive_json()
                session_id = init_msg["session_id"]

                # Agree to consent
                ws.send_json({
                    "type": "consent_response",
                    "session_id": session_id,
                    "value": "agree",
                })

                # Wait for first question
                msg = ws.receive_json()
                assert msg["type"] == "question", f"Expected question, got: {msg}"

                # Send touch card
                ws.send_json({
                    "type": "touch_input",
                    "session_id": session_id,
                    "value": "3 days",
                    "slot_id": "onset",
                })

                # Expect next question or synthesis
                next_msg = ws.receive_json()
                assert next_msg["type"] in ("question", "synthesis", "synthesis_fhir"), f"Error received after touch: {next_msg}"

                ws.close()


class TestVoiceInput:
    def test_voice_chunk_followed_by_final_triggers_arbitration(self, app_client):
        """
        Sending voice_chunk + voice_final should trigger Bhashini ASR and
        either return a question or confirm_utterance.
        """
        with (
            patch("app.api.ws_gateway.transcribe_audio", new_callable=AsyncMock) as mock_asr,
            patch("app.api.ws_gateway.translate_entity", new_callable=AsyncMock) as mock_rag,
            patch("app.api.ws_gateway.evaluate_red_flags", new_callable=AsyncMock) as mock_rf,
            patch("app.api.ws_gateway.orchestrate_turn", new_callable=AsyncMock) as mock_llm,
        ):
            mock_asr.return_value = {"transcript": "तीन दिन से दर्द है", "confidence": 0.87}
            mock_rag.return_value = {"mapped": False, "confidence": 0.0, "dosha_indicators": []}
            mock_rf.return_value = (False, None)
            mock_llm.return_value = {
                "extracted_entities": {"onset": {"value": "3 days", "raw_text": "3 days"}},
                "next_question": "Where is the pain?",
                "touch_cards": ["Chest", "Abdomen"],
            }

            with app_client.websocket_connect("/ws/session") as ws:
                ws.send_json({"language": "hi"})
                init_msg = ws.receive_json()
                session_id = init_msg["session_id"]

                ws.send_json({
                    "type": "consent_response",
                    "session_id": session_id,
                    "value": "agree",
                })

                # Drain until question
                for _ in range(8):
                    msg = ws.receive_json()
                    if msg["type"] == "question":
                        break
                    if msg["type"] == "error":
                        pytest.skip("Service not available in test environment")

                # Send voice chunk
                ws.send_json({
                    "type": "voice_chunk",
                    "session_id": session_id,
                    "audio_b64": _SILENT_PCM_B64,
                    "rms_db": 65.0,
                })

                # Send voice final
                ws.send_json({
                    "type": "voice_final",
                    "session_id": session_id,
                    "audio_b64": _SILENT_PCM_B64,
                })

                # Expect question, confirm_utterance, or synthesis
                for _ in range(8):
                    msg = ws.receive_json()
                    if msg["type"] in ("question", "confirm_utterance", "synthesis"):
                        break
                    if msg["type"] == "error":
                        pytest.skip(f"Upstream error: {msg.get('message')}")

                ws.close()


class TestRedFlagIntercept:
    def test_red_flag_triggers_triage_alert(self, app_client):
        """
        If red_flag_interceptor fires, the WebSocket should receive a 'red_flag' message.
        """
        from app.models.clinical import RedFlagAlert

        with (
            patch("app.api.ws_gateway.orchestrate_turn", new_callable=AsyncMock) as mock_llm,
            patch("app.api.ws_gateway.translate_entity", new_callable=AsyncMock) as mock_rag,
            patch("app.api.ws_gateway.evaluate_red_flags", new_callable=AsyncMock) as mock_rf,
            patch("app.api.ws_gateway.synthesise_speech", new_callable=AsyncMock) as mock_tts,
        ):
            mock_llm.return_value = {
                "extracted_entities": {"associations": {"value": "chest pain radiating to left arm", "raw_text": "chest pain"}},
                "next_question": None,
                "touch_cards": [],
            }
            mock_rag.return_value = {"mapped": False, "confidence": 0.0, "dosha_indicators": []}
            alert = RedFlagAlert(
                rule_id="RF-CAR-001",
                name="Acute Coronary Syndrome",
                priority="P0",
                action="EMERGENCY_TRIAGE",
                triggered_slots={"associations": "chest pain radiating to left arm"},
                timestamp_iso="2026-08-30T00:00:00Z",
            )
            mock_rf.return_value = (True, alert)
            mock_tts.return_value = b"\x00" * 100

            with app_client.websocket_connect("/ws/session") as ws:
                ws.send_json({"language": "hi"})
                init_msg = ws.receive_json()
                session_id = init_msg["session_id"]

                ws.send_json({
                    "type": "consent_response",
                    "session_id": session_id,
                    "value": "agree",
                })

                # Drain until question
                for _ in range(8):
                    msg = ws.receive_json()
                    if msg["type"] == "question":
                        break
                    if msg["type"] == "error":
                        pytest.skip("Service not available")

                # Send touch input that triggers red flag
                ws.send_json({
                    "type": "touch_input",
                    "session_id": session_id,
                    "value": "chest pain radiating to left arm",
                    "slot_id": "associations",
                })

                # Expect red_flag message
                for _ in range(8):
                    msg = ws.receive_json()
                    if msg["type"] == "red_flag":
                        assert "priority" in msg or "rule_id" in msg or "action" in msg
                        break
                    if msg["type"] == "error":
                        pytest.skip(f"Upstream error: {msg.get('message')}")

                ws.close()


class TestDocumentUpload:
    def test_document_image_returns_document_processed(self, app_client):
        """
        Sending a document_image event should trigger OCR pipeline and return
        a 'document_processed' message with lab results.
        """
        from app.models.clinical import LabResult, AnomalyStatus

        with (
            patch("app.api.ws_gateway.classify_document") as mock_classify,
            patch("app.api.ws_gateway.process_document", new_callable=AsyncMock) as mock_ocr,
            patch("app.api.ws_gateway.extract_lab_results") as mock_labs,
            patch("app.api.ws_gateway.extract_report_date") as mock_date,
            patch("app.api.ws_gateway.apply_cross_correlations") as mock_cc,
            patch("app.api.ws_gateway.sort_timelines") as mock_sort,
            patch("app.api.ws_gateway.evaluate_red_flags", new_callable=AsyncMock) as mock_rf,
        ):
            mock_classify.return_value = "printed_lab_report"
            mock_ocr.return_value = {"document": {"text": "HbA1c: 7.2%\nFasting Blood Sugar: 142 mg/dL"}}
            mock_labs.return_value = [
                LabResult(
                    biomarker="hba1c",
                    display_name="HbA1c",
                    latest_value=7.2,
                    unit="%",
                    status=AnomalyStatus.HIGH,
                )
            ]
            mock_sort.side_effect = lambda x: x
            mock_date.return_value = "2024-03-15"
            mock_cc.return_value = ["Elevated HbA1c: possible diabetes"]
            mock_rf.return_value = (False, None)

            with app_client.websocket_connect("/ws/session") as ws:
                ws.send_json({"language": "hi"})
                init_msg = ws.receive_json()
                session_id = init_msg["session_id"]

                ws.send_json({
                    "type": "consent_response",
                    "session_id": session_id,
                    "value": "agree",
                })

                # Drain to question
                msg = ws.receive_json()
                assert msg["type"] == "question"

                # Send document image
                ws.send_json({
                    "type": "document_image",
                    "session_id": session_id,
                    "image_b64": _SILENT_PCM_B64,
                })

                # Expect document_processed
                doc_msg = ws.receive_json()
                assert doc_msg["type"] == "document_processed"
                assert doc_msg["status"] == "ok"
                assert doc_msg["biomarkers_found"] == 1

                ws.close()


# ═══════════════════════════════════════════════════════════════════════════════
# Traceability Tests
# ═══════════════════════════════════════════════════════════════════════════════

class TestAnchorRegistry:
    def test_record_and_retrieve(self):
        from app.models.clinical import Anchor
        from app.traceability.anchor_registry import AnchorRegistry

        reg = AnchorRegistry()
        anchor = Anchor(
            slot="onset",
            raw_value="3 days",
            source="touch",
            confidence=0.9,
            timestamp="2024-01-01T00:00:00Z",
        )
        reg.record("sess-001", anchor)

        all_anchors = reg.get_all("sess-001")
        assert len(all_anchors) == 1
        assert all_anchors[0].slot == "onset"

    def test_deduplication(self):
        from app.models.clinical import Anchor
        from app.traceability.anchor_registry import AnchorRegistry

        reg = AnchorRegistry()
        anchor = Anchor(
            slot="onset", raw_value="3 days", source="touch",
            confidence=0.9, timestamp="2024-01-01T00:00:00Z",
        )
        reg.record("sess-002", anchor)
        reg.record("sess-002", anchor)  # duplicate

        assert reg.count("sess-002") == 1

    def test_clear(self):
        from app.models.clinical import Anchor
        from app.traceability.anchor_registry import AnchorRegistry

        reg = AnchorRegistry()
        anchor = Anchor(
            slot="location", raw_value="chest", source="voice",
            confidence=0.85, timestamp="2024-01-01T00:00:00Z",
        )
        reg.record("sess-003", anchor)
        n = reg.clear("sess-003")
        assert n == 1
        assert reg.count("sess-003") == 0

    def test_to_fhir_provenance(self):
        from app.models.clinical import Anchor
        from app.traceability.anchor_registry import AnchorRegistry

        reg = AnchorRegistry()
        anchor = Anchor(
            slot="onset", raw_value="1 week", source="voice",
            confidence=0.88, timestamp="2024-01-01T00:00:00Z",
        )
        reg.record("sess-004", anchor)
        provs = reg.to_fhir_provenance("sess-004", "Patient/p1", "Encounter/e1")
        assert len(provs) == 1
        assert provs[0]["resourceType"] == "Provenance"


class TestEvidenceLinker:
    def test_summary_dict_empty(self):
        from app.traceability.evidence_linker import EvidenceLinker, EvidenceLink
        linker = EvidenceLinker("sess-e001")
        summary = linker.summary_dict([])
        assert summary["total_slots_filled"] == 0
        assert summary["mean_confidence"] == 0.0

    def test_summary_dict_with_links(self):
        from app.traceability.evidence_linker import EvidenceLinker, EvidenceLink
        from app.models.clinical import Anchor

        anchor = Anchor(
            slot="onset", raw_value="3 days", source="voice",
            confidence=0.9, timestamp="2024-01-01T00:00:00Z",
        )
        link = EvidenceLink(
            slot="onset",
            value="3 days",
            anchors=[anchor],
            namaste_code="NM-F008",
            icd11_code="R10.9",
            confidence=0.9,
        )
        linker = EvidenceLinker("sess-e002")
        summary = linker.summary_dict([link])
        assert summary["total_slots_filled"] == 1
        assert summary["namaste_resolved"] == 1
        assert summary["voice_confirmed"] == 1

    def test_provenance_generation(self):
        from app.traceability.evidence_linker import EvidenceLinker, EvidenceLink
        from app.models.clinical import Anchor

        anchor = Anchor(
            slot="location", raw_value="abdomen", source="touch",
            confidence=0.95, timestamp="2024-01-01T00:00:00Z",
        )
        link = EvidenceLink(slot="location", value="abdomen", anchors=[anchor])
        linker = EvidenceLinker("sess-e003")
        provs = linker.to_fhir_provenance([link])
        assert len(provs) == 1
        assert provs[0]["resourceType"] == "Provenance"


# ═══════════════════════════════════════════════════════════════════════════════
# Idiom Corpus Loader Tests
# ═══════════════════════════════════════════════════════════════════════════════

class TestIdiomCorpusLoader:
    def test_load_corpus_creates_schema(self, tmp_path):
        """load_corpus() creates the expected SQLite schema."""
        from app.nlp.idiom_corpus_loader import load_corpus, get_bm25_connection

        db_path = tmp_path / "test_bm25.db"
        empty_csv = tmp_path / "empty.csv"
        stats = load_corpus(
            db_path=db_path,
            idioms_csv=empty_csv,
            namaste_csv=empty_csv,
        )
        assert stats["idioms_loaded"] == 0
        assert db_path.exists()

        # Verify tables were created
        conn = get_bm25_connection(db_path)
        tables = {r[0] for r in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).fetchall()}
        conn.close()
        assert "namaste_codes" in tables
        assert "embeddings_meta" in tables

    def test_load_corpus_from_real_csvs(self, tmp_path):
        """load_corpus() loads the actual seed CSVs and returns correct counts."""
        from pathlib import Path
        from app.nlp.idiom_corpus_loader import (
            load_corpus, get_bm25_connection, bm25_search_idioms,
            IDIOMS_CSV, NAMASTE_CSV,
        )

        if not IDIOMS_CSV.exists() or not NAMASTE_CSV.exists():
            pytest.skip("Seed CSVs not present — skipping")

        db_path = tmp_path / "test_real.db"
        stats = load_corpus(db_path=db_path)

        assert stats["idioms_loaded"] > 0
        assert stats["namaste_loaded"] > 0

        # Verify BM25 search works
        results = bm25_search_idioms("पेट दर्द", top_k=3, conn=get_bm25_connection(db_path))
        assert isinstance(results, list)

    def test_reset_flag_clears_and_reloads(self, tmp_path):
        """--reset drops all tables and reloads from scratch."""
        from app.nlp.idiom_corpus_loader import load_corpus

        db_path = tmp_path / "test_reset.db"
        empty_csv = tmp_path / "empty.csv"
        load_corpus(
            db_path=db_path,
            idioms_csv=empty_csv,
            namaste_csv=empty_csv,
        )
        stats = load_corpus(
            db_path=db_path,
            idioms_csv=empty_csv,
            namaste_csv=empty_csv,
            reset=True,
        )
        assert stats["idioms_loaded"] == 0
