import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import type { Citation } from "@shared/schema";

interface ClassificationRule {
  useCase: string;
  tier: string;
  reason: string;
  citations: Citation[];
}

interface RulesData {
  classifications: ClassificationRule[];
}

let rulesCache: ClassificationRule[] | null = null;

function loadRules(): ClassificationRule[] {
  if (rulesCache) return rulesCache;

  const rulesPath = path.join(process.cwd(), "server/data/eu-ai-act-rules.yaml");
  const rulesContent = fs.readFileSync(rulesPath, "utf8");
  const rulesData = yaml.load(rulesContent) as RulesData;
  
  rulesCache = rulesData.classifications;
  return rulesCache;
}

export interface ClassificationResult {
  tier: string;
  reason: string;
  citations: Citation[];
}

export function classifyAISystem(aiUseCase: string): ClassificationResult {
  const rules = loadRules();
  
  const rule = rules.find(r => 
    r.useCase.toLowerCase() === aiUseCase.toLowerCase()
  );

  if (rule) {
    return {
      tier: rule.tier,
      reason: rule.reason,
      citations: rule.citations,
    };
  }

  const defaultRule = rules.find(r => r.useCase === "Other");
  return {
    tier: defaultRule?.tier || "Limited-Risk",
    reason: defaultRule?.reason || "This AI system does not fall under explicitly high-risk categories and is classified as limited-risk, requiring transparency obligations.",
    citations: defaultRule?.citations || [],
  };
}
