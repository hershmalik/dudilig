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
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
  info: "text-violet-400",
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
              "flex gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors",
              i !== 0 && "border-t border-slate-800/60"
            )}
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", severityColor[event.severity])} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300 leading-relaxed">{event.message}</p>
              <p className="text-xs text-slate-600 mt-0.5">{timeAgo(event.timestamp)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
