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
  
  console.log(`[Classification] Input AI use case: "${aiUseCase}"`);
  
  // First try exact match
  let rule = rules.find(r => 
    r.useCase.toLowerCase() === aiUseCase.toLowerCase()
  );

  // If no exact match, try fuzzy matching based on keywords
  if (!rule) {
    const useCaseLower = aiUseCase.toLowerCase();
    console.log(`[Classification] No exact match, trying fuzzy matching for: "${useCaseLower}"`);
    
    // Medical diagnosis patterns
    if (useCaseLower.includes('medical') || 
        useCaseLower.includes('diagnosis') || 
        useCaseLower.includes('disease') ||
        useCaseLower.includes('cancer') ||
        useCaseLower.includes('patient') ||
        useCaseLower.includes('healthcare') ||
        useCaseLower.includes('clinical') ||
        useCaseLower.includes('radiology') ||
        useCaseLower.includes('x-ray') ||
        useCaseLower.includes('mri') ||
        useCaseLower.includes('ct scan')) {
      console.log(`[Classification] Matched medical diagnosis pattern!`);
      rule = rules.find(r => r.useCase === "Medical Diagnosis");
    }
    // Credit scoring patterns
    else if (useCaseLower.includes('credit') || 
             useCaseLower.includes('loan') || 
             useCaseLower.includes('creditworthiness')) {
      rule = rules.find(r => r.useCase === "Credit Scoring");
    }
    // Recruitment patterns
    else if (useCaseLower.includes('recruitment') || 
             useCaseLower.includes('hiring') || 
             useCaseLower.includes('candidate screening')) {
      rule = rules.find(r => r.useCase === "Recruitment Screening");
    }
    // Biometric patterns
    else if (useCaseLower.includes('biometric') || 
             useCaseLower.includes('facial recognition') || 
             useCaseLower.includes('face recognition')) {
      rule = rules.find(r => r.useCase === "Biometric Identification");
    }
    // Predictive policing patterns
    else if (useCaseLower.includes('policing') || 
             useCaseLower.includes('law enforcement') || 
             useCaseLower.includes('crime prediction')) {
      rule = rules.find(r => r.useCase === "Predictive Policing");
    }
  }

  if (rule) {
    console.log(`[Classification] Matched rule "${rule.useCase}" → ${rule.tier}`);
    return {
      tier: rule.tier,
      reason: rule.reason,
      citations: rule.citations,
    };
  }

  console.log(`[Classification] No rule matched, using default → Limited-Risk`);
  const defaultRule = rules.find(r => r.useCase === "Other");
  return {
    tier: defaultRule?.tier || "Limited-Risk",
    reason: defaultRule?.reason || "This AI system does not fall under explicitly high-risk categories and is classified as limited-risk, requiring transparency obligations.",
    citations: defaultRule?.citations || [],
  };
}
