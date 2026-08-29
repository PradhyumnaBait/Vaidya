"""
MediKiosk — Deterministic Red-Flag Intercept Engine

This module is a pure rule evaluator. Zero ML involvement.
It evaluates hard-coded clinical rules against the live BeliefState
after every slot update.

Priority levels:
  P0 — Immediate emergency: FSM enters RED_FLAG_TRIAGE, kiosk prints emergency ticket,
        Redis Pub/Sub alert published to triage:alerts channel.
  P1 — High risk: Priority queue flag, physician notified.

The evaluator runs as a concurrent asyncio Task alongside every LLM call,
ensuring it fires mid-question without waiting for the next turn boundary.
"""
from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from typing import Any

from app.config import get_settings
from app.models.session import BeliefState

logger = logging.getLogger(__name__)
settings = get_settings()


@dataclass
class RedFlagRule:
    rule_id: str
    name: str
    description: str
    conditions: list[dict[str, Any]]
    logic: str      # "AND" | "OR" | "ANY_ONE" | "2_OF_3" | "ALL"
    priority: str   # "P0" | "P1"
    action: str     # "EMERGENCY_TRIAGE" | "PRIORITY_QUEUE" | "ELEVATED_RISK_FLAG"


# ── Rule Definitions ──────────────────────────────────────────────────────────

RED_FLAG_RULES: list[RedFlagRule] = [
    RedFlagRule(
        rule_id="RF-CV-001",
        name="Acute Coronary Syndrome",
        description="Crushing precordial chest pain with radiation to arm/jaw/neck",
        conditions=[
            {"slot": "socrates.site",
             "matches": ["precordial", "chest", "sternal", "chest/precordial"]},
            {"slot": "socrates.character",
             "matches": ["crushing", "pressure", "crushing/pressure", "heavy", "heaviness/dull"]},
            {"slot": "socrates.radiation",
             "matches": ["left arm", "jaw", "neck", "shoulder", "arm"]},
        ],
        logic="AND",
        priority="P0",
        action="EMERGENCY_TRIAGE",
    ),
    RedFlagRule(
        rule_id="RF-CV-002",
        name="Probable ACS — Partial (2-of-3)",
        description="Two of three ACS hallmark features present",
        conditions=[
            {"slot": "socrates.site",
             "matches": ["precordial", "chest", "sternal", "chest/precordial"]},
            {"slot": "socrates.character",
             "matches": ["crushing", "pressure", "crushing/pressure", "heavy"]},
            {"slot": "socrates.radiation",
             "matches": ["left arm", "jaw", "neck", "shoulder"]},
        ],
        logic="2_OF_3",
        priority="P1",
        action="PRIORITY_QUEUE",
    ),
    RedFlagRule(
        rule_id="RF-MET-001",
        name="Hyperglycaemic Emergency",
        description="Critically elevated blood glucose from scanned labs",
        conditions=[
            {"source": "lab_data", "field": "fasting_blood_sugar",
             "operator": ">", "value": 350.0},
        ],
        logic="OR",
        priority="P0",
        action="EMERGENCY_TRIAGE",
    ),
    RedFlagRule(
        rule_id="RF-MET-002",
        name="Hyperglycaemia — Random Glucose",
        description="Critically elevated random blood glucose from scanned labs",
        conditions=[
            {"source": "lab_data", "field": "random_blood_sugar",
             "operator": ">", "value": 450.0},
        ],
        logic="OR",
        priority="P0",
        action="EMERGENCY_TRIAGE",
    ),
    RedFlagRule(
        rule_id="RF-NEU-001",
        name="Stroke / TIA",
        description="Sudden neurological symptoms suggestive of stroke",
        conditions=[
            {"slot": "socrates.associations", "contains_any": [
                "facial droop", "unilateral weakness", "sudden speech difficulty",
                "vision loss", "sudden dysarthria", "balance loss", "dysarthria",
            ]},
        ],
        logic="ANY_ONE",
        priority="P0",
        action="EMERGENCY_TRIAGE",
    ),
    RedFlagRule(
        rule_id="RF-CV-LAB-001",
        name="Cardiovascular Risk Compound",
        description="Active chest pain combined with historically elevated LDL",
        conditions=[
            {"slot": "socrates.site", "matches": ["chest", "precordial", "chest/precordial"]},
            {"source": "lab_data", "field": "ldl_cholesterol", "operator": ">", "value": 160.0},
            {"source": "lab_data", "field": "triglycerides", "operator": ">", "value": 200.0},
        ],
        logic="ALL",
        priority="P1",
        action="ELEVATED_RISK_FLAG",
    ),
    RedFlagRule(
        rule_id="RF-MET-003",
        name="Severe Anaemia (Lab)",
        description="Critically low haemoglobin detected in scanned labs",
        conditions=[
            {"source": "lab_data", "field": "haemoglobin", "operator": "<", "value": 6.0},
        ],
        logic="OR",
        priority="P1",
        action="PRIORITY_QUEUE",
    ),
    RedFlagRule(
        rule_id="RF-REN-001",
        name="Acute Kidney Injury Risk (Lab)",
        description="Critically elevated serum creatinine",
        conditions=[
            {"source": "lab_data", "field": "serum_creatinine",
             "operator": ">", "value": 5.0},
        ],
        logic="OR",
        priority="P1",
        action="PRIORITY_QUEUE",
    ),
]


