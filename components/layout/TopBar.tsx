import { Bell } from "lucide-react"

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header
      className="px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10"
      style={{
        background: "rgba(11,14,22,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="min-w-0">
        <h1 className="font-medium text-base truncate" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="fig-label mt-0.5 truncate hidden sm:block">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {action}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors relative"
          style={{ color: "var(--text-muted)" }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse-soft"
            style={{ background: "var(--accent-red)" }}
          />
        </button>
      </div>
    </header>
  )
}
