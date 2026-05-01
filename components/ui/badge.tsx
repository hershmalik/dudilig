import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline"
  className?: string
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: "rgba(247,244,237,0.08)", color: "var(--text-muted)", borderColor: "var(--rule-strong)" },
  success: { background: "rgba(74,222,128,0.10)", color: "#4ADE80", borderColor: "rgba(74,222,128,0.20)" },
  warning: { background: "rgba(200,132,42,0.10)", color: "#C8842A", borderColor: "rgba(200,132,42,0.20)" },
  error:   { background: "rgba(239,68,68,0.10)",  color: "#EF4444", borderColor: "rgba(239,68,68,0.20)" },
  info:    { background: "rgba(59,130,246,0.10)",  color: "#3B82F6", borderColor: "rgba(59,130,246,0.20)" },
  outline: { background: "transparent", color: "var(--text-muted)", borderColor: "var(--rule-strong)" },
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border", className)}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  )
}
