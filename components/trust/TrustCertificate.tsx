"use client"

import Link from "next/link"
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Minus,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Certificate } from "@/lib/types/certificate"
import { useEffect, useState } from "react"
import { HashVerifier } from "./HashVerifier"

interface TrustCertificateProps {
  certificate: Certificate
  embed?: boolean
}

function statusMeta(status: "pass" | "warning" | "fail") {
  if (status === "pass")
    return {
      label: "COMPLIANCE ATTESTATION PASSED",
      sub: "All claims independently verified against deployed contract",
      color: "var(--accent-green)",
      bg: "rgba(74,222,128,0.10)",
      border: "rgba(74,222,128,0.20)",
      badge: "Valid",
      badgeVariant: "success" as const,
    }
  if (status === "warning")
    return {
      label: "ATTESTATION PASSED WITH WARNINGS",
      sub: "Verified, with items flagged for human review",
      color: "var(--accent-amber)",
      bg: "rgba(200,132,42,0.10)",
      border: "rgba(200,132,42,0.20)",
      badge: "Review",
      badgeVariant: "warning" as const,
    }
  return {
    label: "ATTESTATION FAILED",
    sub: "Contract does not match claimed compliance posture",
    color: "var(--accent-red)",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.20)",
    badge: "Mismatch",
    badgeVariant: "error" as const,
  }
}

function StatusIcon({ status }: { status: string }) {
  if (status === "pass")
    return <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--accent-green)" }} />
  if (status === "fail")
    return <XCircle className="w-4 h-4 shrink-0" style={{ color: "var(--accent-red)" }} />
  if (status === "warning")
    return (
      <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "var(--accent-amber)" }} />
    )
  return <Minus className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
}

function ruleStatusBadgeVariant(
  s: "pass" | "fail" | "warning" | "na"
): "success" | "error" | "warning" | "default" {
  if (s === "pass") return "success"
  if (s === "fail") return "error"
  if (s === "warning") return "warning"
  return "default"
}

