import { ActivityEvent } from "@/lib/types"

export const activityEvents: ActivityEvent[] = [
  {
    id: "act-001",
    type: "kyc",
    message: "Investor Kwame Asante flagged — PEP match detected",
    timestamp: "2026-04-28T11:42:00Z",
    severity: "error",
  },
  {
    id: "act-002",
    type: "attestation",
    message: "Smart contract attestation passed — Meridian Private Credit Fund I",
    timestamp: "2026-04-25T14:32:00Z",
    severity: "success",
  },
  {
    id: "act-003",
    type: "filing",
    message: "CIMA AML Annual Review submitted successfully",
    timestamp: "2026-04-24T16:15:00Z",
    severity: "success",
  },
  {
    id: "act-004",
    type: "aml",
    message: "AML screening batch completed — 15 investors rescreened",
    timestamp: "2026-04-25T09:00:00Z",
    severity: "info",
  },
  {
    id: "act-005",
    type: "investor",
    message: "New investor onboarded: Apex Capital Management (Singapore)",
    timestamp: "2026-04-23T13:20:00Z",
    severity: "success",
  },
  {
    id: "act-006",
    type: "filing",
    message: "SEC Form D renewal overdue — immediate action required",
    timestamp: "2026-04-22T08:00:00Z",
    severity: "error",
  },
  {
    id: "act-007",
    type: "attestation",
    message: "Attestation FAILED — Gulf Real Estate Income Trust: MAX_INVESTORS mismatch",
    timestamp: "2026-04-20T11:45:00Z",
    severity: "error",
  },
  {
    id: "act-008",
    type: "kyc",
    message: "Investor Aiko Yamamoto flagged — unusual wire transfer pattern",
    timestamp: "2026-04-19T15:30:00Z",
    severity: "warning",
  },
  {
    id: "act-009",
    type: "investor",
    message: "KYC documents received for Ibrahim Al-Rashid — review pending",
    timestamp: "2026-04-22T10:05:00Z",
    severity: "info",
  },
  {
    id: "act-010",
    type: "aml",
    message: "Sanctions watchlist updated — OFAC SDN list April 2026",
    timestamp: "2026-04-15T07:00:00Z",
    severity: "info",
  },
]
