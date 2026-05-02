import { AttestationRun } from "@/lib/types"

export const attestationHistory: AttestationRun[] = [
  {
    id: "att-001",
    tokenId: "tok-001",
    tokenName: "Meridian Private Credit Fund I",
    runAt: "2026-04-25T14:32:00Z",
    status: "pass",
    hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    checkedFields: [
      { field: "MAX_INVESTORS", contractValue: "250", claimValue: "250", match: true },
      { field: "TRANSFER_LOCKUP", contractValue: "365 days", claimValue: "12 months", match: true },
      { field: "ACCREDITED_ONLY", contractValue: "true", claimValue: "true", match: true },
      { field: "jurisdictionWhitelist", contractValue: "KY, SG, AE, HK, VG, BVI", claimValue: "Cayman, Singapore, UAE, Hong Kong, BVI", match: true },
      { field: "tokenStandard", contractValue: "ERC-1400", claimValue: "ERC-1400", match: true },
      { field: "network", contractValue: "Polygon (137)", claimValue: "Polygon", match: true },
      { field: "transferRestrictions", contractValue: "enabled", claimValue: "enabled", match: true },
    ],
  },
  {
    id: "att-002",
    tokenId: "tok-001",
    tokenName: "Meridian Private Credit Fund I",
    runAt: "2026-04-11T09:15:00Z",
    status: "pass",
    hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
    checkedFields: [
      { field: "MAX_INVESTORS", contractValue: "250", claimValue: "250", match: true },
      { field: "TRANSFER_LOCKUP", contractValue: "365 days", claimValue: "12 months", match: true },
      { field: "ACCREDITED_ONLY", contractValue: "true", claimValue: "true", match: true },
      { field: "jurisdictionWhitelist", contractValue: "KY, SG, AE, HK, VG, BVI", claimValue: "Cayman, Singapore, UAE, Hong Kong, BVI", match: true },
      { field: "tokenStandard", contractValue: "ERC-1400", claimValue: "ERC-1400", match: true },
      { field: "network", contractValue: "Polygon (137)", claimValue: "Polygon", match: true },
      { field: "transferRestrictions", contractValue: "enabled", claimValue: "enabled", match: true },
    ],
  },
  {
    id: "att-003",
    tokenId: "tok-003",
    tokenName: "Gulf Real Estate Income Trust",
    runAt: "2026-04-20T11:45:00Z",
    status: "fail",
    hash: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
    checkedFields: [
      { field: "MAX_INVESTORS", contractValue: "500", claimValue: "250", match: false },
      { field: "TRANSFER_LOCKUP", contractValue: "1095 days", claimValue: "36 months", match: true },
      { field: "ACCREDITED_ONLY", contractValue: "false", claimValue: "false", match: true },
      { field: "jurisdictionWhitelist", contractValue: "AE, KY, BVI", claimValue: "ADGM, Cayman, BVI", match: true },
      { field: "tokenStandard", contractValue: "ERC-1400", claimValue: "ERC-1400", match: true },
      { field: "network", contractValue: "Polygon (137)", claimValue: "Polygon", match: true },
      { field: "transferRestrictions", contractValue: "enabled", claimValue: "enabled", match: true },
    ],
  },
  {
    id: "att-004",
    tokenId: "tok-001",
    tokenName: "Meridian Private Credit Fund I",
    runAt: "2026-03-28T16:00:00Z",
    status: "pass",
    hash: "d4e5f6789012345678901234567890abcdef1234567890abcdef123456789",
    checkedFields: [
      { field: "MAX_INVESTORS", contractValue: "250", claimValue: "250", match: true },
      { field: "TRANSFER_LOCKUP", contractValue: "365 days", claimValue: "12 months", match: true },
      { field: "ACCREDITED_ONLY", contractValue: "true", claimValue: "true", match: true },
      { field: "jurisdictionWhitelist", contractValue: "KY, SG, AE, HK, VG, BVI", claimValue: "Cayman, Singapore, UAE, Hong Kong, BVI", match: true },
      { field: "tokenStandard", contractValue: "ERC-1400", claimValue: "ERC-1400", match: true },
      { field: "network", contractValue: "Polygon (137)", claimValue: "Polygon", match: true },
      { field: "transferRestrictions", contractValue: "enabled", claimValue: "enabled", match: true },
    ],
  },
]

export const complianceClaim = {
  maxInvestors: 250,
  jurisdiction: "Cayman Islands",
  accreditedOnly: true,
  transferLockup: "12 months",
  standard: "ERC-1400",
  network: "Polygon",
  transferRestrictions: "Enabled",
}

export const attestationSteps = [
  { label: "Fetching contract bytecode from Polygon", duration: 600 },
  { label: "Parsing transfer restriction logic", duration: 800 },
  { label: "Comparing investor cap against offering documents", duration: 700 },
  { label: "Verifying jurisdiction whitelist mapping", duration: 500 },
  { label: "Checking accreditation enforcement logic", duration: 600 },
  { label: "Validating lock-up period encoding", duration: 400 },
  { label: "Generating cryptographic attestation hash", duration: 900 },
]

export const attestationFailSteps = [
  { label: "Fetching contract bytecode from Polygon", duration: 600 },
  { label: "Parsing transfer restriction logic", duration: 800 },
  {
    label: "Comparing investor cap against offering documents",
    duration: 700,
    failMessage: "MISMATCH: Contract MAX_INVESTORS = 500, Claim = 250",
  },
]
