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
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export default function AttestationPage() {
  const [failMode, setFailMode] = useState(false)

  return (
    <div>
      <TopBar
        title="Smart Contract Attestation"
        subtitle="Cryptographically verify on-chain contracts match off-chain compliance claims"
        action={
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500">Simulate mismatch</span>
            <button
              onClick={() => setFailMode(!failMode)}
              className={`relative w-10 h-5 rounded-full transition-colors ${failMode ? "bg-red-600" : "bg-slate-700"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${failMode ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        }
      />

      {failMode && (
        <div className="mx-8 mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-300">
            Demo mode: simulating a contract where <span className="font-mono">MAX_INVESTORS = 500</span> but the offering documents claim <span className="font-mono">250</span>. Watch the attestation catch it.
          </p>
        </div>
      )}

      <div className="p-8 space-y-6">
        {/* Token selector */}
        <div className="flex gap-3">
          {tokens.map(token => (
            <button
              key={token.id}
              className={`flex-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                token.id === "tok-001"
                  ? "border-violet-600/40 bg-violet-600/5"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <p className="text-xs font-medium text-slate-300 truncate">{token.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge
                  variant={
                    token.attestationStatus === "verified" ? "success" :
                    token.attestationStatus === "failed" ? "error" : "warning"
                  }
                >
                  {token.attestationStatus}
                </Badge>
                <span className="text-xs text-slate-600">{token.standard}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Contract */}
          <Card className="p-6">
            <ContractCodeBlock />
          </Card>

          {/* Right: Engine */}
          <Card className="p-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Attestation Engine</p>
            <AttestationEngine failMode={failMode} />
          </Card>
        </div>

        {/* History */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-800">
            <p className="text-sm font-medium text-slate-200">Attestation History</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Token</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Run At</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Result</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Fields Checked</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Hash</th>
              </tr>
            </thead>
            <tbody>
              {attestationHistory.map((run, i) => (
                <tr key={run.id} className={`border-t border-slate-800 hover:bg-slate-800/30 transition-colors ${i === 0 ? "border-t-0" : ""}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">{run.tokenName}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{timeAgo(run.runAt)}</td>
                  <td className="px-6 py-4">
                    {run.status === "pass" ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-400">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">{run.checkedFields.length} fields</span>
                    {run.checkedFields.some(f => !f.match) && (
                      <span className="ml-2 text-xs text-red-400">
                        {run.checkedFields.filter(f => !f.match).length} mismatch
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-slate-600 truncate max-w-32">{run.hash.slice(0, 16)}...</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
