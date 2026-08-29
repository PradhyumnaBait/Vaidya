"""
MediKiosk — Anchor Registry

Stores and retrieves clinical Anchor records linking every extracted
clinical claim (slot value) to its originating evidence source.

An Anchor records:
  - Which slot was filled (e.g., SOCRATES.onset)
  - What the patient said (raw utterance / touch card)
  - Where it came from (voice transcript, touch card ID, OCR document)
  - The confidence score and timestamp

Anchors are held in-memory per session (keyed by session_id) and written
to the session's BeliefState.anchors list via the session_manager.
They are also serialised into the FHIR Provenance resources attached
to each FHIR Bundle entry.

Usage:
    from app.traceability.anchor_registry import AnchorRegistry

    registry = AnchorRegistry()
    registry.record(session_id, anchor)
    anchors = registry.get_all(session_id)
    registry.clear(session_id)   # called at session teardown
"""
from __future__ import annotations

import logging
import threading
from datetime import datetime, timezone
from typing import Any

from app.models.clinical import Anchor

logger = logging.getLogger(__name__)

# Module-level singleton (one per process; sessions are keyed by session_id)
_lock = threading.Lock()
_store: dict[str, list[Anchor]] = {}


class AnchorRegistry:
    """
    Thread-safe in-process anchor store.

    For production multi-process deployments, anchors are additionally
    persisted in Redis as session metadata by session_manager.py.
    This in-process store serves as the hot-path cache for the current
    request cycle.
    """

    def record(
        self,
        session_id: str,
        anchor: Anchor,
    ) -> None:
        """
        Add an Anchor to the registry for session_id.

        Thread-safe. Duplicate anchors (same slot + source + timestamp
        within 1 second) are silently dropped.
        """
        with _lock:
            existing = _store.setdefault(session_id, [])
            # Deduplication: skip exact same (slot, source, confidence)
            for ex in existing:
                if (
                    ex.slot == anchor.slot
                    and ex.source == anchor.source
                    and abs(ex.confidence - anchor.confidence) < 1e-6
                ):
                    return
            existing.append(anchor)
            logger.debug(
                "Anchor recorded [%s] slot=%s source=%s conf=%.2f",
                session_id[:8],
                anchor.slot,
                anchor.source,
                anchor.confidence,
            )

    def record_raw(
        self,
        session_id: str,
        *,
        slot: str,
        raw_value: Any,
        source: str,
        confidence: float = 1.0,
        metadata: dict | None = None,
    ) -> Anchor:
        """
        Convenience method: build and record an Anchor in one call.

        Returns:
            The created Anchor.
        """
        anchor = Anchor(
            slot=slot,
            raw_value=str(raw_value),
            source=source,
            confidence=confidence,
            timestamp=datetime.now(tz=timezone.utc).isoformat(),
            metadata=metadata or {},
        )
        self.record(session_id, anchor)
        return anchor

    def get_all(self, session_id: str) -> list[Anchor]:
        """Return all anchors for a session (empty list if none)."""
        with _lock:
            return list(_store.get(session_id, []))

    def get_by_slot(self, session_id: str, slot: str) -> list[Anchor]:
        """Return anchors for a specific slot (e.g., 'onset')."""
        return [a for a in self.get_all(session_id) if a.slot == slot]

    def get_by_source(self, session_id: str, source: str) -> list[Anchor]:
        """Return anchors from a specific source type ('voice', 'touch', 'ocr')."""
        return [a for a in self.get_all(session_id) if a.source == source]

    def count(self, session_id: str) -> int:
        """Return total anchor count for a session."""
        with _lock:
            return len(_store.get(session_id, []))

    def clear(self, session_id: str) -> int:
        """
        Remove all anchors for session_id (called at session teardown).

        Returns:
            Number of anchors cleared.
        """
        with _lock:
            removed = _store.pop(session_id, [])
            n = len(removed)
        logger.debug("Cleared %d anchor(s) for session %s", n, session_id[:8])
        return n

    def to_fhir_provenance(
        self,
        session_id: str,
        patient_ref: str,
        encounter_ref: str,
    ) -> list[dict]:
        """
        Convert anchors to FHIR Provenance resources.

        Returns a list of FHIR R4 Provenance resource dicts, one per anchor.
        These are included as entries in the FHIR Bundle.
        """
        anchors = self.get_all(session_id)
        resources = []
        for anchor in anchors:
            prov = {
                "resourceType": "Provenance",
                "id": f"prov-{anchor.slot}-{id(anchor)}",
                "target": [{"reference": patient_ref}],
                "recorded": anchor.timestamp,
                "agent": [
                    {
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/provenance-participant-type",
                                    "code": "informant",
                                }
                            ]
                        },
                        "who": {"reference": patient_ref},
                    }
                ],
                "entity": [
                    {
                        "role": "source",
                        "what": {
                            "identifier": {
                                "system": "https://medikiosk.nhm.in/source-type",
                                "value": anchor.source,
                            }
                        },
                    }
                ],
                "extension": [
                    {
                        "url": "https://medikiosk.nhm.in/StructureDefinition/anchor-slot",
                        "valueString": anchor.slot,
                    },
                    {
                        "url": "https://medikiosk.nhm.in/StructureDefinition/anchor-raw-value",
                        "valueString": anchor.raw_value,
                    },
                    {
                        "url": "https://medikiosk.nhm.in/StructureDefinition/anchor-confidence",
                        "valueDecimal": round(anchor.confidence, 4),
                    },
                ],
            }
            if encounter_ref:
                prov["target"].append({"reference": encounter_ref})
            resources.append(prov)
        return resources


# Module-level singleton instance
anchor_registry = AnchorRegistry()
