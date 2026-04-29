import { Bell } from "lucide-react"

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="min-w-0">
        <h1 className="text-slate-50 font-semibold text-base truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {action}
        <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
