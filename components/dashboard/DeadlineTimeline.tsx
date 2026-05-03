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
              "flex items-start gap-3 px-4 py-3 hover:bg-[rgba(247,244,237,0.04)] transition-colors",
              i !== 0 && "border-t border-[var(--rule)]"
            )}
          >
            <div className={cn(
              "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold",
              isOverdue ? "bg-[rgba(239,68,68,0.10)] text-[var(--accent-red)]" : isUrgent ? "bg-[rgba(200,132,42,0.10)] text-[var(--accent-amber)]" : "bg-[rgba(247,244,237,0.06)] text-[var(--text-muted)]"
            )}>
              {isOverdue ? "!" : `${days}d`}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{filing.filingType}</p>
              <p className="text-xs text-[var(--text-tertiary)] truncate">{filing.jurisdiction}</p>
              <p className={cn(
                "text-xs mt-0.5",
                isOverdue ? "text-[var(--accent-red)]" : isUrgent ? "text-[var(--accent-amber)]" : "text-[var(--text-tertiary)]"
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
