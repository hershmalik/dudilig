import type { ComplianceStandard } from "@/lib/services/analyze-claude"

export type CertificateStatus = "pass" | "warning" | "fail"

export interface AnalysisRuleResult {
  rule: string
  status: "pass" | "fail" | "warning" | "na"
  finding: string
  line: string | null
}

export interface AnalysisResult {
  summary: string
  overallStatus: CertificateStatus
  score: number
  results: AnalysisRuleResult[]
  criticalIssues: string[]
  recommendations: string[]
}

export interface ClaimedFacts {
  maxInvestors?: number
  transferLockupMonths?: number
  accreditedOnly?: boolean
  jurisdictionWhitelist?: string[]
  custom?: Record<string, string | number | boolean>
}

export interface CertificateInput {
  issuerName: string
  tokenName: string
  standard: ComplianceStandard
  contractAddress?: string
  network?: string
  claimedFacts: ClaimedFacts
  contractCode: string
}

export interface Certificate extends CertificateInput {
  id: string
  standardName: string
  analysis: AnalysisResult
  hash: string
  createdAt: string
}

export interface CertificateSummary {
  id: string
  issuerName: string
  tokenName: string
  standardName: string
  overallStatus: CertificateStatus
  score: number
  createdAt: string
}
