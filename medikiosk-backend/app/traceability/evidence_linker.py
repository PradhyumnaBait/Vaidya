"""
MediKiosk — Evidence Linker

Provides a thin orchestration layer that, given a set of extracted clinical
entities and lab results, links each to:

  1. The Anchor that recorded its evidence source
  2. The NAMASTE / ICD-11 ontology hits returned by the RAG translator
  3. The FHIR resource reference it maps to in the Bundle

This module is intentionally stateless: it receives data from ws_gateway.py
and returns enriched evidence records for downstream use by:
  - synthesis_engine.py (building the 15-second glanceable dashboard)
  - bundle_builder.py (annotating FHIR Provenance resources)
  - The physician REST endpoint (/api/physician/bundle/{session_id})

The bulk of the work was subsumed into ws_gateway.py during
Phase 9 implementation. This module provides the reusable helpers
that gateway and synthesis_engine import.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from app.models.clinical import Anchor, LabResult
from app.traceability.anchor_registry import AnchorRegistry, anchor_registry

logger = logging.getLogger(__name__)


@dataclass
class EvidenceLink:
    """
    A resolved evidence record joining a clinical claim to its sources.

    Attributes:
        slot:           The SOCRATES/Dashavidha slot that was filled.
        value:          The final interpreted value (string or dict).
        anchors:        All evidence anchors contributing to this slot.
        namaste_code:   Best NAMASTE match, if resolved.
        icd11_code:     Best ICD-11 allopathic code, if resolved.
        icd11_tm2_code: Best ICD-11 TM2 code, if resolved.
        confidence:     Aggregate confidence (mean of anchor confidences).
        fhir_ref:       Reference to the FHIR resource this links to.
        lab_results:    Associated lab results, if any.
    """

    slot: str
    value: Any
    anchors: list[Anchor] = field(default_factory=list)
    namaste_code: str | None = None
    icd11_code: str | None = None
    icd11_tm2_code: str | None = None
    confidence: float = 1.0
    fhir_ref: str | None = None
    lab_results: list[LabResult] = field(default_factory=list)

    @property
    def source_types(self) -> set[str]:
        """Unique source types contributing to this evidence link."""
        return {a.source for a in self.anchors}

    @property
    def is_voice_confirmed(self) -> bool:
        return "voice" in self.source_types

    @property
    def is_touch_confirmed(self) -> bool:
        return "touch" in self.source_types

    @property
    def is_ocr_confirmed(self) -> bool:
        return "ocr" in self.source_types

    def to_dict(self) -> dict:
        return {
            "slot": self.slot,
            "value": self.value,
            "namaste_code": self.namaste_code,
            "icd11_code": self.icd11_code,
            "icd11_tm2_code": self.icd11_tm2_code,
            "confidence": round(self.confidence, 4),
            "sources": list(self.source_types),
            "fhir_ref": self.fhir_ref,
            "anchor_count": len(self.anchors),
        }


class EvidenceLinker:
    """
    Links extracted clinical entities to their evidence sources.

    Typical call site (ws_gateway.py → _run_synthesis):

        linker = EvidenceLinker(session_id, registry=anchor_registry)
        links  = linker.build_links(belief_state, ontology_hits)
        fhir_provenance_list = linker.to_fhir_provenance(links)
    """

    def __init__(
        self,
        session_id: str,
        registry: AnchorRegistry | None = None,
    ) -> None:
        self.session_id = session_id
        self._registry = registry or anchor_registry

    # ── Public API ─────────────────────────────────────────────────────────────

    def build_links(
        self,
        belief_state: Any,   # app.models.session.BeliefState
        ontology_hits: list[dict],
    ) -> list[EvidenceLink]:
        """
        Build EvidenceLink records for all filled slots in belief_state.

        For each slot with a filled value, we:
          1. Retrieve all matching anchors from the registry.
          2. Match the first ontology hit with the same slot/entity name.
          3. Compute aggregate confidence.
          4. Return an EvidenceLink.

        Args:
            belief_state:   Current session BeliefState.
            ontology_hits:  List of RAG hit dicts (from rag_translator).

        Returns:
            List of EvidenceLink records (one per filled slot).
        """
        links: list[EvidenceLink] = []
        all_anchors = self._registry.get_all(self.session_id)

        # Build a quick lookup: slot → list[Anchor]
        slot_to_anchors: dict[str, list[Anchor]] = {}
        for anchor in all_anchors:
            slot_to_anchors.setdefault(anchor.slot, []).append(anchor)

        # Build ontology lookup: entity_text → hit
        onto_lookup: dict[str, dict] = {}
        for hit in ontology_hits:
            text = hit.get("query_text", hit.get("entity", "")).lower()
            if text:
                onto_lookup[text] = hit

        # Iterate over filled slots in the belief state
        socrates = getattr(belief_state, "socrates", {}) or {}
        dashavidha = getattr(belief_state, "dashavidha_core4", {}) or {}

        all_slots: dict[str, Any] = {**socrates, **dashavidha}
        for slot, slot_val in all_slots.items():
            value = getattr(slot_val, "value", slot_val) if hasattr(slot_val, "value") else slot_val
            if value is None:
                continue

            anchors_for_slot = slot_to_anchors.get(slot, [])
            confidence = (
                sum(a.confidence for a in anchors_for_slot) / len(anchors_for_slot)
                if anchors_for_slot else 1.0
            )

            # Match ontology hit by slot name similarity
            hit = onto_lookup.get(slot.lower()) or onto_lookup.get(str(value).lower())
            namaste = hit.get("namaste_code") if hit else None
            icd11 = hit.get("icd11_allopathic") if hit else None
            tm2 = hit.get("icd11_tm2") if hit else None

            links.append(EvidenceLink(
                slot=slot,
                value=value,
                anchors=anchors_for_slot,
                namaste_code=namaste,
                icd11_code=icd11,
                icd11_tm2_code=tm2,
                confidence=confidence,
            ))

        logger.debug(
            "Built %d evidence links for session %s",
            len(links),
            self.session_id[:8],
        )
        return links

    def to_fhir_provenance(
        self,
        links: list[EvidenceLink],
        patient_ref: str = "Patient/unknown",
        encounter_ref: str = "Encounter/unknown",
    ) -> list[dict]:
        """
        Generate FHIR Provenance resources for a list of EvidenceLinks.

        These are appended to the FHIR Bundle as additional entries.
        """
        resources = []
        for link in links:
            prov = {
                "resourceType": "Provenance",
                "id": f"prov-{link.slot}",
                "target": [{"reference": patient_ref}],
                "recorded": (
                    link.anchors[0].timestamp if link.anchors else "unknown"
                ),
                "reason": [
                    {
                        "coding": [
                            {
                                "system": "https://medikiosk.nhm.in/StructureDefinition/slot-type",
                                "code": link.slot,
                            }
                        ]
                    }
                ],
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
                "extension": [
                    {
                        "url": "https://medikiosk.nhm.in/StructureDefinition/evidence-sources",
                        "valueString": ",".join(sorted(link.source_types)) or "unknown",
                    },
                    {
                        "url": "https://medikiosk.nhm.in/StructureDefinition/aggregate-confidence",
                        "valueDecimal": round(link.confidence, 4),
                    },
                ],
            }
            if link.namaste_code:
                prov["extension"].append({
                    "url": "https://medikiosk.nhm.in/StructureDefinition/namaste-code",
                    "valueString": link.namaste_code,
                })
            resources.append(prov)
        return resources

    def summary_dict(self, links: list[EvidenceLink]) -> dict:
        """Return a compact summary suitable for the physician dashboard."""
        return {
            "total_slots_filled": len(links),
            "voice_confirmed": sum(1 for l in links if l.is_voice_confirmed),
            "touch_confirmed": sum(1 for l in links if l.is_touch_confirmed),
            "ocr_confirmed": sum(1 for l in links if l.is_ocr_confirmed),
            "namaste_resolved": sum(1 for l in links if l.namaste_code),
            "icd11_resolved": sum(1 for l in links if l.icd11_code),
            "mean_confidence": (
                round(sum(l.confidence for l in links) / len(links), 3)
                if links else 0.0
            ),
            "links": [l.to_dict() for l in links],
        }
