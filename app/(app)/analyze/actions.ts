"use server"

import { createCertificate } from "@/lib/storage/certificates"
import { consumeAnalysis } from "@/lib/storage/analysis-cache"
import type { ClaimedFacts } from "@/lib/types/certificate"

const MAX_FIELD_BYTES = 1_000

function tooLong(s: string | undefined, max: number): boolean {
  return typeof s === "string" && Buffer.byteLength(s, "utf8") > max
}

export type SaveCertificateInput = {
  /**
   * Single-use opaque token returned by POST /api/analyze. The server
   * uses this to look up the trusted analysis it produced — the client
   * never gets to choose the analysis content, only reference it.
   */
  analysisToken: string
  issuerName: string
  tokenName: string
  contractAddress?: string
  network?: string
  claimedFacts?: ClaimedFacts
}

export type SaveCertificateResult =
  | { ok: true; id: string; url: string; hash: string }
  | { ok: false; error: string }

export async function saveAnalysisAsCertificate(
  input: SaveCertificateInput
): Promise<SaveCertificateResult> {
  const issuerName = input.issuerName?.trim()
  const tokenName = input.tokenName?.trim()
  const contractAddress = input.contractAddress?.trim() || undefined
  const network = input.network?.trim() || undefined

  if (!issuerName || !tokenName) {
    return { ok: false, error: "Issuer name and token name are required." }
  }

  if (
    tooLong(issuerName, MAX_FIELD_BYTES) ||
    tooLong(tokenName, MAX_FIELD_BYTES) ||
    tooLong(contractAddress, MAX_FIELD_BYTES) ||
    tooLong(network, MAX_FIELD_BYTES)
  ) {
    return { ok: false, error: "One or more text fields exceed the maximum length." }
  }

  // Cap claimedFacts size to stop nested-object abuse.
  if (input.claimedFacts !== undefined && input.claimedFacts !== null) {
    let serialized: string
    try {
      serialized = JSON.stringify(input.claimedFacts)
    } catch {
      return { ok: false, error: "claimedFacts is not serializable." }
    }
    if (Buffer.byteLength(serialized, "utf8") > 4_000) {
      return { ok: false, error: "claimedFacts exceeds the 4,000-byte limit." }
    }
  }

  if (!input.analysisToken) {
    return {
      ok: false,
      error: "Analysis reference missing. Please re-run the analysis and try again.",
    }
  }

  // Look up the server-stored analysis. Returns null if the token is
  // unknown, expired (>30min), already used, or malformed. This is the
  // anti-forgery boundary: the client cannot synthesize a trusted analysis.
  const cached = await consumeAnalysis(input.analysisToken)
  if (!cached) {
    return {
      ok: false,
      error:
        "Analysis expired or already published. Please re-run the analysis and try again.",
    }
  }

  try {
    const cert = await createCertificate({
      issuerName,
      tokenName,
      standard: cached.standard,
      standardName: cached.standardName,
      contractAddress,
      network,
      claimedFacts: input.claimedFacts ?? {},
      contractCode: cached.contractCode,
      analysis: cached.analysis,
    })
    return { ok: true, id: cert.id, url: `/trust/${cert.id}`, hash: cert.hash }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to publish certificate"
    return { ok: false, error: message }
  }
}
