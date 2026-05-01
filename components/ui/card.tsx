import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)" }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3
      className={cn("text-sm font-medium", className)}
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </h3>
  )
}
