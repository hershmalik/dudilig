"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { investors } from "@/lib/mock-data/investors"
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils"
import { Search, X, AlertTriangle, ChevronRight } from "lucide-react"
import { Investor } from "@/lib/types"

type KycFilter = "all" | "verified" | "pending" | "flagged" | "expired"

const kycBadge = (status: string) => {
  const map: Record<string, { variant: "success" | "warning" | "error" | "outline"; label: string }> = {
    verified: { variant: "success", label: "Verified" },
    pending: { variant: "warning", label: "Pending" },
    flagged: { variant: "error", label: "Flagged" },
    expired: { variant: "outline", label: "Expired" },
  }
  const { variant, label } = map[status] ?? { variant: "outline", label: status }
  return <Badge variant={variant}>{label}</Badge>
}

const amlBadge = (risk: string) => {
  const map: Record<string, "success" | "warning" | "error"> = {
    low: "success", medium: "warning", high: "error",
  }
  return <Badge variant={map[risk] ?? "outline"}>{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk</Badge>
}

export default function InvestorsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<KycFilter>("all")
  const [selected, setSelected] = useState<Investor | null>(null)

  const filtered = investors.filter(inv => {
    const matchSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.jurisdiction.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || inv.kycStatus === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Investor Registry"
          subtitle={`${investors.length} investors · ${investors.filter(i => i.kycStatus === "flagged").length} flagged`}
        />

        <div className="p-4 sm:p-8 space-y-4 flex-1">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search investors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "verified", "pending", "flagged", "expired"] as KycFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-[var(--accent-blue)] text-white"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--rule)] hover:border-[var(--rule-strong)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--rule)]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Investor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Jurisdiction</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">KYC Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">AML Risk</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Sanctions Screened</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className={`border-t border-[var(--rule)] hover:bg-[rgba(247,244,237,0.06)]/40 transition-colors cursor-pointer ${
                      selected?.id === inv.id ? "bg-[rgba(247,244,237,0.04)]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[rgba(59,130,246,0.20)] flex items-center justify-center text-xs font-semibold text-[var(--accent-blue)]">
                          {inv.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                            {inv.name}
                            {inv.kycStatus === "flagged" && <AlertTriangle className="w-3 h-3 text-[var(--accent-amber)]" />}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">{inv.entity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{inv.jurisdiction}</td>
                    <td className="px-6 py-4">{kycBadge(inv.kycStatus)}</td>
                    <td className="px-6 py-4">{amlBadge(inv.amlRiskScore)}</td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)]">{timeAgo(inv.sanctionsLastRun)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{formatCurrency(inv.totalInvested)}</td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Drawer — full-screen on mobile, sidebar on desktop */}
      {selected && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto lg:w-80 lg:shrink-0 lg:border-l lg:border-[var(--rule)] lg:bg-[var(--bg-elevated)] lg:overflow-y-auto">
          <div className="h-full bg-[var(--bg-elevated)] overflow-y-auto lg:h-auto">
          <div className="p-5 border-b border-[var(--rule)] flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Investor Detail</p>
            <button onClick={() => setSelected(null)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.20)] flex items-center justify-center text-sm font-semibold text-[var(--accent-blue)]">
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{selected.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{selected.entity} · {selected.jurisdiction}</p>
              </div>
            </div>

            {selected.flagReason && (
              <div className="bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent-red)] mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--accent-red)]">{selected.flagReason}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">KYC Status</span>
                {kycBadge(selected.kycStatus)}
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">AML Risk</span>
                {amlBadge(selected.amlRiskScore)}
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Accreditation</span>
                <Badge variant={selected.accreditation === "verified" ? "success" : "warning"}>
                  {selected.accreditation}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Total Invested</span>
                <span className="text-xs text-[var(--text-primary)]">{formatCurrency(selected.totalInvested)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Onboarded</span>
                <span className="text-xs text-[var(--text-primary)]">{formatDate(selected.onboardedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Sanctions Screened</span>
                <span className="text-xs text-[var(--text-primary)]">{timeAgo(selected.sanctionsLastRun)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Documents</p>
              {["Passport / ID (verified)", "Proof of Address", "Source of Funds Declaration", "Accreditation Certificate"].map(doc => (
                <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-[rgba(247,244,237,0.06)] rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                  <span className="text-xs text-[var(--text-muted)]">{doc}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[rgba(247,244,237,0.06)] hover:bg-[rgba(247,244,237,0.10)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors">
                Request Update
              </button>
              {selected.kycStatus === "flagged" && (
                <button className="flex-1 py-2 bg-[rgba(239,68,68,0.20)] hover:bg-[rgba(239,68,68,0.30)] text-[var(--accent-red)] text-xs font-medium rounded-lg transition-colors">
                  Escalate
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
