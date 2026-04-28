import { TopBar } from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { filings } from "@/lib/mock-data/filings"
import { formatDate, daysUntil } from "@/lib/utils"
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react"

const statusConfig = {
  not_started: { label: "Not Started", variant: "outline" as const, icon: Clock },
  in_progress: { label: "In Progress", variant: "info" as const, icon: FileText },
  submitted: { label: "Submitted", variant: "success" as const, icon: CheckCircle2 },
  overdue: { label: "Overdue", variant: "error" as const, icon: XCircle },
}

export default function FilingsPage() {
  const grouped = {
    overdue: filings.filter(f => f.status === "overdue"),
    in_progress: filings.filter(f => f.status === "in_progress"),
    not_started: filings.filter(f => f.status === "not_started"),
    submitted: filings.filter(f => f.status === "submitted"),
  }

  return (
    <div>
      <TopBar
        title="Regulatory Filings"
        subtitle={`${filings.filter(f => f.status !== "submitted").length} open · ${filings.filter(f => f.status === "overdue").length} overdue`}
      />

      <div className="p-8 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(grouped).map(([status, items]) => {
            const cfg = statusConfig[status as keyof typeof statusConfig]
            const Icon = cfg.icon
            return (
              <Card key={status} className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  status === "submitted" ? "bg-emerald-500/10" :
                  status === "overdue" ? "bg-red-500/10" :
                  status === "in_progress" ? "bg-violet-500/10" :
                  "bg-slate-800"
                }`}>
                  <Icon className={`w-4 h-4 ${
                    status === "submitted" ? "text-emerald-400" :
                    status === "overdue" ? "text-red-400" :
                    status === "in_progress" ? "text-violet-400" :
                    "text-slate-400"
                  }`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-50">{items.length}</p>
                  <p className="text-xs text-slate-500">{cfg.label}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Filings table */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-800">
            <p className="text-sm font-medium text-slate-200">All Filings</p>
          </div>
          <div className="divide-y divide-slate-800">
            {filings
              .sort((a, b) => {
                const order = { overdue: 0, in_progress: 1, not_started: 2, submitted: 3 }
                return order[a.status] - order[b.status]
              })
              .map(filing => {
                const cfg = statusConfig[filing.status]
                const days = daysUntil(filing.dueDate)
                const isOverdue = days < 0
                const isUrgent = days <= 14 && days >= 0

                return (
                  <div key={filing.id} className="px-6 py-5 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isOverdue ? "bg-red-500/10 text-red-400" :
                        isUrgent ? "bg-amber-500/10 text-amber-400" :
                        filing.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {isOverdue ? "!" : filing.status === "submitted" ? "✓" : `${days}d`}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-medium text-slate-200">{filing.filingType}</p>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{filing.jurisdiction}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{filing.description}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {filing.documents.map(doc => (
                            <span key={doc} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-xs font-medium ${
                          isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-slate-400"
                        }`}>
                          {isOverdue
                            ? `${Math.abs(days)} days overdue`
                            : filing.status === "submitted"
                            ? "Submitted"
                            : `Due ${formatDate(filing.dueDate)}`}
                        </p>
                        {!isOverdue && filing.status !== "submitted" && (
                          <button className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            Start filing →
                          </button>
                        )}
                        {filing.status === "overdue" && (
                          <button className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Urgent action
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>
      </div>
    </div>
  )
}