# ── Condition Evaluation Helpers ──────────────────────────────────────────────

def _get_slot_value(state: BeliefState, slot_path: str) -> str | list | None:
    """Extract a value from the BeliefState using dot-notation path."""
    parts = slot_path.split(".")
    # Only handle "socrates.<field>" paths
    if parts[0] == "socrates":
        s = state.socrates
        field_name = parts[1]
        slot_obj = getattr(s, field_name, None)
        if slot_obj is None:
            return None
        if isinstance(slot_obj, list):
            return [sv.value for sv in slot_obj]
        return slot_obj.value if slot_obj else None
    return None


def _get_lab_value(lab_results: list[dict], field: str) -> float | None:
    """Get the latest numeric value for a biomarker from lab results."""
    for lr in lab_results:
        if lr.get("biomarker") == field:
            return lr.get("latest_value")
    return None


def _evaluate_condition(
    cond: dict[str, Any],
    state: BeliefState,
    lab_results: list[dict],
) -> bool:
    """Evaluate a single rule condition against current state and lab data."""

    if "slot" in cond:
        # Slot-based condition
        value = _get_slot_value(state, cond["slot"])
        if value is None:
            return False

        if "matches" in cond:
            # Check if the slot value contains any of the match strings
            value_lower = value.lower() if isinstance(value, str) else ""
            return any(m.lower() in value_lower for m in cond["matches"])

        if "contains_any" in cond:
            # For list slots (associations), check if any association matches
            if isinstance(value, list):
                value_strs = " ".join(value).lower()
            else:
                value_strs = str(value).lower()
            return any(m.lower() in value_strs for m in cond["contains_any"])

    elif "source" in cond and cond["source"] == "lab_data":
        # Lab-based condition
        lab_val = _get_lab_value(lab_results, cond["field"])
        if lab_val is None:
            return False
        op = cond["operator"]
        threshold = cond["value"]
        if op == ">":
            return lab_val > threshold
        elif op == "<":
            return lab_val < threshold
        elif op == ">=":
            return lab_val >= threshold
        elif op == "<=":
            return lab_val <= threshold
        elif op == "==":
            return lab_val == threshold

    return False


def _evaluate_rule(
    rule: RedFlagRule,
    state: BeliefState,
    lab_results: list[dict],
) -> bool:
    """Evaluate all conditions of a rule with the specified logic."""
    results = [
        _evaluate_condition(c, state, lab_results) for c in rule.conditions
    ]

    if rule.logic == "AND":
        return all(results)
    elif rule.logic == "OR":
        return any(results)
    elif rule.logic == "ANY_ONE":
        return any(results)
    elif rule.logic == "ALL":
        return all(results)
    elif rule.logic == "2_OF_3":
        return sum(results) >= 2
    return False


# ── Redis Pub/Sub Alert Publisher ─────────────────────────────────────────────

async def _publish_triage_alert(
    rule: RedFlagRule,
    state: BeliefState,
    lab_results: list[dict],
) -> None:
    """Publish a P0/P1 alert to the triage dashboard via Redis Pub/Sub."""
    try:
        from app.core.session_manager import get_redis
        r = get_redis()

        triggered_slots: dict[str, str] = {}
        for cond in rule.conditions:
            if "slot" in cond:
                val = _get_slot_value(state, cond["slot"])
                if val:
                    triggered_slots[cond["slot"]] = str(val)

        alert_payload = {
            "alert_level": rule.priority,
            "rule_id": rule.rule_id,
            "name": rule.name,
            "session_id_hash": state.session_hash,
            "token_number": state.session_id[-6:].upper(),  # Last 6 chars as kiosk token
            "summary": rule.description,
            "triggered_slots": triggered_slots,
            "timestamp_iso": time.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        }

        await r.publish(settings.triage_pubsub_channel, json.dumps(alert_payload))
        logger.warning(
            "RED FLAG %s published: rule=%s session=%s",
            rule.priority, rule.rule_id, state.session_hash[:12],
        )

    except Exception as exc:
        logger.error("Failed to publish triage alert: %s", exc)


# ── Main Evaluation Entry Point ───────────────────────────────────────────────

async def evaluate_red_flags(
    state: BeliefState,
    lab_results: list[dict] | None = None,
) -> tuple[bool, RedFlagRule | None]:
    """
    Evaluate all red-flag rules against the current BeliefState.
    Runs after EVERY slot update.

    Returns:
        (triggered: bool, matched_rule: RedFlagRule | None)
    """
    if state.red_flag_triggered:
        # Already triggered; don't re-evaluate
        return True, None

    if lab_results is None:
        lab_results = []

    # P0 rules first (ordered for early termination)
    p0_rules = [r for r in RED_FLAG_RULES if r.priority == "P0"]
    p1_rules = [r for r in RED_FLAG_RULES if r.priority == "P1"]

    for rule in p0_rules + p1_rules:
        if _evaluate_rule(rule, state, lab_results):
            # Mark state
            state.red_flag_triggered = True
            state.red_flag_rule_id = rule.rule_id

            # Publish alert (non-blocking)
            await _publish_triage_alert(rule, state, lab_results)

            return True, rule

    return False, None
