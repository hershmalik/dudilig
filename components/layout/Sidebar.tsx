"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Layers,
  ChevronRight,
  MessageSquare,
  Award,
  Microscope,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/attestation", label: "Attestation", icon: ShieldCheck },
  { href: "/analyze", label: "Contract Analyzer", icon: Microscope },
  { href: "/filings", label: "Filings", icon: FileText },
  { href: "/tokens", label: "Tokens", icon: Layers },
  { href: "/chat", label: "Compliance AI", icon: MessageSquare },
  { href: "/certificate", label: "Trust Certificate", icon: Award },
]

const TOTAL_CREDITS = 5000
const USED_CREDITS = 3247
const REMAINING = TOTAL_CREDITS - USED_CREDITS
const PCT_USED = (USED_CREDITS / TOTAL_CREDITS) * 100

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-slate-950 border-r border-slate-800 flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-slate-50 font-semibold text-sm tracking-tight">Dudilig</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 ml-9">Compliance OS</p>
      </div>

      {/* Issuer context */}
      <div className="px-4 py-3 mx-3 mt-4 bg-slate-800/50 rounded-lg border border-slate-800">
        <p className="text-xs text-slate-500 mb-0.5">Active Issuer</p>
        <p className="text-sm text-slate-200 font-medium">Meridian Capital Partners</p>
        <p className="text-xs text-slate-500 mt-0.5">Cayman Islands · 3 Tokens</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                active
                  ? "bg-violet-600/15 text-violet-400 border border-violet-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300")} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-violet-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Credit meter */}
      <div className="px-3 pb-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-medium text-slate-300">Credits</span>
            </div>
            <span className="text-xs text-slate-500">Platform tier</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${PCT_USED}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{REMAINING.toLocaleString()}</span> remaining
              </span>
              <span className="text-xs text-slate-600">{TOTAL_CREDITS.toLocaleString()} / mo</span>
            </div>
          </div>

          <button className="w-full py-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 border border-violet-600/20 hover:border-violet-600/40 rounded-lg transition-colors">
            Top up credits
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-violet-600/30 rounded-full flex items-center justify-center text-xs font-semibold text-violet-300">
            MC
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">Meridian Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@meridian.ky</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
