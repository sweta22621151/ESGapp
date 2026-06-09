"""
BUS5001 Assessment 3 - Q3 Rule-Based Baseline ESG Message Triage

Run examples:
  python baseline_triage.py "There is a water leak in Building C that has been running all morning."
  python baseline_triage.py --samples

This baseline does not use an external LLM. It provides a simple comparison point for LLM outputs.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict

TEAM_ROUTES = {
    "water_leak": "Facilities and Sustainability Operations",
    "energy_waste": "Facilities Energy Management",
    "waste_contamination": "Waste and Recycling Team",
    "supplier_policy": "Procurement and ESG Governance",
    "accessibility_barrier": "Accessibility and Inclusion Team",
    "governance_conduct": "People, Governance and Compliance Team",
    "unknown": "ESG Support Desk",
}

SAMPLE_MESSAGES = [
    "There is a water leak in Building C that has been running all morning.",
    "The recycling bins are contaminated again and no one seems to be checking them.",
    "The air conditioning is running overnight in an empty office.",
    "I want to report that one of our suppliers may not meet our sustainability policy.",
    "The accessible entrance near the main building has been blocked for two days.",
]


@dataclass
class TriageResult:
    issue_category: str
    urgency: str
    sentiment: str
    followup_required: str
    recommended_team: str
    escalation_reason: str
    data_sensitivity_risk: str
    brief_summary: str
    baseline_method: str
    confidence: float


def classify_issue(text: str) -> str:
    lower = text.lower()
    if re.search(r"water|leak|tap|pipe|flood", lower):
        return "water_leak"
    if re.search(r"recycl|bin|waste|contaminat|disposal|rubbish|trash", lower):
        return "waste_contamination"
    if re.search(r"air conditioning|aircon|\bac\b|light|electric|energy|overnight|empty office|heating", lower):
        return "energy_waste"
    if re.search(r"supplier|procurement|vendor|supply chain|sustainability policy", lower):
        return "supplier_policy"
    if re.search(r"accessible|accessibility|wheelchair|blocked entrance|barrier|inclusion", lower):
        return "accessibility_barrier"
    if re.search(r"conduct|harassment|governance|privacy|ethics|wellbeing", lower):
        return "governance_conduct"
    return "unknown"


def classify_urgency(text: str, category: str) -> str:
    lower = text.lower()
    if re.search(r"fire|injury|danger|unsafe|hazard|emergency|immediate", lower):
        return "CRITICAL"
    if re.search(r"all morning|two days|blocked|running|leak|breach|not meet|supplier", lower):
        return "HIGH"
    if re.search(r"again|repeated|overnight|seems|concern", lower):
        return "MEDIUM"
    if category in {"accessibility_barrier", "supplier_policy"}:
        return "HIGH"
    return "LOW"


def classify_sentiment(text: str) -> str:
    lower = text.lower()
    if re.search(r"again|blocked|leak|concern|not meet|unsafe|running|contaminated", lower):
        return "NEGATIVE"
    if re.search(r"thank|good|resolved|appreciate", lower):
        return "POSITIVE"
    return "NEUTRAL"


def triage(text: str) -> TriageResult:
    category = classify_issue(text)
    urgency = classify_urgency(text, category)
    sensitive = category in {"supplier_policy", "accessibility_barrier", "governance_conduct"}
    followup = "N" if category == "unknown" else "Y"
    if category == "unknown":
        escalation = "Message is unclear and requires more information before triage."
        confidence = 0.35
    elif urgency in {"HIGH", "CRITICAL"} or sensitive:
        escalation = "High urgency, sensitive category, accessibility impact or supplier compliance risk requires human review."
        confidence = 0.82
    else:
        escalation = "Standard operational issue suitable for routine workflow."
        confidence = 0.76

    return TriageResult(
        issue_category=category,
        urgency=urgency,
        sentiment=classify_sentiment(text),
        followup_required=followup,
        recommended_team=TEAM_ROUTES[category],
        escalation_reason=escalation,
        data_sensitivity_risk="MEDIUM" if sensitive else "LOW",
        brief_summary=text[:180],
        baseline_method="rule-based keyword classifier",
        confidence=confidence,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Rule-based ESG message triage baseline.")
    parser.add_argument("message", nargs="*", help="Message to classify")
    parser.add_argument("--samples", action="store_true", help="Run sample messages")
    args = parser.parse_args()

    messages = SAMPLE_MESSAGES if args.samples else [" ".join(args.message).strip()]
    if not messages or not messages[0]:
        parser.error("Provide a message or use --samples")

    output = [asdict(triage(message)) for message in messages]
    print(json.dumps(output if args.samples else output[0], indent=2))


if __name__ == "__main__":
    main()
