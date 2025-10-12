import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Analysis result schema
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  sector: text("sector").notNull(),
  geography: text("geography").notNull(),
  aiUseCase: text("ai_use_case").notNull(),
  tier: text("tier").notNull(),
  tierReason: text("tier_reason").notNull(),
  citations: jsonb("citations").$type<Citation[]>().notNull(),
  gaps: jsonb("gaps").$type<ComplianceGap[]>().notNull(),
  scenario: jsonb("scenario").$type<Scenario>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TypeScript types for the application
export interface Citation {
  id: string;
  text: string;
  url: string;
  article?: string;
}

export interface ComplianceGap {
  id: string;
  title: string;
  status: "red" | "yellow" | "green";
  action: string;
  citation: Citation;
  confidence: "High" | "Medium" | "Low";
}

export interface Scenario {
  name: string;
  description: string;
  costRange: {
    min: number;
    max: number;
  };
  timelineRange: {
    min: number;
    max: number;
  };
  dealTerms: DealTerm[];
  confidence: "High" | "Medium" | "Low";
}

export interface DealTerm {
  id: string;
  type: "reserve" | "milestone" | "valuation";
  description: string;
  impact: string;
}

export interface ExtractedData {
  companyName: string;
  sector: string;
  geography: string;
  aiUseCase: string;
  productClaims: string[];
}

export interface AnalysisResult {
  id: string;
  companyName: string;
  sector: string;
  geography: string;
  aiUseCase: string;
  tier: string;
  tierReason: string;
  citations: Citation[];
  gaps: ComplianceGap[];
  scenario: Scenario;
  createdAt: string;
}

// Zod schemas for validation
export const extractedDataSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  geography: z.string().min(1, "Geography is required"),
  aiUseCase: z.string().min(1, "AI use case is required"),
  productClaims: z.array(z.string()).optional().default([]),
});

export const citationSchema = z.object({
  id: z.string(),
  text: z.string(),
  url: z.string().url(),
  article: z.string().optional(),
});

export const complianceGapSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["red", "yellow", "green"]),
  action: z.string(),
  citation: citationSchema,
  confidence: z.enum(["High", "Medium", "Low"]),
});

export const dealTermSchema = z.object({
  id: z.string(),
  type: z.enum(["reserve", "milestone", "valuation"]),
  description: z.string(),
  impact: z.string(),
});

export const scenarioSchema = z.object({
  name: z.string(),
  description: z.string(),
  costRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  timelineRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  dealTerms: z.array(dealTermSchema),
  confidence: z.enum(["High", "Medium", "Low"]),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Manual upload form schema
export const manualInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  geography: z.string().min(1, "Geography is required"),
  aiUseCase: z.string().min(1, "AI use case is required"),
  productDescription: z.string().optional(),
});

export type ManualInput = z.infer<typeof manualInputSchema>;
