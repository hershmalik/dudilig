/**
 * Browser-safe twin of lib/crypto/hash.ts. Used by the interactive
 * "Verify hash" button on the public certificate page so visitors
 * can independently recompute the attestation hash in their own
 * browser without trusting any Dudilig server-side code.
 *
 * canonicalize() must stay byte-for-byte identical to the server
 * version — any drift breaks verification. Keep these two files in
 * lockstep.
 */

export function canonicalize(value: unknown): string {
  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "symbol"
  ) {
    return "null"
  }
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((v) =>
          v === undefined || typeof v === "function" || typeof v === "symbol"
            ? "null"
            : canonicalize(v)
        )
        .join(",") +
      "]"
    )
  }
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj)
    .filter((k) => {
      const v = obj[k]
      return v !== undefined && typeof v !== "function" && typeof v !== "symbol"
    })
    .sort()
  return (
    "{" +
    keys
      .map((k) => JSON.stringify(k) + ":" + canonicalize(obj[k]))
      .join(",") +
    "}"
  )
}

export async function sha256HexBrowser(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  const view = new Uint8Array(digest)
  let hex = ""
  for (let i = 0; i < view.length; i++) {
    hex += view[i].toString(16).padStart(2, "0")
  }
  return hex
}

/**
 * Reconstruct the exact hashPayload object that the server hashed
 * when minting this certificate. Field order does not matter
 * (canonicalize sorts keys at every depth), but the SHAPE must match
 * the server's hashPayload in lib/storage/certificates.ts:createCertificate.
 */
export interface CertLike {
  id: string
  issuerName: string
  tokenName: string
  standard: string
  standardName: string
  contractAddress?: string | null
  network?: string | null
  claimedFacts?: Record<string, unknown>
  contractCode: string
  analysis: unknown
  createdAt: string
}

export async function recomputeAttestationHash(cert: CertLike): Promise<string> {
  const hashPayload = {
    id: cert.id,
    issuerName: cert.issuerName,
    tokenName: cert.tokenName,
    standard: cert.standard,
    standardName: cert.standardName,
    contractAddress: cert.contractAddress ?? null,
    network: cert.network ?? null,
    claimedFacts: cert.claimedFacts ?? {},
    contractCode: cert.contractCode,
    analysis: cert.analysis,
    createdAt: cert.createdAt,
  }
  const canonical = canonicalize(hashPayload)
  const hex = await sha256HexBrowser(canonical)
  return "sha256:" + hex
}
