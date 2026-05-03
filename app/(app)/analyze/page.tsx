"use client"

import { useState } from "react"
import Link from "next/link"
import { TopBar } from "@/components/layout/TopBar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { contractSolidity } from "@/lib/mock-data/tokens"
import {
  Microscope,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Minus,
  Loader2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { saveAnalysisAsCertificate } from "./actions"

const STANDARDS = [
  { id: "reg-d-506c", label: "Reg D 506(c)", desc: "US accredited investors" },
  { id: "reg-s", label: "Reg S", desc: "Offshore, non-US only" },
  { id: "mica", label: "MiCA", desc: "EU crypto assets" },
  { id: "erc-1400", label: "ERC-1400", desc: "Security token standard" },
]

interface AnalysisResult {
  summary: string
  overallStatus: "pass" | "warning" | "fail"
  score: number
  results: Array<{
    rule: string
    status: "pass" | "fail" | "warning" | "na"
    finding: string
    line: string | null
  }>
  criticalIssues: string[]
  recommendations: string[]
}

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
  if (status === "fail") return <XCircle className="w-4 h-4 text-[var(--accent-red)] shrink-0" />
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-[var(--accent-amber)] shrink-0" />
  return <Minus className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
}

function statusVariant(status: string): "success" | "error" | "warning" | "default" {
  if (status === "pass") return "success"
  if (status === "fail") return "error"
  if (status === "warning") return "warning"
  return "default"
}

