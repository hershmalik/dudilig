import type { AnalysisResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createAnalysis(analysis: Omit<AnalysisResult, "id" | "createdAt">): Promise<AnalysisResult>;
  getAnalysis(id: string): Promise<AnalysisResult | undefined>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, AnalysisResult>;

  constructor() {
    this.analyses = new Map();
  }

  async createAnalysis(analysis: Omit<AnalysisResult, "id" | "createdAt">): Promise<AnalysisResult> {
    const id = randomUUID();
    const result: AnalysisResult = {
      ...analysis,
      id,
      createdAt: new Date().toISOString(),
    };
    this.analyses.set(id, result);
    return result;
  }

  async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
    return this.analyses.get(id);
  }
}

export const storage = new MemStorage();
