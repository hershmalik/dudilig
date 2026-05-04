import { TopBar } from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { tokens } from "@/lib/mock-data/tokens"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ExternalLink, ShieldCheck, Users, Lock } from "lucide-react"
import Link from "next/link"

const typeLabel: Record<string, string> = {
  "private-credit": "Private Credit",
  "pre-ipo-equity": "Pre-IPO Equity",
  "real-estate": "Real Estate",
}

const typeColor: Record<string, string> = {
  "private-credit": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "pre-ipo-equity": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "real-estate": "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export default function TokensPage() {
  return (
    <div>
      <TopBar
        title="Token Portfolio"
        subtitle={`${tokens.length} active tokens · ${formatCurrency(tokens.reduce((s, t) => s + t.totalRaise, 0))} total AUM`}
      />

      <div className="p-8 space-y-4">
        {tokens.map(token => (
          <Card key={token.id} className="p-6">
            <div className="flex items-start gap-6">
              {/* Left: meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-base font-semibold text-slate-100">{token.name}</h2>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${typeColor[token.type]}`}>
                    {typeLabel[token.type]}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xs text-slate-500">{token.jurisdiction}</p>
                  <span className="text-slate-700">·</span>
                  <p className="text-xs font-mono text-slate-500">{token.contractAddress.slice(0, 18)}...</p>
                  <a
                    href="#"
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    View on {token.network} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Raise</p>
                    <p className="text-sm font-semibold text-slate-200">{formatCurrency(token.totalRaise)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Standard</p>
                    <p className="text-sm text-slate-300">{token.standard}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Network</p>
                    <p className="text-sm text-slate-300">{token.network}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Transfer Lock-up</p>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <p className="text-sm text-slate-300">{token.transferLockupMonths}mo</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Attested</p>
                    <p className="text-sm text-slate-300">{formatDate(token.lastAttested)}</p>
                  </div>
                </div>
              </div>

              {/* Right: status panel */}
              <div className="shrink-0 w-56 space-y-4">
                {/* Compliance score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">Compliance Score</p>
                    <p className="text-sm font-bold text-slate-200">{token.complianceScore}/100</p>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${token.complianceScore}%`,
                        background: token.complianceScore >= 80 ? "#10b981" : token.complianceScore >= 60 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>

                {/* Investor cap */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">Investor Cap</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Users className="w-3 h-3" />
                      {token.currentInvestors}/{token.maxInvestors}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${(token.currentInvestors / token.maxInvestors) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Attestation + accredited */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Attestation</p>
                    <Badge variant={
                      token.attestationStatus === "verified" ? "success" :
                      token.attestationStatus === "failed" ? "error" : "warning"
                    }>
                      {token.attestationStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Accredited Only</p>
                    <Badge variant={token.accreditedOnly ? "info" : "outline"}>
                      {token.accreditedOnly ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                <Link
                  href="/attestation"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-600/30 text-violet-400 text-xs font-medium rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Run Attestation
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
