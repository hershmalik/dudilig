import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import type { ComplianceGap } from "@shared/schema";

interface GapTemplate {
  id: string;
  title: string;
  action: string;
  citation: {
    id: string;
    text: string;
    url: string;
    article: string;
  };
  confidence: "High" | "Medium" | "Low";
}

interface GapsData {
  gaps: {
    "High-Risk": GapTemplate[];
    "Limited-Risk": GapTemplate[];
    "Minimal-Risk": GapTemplate[];
  };
}

let gapsCache: GapsData | null = null;

function loadGaps(): GapsData {
  if (gapsCache) return gapsCache;

  const gapsPath = path.join(process.cwd(), "server/data/compliance-gaps.yaml");
  const gapsContent = fs.readFileSync(gapsPath, "utf8");
  const gapsData = yaml.load(gapsContent) as GapsData;
  
  gapsCache = gapsData;
  return gapsCache;
}

function assignStatus(index: number, total: number): "red" | "yellow" | "green" {
  if (index === 0) return "red";
  if (index === 1) return "yellow";
  if (index === 2) return "green";
  return index % 3 === 0 ? "red" : index % 3 === 1 ? "yellow" : "green";
}

export function analyzeComplianceGaps(tier: string): ComplianceGap[] {
  const gapsData = loadGaps();
  
  let tierKey: keyof GapsData["gaps"];
  if (tier === "High-Risk") {
    tierKey = "High-Risk";
  } else if (tier === "Minimal-Risk") {
    tierKey = "Minimal-Risk";
  } else {
    tierKey = "Limited-Risk";
  }

  const templates = gapsData.gaps[tierKey] || gapsData.gaps["Limited-Risk"];
  
  const selectedGaps = templates.slice(0, 5);
  
  return selectedGaps.map((template, index) => ({
    id: template.id,
    title: template.title,
    status: assignStatus(index, selectedGaps.length),
    action: template.action,
    citation: {
      id: template.citation.id,
      text: template.citation.text,
      url: template.citation.url,
      article: template.citation.article,
    },
    confidence: template.confidence,
  }));
}
