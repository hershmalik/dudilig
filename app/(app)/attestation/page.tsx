"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { AttestationEngine } from "@/components/attestation/AttestationEngine"
import { ContractCodeBlock } from "@/components/attestation/ContractCodeBlock"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { attestationHistory } from "@/lib/mock-data/attestations"
import { formatDate, timeAgo } from "@/lib/utils"
import { tokens } from "@/lib/mock-data/tokens"
import { AlertTriangle, CheckCircle2, XCircle, FileText, Code2, ShieldCheck, Share2, ArrowRight } from "lucide-react"

function AttestationExplainer() {
  const steps = [
    {
      icon: FileText,
      color: "text-[var(--accent-blue)]",
      bg: "bg-[rgba(59,130,246,0.10)] border-[rgba(59,130,246,0.20)]",
      title: "Legal Document",
      description: "Fund manager files offering docs stating rules: \"max 250 investors, accredited only, 12-month lockup.\"",
    },
    {
      icon: Code2,
      color: "text-[var(--accent-blue)]",
      bg: "bg-[rgba(59,130,246,0.10)] border-[rgba(59,130,246,0.20)]",
      title: "Smart Contract",
      description: "A separate piece of code is deployed on-chain. It may — or may not — actually enforce those rules.",
    },
    {
      icon: ShieldCheck,
      color: "text-[var(--accent-green)]",
      bg: "bg-[rgba(74,222,128,0.10)] border-[rgba(74,222,128,0.20)]",
      title: "Attestation Engine",
      description: "Dudilig reads the contract code directly and checks every claim. Produces a cryptographic proof of the result.",
    },
    {
      icon: Share2,
      color: "text-[var(--accent-amber)]",
      bg: "bg-[rgba(200,132,42,0.10)] border-[rgba(200,132,42,0.20)]",
      title: "Trust Certificate",
      description: "A shareable public certificate any LP, regulator, or liquidity provider can verify — no code-reading required.",
    },
  ]

  return (
    <div className="mx-4 sm:mx-8 mt-6 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--rule)]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">How the attestation engine works</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">The problem it solves, in plain English</p>
      </div>

      {/* Flow diagram */}
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start gap-2">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex sm:flex-col items-start sm:items-start gap-2 w-full sm:flex-1">
                <div className={`border rounded-xl p-4 ${step.bg} w-full`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${step.color}`} />
                    <p className={`text-xs font-semibold ${step.color}`}>{step.title}</p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 mt-1 sm:hidden rotate-90" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Plain language explainer */}
      <div className="px-6 pb-6">
        <div className="bg-[rgba(247,244,237,0.04)] rounded-xl p-5 border border-[var(--rule-strong)]">
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">Real example</p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            A Singapore-based tokenized private credit fund launches a Reg S offering for non-US investors only. Their lawyer filed the right documents. But does the smart contract actually block US wallet addresses? Dudilig reads the contract, verifies the geo-blocking and accreditation logic is correctly implemented, and issues a signed attestation certificate. That certificate is what gets Wintermute or Galaxy Digital comfortable enough to provide liquidity — without it, they won't touch it.
          </p>
        </div>
      </div>

      {/* The key insight */}
      <div className="px-6 pb-6">
        <div className="flex items-start gap-3 bg-[var(--accent-red)]/5 border border-[rgba(239,68,68,0.15)] rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            <span className="text-[var(--accent-red)] font-medium">The gap nobody talks about:</span> Legal documents and smart contracts are two completely separate things. The contract could say one thing and do another — and nobody would know until something goes wrong in a trade or an audit. Toggle "Simulate mismatch" below to see what that looks like.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AttestationPage() {
  const [failMode, setFailMode] = useState(false)

  return (
    <div>
      <TopBar
        title="Smart Contract Attestation"
        subtitle="Cryptographically verify on-chain contracts match off-chain compliance claims"
        action={
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-[var(--text-tertiary)]">Simulate mismatch</span>
            <button
              onClick={() => setFailMode(!failMode)}
              className={`relative w-10 h-5 rounded-full transition-colors ${failMode ? "bg-[var(--accent-red)]" : "bg-[rgba(247,244,237,0.08)]"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${failMode ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        }
      />

      <AttestationExplainer />

      {failMode && (
        <div className="mx-8 mt-4 bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[var(--accent-red)] shrink-0" />
          <p className="text-xs text-[var(--accent-red)]">
            Demo mode: simulating a contract where <span className="font-mono">MAX_INVESTORS = 500</span> but the offering documents claim <span className="font-mono">250</span>. Watch the attestation catch it.
          </p>
        </div>
      )}

      <div className="p-4 sm:p-8 space-y-6">
        {/* Token selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          {tokens.map(token => (
            <button
              key={token.id}
              className={`flex-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                token.id === "tok-001"
                  ? "border-[rgba(59,130,246,0.40)] bg-[rgba(59,130,246,0.05)]"
                  : "border-[var(--rule)] bg-[var(--bg-elevated)] hover:border-[var(--rule-strong)]"
              }`}
            >
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{token.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge
                  variant={
                    token.attestationStatus === "verified" ? "success" :
                    token.attestationStatus === "failed" ? "error" : "warning"
                  }
                >
                  {token.attestationStatus}
                </Badge>
                <span className="text-xs text-[var(--text-tertiary)]">{token.standard}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Contract */}
          <Card className="p-6">
            <ContractCodeBlock />
          </Card>

          {/* Right: Engine */}
          <Card className="p-6">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">Attestation Engine</p>
            <AttestationEngine failMode={failMode} />
          </Card>
        </div>

        {/* History */}
        <Card>
          <div className="px-6 py-4 border-b border-[var(--rule)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">Attestation History</p>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[var(--rule)]">
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Token</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Run At</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Result</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Fields Checked</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Hash</th>
              </tr>
            </thead>
            <tbody>
              {attestationHistory.map((run, i) => (
                <tr key={run.id} className={`border-t border-[var(--rule)] hover:bg-[rgba(247,244,237,0.06)]/30 transition-colors ${i === 0 ? "border-t-0" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--text-primary)]">{run.tokenName}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)]">{timeAgo(run.runAt)}</td>
                  <td className="px-6 py-4">
                    {run.status === "pass" ? (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--accent-green)]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--accent-red)]">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[var(--text-muted)]">{run.checkedFields.length} fields</span>
                    {run.checkedFields.some(f => !f.match) && (
                      <span className="ml-2 text-xs text-[var(--accent-red)]">
                        {run.checkedFields.filter(f => !f.match).length} mismatch
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-[var(--text-tertiary)] truncate max-w-32">{run.hash.slice(0, 16)}...</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
