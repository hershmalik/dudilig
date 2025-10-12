import type {
  ComplianceApproach,
  TargetMarket,
  SimulatorState,
  SimulatorMetrics,
  StrategicRecommendation,
  ImpactAnalysis,
} from "@shared/schema";

// Compliance approaches (rebranded for startups)
export const complianceApproaches: ComplianceApproach[] = [
  {
    id: "standard",
    name: "Standard KYC Flow",
    description: "Industry-standard data collection with balanced compliance requirements",
  },
  {
    id: "ai-optimized",
    name: "AI-Optimized Phased Collection",
    description: "Smart data collection triggers based on user behavior and risk signals",
  },
  {
    id: "minimal",
    name: "Minimal Upfront Collection",
    description: "Collect minimum required data, expand based on transaction triggers",
  },
  {
    id: "full-verification",
    name: "Full Upfront Verification",
    description: "Comprehensive data collection before any service access",
  },
];

// Target markets with regulatory contexts
export const targetMarkets: TargetMarket[] = [
  {
    id: "us",
    name: "US - CIP + AML + OFAC",
    regulations: "US",
    riskLevel: "Medium",
    complexity: 7,
  },
  {
    id: "eu",
    name: "EU - GDPR + AML5 + MiCA",
    regulations: "EU",
    riskLevel: "High",
    complexity: 9,
  },
  {
    id: "uk",
    name: "UK - FCA + AML + PCI",
    regulations: "UK",
    riskLevel: "Medium",
    complexity: 8,
  },
  {
    id: "singapore",
    name: "Singapore - MAS + AML + KYC",
    regulations: "Singapore",
    riskLevel: "Medium",
    complexity: 7,
  },
  {
    id: "japan",
    name: "Japan - JFSA + AML + Privacy",
    regulations: "Japan",
    riskLevel: "High",
    complexity: 8,
  },
];

// Calculate metrics based on approach and market
export function calculateMetrics(
  approachId: string,
  marketId: string
): SimulatorMetrics {
  const baseMetrics: Record<string, SimulatorMetrics> = {
    standard: {
      conversionRate: 68,
      engineeringComplexity: 7,
      regulatoryRisk: 15,
      timeToMarket: 120,
      userFrictionScore: 8.2,
      annualCost: 450,
      complianceScore: 85,
    },
    "ai-optimized": {
      conversionRate: 82,
      engineeringComplexity: 8,
      regulatoryRisk: 12,
      timeToMarket: 150,
      userFrictionScore: 5.8,
      annualCost: 680,
      complianceScore: 88,
    },
    minimal: {
      conversionRate: 91,
      engineeringComplexity: 5,
      regulatoryRisk: 28,
      timeToMarket: 90,
      userFrictionScore: 3.2,
      annualCost: 320,
      complianceScore: 72,
    },
    "full-verification": {
      conversionRate: 52,
      engineeringComplexity: 6,
      regulatoryRisk: 5,
      timeToMarket: 110,
      userFrictionScore: 9.8,
      annualCost: 580,
      complianceScore: 95,
    },
  };

  const market = targetMarkets.find((m) => m.id === marketId);
  const metrics = { ...baseMetrics[approachId] };

  // Adjust metrics based on market complexity
  if (market) {
    const complexityFactor = market.complexity / 7;
    metrics.engineeringComplexity = Math.round(
      metrics.engineeringComplexity * complexityFactor
    );
    metrics.timeToMarket = Math.round(metrics.timeToMarket * complexityFactor);
    metrics.annualCost = Math.round(metrics.annualCost * complexityFactor);

    // EU has stricter requirements
    if (marketId === "eu") {
      metrics.regulatoryRisk = Math.round(metrics.regulatoryRisk * 1.3);
      metrics.complianceScore = Math.max(
        metrics.complianceScore - 5,
        0
      );
    }
  }

  return metrics;
}

