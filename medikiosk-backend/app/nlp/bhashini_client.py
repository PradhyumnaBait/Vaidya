"""
MediKiosk — Bhashini ASR/TTS Client

Wraps the Bhashini Dhruva API for:
- Streaming ASR: converts patient speech → text + confidence score
- TTS synthesis: converts system question text → audio bytes

The client returns confidence scores per utterance, which feed directly
into the ArbitrationEngine's dynamic threshold logic.

Bhashini pipeline schema reference:
  POST /services/inference/pipeline
  { "pipelineTasks": [...], "inputData": {...} }
"""
from __future__ import annotations

import base64
import logging
from typing import Any

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_http_client: httpx.AsyncClient | None = None

# Language code mapping: BCP-47 → Bhashini sourceLanguage
BHASHINI_LANG_MAP: dict[str, str] = {
    "hi": "hi",    # Hindi
    "mr": "mr",    # Marathi
    "gu": "gu",    # Gujarati
    "en": "en",    # English
    "ta": "ta",    # Tamil
    "te": "te",    # Telugu
    "kn": "kn",    # Kannada
    "bn": "bn",    # Bengali
    "pa": "pa",    # Punjabi
}

# Default ASR model IDs (from Bhashini model explorer)
ASR_MODEL_IDS: dict[str, str] = {
    "hi": "ai4bharat/indicwav2vec-hindi",
    "mr": "ai4bharat/indicwav2vec-marathi",
    "gu": "ai4bharat/indicwav2vec-gujarati",
    "en": "ai4bharat/whisper-small-en",
}

TTS_MODEL_IDS: dict[str, str] = {
    "hi": "ai4bharat/indic-tts-coqui-hi-gpu--t4",
    "mr": "ai4bharat/indic-tts-coqui-mr-gpu--t4",
    "gu": "ai4bharat/indic-tts-coqui-gu-gpu--t4",
    "en": "ai4bharat/indic-tts-coqui-en-gpu--t4",
}


async def init_bhashini() -> None:
    global _http_client
    _http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(10.0),
        headers={
            "Authorization": settings.bhashini_api_key,
            "userID": settings.bhashini_user_id,
            "Content-Type": "application/json",
        },
    )
    logger.info("Bhashini HTTP client initialised.")


def _get_client() -> httpx.AsyncClient:
    if _http_client is None:
        raise RuntimeError("Bhashini client not initialised.")
    return _http_client


# ── ASR ───────────────────────────────────────────────────────────────────────

async def transcribe_audio(
    audio_b64: str,
    language: str = "hi",
) -> dict[str, Any]:
    """
    Submit a base64-encoded audio chunk to Bhashini ASR.

    Returns:
        {
            "transcript": str,
            "confidence": float,   # 0.0 – 1.0
            "language": str
        }
    """
    lang_code = BHASHINI_LANG_MAP.get(language, "hi")
    model_id = ASR_MODEL_IDS.get(language, ASR_MODEL_IDS["hi"])

    payload: dict[str, Any] = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {"sourceLanguage": lang_code},
                    "serviceId": model_id,
                    "audioFormat": "wav",
                    "samplingRate": 16000,
                },
            }
        ],
        "inputData": {
            "audio": [{"audioContent": audio_b64}]
        },
    }

    try:
        client = _get_client()
        resp = await client.post(settings.bhashini_asr_endpoint, json=payload)
        resp.raise_for_status()
        data = resp.json()

        # Parse Bhashini pipeline output format
        output = data.get("pipelineResponse", [{}])[0]
        output_data = output.get("output", [{}])[0]
        transcript = output_data.get("source", "")

        # Bhashini does not always return confidence; we compute a proxy
        # based on the response quality flag if available
        confidence_raw = output_data.get("confidence", None)
        if confidence_raw is not None:
            confidence = float(confidence_raw)
        else:
            # Heuristic: if transcript is non-empty and >= 2 words, assign 0.75
            words = transcript.strip().split()
            confidence = 0.75 if len(words) >= 2 else 0.55

        return {
            "transcript": transcript,
            "confidence": min(max(confidence, 0.0), 1.0),
            "language": language,
        }

    except httpx.HTTPError as exc:
        logger.error("Bhashini ASR HTTP error: %s", exc)
        return {"transcript": "", "confidence": 0.0, "language": language, "error": str(exc)}

    except Exception as exc:
        logger.error("Bhashini ASR unexpected error: %s", exc)
        return {"transcript": "", "confidence": 0.0, "language": language, "error": str(exc)}


# ── TTS ───────────────────────────────────────────────────────────────────────

async def synthesise_speech(text: str, language: str = "hi") -> bytes | None:
    """
    Convert text to speech via Bhashini IndicTTS.
    Returns raw audio bytes (WAV), or None on failure.
    The frontend handles playback; the backend only generates the audio.
    """
    lang_code = BHASHINI_LANG_MAP.get(language, "hi")
    model_id = TTS_MODEL_IDS.get(language, TTS_MODEL_IDS["hi"])

    payload: dict[str, Any] = {
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {"sourceLanguage": lang_code},
                    "serviceId": model_id,
                    "gender": "female",
                    "samplingRate": 8000,
                },
            }
        ],
        "inputData": {
            "input": [{"source": text}]
        },
    }

    try:
        client = _get_client()
        resp = await client.post(settings.bhashini_tts_endpoint, json=payload)
        resp.raise_for_status()
        data = resp.json()

        output = data.get("pipelineResponse", [{}])[0]
        audio_b64 = output.get("audio", [{}])[0].get("audioContent", "")
        if not audio_b64:
            return None
        return base64.b64decode(audio_b64)

    except Exception as exc:
        logger.error("Bhashini TTS error: %s", exc)
        return None
