import { createHash } from "node:crypto"

/**
 * Deterministic JSON serialization: keys are sorted at every depth,
 * arrays preserve order, no whitespace. This is the canonical form
 * over which we compute the attestation hash, so that anyone with the
 * same payload will compute the same hash.
 */
export function canonicalize(value: unknown): string {
  // Match JSON.stringify semantics for non-serializable values:
  // - top-level undefined / function / symbol -> "null" (we coerce instead
  //   of returning undefined so the canonical string is always valid JSON)
  // - inside arrays:  undefined -> "null"
  // - inside objects: undefined values are omitted entirely
  if (value === undefined || typeof value === "function" || typeof value === "symbol") {
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

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex")
}

/**
 * Compute the canonical attestation hash for a payload. The hash is
 * SHA-256 of the deterministic JSON serialization, prefixed with
 * "sha256:" for readability.
 */
export function attestationHash(payload: unknown): string {
  return "sha256:" + sha256Hex(canonicalize(payload))
}
