import "server-only"
import { promises as fs } from "node:fs"
import path from "node:path"
import { randomBytes } from "node:crypto"
import type {
  AnalysisResult,
  Certificate,
  CertificateSummary,
  ClaimedFacts,
} from "@/lib/types/certificate"
import type { ComplianceStandard } from "@/lib/services/analyze-claude"
import { attestationHash } from "@/lib/crypto/hash"

const DATA_DIR = path.join(process.cwd(), "data", "certificates")

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

/**
 * URL-safe 12-char ID. Uses crypto random + base32-ish alphabet
 * (no ambiguous characters: removed 0/O/1/I/l).
 */
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz"
export function newCertificateId(): string {
  const bytes = randomBytes(12)
  let out = ""
  for (let i = 0; i < 12; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return out
}

function certPath(id: string): string {
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error("Invalid certificate id")
  }
  return path.join(DATA_DIR, `${id}.json`)
}

export async function saveCertificate(cert: Certificate): Promise<void> {
  await ensureDir()
  await fs.writeFile(certPath(cert.id), JSON.stringify(cert, null, 2), "utf8")
}

/**
 * High-level helper: generate a fresh id + canonical SHA-256 hash and
 * persist the certificate. Used by both the public POST endpoint and
 * the in-app server action so the canonical payload format and hash
 * algorithm stay in lockstep.
 */
export async function createCertificate(args: {
  issuerName: string
  tokenName: string
  standard: ComplianceStandard
  standardName: string
  contractAddress?: string
  network?: string
  claimedFacts: ClaimedFacts
  contractCode: string
  analysis: AnalysisResult
}): Promise<Certificate> {
  const id = newCertificateId()
  const createdAt = new Date().toISOString()

  const hashPayload = {
    id,
    issuerName: args.issuerName,
    tokenName: args.tokenName,
    standard: args.standard,
    standardName: args.standardName,
    contractAddress: args.contractAddress ?? null,
    network: args.network ?? null,
    claimedFacts: args.claimedFacts ?? {},
    contractCode: args.contractCode,
    analysis: args.analysis,
    createdAt,
  }

  const hash = attestationHash(hashPayload)

  const cert: Certificate = {
    id,
    issuerName: args.issuerName,
    tokenName: args.tokenName,
    standard: args.standard,
    standardName: args.standardName,
    contractAddress: args.contractAddress,
    network: args.network,
    claimedFacts: args.claimedFacts ?? {},
    contractCode: args.contractCode,
    analysis: args.analysis,
    hash,
    createdAt,
  }

  await saveCertificate(cert)
  return cert
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  let filePath: string
  try {
    filePath = certPath(id)
  } catch {
    // Invalid id format -> treat as "not found" so callers can render 404
    return null
  }
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw) as Certificate
  } catch (err) {
    const e = err as NodeJS.ErrnoException
    if (e.code === "ENOENT") return null
    throw err
  }
}

export async function listCertificates(): Promise<CertificateSummary[]> {
  try {
    await ensureDir()
    const files = await fs.readdir(DATA_DIR)
    const summaries: CertificateSummary[] = []
    for (const file of files) {
      if (!file.endsWith(".json")) continue
      try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8")
        const cert = JSON.parse(raw) as Certificate
        summaries.push({
          id: cert.id,
          issuerName: cert.issuerName,
          tokenName: cert.tokenName,
          standardName: cert.standardName,
          overallStatus: cert.analysis.overallStatus,
          score: cert.analysis.score,
          createdAt: cert.createdAt,
        })
      } catch {
        // Skip malformed
      }
    }
    summaries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return summaries
  } catch {
    return []
  }
}