// Generate recommendations based on approach
export function generateRecommendations(
  approachId: string
): StrategicRecommendation[] {
  const recommendations: Record<string, StrategicRecommendation[]> = {
    standard: [
      {
        category: "Engineering Priority",
        recommendation:
          "Build modular KYC system with API-driven data collection triggers. Invest in real-time risk scoring to enable dynamic verification flows.",
      },
      {
        category: "Compliance Strategy",
        recommendation:
          "Implement risk-based tiered approach. Collect minimum viable data upfront, trigger additional collection based on transaction patterns.",
      },
      {
        category: "Product Impact",
        recommendation:
          "Optimize for initial conversion while maintaining compliance. Use progressive disclosure and smart defaults to reduce user friction.",
      },
    ],
    "ai-optimized": [
      {
        category: "Engineering Priority",
        recommendation:
          "Build ML-based risk scoring engine. Implement behavioral analytics to predict user intent and adjust collection requirements dynamically.",
      },
      {
        category: "Compliance Strategy",
        recommendation:
          "Design adaptive compliance framework that responds to real-time risk signals. Ensure explainable AI for regulatory audit trails.",
      },
      {
        category: "Product Impact",
        recommendation:
          "Create seamless user experience with invisible compliance. Show verification steps only when risk scoring requires it.",
      },
    ],
    minimal: [
      {
        category: "Engineering Priority",
        recommendation:
          "Build lightweight initial flow with robust expansion triggers. Ensure seamless transition to full verification when thresholds hit.",
      },
      {
        category: "Compliance Strategy",
        recommendation:
          "Document risk appetite clearly. Implement transaction monitoring to trigger step-up verification before regulatory limits.",
      },
      {
        category: "Product Impact",
        recommendation:
          "Maximize top-of-funnel conversion. Communicate future verification needs transparently to avoid user surprise.",
      },
    ],
    "full-verification": [
      {
        category: "Engineering Priority",
        recommendation:
          "Optimize verification speed and UX polish. Implement document auto-fill and intelligent validation to reduce completion time.",
      },
      {
        category: "Compliance Strategy",
        recommendation:
          "Achieve maximum regulatory confidence upfront. Position as premium, secure offering to justify higher friction.",
      },
      {
        category: "Product Impact",
        recommendation:
          "Target compliance-conscious users. Communicate security and regulatory adherence as key value props.",
      },
    ],
  };

  return recommendations[approachId] || recommendations.standard;
}

