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

        <div className="p-8 space-y-4 flex-1">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search investors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "verified", "pending", "flagged", "expired"] as KycFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-violet-600 text-white"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Investor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Jurisdiction</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">KYC Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">AML Risk</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Sanctions Screened</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className={`border-t border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      selected?.id === inv.id ? "bg-slate-800/50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-violet-600/20 flex items-center justify-center text-xs font-semibold text-violet-300">
                          {inv.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                            {inv.name}
                            {inv.kycStatus === "flagged" && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          </p>
                          <p className="text-xs text-slate-500">{inv.entity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{inv.jurisdiction}</td>
                    <td className="px-6 py-4">{kycBadge(inv.kycStatus)}</td>
                    <td className="px-6 py-4">{amlBadge(inv.amlRiskScore)}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{timeAgo(inv.sanctionsLastRun)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatCurrency(inv.totalInvested)}</td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="w-80 shrink-0 border-l border-slate-800 bg-slate-900 overflow-y-auto">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200">Investor Detail</p>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-300">
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{selected.name}</p>
                <p className="text-xs text-slate-500">{selected.entity} · {selected.jurisdiction}</p>
              </div>
            </div>

            {selected.flagReason && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300">{selected.flagReason}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">KYC Status</span>
                {kycBadge(selected.kycStatus)}
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">AML Risk</span>
                {amlBadge(selected.amlRiskScore)}
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Accreditation</span>
                <Badge variant={selected.accreditation === "verified" ? "success" : "warning"}>
                  {selected.accreditation}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Total Invested</span>
                <span className="text-xs text-slate-300">{formatCurrency(selected.totalInvested)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Onboarded</span>
                <span className="text-xs text-slate-300">{formatDate(selected.onboardedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Sanctions Screened</span>
                <span className="text-xs text-slate-300">{timeAgo(selected.sanctionsLastRun)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Documents</p>
              {["Passport / ID (verified)", "Proof of Address", "Source of Funds Declaration", "Accreditation Certificate"].map(doc => (
                <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">{doc}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors">
                Request Update
              </button>
              {selected.kycStatus === "flagged" && (
                <button className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium rounded-lg transition-colors">
                  Escalate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
