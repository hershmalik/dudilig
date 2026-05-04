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
  "private-credit": "bg-[rgba(59,130,246,0.10)] text-[var(--accent-blue)] border-[rgba(59,130,246,0.20)]",
  "pre-ipo-equity": "bg-[rgba(59,130,246,0.10)] text-[var(--accent-blue)] border-[rgba(59,130,246,0.20)]",
  "real-estate": "bg-[rgba(200,132,42,0.10)] text-[var(--accent-amber)] border-[rgba(200,132,42,0.20)]",
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
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">{token.name}</h2>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${typeColor[token.type]}`}>
                    {typeLabel[token.type]}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xs text-[var(--text-tertiary)]">{token.jurisdiction}</p>
                  <span className="text-[var(--text-tertiary)]">·</span>
                  <p className="text-xs font-mono text-[var(--text-tertiary)]">{token.contractAddress.slice(0, 18)}...</p>
                  <a
                    href="#"
                    className="text-xs text-[var(--accent-blue)] hover:text-[var(--accent-blue)] flex items-center gap-1"
                  >
                    View on {token.network} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Raise</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(token.totalRaise)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Standard</p>
                    <p className="text-sm text-[var(--text-primary)]">{token.standard}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Network</p>
                    <p className="text-sm text-[var(--text-primary)]">{token.network}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Transfer Lock-up</p>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[var(--text-tertiary)]" />
                      <p className="text-sm text-[var(--text-primary)]">{token.transferLockupMonths}mo</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Last Attested</p>
                    <p className="text-sm text-[var(--text-primary)]">{formatDate(token.lastAttested)}</p>
                  </div>
                </div>
              </div>

              {/* Right: status panel */}
              <div className="shrink-0 w-56 space-y-4">
                {/* Compliance score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[var(--text-tertiary)]">Compliance Score</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{token.complianceScore}/100</p>
                  </div>
                  <div className="h-2 bg-[rgba(247,244,237,0.06)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${token.complianceScore}%`,
                        background: token.complianceScore >= 80 ? "#4ADE80" : token.complianceScore >= 60 ? "#C8842A" : "#EF4444",
                      }}
                    />
                  </div>
                </div>

                {/* Investor cap */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[var(--text-tertiary)]">Investor Cap</p>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Users className="w-3 h-3" />
                      {token.currentInvestors}/{token.maxInvestors}
                    </div>
                  </div>
                  <div className="h-1.5 bg-[rgba(247,244,237,0.06)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-blue)]"
                      style={{ width: `${(token.currentInvestors / token.maxInvestors) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Attestation + accredited */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-tertiary)]">Attestation</p>
                    <Badge variant={
                      token.attestationStatus === "verified" ? "success" :
                      token.attestationStatus === "failed" ? "error" : "warning"
                    }>
                      {token.attestationStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-tertiary)]">Accredited Only</p>
                    <Badge variant={token.accreditedOnly ? "info" : "outline"}>
                      {token.accreditedOnly ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                <Link
                  href="/attestation"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--accent-blue)]/15 hover:bg-[var(--accent-blue)]/25 border border-[rgba(59,130,246,0.30)] text-[var(--accent-blue)] text-xs font-medium rounded-lg transition-colors"
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