// Generate impact analysis
export function generateImpactAnalysis(approachId: string): ImpactAnalysis[] {
  const impactMap: Record<string, ImpactAnalysis[]> = {
    standard: [
      {
        team: "Engineering",
        impact: "API refactoring + new risk engine",
        effort: "Medium",
        timeline: "8-12 weeks",
        dependencies: "Compliance API specs",
      },
      {
        team: "Product",
        impact: "UX redesign + A/B testing",
        effort: "Low",
        timeline: "4-6 weeks",
        dependencies: "User research",
      },
      {
        team: "Compliance",
        impact: "Policy updates + risk framework",
        effort: "High",
        timeline: "6-8 weeks",
        dependencies: "Legal review",
      },
      {
        team: "Legal",
        impact: "Regulatory filing + approval",
        effort: "Medium",
        timeline: "10-14 weeks",
        dependencies: "Regulator engagement",
      },
    ],
    "ai-optimized": [
      {
        team: "Engineering",
        impact: "ML infrastructure + behavioral analytics",
        effort: "High",
        timeline: "12-16 weeks",
        dependencies: "Data science team",
      },
      {
        team: "Product",
        impact: "Adaptive UX flows + experimentation",
        effort: "Medium",
        timeline: "6-8 weeks",
        dependencies: "ML model outputs",
      },
      {
        team: "Compliance",
        impact: "Explainable AI framework + audit trails",
        effort: "High",
        timeline: "8-10 weeks",
        dependencies: "AI governance policy",
      },
      {
        team: "Legal",
        impact: "AI regulatory compliance review",
        effort: "High",
        timeline: "10-12 weeks",
        dependencies: "External counsel",
      },
    ],
    minimal: [
      {
        team: "Engineering",
        impact: "Lightweight flow + trigger system",
        effort: "Low",
        timeline: "4-6 weeks",
        dependencies: "Basic KYC infrastructure",
      },
      {
        team: "Product",
        impact: "Minimal onboarding + expansion UX",
        effort: "Low",
        timeline: "3-4 weeks",
        dependencies: "User flows defined",
      },
      {
        team: "Compliance",
        impact: "Risk threshold documentation",
        effort: "Medium",
        timeline: "4-6 weeks",
        dependencies: "Risk appetite approval",
      },
      {
        team: "Legal",
        impact: "Regulatory risk assessment",
        effort: "Medium",
        timeline: "6-8 weeks",
        dependencies: "Compliance strategy",
      },
    ],
    "full-verification": [
      {
        team: "Engineering",
        impact: "Document processing + validation optimization",
        effort: "Medium",
        timeline: "6-8 weeks",
        dependencies: "Third-party integrations",
      },
      {
        team: "Product",
        impact: "Premium onboarding experience",
        effort: "Medium",
        timeline: "5-7 weeks",
        dependencies: "Brand positioning",
      },
      {
        team: "Compliance",
        impact: "Maximum compliance assurance",
        effort: "Low",
        timeline: "3-4 weeks",
        dependencies: "Policy templates",
      },
      {
        team: "Legal",
        impact: "Regulatory pre-approval process",
        effort: "Medium",
        timeline: "8-10 weeks",
        dependencies: "Regulator relationships",
      },
    ],
  };

  return impactMap[approachId] || impactMap.standard;
}

// Generate funnel data based on approach
export function generateFunnelData(approachId: string) {
  const funnelMap: Record<string, { stage: string; value: number }[]> = {
    standard: [
      { stage: "Landing", value: 100 },
      { stage: "Started KYC", value: 85 },
      { stage: "Completed KYC", value: 68 },
      { stage: "First Transaction", value: 52 },
      { stage: "Active User", value: 41 },
    ],
    "ai-optimized": [
      { stage: "Landing", value: 100 },
      { stage: "Started KYC", value: 94 },
      { stage: "Completed KYC", value: 82 },
      { stage: "First Transaction", value: 71 },
      { stage: "Active User", value: 58 },
    ],
    minimal: [
      { stage: "Landing", value: 100 },
      { stage: "Started KYC", value: 98 },
      { stage: "Completed KYC", value: 91 },
      { stage: "First Transaction", value: 84 },
      { stage: "Active User", value: 72 },
    ],
    "full-verification": [
      { stage: "Landing", value: 100 },
      { stage: "Started KYC", value: 72 },
      { stage: "Completed KYC", value: 52 },
      { stage: "First Transaction", value: 38 },
      { stage: "Active User", value: 29 },
    ],
  };

  return funnelMap[approachId] || funnelMap.standard;
}

// Generate tradeoff data for chart
export function generateTradeoffData() {
  return [
    { approach: "Standard", conversion: 68, risk: 15 },
    { approach: "AI-Optimized", conversion: 82, risk: 12 },
    { approach: "Minimal", conversion: 91, risk: 28 },
    { approach: "Full", conversion: 52, risk: 5 },
  ];
}

// Main function to get simulator state
export function getSimulatorState(
  approachId: string = "standard",
  marketId: string = "us"
): SimulatorState {
  return {
    approach: approachId,
    market: marketId,
    metrics: calculateMetrics(approachId, marketId),
    recommendations: generateRecommendations(approachId),
    impactAnalysis: generateImpactAnalysis(approachId),
    funnelData: generateFunnelData(approachId),
    tradeoffData: generateTradeoffData(),
  };
}
