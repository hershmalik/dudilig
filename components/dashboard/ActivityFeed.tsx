import { activityEvents } from "@/lib/mock-data/activity"
import { timeAgo } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const severityIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const severityColor = {
  success: "text-[var(--accent-green)]",
  warning: "text-[var(--accent-amber)]",
  error: "text-[var(--accent-red)]",
  info: "text-[var(--accent-blue)]",
}

export function ActivityFeed() {
  return (
    <div className="space-y-0">
      {activityEvents.slice(0, 8).map((event, i) => {
        const Icon = severityIcon[event.severity]
        return (
          <div
            key={event.id}
            className={cn(
              "flex gap-3 px-4 py-3 hover:bg-[rgba(247,244,237,0.04)] transition-colors",
              i !== 0 && "border-t border-[var(--rule)]"
            )}
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", severityColor[event.severity])} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">{event.message}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{timeAgo(event.timestamp)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
