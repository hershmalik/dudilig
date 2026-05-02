import { randomBytes } from "node:crypto"
import type { AnalysisResult } from "@/lib/types/certificate"
import type { ComplianceStandard } from "@/lib/services/analyze-claude"

/**
 * Server-side cache of analysis runs, keyed by a single-use opaque token.
 *
 * Why this exists:
 * The /analyze page lets a user generate an analysis (real Claude call)
 * and then optionally publish it as a public Trust Certificate. We must
 * NOT trust the client to send back the analysis it received — a malicious
 * user could open devtools, mutate the analysis to a forged "PASS", and
 * submit, producing a Dudilig-signed certificate that lies about the
 * contract.
 *
 * Instead, /api/analyze stores the {analysis, standard, contractCode}
 * server-side and hands the client an opaque token. The publish server
 * action accepts only the token + presentation fields (issuer, token name,
 * etc.) and reads the trusted analysis from this cache.
 *
 * Single-use + TTL prevent token replay and unbounded growth. In-memory
 * is fine for the sprint (single-instance Render); a horizontally-scaled
 * deploy would need Redis or similar.
 */

interface CacheEntry {
  analysis: AnalysisResult
  standard: ComplianceStandard
  standardName: string
  contractCode: string
  expiresAt: number
}

const TTL_MS = 30 * 60 * 1000 // 30 minutes
const MAX_ENTRIES = 500 // hard cap on memory growth

const cache = new Map<string, CacheEntry>()

function pruneExpired() {
  const now = Date.now()
  for (const [token, entry] of cache.entries()) {
    if (entry.expiresAt < now) cache.delete(token)
  }
  // If still over cap, drop oldest by insertion order.
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value
    if (oldest === undefined) break
    cache.delete(oldest)
  }
}

export function storeAnalysis(input: {
  analysis: AnalysisResult
  standard: ComplianceStandard
  standardName: string
  contractCode: string
}): string {
  pruneExpired()
  const token = randomBytes(24).toString("hex")
  cache.set(token, {
    ...input,
    expiresAt: Date.now() + TTL_MS,
  })
  return token
}

/**
 * Look up a token, return its entry, and delete it (single-use).
 * Returns null if the token is unknown, expired, or malformed.
 */
export function consumeAnalysis(token: string): CacheEntry | null {
  if (typeof token !== "string" || !/^[a-f0-9]{48}$/.test(token)) return null
  const entry = cache.get(token)
  if (!entry) return null
  cache.delete(token)
  if (entry.expiresAt < Date.now()) return null
  return entry
}