function ScoreRing({ score, status }: { score: number; status: string }) {
  const color = status === "pass" ? "#4ADE80" : status === "fail" ? "#EF4444" : "#C8842A"
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(247,244,237,0.10)" strokeWidth="8" />
        <circle
          cx="56" cy="56" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-[var(--text-primary)]">{score}</span>
        <span className="text-xs text-[var(--text-tertiary)]">/ 100</span>
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  const [code, setCode] = useState("")
  const [standard, setStandard] = useState("reg-s")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [standardName, setStandardName] = useState("")
  const [error, setError] = useState("")
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  // Publish-as-Trust-Certificate state
  const [analysisToken, setAnalysisToken] = useState("")
  const [issuerName, setIssuerName] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [network, setNetwork] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState("")
  const [publishedCert, setPublishedCert] = useState<{ url: string; hash: string } | null>(null)

  async function runAnalysis() {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    setError("")
    setExpandedRules(new Set())
    setPublishError("")
    setPublishedCert(null)
    setAnalysisToken("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, standard }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.analysis)
        setStandardName(data.standard)
        setAnalysisToken(data.analysisToken ?? "")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function publishCertificate() {
    if (!result || !issuerName.trim() || !tokenName.trim() || !analysisToken) return
    setPublishing(true)
    setPublishError("")
    setPublishedCert(null)
    try {
      const res = await saveAnalysisAsCertificate({
        analysisToken,
        issuerName,
        tokenName,
        contractAddress: contractAddress || undefined,
        network: network || undefined,
      })
      if (res.ok) {
        setPublishedCert({ url: res.url, hash: res.hash })
        setAnalysisToken("") // single-use; clear so the button disables
      } else {
        setPublishError(res.error)
      }
    } catch {
      setPublishError("Failed to publish certificate. Please try again.")
    } finally {
      setPublishing(false)
    }
  }

  function loadExample() {
    setCode(contractSolidity)
    setStandard("reg-s")
  }

  function toggleRule(i: number) {
    setExpandedRules(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function copyReport() {
    if (!result) return
    const text = [
      `Dudilig Contract Analysis — ${standardName}`,
      `Score: ${result.score}/100 | Status: ${result.overallStatus.toUpperCase()}`,
      "",
      result.summary,
      "",
      "RULE RESULTS:",
      ...result.results.map(r => `[${r.status.toUpperCase()}] ${r.rule}\n  ${r.finding}`),
      "",
      result.criticalIssues.length ? `CRITICAL ISSUES:\n${result.criticalIssues.map(i => `• ${i}`).join("\n")}` : "",
      "",
      `RECOMMENDATIONS:\n${result.recommendations.map(r => `• ${r}`).join("\n")}`,
    ].join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const passCount = result?.results.filter(r => r.status === "pass").length ?? 0
  const failCount = result?.results.filter(r => r.status === "fail").length ?? 0
  const warnCount = result?.results.filter(r => r.status === "warning").length ?? 0

  return (
    <div>
      <TopBar
        title="Contract Analyzer"
        subtitle="Paste Solidity code · get live compliance analysis powered by Claude"
      />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Explainer banner */}
        <div className="bg-[rgba(59,130,246,0.10)] border border-[var(--accent-blue)]/20 rounded-xl px-4 py-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[var(--accent-blue)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--accent-blue)]">Live AI analysis — no mocks</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Paste any ERC-1400, ERC-3643, or custom security token contract. Claude reads the actual Solidity and checks every compliance rule for the standard you select. Results are real — Pass/Fail/Warning per rule with specific code references.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            {/* Standard selector */}
            <Card className="p-4">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Compliance Standard</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STANDARDS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStandard(s.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-colors",
                      standard === s.id
                        ? "border-[rgba(59,130,246,0.40)] bg-[rgba(59,130,246,0.10)]"
                        : "border-[var(--rule)] hover:border-[var(--rule-strong)] bg-[var(--bg-elevated)]"
                    )}
                  >
                    <p className={cn("text-sm font-medium", standard === s.id ? "text-[var(--accent-blue)]" : "text-[var(--text-primary)]")}>{s.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Code input */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Solidity Contract</p>
                <button
                  onClick={loadExample}
                  className="text-xs text-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                >
                  Load example
                </button>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={`// Paste your Solidity contract here\n// e.g. an ERC-1400 or ERC-3643 token\n\npragma solidity ^0.8.0;\n\ncontract MySecurityToken { ... }`}
                className="w-full h-72 sm:h-96 px-3 py-3 bg-[var(--bg-base)] border border-[var(--rule)] rounded-lg text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-[var(--text-tertiary)]">{code.length > 0 ? `${code.split("\n").length} lines` : "No contract loaded"}</p>
                <button
                  onClick={runAnalysis}
                  disabled={!code.trim() || loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Microscope className="w-4 h-4" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </Card>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {!result && !loading && !error && (
              <Card className="p-8 flex flex-col items-center justify-center text-center min-h-64">
                <div className="w-12 h-12 bg-[rgba(247,244,237,0.06)] rounded-2xl flex items-center justify-center mb-4">
                  <Microscope className="w-6 h-6 text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm text-[var(--text-muted)] font-medium">No analysis yet</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 max-w-xs">
                  Paste a Solidity contract on the left, select a compliance standard, and click "Run Analysis" to get live results.
                </p>
                <button
                  onClick={loadExample}
                  className="mt-4 text-xs text-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                >
                  Load example contract →
                </button>
              </Card>
            )}

            {loading && (
              <Card className="p-8 flex flex-col items-center justify-center min-h-64">
                <Loader2 className="w-8 h-8 text-[var(--accent-blue)] animate-spin mb-4" />
                <p className="text-sm text-[var(--text-primary)] font-medium">Analyzing contract...</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-2">Claude is reading the Solidity and checking each compliance rule</p>
              </Card>
            )}

            {error && (
              <Card className="p-6">
                <div className="flex items-start gap-3 bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] rounded-xl p-4">
                  <XCircle className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[var(--accent-red)]">Analysis failed</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{error}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">Make sure ANTHROPIC_API_KEY is set in your environment.</p>
                  </div>
                </div>
              </Card>
            )}

            {result && (
              <>
                {/* Score card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Analysis Result — {standardName}</p>
                    <button
                      onClick={copyReport}
                      className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Copied!" : "Copy report"}
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <ScoreRing score={result.score} status={result.overallStatus} />
                    <div className="flex-1 space-y-3">
                      <div>
                        <Badge variant={statusVariant(result.overallStatus)} className="mb-2">
                          {result.overallStatus === "pass" ? "COMPLIANT" : result.overallStatus === "fail" ? "NON-COMPLIANT" : "NEEDS REVIEW"}
                        </Badge>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{result.summary}</p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className="text-[var(--accent-green)] font-medium">{passCount} passed</span>
                        <span className="text-[var(--accent-amber)] font-medium">{warnCount} warnings</span>
                        <span className="text-[var(--accent-red)] font-medium">{failCount} failed</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Prominent Publish CTA banner */}
                {!publishedCert && (
                  <button
                    onClick={() => {
                      document.getElementById("publish-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
                      document.getElementById("publish-issuer")?.focus({ preventScroll: true })
                    }}
                    data-testid="button-jump-to-publish"
                    className="w-full flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-[rgba(74,222,128,0.15)] via-[rgba(74,222,128,0.10)] to-[rgba(59,130,246,0.10)] border border-[rgba(74,222,128,0.30)] rounded-xl hover-elevate active-elevate-2 transition-shadow text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.20)] border border-[rgba(74,222,128,0.30)] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[var(--accent-green)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--accent-green)]">Publish as Trust Certificate →</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          Turn this analysis into a public, signed, shareable URL. No login to view.
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[var(--accent-green)] shrink-0 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                )}

                {/* Critical issues */}
                {result.criticalIssues.length > 0 && (
                  <div className="bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-[var(--accent-red)] flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Critical Issues
                    </p>
                    {result.criticalIssues.map((issue, i) => (
                      <p key={i} className="text-xs text-[var(--text-primary)] ml-6">• {issue}</p>
                    ))}
                  </div>
                )}

                {/* Rule-by-rule results */}
                <Card>
                  <div className="px-6 py-4 border-b border-[var(--rule)]">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Rule-by-Rule Findings</p>
                  </div>
                  <div className="divide-y divide-[var(--rule)]">
                    {result.results.map((r, i) => (
                      <div key={i} className="px-6 py-4">
                        <button
                          onClick={() => toggleRule(i)}
                          className="w-full flex items-start gap-3 text-left"
                        >
                          <StatusIcon status={r.status} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-medium text-[var(--text-primary)]">{r.rule}</p>
                              <Badge variant={statusVariant(r.status)} className="text-[10px]">
                                {r.status.toUpperCase()}
                              </Badge>
                            </div>
                            {expandedRules.has(i) && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-[var(--text-muted)]">{r.finding}</p>
                                {r.line && (
                                  <p className="text-xs font-mono text-[var(--accent-blue)] bg-[rgba(59,130,246,0.10)] px-2 py-1 rounded">{r.line}</p>
                                )}
                              </div>
                            )}
                          </div>
                          {expandedRules.has(i)
                            ? <ChevronUp className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                            : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <Card className="p-6">
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blue)]" /> Recommendations
                    </p>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[var(--accent-blue)] text-xs font-semibold mt-0.5 shrink-0">{i + 1}.</span>
                          <p className="text-xs text-[var(--text-muted)]">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Publish as Trust Certificate */}
                <div id="publish-section" className="scroll-mt-6">
                <Card
                  className="p-6 border-[rgba(74,222,128,0.30)] bg-gradient-to-br from-[rgba(74,222,128,0.04)] to-transparent shadow-[0_0_0_1px_rgba(74,222,128,0.15)]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.10)] border border-[rgba(74,222,128,0.20)] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[var(--accent-green)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Publish as Trust Certificate</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Save this analysis as a public, signed certificate with a permanent shareable URL.
                        No login required to view. The cryptographic hash is computed from the canonical
                        contract + claims + analysis payload.
                      </p>
                    </div>
                  </div>

                  {!publishedCert ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="publish-issuer">
                            Issuer name <span className="text-[var(--accent-red)]">*</span>
                          </label>
                          <input
                            id="publish-issuer"
                            data-testid="input-issuer-name"
                            type="text"
                            value={issuerName}
                            onChange={e => setIssuerName(e.target.value)}
                            placeholder="e.g. Meridian Capital LLC"
                            maxLength={200}
                            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--rule)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="publish-token">
                            Token name <span className="text-[var(--accent-red)]">*</span>
                          </label>
                          <input
                            id="publish-token"
                            data-testid="input-token-name"
                            type="text"
                            value={tokenName}
                            onChange={e => setTokenName(e.target.value)}
                            placeholder="e.g. Meridian Private Credit Fund I"
                            maxLength={200}
                            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--rule)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="publish-address">
                            Contract address <span className="text-[var(--text-tertiary)]">(optional)</span>
                          </label>
                          <input
                            id="publish-address"
                            data-testid="input-contract-address"
                            type="text"
                            value={contractAddress}
                            onChange={e => setContractAddress(e.target.value)}
                            placeholder="0x..."
                            maxLength={200}
                            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--rule)] rounded-lg text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="publish-network">
                            Network <span className="text-[var(--text-tertiary)]">(optional)</span>
                          </label>
                          <input
                            id="publish-network"
                            data-testid="input-network"
                            type="text"
                            value={network}
                            onChange={e => setNetwork(e.target.value)}
                            placeholder="e.g. Ethereum, Polygon, Base"
                            maxLength={200}
                            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--rule)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                          />
                        </div>
                      </div>

                      {publishError && (
                        <div className="flex items-start gap-2 bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] rounded-lg p-3">
                          <XCircle className="w-3.5 h-3.5 text-[var(--accent-red)] shrink-0 mt-0.5" />
                          <p className="text-xs text-[var(--accent-red)]">{publishError}</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={publishCertificate}
                          disabled={
                            publishing ||
                            !issuerName.trim() ||
                            !tokenName.trim() ||
                            !analysisToken
                          }
                          data-testid="button-publish-certificate"
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] hover:bg-[var(--accent-green)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {publishing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Publish Certificate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3" data-testid="status-certificate-published">
                      <div className="flex items-start gap-2 bg-[rgba(74,222,128,0.10)] border border-[rgba(74,222,128,0.20)] rounded-lg p-3">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[var(--accent-green)]">Certificate published</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 break-all">
                            <span className="text-[var(--text-tertiary)]">URL:</span>{" "}
                            <code className="text-[var(--accent-green)]">{publishedCert.url}</code>
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 break-all">
                            <span className="text-[var(--text-tertiary)]">Hash:</span>{" "}
                            <code className="text-[var(--accent-blue)] text-[10px]">{publishedCert.hash}</code>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={publishedCert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="link-view-certificate"
                          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)] text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open certificate
                        </Link>
                        <button
                          onClick={() => {
                            setPublishedCert(null)
                            setIssuerName("")
                            setTokenName("")
                            setContractAddress("")
                            setNetwork("")
                          }}
                          data-testid="button-publish-another"
                          className="px-4 py-2 border border-[var(--rule)] hover:border-[var(--rule-strong)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors"
                        >
                          Publish another
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
