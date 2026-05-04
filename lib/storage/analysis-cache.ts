import { promises as fs } from "node:fs"
import path from "node:path"
import { randomBytes } from "node:crypto"
import type { AnalysisResult } from "@/lib/types/certificate"
import type { ComplianceStandard } from "@/lib/services/analyze-claude"

/**
 * Server-side store of analysis runs, keyed by a single-use opaque token.
 *
 * Why this exists:
 * The /analyze page lets a user generate an analysis (real Claude call)
 * and then optionally publish it as a public Trust Certificate. We must
 * NOT trust the client to send back the analysis it received — a malicious
 * user could open devtools, mutate the analysis to a forged "PASS", and
 * submit, producing a Dudilig-signed certificate that lies about the
 * contract.
 *
 * Instead, /api/analyze writes the {analysis, standard, contractCode}
 * to disk under data/analysis-tokens/{token}.json and hands the client an
 * opaque token. The publish server action accepts only the token + form
 * fields and reads the trusted analysis from disk.
 *
 * Why disk and not in-memory:
 * Next.js bundles the API route handler and the Server Action into
 * separate JavaScript chunks. Each chunk gets its own copy of any
 * module-level state, so an in-memory Map ends up empty when the
 * Server Action looks up the token written by the API route.
 * Disk is the simplest store both chunks can share. It also survives
 * cold-start spin-ups on most hosting platforms.
 */

const TOKEN_DIR = path.join(process.cwd(), "data", "analysis-tokens")
const TTL_MS = 30 * 60 * 1000 // 30 minutes
const MAX_ENTRIES = 500
const TOKEN_RE = /^[a-f0-9]{48}$/

interface StoredEntry {
  analysis: AnalysisResult
  standard: ComplianceStandard
  standardName: string
  contractCode: string
  expiresAt: number
}

export interface ConsumedEntry {
  analysis: AnalysisResult
  standard: ComplianceStandard
  standardName: string
  contractCode: string
}

async function ensureDir() {
  await fs.mkdir(TOKEN_DIR, { recursive: true })
}

function tokenPath(token: string): string {
  return path.join(TOKEN_DIR, `${token}.json`)
}

/**
 * Best-effort cleanup. Deletes any token files past their TTL, and if
 * we're over MAX_ENTRIES drops the oldest by mtime. Failures are
 * swallowed — pruning is housekeeping, not load-bearing.
 */
async function prune(): Promise<void> {
  let names: string[]
  try {
    names = await fs.readdir(TOKEN_DIR)
  } catch {
    return
  }
  const now = Date.now()
  const survivors: { name: string; mtimeMs: number }[] = []

  await Promise.all(
    names.map(async (name) => {
      const full = path.join(TOKEN_DIR, name)
      // Sweep stale claim files (>5min old) from crashed consumers.
      if (name.includes(".claim-")) {
        try {
          const st = await fs.stat(full)
          if (now - st.mtimeMs > 5 * 60 * 1000) {
            await fs.unlink(full).catch(() => {})
          }
        } catch {
          /* ignore */
        }
        return
      }
      if (!name.endsWith(".json")) return
      const token = name.slice(0, -5)
      if (!TOKEN_RE.test(token)) return
      try {
        const raw = await fs.readFile(full, "utf8")
        const entry = JSON.parse(raw) as StoredEntry
        if (typeof entry.expiresAt !== "number" || entry.expiresAt < now) {
          await fs.unlink(full).catch(() => {})
          return
        }
        const stat = await fs.stat(full)
        survivors.push({ name, mtimeMs: stat.mtimeMs })
      } catch {
        // Corrupted file: drop it.
        await fs.unlink(full).catch(() => {})
      }
    })
  )

  if (survivors.length > MAX_ENTRIES) {
    survivors.sort((a, b) => a.mtimeMs - b.mtimeMs)
    const excess = survivors.length - MAX_ENTRIES
    await Promise.all(
      survivors.slice(0, excess).map((s) =>
        fs.unlink(path.join(TOKEN_DIR, s.name)).catch(() => {})
      )
    )
  }
}

export async function storeAnalysis(input: {
  analysis: AnalysisResult
  standard: ComplianceStandard
  standardName: string
  contractCode: string
}): Promise<string> {
  await ensureDir()
  const token = randomBytes(24).toString("hex")
  const entry: StoredEntry = {
    ...input,
    expiresAt: Date.now() + TTL_MS,
  }
  await fs.writeFile(tokenPath(token), JSON.stringify(entry), "utf8")
  // Fire-and-forget housekeeping.
  prune().catch(() => {})
  return token
}

/**
 * Look up a token, return its entry, and delete it (single-use).
 * Returns null if the token is unknown, expired, or malformed.
 *
 * Single-use is enforced via atomic rename: we rename the token file
 * to a unique `.claim-{nonce}` name BEFORE reading. POSIX `rename` is
 * atomic, so under concurrent consume requests for the same token,
 * exactly one rename succeeds; the others get ENOENT and return null.
 * Only the winning claimant reads + unlinks the renamed file.
 */
export async function consumeAnalysis(
  token: string
): Promise<ConsumedEntry | null> {
  if (typeof token !== "string" || !TOKEN_RE.test(token)) return null
  const source = tokenPath(token)
  const claim = `${source}.claim-${randomBytes(8).toString("hex")}`

  try {
    await fs.rename(source, claim)
  } catch {
    // ENOENT (already consumed, never existed, or lost the race) → null.
    return null
  }

  let raw: string
  try {
    raw = await fs.readFile(claim, "utf8")
  } catch {
    return null
  } finally {
    // We own this claim file; clean it up regardless of parse outcome.
    await fs.unlink(claim).catch(() => {})
  }

  let entry: StoredEntry
  try {
    entry = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof entry.expiresAt !== "number" || entry.expiresAt < Date.now()) {
    return null
  }
  return {
    analysis: entry.analysis,
    standard: entry.standard,
    standardName: entry.standardName,
    contractCode: entry.contractCode,
  }
}
