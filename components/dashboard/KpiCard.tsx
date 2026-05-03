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

export function KpiCard({ label, value, icon: Icon, delta, deltaType = "neutral", iconColor = "text-[var(--accent-blue)]", badge }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
            {badge}
          </div>
          {delta && (
            <p className={cn(
              "text-xs",
              deltaType === "positive" && "text-[var(--accent-green)]",
              deltaType === "negative" && "text-[var(--accent-red)]",
              deltaType === "neutral" && "text-[var(--text-tertiary)]",
            )}>
              {delta}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 bg-[rgba(247,244,237,0.06)] rounded-lg", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  )
}
