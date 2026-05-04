import { filings } from "@/lib/mock-data/filings"
import { daysUntil, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function DeadlineTimeline() {
  const upcoming = filings
    .filter(f => f.status !== "submitted")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-0">
      {upcoming.map((filing, i) => {
        const days = daysUntil(filing.dueDate)
        const isOverdue = days < 0
        const isUrgent = days <= 14 && days >= 0

        return (
          <div
            key={filing.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors",
              i !== 0 && "border-t border-slate-800/60"
            )}
          >
            <div className={cn(
              "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold",
              isOverdue ? "bg-red-500/10 text-red-400" : isUrgent ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-400"
            )}>
              {isOverdue ? "!" : `${days}d`}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-300 truncate">{filing.filingType}</p>
              <p className="text-xs text-slate-500 truncate">{filing.jurisdiction}</p>
              <p className={cn(
                "text-xs mt-0.5",
                isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-slate-600"
              )}>
                {isOverdue ? `${Math.abs(days)}d overdue` : `Due ${formatDate(filing.dueDate)}`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
