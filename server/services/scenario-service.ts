import type { Scenario } from "@shared/schema";

export function generateScenario(tier: string, sector: string): Scenario {
  const baseCosts = {
    "High-Risk": { min: 450, max: 650 },
    "Limited-Risk": { min: 50, max: 120 },
    "Minimal-Risk": { min: 10, max: 30 },
  };

  const baseTimeline = {
    "High-Risk": { min: 8, max: 12 },
    "Limited-Risk": { min: 2, max: 4 },
    "Minimal-Risk": { min: 1, max: 2 },
  };

  const costs = baseCosts[tier as keyof typeof baseCosts] || baseCosts["Limited-Risk"];
  const timeline = baseTimeline[tier as keyof typeof baseTimeline] || baseTimeline["Limited-Risk"];

  const dealTerms = [];

  if (tier === "High-Risk") {
    dealTerms.push({
      id: "reserve-1",
      type: "reserve" as const,
      description: `Add $${(costs.min + costs.max) / 2}k reserve for compliance costs`,
      impact: "Reduces available capital for growth initiatives by 15-20%, requiring additional fundraising or extended runway planning",
    });

    dealTerms.push({
      id: "milestone-1",
      type: "milestone" as const,
      description: "Gate Series B funding on CE marking completion",
      impact: `Delays next funding round by ${timeline.min}-${timeline.max} months, potentially requiring bridge financing or extended Series A terms`,
    });

    if (sector.toLowerCase().includes("health")) {
      dealTerms.push({
        id: "valuation-1",
        type: "valuation" as const,
        description: "Adjust pre-money valuation down 10-15% for regulatory risk",
        impact: "Reflects increased time-to-market and compliance uncertainty in healthcare AI market",
      });
    }
  } else if (tier === "Limited-Risk") {
    dealTerms.push({
      id: "reserve-2",
      type: "reserve" as const,
      description: `Allocate $${costs.max}k for transparency compliance`,
      impact: "Minimal impact on runway, can be absorbed in operational budget",
    });

    dealTerms.push({
      id: "milestone-2",
      type: "milestone" as const,
      description: "Include transparency audit in pre-Series A checklist",
      impact: "Minor process addition, no material impact on funding timeline",
    });
  } else {
    dealTerms.push({
      id: "minimal-1",
      type: "reserve" as const,
      description: "Minimal compliance reserves needed",
      impact: "No significant impact on deal structure or valuation",
    });
  }

  return {
    name: "Stricter EU AI Act Enforcement (2026)",
    description: "Projected scenario assuming increased regulatory scrutiny, faster enforcement timelines, and higher compliance standards following the EU AI Act's full implementation.",
    costRange: costs,
    timelineRange: timeline,
    dealTerms: dealTerms.slice(0, 2),
    confidence: tier === "High-Risk" ? "High" : "Medium",
  };
}
