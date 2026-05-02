export type KycStatus = "verified" | "pending" | "flagged" | "expired"
export type AmlRisk = "low" | "medium" | "high"
export type AccreditationStatus = "verified" | "pending" | "expired"
export type FilingStatus = "not_started" | "in_progress" | "submitted" | "overdue"
export type AttestationStatus = "verified" | "pending" | "failed"
export type TokenStandard = "ERC-1400" | "ERC-3643"
export type Network = "Polygon" | "Ethereum"

export interface Investor {
  id: string
  name: string
  entity: "Individual" | "Institutional"
  jurisdiction: string
  kycStatus: KycStatus
  amlRiskScore: AmlRisk
  accreditation: AccreditationStatus
  sanctionsLastRun: string
  totalInvested: number
  onboardedAt: string
  flagReason?: string
}

export interface Token {
  id: string
  name: string
  type: "private-credit" | "pre-ipo-equity" | "real-estate"
  totalRaise: number
  jurisdiction: string
  standard: TokenStandard
  network: Network
  contractAddress: string
  deploymentBlock: number
  maxInvestors: number
  currentInvestors: number
  transferLockupMonths: number
  accreditedOnly: boolean
  complianceScore: number
  attestationStatus: AttestationStatus
  lastAttested: string
}

export interface AttestationRun {
  id: string
  tokenId: string
  tokenName: string
  runAt: string
  status: "pass" | "fail"
  hash: string
  checkedFields: {
    field: string
    contractValue: string
    claimValue: string
    match: boolean
  }[]
}

export interface Filing {
  id: string
  jurisdiction: string
  filingType: string
  dueDate: string
  status: FilingStatus
  description: string
  documents: string[]
}

export interface ActivityEvent {
  id: string
  type: "kyc" | "attestation" | "filing" | "investor" | "aml"
  message: string
  timestamp: string
  severity: "info" | "warning" | "success" | "error"
}
