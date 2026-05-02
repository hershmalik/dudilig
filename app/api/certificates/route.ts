import { NextRequest, NextResponse } from "next/server"
import {
  analyzeContract,
  STANDARD_RULES,
  type ComplianceStandard,
} from "@/lib/services/analyze-claude"
import {
  newCertificateId,
  saveCertificate,
  listCertificates,
} from "@/lib/storage/certificates"
import { attestationHash } from "@/lib/crypto/hash"
import type { Certificate, CertificateInput } from "@/lib/types/certificate"

export async function GET() {
  const summaries = await listCertificates()
  return NextResponse.json({ certificates: summaries })
}

// Hard caps to keep this open endpoint from being weaponized into a
// Claude / disk-fill amplifier. Tuned generously for real Solidity contracts.
const MAX_CONTRACT_BYTES = 60_000
const MAX_FIELD_BYTES = 1_000

function tooLong(s: string | undefined, max: number): boolean {
  return typeof s === "string" && Buffer.byteLength(s, "utf8") > max
}

export async function POST(req: NextRequest) {
  // Optional shared-secret gate. When CERT_API_TOKEN is set in the
  // environment (production), require a matching X-Cert-Token header.
  // When unset (local dev) the endpoint is open so the seeder works
  // without extra config.
  const requiredToken = process.env.CERT_API_TOKEN
  if (requiredToken) {
    const provided = req.headers.get("x-cert-token")
    if (provided !== requiredToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Cap raw body size before parsing.
  const lengthHeader = req.headers.get("content-length")
  if (lengthHeader && parseInt(lengthHeader, 10) > 100_000) {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 413 }
    )
  }

  let body: Partial<CertificateInput>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const {
    issuerName,
    tokenName,
    standard,
    contractAddress,
    network,
    claimedFacts,
    contractCode,
  } = body

  if (!issuerName || !tokenName || !standard || !contractCode) {
    return NextResponse.json(
      {
        error:
          "Missing required field. Required: issuerName, tokenName, standard, contractCode.",
      },
      { status: 400 }
    )
  }

  if (!(standard in STANDARD_RULES)) {
    return NextResponse.json(
      { error: `Unknown standard: ${standard}` },
      { status: 400 }
    )
  }

  if (
    tooLong(issuerName, MAX_FIELD_BYTES) ||
    tooLong(tokenName, MAX_FIELD_BYTES) ||
    tooLong(contractAddress, MAX_FIELD_BYTES) ||
    tooLong(network, MAX_FIELD_BYTES)
  ) {
    return NextResponse.json(
      { error: "One or more text fields exceed maximum length" },
      { status: 400 }
    )
  }

  if (tooLong(contractCode, MAX_CONTRACT_BYTES)) {
    return NextResponse.json(
      { error: `contractCode exceeds ${MAX_CONTRACT_BYTES} bytes` },
      { status: 413 }
    )
  }

  let analysis, standardName
  try {
    const result = await analyzeContract({
      code: contractCode,
      standard: standard as ComplianceStandard,
    })
    analysis = result.analysis
    standardName = result.standardName
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const id = newCertificateId()
  const createdAt = new Date().toISOString()

  // Canonical payload that the hash covers. Deterministic — anyone
  // can re-derive the same hash from the same inputs + outputs.
  const hashPayload = {
    id,
    issuerName,
    tokenName,
    standard,
    standardName,
    contractAddress: contractAddress ?? null,
    network: network ?? null,
    claimedFacts: claimedFacts ?? {},
    contractCode,
    analysis,
    createdAt,
  }

  const hash = attestationHash(hashPayload)

  const certificate: Certificate = {
    id,
    issuerName,
    tokenName,
    standard: standard as ComplianceStandard,
    standardName,
    contractAddress,
    network,
    claimedFacts: claimedFacts ?? {},
    contractCode,
    analysis,
    hash,
    createdAt,
  }

  await saveCertificate(certificate)

  return NextResponse.json({
    id,
    hash,
    url: `/trust/${id}`,
    overallStatus: analysis.overallStatus,
    score: analysis.score,
  })
}
