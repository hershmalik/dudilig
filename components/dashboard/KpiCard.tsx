import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  delta?: string
  deltaType?: "positive" | "negative" | "neutral"
  iconColor?: string
  badge?: React.ReactNode
}

export function KpiCard({ label, value, icon: Icon, delta, deltaType = "neutral", iconColor = "text-violet-400", badge }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-50">{value}</p>
            {badge}
          </div>
          {delta && (
            <p className={cn(
              "text-xs",
              deltaType === "positive" && "text-emerald-400",
              deltaType === "negative" && "text-red-400",
              deltaType === "neutral" && "text-slate-500",
            )}>
              {delta}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 bg-slate-800 rounded-lg", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  )
}
