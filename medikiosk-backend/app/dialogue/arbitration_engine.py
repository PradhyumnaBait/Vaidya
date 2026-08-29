"""
MediKiosk — Acoustic-Noise Input Arbitration Engine

Resolves the "Input Race Condition" in noisy OPD environments:
- A voice (ASR) stream and touch events arrive concurrently for the same slot.
- The engine runs a timed arbitration window and selects exactly one input.
- Dynamic confidence threshold adapts to measured ambient noise level.
- TOUCH_LOCK short-circuits voice processing immediately when a tap is detected.

Key formula:
    α_threshold(t) = 0.70 + 0.15 × (RMS_ambient_dB / 95.0)

At 85 dB:  α_threshold ≈ 0.84  → aggressive touch preference
At 60 dB:  α_threshold ≈ 0.79  → moderate preference
At 40 dB:  α_threshold ≈ 0.76  → near-default
"""
from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Literal

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


@dataclass
class ArbitrationResult:
    source: Literal["voice", "touch"]
    value: str
    raw_text: str
    confidence: float
    slot_id: str
    elapsed_ms: float


class ArbitrationWindow:
    """
    Single-slot arbitration window.
    Open for at most `window_ms` milliseconds.
    Immediately resolves on TOUCH_LOCK.
    """

    def __init__(
        self,
        slot_id: str,
        ambient_rms_db: float = 70.0,
        window_ms: int | None = None,
    ):
        self.slot_id = slot_id
        self.ambient_rms_db = ambient_rms_db
        self.window_ms = window_ms or settings.bhashini_arbitration_window_ms
        self._alpha_threshold = self._compute_threshold(ambient_rms_db)
        self._touch_event: asyncio.Event = asyncio.Event()
        self._touch_value: str | None = None
        self._voice_result: tuple[str, float] | None = None  # (text, confidence)
        self._open_time_ms: float = time.time() * 1000

    def _compute_threshold(self, rms_db: float) -> float:
        """
        Dynamic ASR confidence threshold.
        Rises toward 0.85 as ambient noise increases toward 95 dB.
        """
        return 0.70 + 0.15 * (min(rms_db, 95.0) / 95.0)

    def register_touch(self, value: str, slot_id: str) -> None:
        """
        Called by the WebSocket gateway when a touch event arrives.
        Sets the TOUCH_LOCK immediately.
        """
        if slot_id != self.slot_id:
            logger.warning(
                "Touch event for slot %s received during window for slot %s — ignored.",
                slot_id, self.slot_id,
            )
            return
        self._touch_value = value
        self._touch_event.set()
        logger.debug("TOUCH_LOCK acquired for slot %s: value=%s", slot_id, value)

    def register_voice_result(self, text: str, confidence: float) -> None:
        """
        Called by the Bhashini ASR streaming handler with the final transcription.
        """
        self._voice_result = (text, confidence)
        logger.debug(
            "Voice result registered for slot %s: confidence=%.2f text=%s",
            self.slot_id, confidence, text[:40],
        )

    async def resolve(self) -> ArbitrationResult:
        """
        Wait for either a touch event or the window timeout, then decide.
        Returns an ArbitrationResult with the winning source and value.
        """
        elapsed_start = time.time() * 1000
        window_sec = self.window_ms / 1000.0

        try:
            # Race: touch lock vs timeout
            await asyncio.wait_for(self._touch_event.wait(), timeout=window_sec)
        except asyncio.TimeoutError:
            pass  # Voice or fallback path below

        elapsed = time.time() * 1000 - elapsed_start

        # ── Decision Logic ────────────────────────────────────────────────────
        if self._touch_event.is_set() and self._touch_value is not None:
            # Touch wins unconditionally
            return ArbitrationResult(
                source="touch",
                value=self._touch_value,
                raw_text=self._touch_value,
                confidence=1.0,
                slot_id=self.slot_id,
                elapsed_ms=elapsed,
            )

        if self._voice_result is not None:
            text, confidence = self._voice_result
            if confidence >= self._alpha_threshold:
                # Voice accepted
                return ArbitrationResult(
                    source="voice",
                    value=text,
                    raw_text=text,
                    confidence=confidence,
                    slot_id=self.slot_id,
                    elapsed_ms=elapsed,
                )
            elif confidence >= 0.50:
                # Low confidence: return CONFIRM_NEEDED so the gateway can
                # show the transcription and ask the patient to tap to confirm
                return ArbitrationResult(
                    source="voice",
                    value=f"CONFIRM_NEEDED:{text}",
                    raw_text=text,
                    confidence=confidence,
                    slot_id=self.slot_id,
                    elapsed_ms=elapsed,
                )

        # ── Fallback: no usable input — request touch card re-selection ──────
        logger.info(
            "Slot %s: no valid input in %dms (ambient=%.0fdB, α=%.2f). "
            "Requesting touch re-selection.",
            self.slot_id, elapsed, self.ambient_rms_db, self._alpha_threshold,
        )
        return ArbitrationResult(
            source="touch",
            value="RETRY_TOUCH",
            raw_text="",
            confidence=0.0,
            slot_id=self.slot_id,
            elapsed_ms=elapsed,
        )


class ArbitrationEngine:
    """
    Session-level manager for arbitration windows.
    Creates one ArbitrationWindow per dialogue turn.
    """

    def __init__(self):
        self._current_window: ArbitrationWindow | None = None
        self._ambient_rms_db: float = 70.0  # Default; updated on each audio chunk

    def update_ambient_noise(self, rms_db: float) -> None:
        """
        Called periodically by the audio streaming handler with measured RMS dB.
        This allows the threshold to adapt dynamically during a session.
        """
        # Exponential moving average for smoothing
        self._ambient_rms_db = 0.7 * self._ambient_rms_db + 0.3 * rms_db

    def open_window(self, slot_id: str) -> ArbitrationWindow:
        """Open a new arbitration window for the given slot."""
        self._current_window = ArbitrationWindow(
            slot_id=slot_id,
            ambient_rms_db=self._ambient_rms_db,
        )
        return self._current_window

    def register_touch(self, value: str, slot_id: str) -> None:
        """Forward touch event to the current window."""
        if self._current_window:
            self._current_window.register_touch(value, slot_id)

    def register_voice(self, text: str, confidence: float) -> None:
        """Forward ASR result to the current window."""
        if self._current_window:
            self._current_window.register_voice_result(text, confidence)

    async def resolve_current(self) -> ArbitrationResult | None:
        """Resolve the current window and close it."""
        if self._current_window is None:
            return None
        result = await self._current_window.resolve()
        self._current_window = None
        return result