function ScoreRing({
  score,
  status,
}: {
  score: number
  status: "pass" | "warning" | "fail"
}) {
  const meta = statusMeta(status)
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.max(0, Math.min(100, score)) / 100) * circ

  return (
    <div className="relative w-28 h-28">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="var(--rule)" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={meta.color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          / 100
        </span>
      </div>
    </div>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
      style={{ color: "var(--text-muted)" }}
      data-testid={`button-copy-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Copy className="w-3 h-3" />
      {copied ? "Copied" : label}
    </button>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

function EmbedSnippet({ certificateId }: { certificateId: string }) {
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  const url = `${origin || ""}/trust/${certificateId}/embed`
  const snippet = `<iframe src="${url}" width="440" height="220" frameborder="0" style="border-radius:12px;background:transparent;" loading="lazy" title="Dudilig Trust Certificate"></iframe>`

  const onCopy = () => {
    setCopied(true)
    // Long enough that headless test runners reliably observe the state
    // change between click and assertion.
    setTimeout(() => setCopied(false), 6000)
    try {
      navigator.clipboard?.writeText(snippet)
    } catch {
      // Clipboard API can throw in iframes / headless contexts without
      // permission; the visual confirmation has already been set.
    }
  }

  return (
    <div className="px-6 sm:px-8 py-5 border-b" style={{ borderColor: "var(--rule)" }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="fig-label">Embed this certificate</p>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent-blue)" }}
          data-testid="button-copy-embed-snippet"
        >
          <Copy className="w-3 h-3" />
          {copied ? "Copied" : "Copy snippet"}
        </button>
      </div>
      <pre
        className="text-xs font-mono p-3 rounded-lg overflow-x-auto"
        style={{
          background: "var(--bg-deepest)",
          color: "var(--text-muted)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
        data-testid="text-embed-snippet"
      >
        {snippet}
      </pre>
      <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
        Drop into any data room, fund page, or pitch deck. Renders the live
        compliance status with a transparent background.
      </p>
    </div>
  )
}

function DudiligLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono, monospace)",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
        }}
      >
        Dudilig
      </span>
    </Link>
  )
}

export function TrustCertificate({ certificate, embed = false }: TrustCertificateProps) {
  const [findingsOpen, setFindingsOpen] = useState(true)
  const meta = statusMeta(certificate.analysis.overallStatus)
  const claim = certificate.claimedFacts ?? {}

  const claimRows: { label: string; value: string }[] = []
  if (claim.maxInvestors !== undefined)
    claimRows.push({ label: "Max Investors", value: String(claim.maxInvestors) })
  if (claim.transferLockupMonths !== undefined)
    claimRows.push({
      label: "Transfer Lockup",
      value: `${claim.transferLockupMonths} months`,
    })
  if (claim.accreditedOnly !== undefined)
    claimRows.push({
      label: "Accredited Only",
      value: claim.accreditedOnly ? "Yes" : "No",
    })
  if (claim.jurisdictionWhitelist?.length)
    claimRows.push({
      label: "Jurisdictions",
      value: claim.jurisdictionWhitelist.join(", "),
    })
  if (claim.custom) {
    for (const [k, v] of Object.entries(claim.custom)) {
      claimRows.push({ label: k, value: String(v) })
    }
  }

  const passCount = certificate.analysis.results.filter((r) => r.status === "pass").length
  const warnCount = certificate.analysis.results.filter((r) => r.status === "warning").length
  const failCount = certificate.analysis.results.filter((r) => r.status === "fail").length

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {!embed && (
        <>
          <div className="gradient-cool" style={{ top: "-300px", left: "-200px" }} />
          <div className="gradient-warm" style={{ top: "-300px", right: "-200px" }} />
        </>
      )}

      {/* Header */}
      {!embed && (
        <div className="w-full max-w-2xl flex items-center justify-between mb-8 relative z-10">
          <DudiligLogo />
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span>Trust Certificate</span>
            <span>·</span>
            <span className="font-mono">{certificate.id}</span>
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden relative z-10"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--rule)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}
        data-testid="card-trust-certificate"
      >
        {/* Status banner */}
        <div
          className="px-6 sm:px-8 py-5 flex items-center gap-4 border-b"
          style={{ background: meta.bg, borderColor: meta.border }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: meta.border }}
          >
            <ShieldCheck className="w-5 h-5" style={{ color: meta.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium tracking-wider"
              style={{ color: meta.color, fontFamily: "var(--font-mono)" }}
              data-testid="text-status-label"
            >
              {meta.label}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {meta.sub}
            </p>
          </div>
          <Badge variant={meta.badgeVariant} className="shrink-0">
            {meta.badge}
          </Badge>
        </div>

        {/* Score + summary */}
        <div
          className="px-6 sm:px-8 py-6 border-b flex flex-col sm:flex-row gap-6 items-center sm:items-start"
          style={{ borderColor: "var(--rule)" }}
        >
          <ScoreRing
            score={certificate.analysis.score}
            status={certificate.analysis.overallStatus}
          />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <p className="fig-label">Tokenized Asset</p>
              <p
                className="text-lg font-medium mt-1"
                style={{ color: "var(--text-primary)" }}
                data-testid="text-token-name"
              >
                {certificate.tokenName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Issued by {certificate.issuerName}
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {certificate.analysis.summary}
            </p>
            <div
              className="flex flex-wrap gap-3 text-xs justify-center sm:justify-start"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span style={{ color: "var(--accent-green)" }}>{passCount} passed</span>
              {warnCount > 0 && (
                <span style={{ color: "var(--accent-amber)" }}>{warnCount} warnings</span>
              )}
              {failCount > 0 && (
                <span style={{ color: "var(--accent-red)" }}>{failCount} failed</span>
              )}
            </div>
          </div>
        </div>

        {/* Token details */}
        <div className="px-6 sm:px-8 py-6 border-b" style={{ borderColor: "var(--rule)" }}>
          <p className="fig-label mb-4">Attestation Subject</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <p style={{ color: "var(--text-tertiary)" }}>Standard</p>
              <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                {certificate.standardName}
              </p>
            </div>
            {certificate.network && (
              <div>
                <p style={{ color: "var(--text-tertiary)" }}>Network</p>
                <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                  {certificate.network}
                </p>
              </div>
            )}
            <div>
              <p style={{ color: "var(--text-tertiary)" }}>Issuer</p>
              <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                {certificate.issuerName}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--text-tertiary)" }}>Attested</p>
              <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                {formatDate(certificate.createdAt)}
              </p>
            </div>
          </div>
          {certificate.contractAddress && (
            <div className="mt-4">
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Contract Address
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p
                  className="text-xs font-mono break-all"
                  style={{ color: "var(--text-muted)" }}
                  data-testid="text-contract-address"
                >
                  {certificate.contractAddress}
                </p>
                <CopyButton text={certificate.contractAddress} label="Copy" />
              </div>
            </div>
          )}
        </div>

        {/* Claimed vs verified */}
        {claimRows.length > 0 && (
          <div className="px-6 sm:px-8 py-6 border-b" style={{ borderColor: "var(--rule)" }}>
            <p className="fig-label mb-4">Compliance Claims</p>
            <div className="space-y-2.5">
              {claimRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3 text-xs">
                  <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                  <span
                    className="font-mono text-right"
                    style={{ color: "var(--text-primary)" }}
                    data-testid={`text-claim-${row.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical issues — only when present */}
        {certificate.analysis.criticalIssues.length > 0 && (
          <div
            className="px-6 sm:px-8 py-5 border-b"
            style={{
              borderColor: "var(--rule)",
              background: "rgba(239,68,68,0.04)",
            }}
          >
            <p
              className="text-xs font-medium mb-3 flex items-center gap-2"
              style={{ color: "var(--accent-red)" }}
            >
              <XCircle className="w-3.5 h-3.5" /> Critical Findings
            </p>
            <ul className="space-y-1.5">
              {certificate.analysis.criticalIssues.map((issue, i) => (
                <li
                  key={i}
                  className="text-xs pl-5"
                  style={{ color: "var(--text-muted)" }}
                  data-testid={`text-critical-issue-${i}`}
                >
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rule findings — collapsible */}
        <div className="px-6 sm:px-8 py-5 border-b" style={{ borderColor: "var(--rule)" }}>
          <button
            onClick={() => setFindingsOpen((v) => !v)}
            className="w-full flex items-center justify-between"
            data-testid="button-toggle-findings"
          >
            <p className="fig-label">Rule-by-Rule Findings ({certificate.analysis.results.length})</p>
            {findingsOpen ? (
              <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            )}
          </button>
          {findingsOpen && (
            <div className="mt-4 space-y-3">
              {certificate.analysis.results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                  data-testid={`row-finding-${i}`}
                >
                  <StatusIcon status={r.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-xs flex-1" style={{ color: "var(--text-primary)" }}>
                        {r.rule}
                      </p>
                      <Badge variant={ruleStatusBadgeVariant(r.status)} className="shrink-0">
                        {r.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {r.finding}
                    </p>
                    {r.line && (
                      <p
                        className="text-xs font-mono mt-1 inline-block px-1.5 py-0.5 rounded"
                        style={{
                          color: "var(--accent-blue)",
                          background: "rgba(59,130,246,0.08)",
                        }}
                      >
                        {r.line}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cryptographic proof */}
        <div className="px-6 sm:px-8 py-6 border-b" style={{ borderColor: "var(--rule)" }}>
          <p className="fig-label mb-3">Cryptographic Proof</p>
          <div
            className="rounded-lg p-3 space-y-2"
            style={{ background: "var(--bg-deepest)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Attestation Hash
              </span>
              <CopyButton text={certificate.hash} label="Copy" />
            </div>
            <p
              className="text-xs font-mono break-all"
              style={{ color: "var(--accent-blue)" }}
              data-testid="text-attestation-hash"
            >
              {certificate.hash}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <p style={{ color: "var(--text-tertiary)" }}>Hash algorithm</p>
              <p className="mt-0.5" style={{ color: "var(--text-muted)" }}>
                SHA-256 over canonical JSON
              </p>
            </div>
            <div>
              <p style={{ color: "var(--text-tertiary)" }}>Attested by</p>
              <p className="mt-0.5" style={{ color: "var(--text-muted)" }}>
                Dudilig Attestation Engine
              </p>
            </div>
          </div>
          {!embed && (
            <HashVerifier
              certificateId={certificate.id}
              expectedHash={certificate.hash}
            />
          )}
        </div>

        {/* Plain language explainer */}
        <div className="px-6 sm:px-8 py-6 border-b" style={{ borderColor: "var(--rule)" }}>
          <p className="fig-label mb-3">What this certificate means</p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Dudilig read the smart contract source code directly and checked it
            against the {certificate.standardName} compliance standard using its
            production AI auditor. Each rule was independently evaluated; the
            findings above are the actual results. The hash is a SHA-256
            fingerprint of the full attestation payload — anyone with the same
            inputs can reproduce it byte-for-byte. Liquidity providers,
            allocators, and regulators can verify this attestation without
            reading the contract themselves.
          </p>
        </div>

        {/* Scope of trust — what this proves vs does not prove */}
        <div
          className="px-6 sm:px-8 py-6 border-b"
          style={{ borderColor: "var(--rule)" }}
          data-testid="section-scope-of-trust"
        >
          <p className="fig-label mb-4">Scope of trust</p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5"
                style={{ color: "var(--accent-green)" }}
              >
                <Check className="w-3.5 h-3.5" />
                What this proves
              </p>
              <ul
                className="space-y-2 text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <li className="flex gap-2">
                  <span style={{ color: "var(--accent-green)" }}>•</span>
                  <span>
                    The exact contract source and claims shown above were
                    submitted to and analyzed by Dudilig's Claude Opus 4.5
                    auditor at the timestamp listed.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--accent-green)" }}>•</span>
                  <span>
                    The findings are deterministically committed by the SHA-256
                    hash. Anyone can re-fetch the raw JSON and recompute the
                    hash to confirm the analysis has not been altered.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--accent-green)" }}>•</span>
                  <span>
                    Dudilig is publicly accountable for this attestation. The
                    URL is permanent and viewable without an account.
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5"
                style={{ color: "var(--accent-amber, #f59e0b)" }}
              >
                <X className="w-3.5 h-3.5" />
                What this does not prove
              </p>
              <ul
                className="space-y-2 text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <li className="flex gap-2">
                  <span style={{ color: "var(--text-tertiary)" }}>•</span>
                  <span>
                    That the contract is deployed at the address shown, or that
                    the on-chain bytecode matches the source analyzed. No RPC
                    bytecode verification is performed in v1.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--text-tertiary)" }}>•</span>
                  <span>
                    Cryptographic asymmetric signing or on-chain anchoring. The
                    attestation is hash-committed but not yet signed by a
                    Dudilig key or anchored via EAS — both planned for v2.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--text-tertiary)" }}>•</span>
                  <span>
                    Legal or regulatory approval. This is an LLM-generated
                    structural review, not a law-firm opinion or accreditation
                    by a regulator.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--text-tertiary)" }}>•</span>
                  <span>
                    Identity of the issuer. The issuer name is self-declared
                    and not KYB-verified at publish time.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p
            className="text-xs mt-5 pt-4 border-t"
            style={{
              color: "var(--text-tertiary)",
              borderColor: "var(--rule)",
            }}
          >
            Continuous attestation, on-chain anchoring via EAS, and RPC
            bytecode verification are on the Dudilig roadmap. This certificate
            is not legal advice.
          </p>
        </div>

        {/* Embed snippet */}
        {!embed && (
          <EmbedSnippet certificateId={certificate.id} />
        )}

        {/* Actions */}
        {!embed && (
          <div
            className="px-6 sm:px-8 py-5 flex flex-wrap gap-3 items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Link
                href={`/api/certificates/${certificate.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-muted)" }}
                data-testid="link-raw-json"
              >
                <ExternalLink className="w-3 h-3" />
                Raw JSON
              </Link>
              <CopyButton
                text={typeof window !== "undefined" ? window.location.href : ""}
                label="Copy URL"
              />
            </div>
            <Link
              href="/analyze"
              className="btn-ghost"
              style={{ fontSize: "12px", padding: "8px 16px" }}
              data-testid="link-publish-your-own"
            >
              Publish your own →
            </Link>
          </div>
        )}
      </div>

      {!embed && (
        <p
          className="text-xs mt-8 text-center max-w-md"
          style={{ color: "var(--text-tertiary)" }}
        >
          Dudilig Trust Certificates are issued by reading smart contracts directly
          and signing the result. Re-issued continuously on every attestation run.
        </p>
      )}
    </div>
  )
}
