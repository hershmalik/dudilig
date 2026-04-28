import { TopBar } from "@/components/layout/TopBar"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { DeadlineTimeline } from "@/components/dashboard/DeadlineTimeline"
import { ComplianceScoreRing } from "@/components/dashboard/ComplianceScoreRing"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tokens } from "@/lib/mock-data/tokens"
import { investors } from "@/lib/mock-data/investors"
import { filings } from "@/lib/mock-data/filings"
import { formatCurrency } from "@/lib/utils"
import { Users, AlertTriangle, FileText, ShieldCheck, Layers } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const flaggedInvestors = investors.filter(i => i.kycStatus === "flagged").length
  const pendingKyc = investors.filter(i => i.kycStatus === "pending").length
  const overdueFilings = filings.filter(f => f.status === "overdue").length
  const failedAttestation = tokens.filter(t => t.attestationStatus === "failed").length

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle="Meridian Capital Partners · Cayman Islands"
      />

      <div className="p-8 space-y-6">
        {/* Score + KPIs */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="col-span-2 p-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Compliance Health</p>
            <ComplianceScoreRing score={84} />
          </Card>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            <KpiCard
              label="Active Investors"
              value={investors.filter(i => i.kycStatus === "verified").length}
              icon={Users}
              delta={`${pendingKyc} pending KYC`}
              deltaType="neutral"
              iconColor="text-violet-400"
            />
            <KpiCard
              label="Flagged / KYC Issues"
              value={flaggedInvestors + pendingKyc}
              icon={AlertTriangle}
              delta={`${flaggedInvestors} flagged`}
              deltaType={flaggedInvestors > 0 ? "negative" : "neutral"}
              iconColor="text-amber-400"
              badge={flaggedInvestors > 0 ? <Badge variant="error">Action needed</Badge> : undefined}
            />
            <KpiCard
              label="Open Filings"
              value={filings.filter(f => f.status !== "submitted").length}
              icon={FileText}
              delta={`${overdueFilings} overdue`}
              deltaType={overdueFilings > 0 ? "negative" : "neutral"}
              iconColor="text-blue-400"
              badge={overdueFilings > 0 ? <Badge variant="error">{overdueFilings} overdue</Badge> : undefined}
            />
            <KpiCard
              label="Tokens Attested"
              value={`${tokens.filter(t => t.attestationStatus === "verified").length}/${tokens.length}`}
              icon={ShieldCheck}
              delta={failedAttestation > 0 ? `${failedAttestation} failed` : "All current"}
              deltaType={failedAttestation > 0 ? "negative" : "positive"}
              iconColor="text-emerald-400"
              badge={failedAttestation > 0 ? <Badge variant="error">{failedAttestation} failed</Badge> : undefined}
            />
            <KpiCard
              label="Total AUM (Tokenized)"
              value={formatCurrency(tokens.reduce((s, t) => s + t.totalRaise, 0))}
              icon={Layers}
              delta={`${tokens.length} active tokens`}
              deltaType="positive"
              iconColor="text-violet-400"
            />
            <KpiCard
              label="Total Investors"
              value={investors.length}
              icon={Users}
              delta={`${investors.filter(i => i.entity === "Institutional").length} institutional`}
              deltaType="neutral"
              iconColor="text-blue-400"
            />
          </div>
        </div>

        {/* Token table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Token Portfolio</CardTitle>
              <Link href="/tokens" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0 pb-0">
            <table className="w-full">
              <thead>
                <tr className="border-t border-slate-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Token</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Jurisdiction</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Raise</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Investors</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Compliance</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Attestation</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, i) => (
                  <tr key={token.id} className={`border-t border-slate-800 hover:bg-slate-800/30 transition-colors ${i === tokens.length - 1 ? "rounded-b-xl" : ""}`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-200">{token.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{token.standard} · {token.network}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{token.jurisdiction}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{formatCurrency(token.totalRaise)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{token.currentInvestors}/{token.maxInvestors}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${token.complianceScore}%`,
                              background: token.complianceScore >= 80 ? "#10b981" : token.complianceScore >= 60 ? "#f59e0b" : "#ef4444"
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{token.complianceScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          token.attestationStatus === "verified" ? "success" :
                          token.attestationStatus === "failed" ? "error" : "warning"
                        }
                      >
                        {token.attestationStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Activity + Deadlines */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-0 pb-0">
              <ActivityFeed />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Deadlines</CardTitle>
                <Link href="/filings" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0 pb-0">
              <DeadlineTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
