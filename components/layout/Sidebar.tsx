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
  ChevronLeft,
  MessageSquare,
  Award,
  Microscope,
  Zap,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

const navItems = [
  { href: "/dashboard",   label: "Dashboard",          icon: LayoutDashboard },
  { href: "/investors",   label: "Investors",           icon: Users },
  { href: "/attestation", label: "Attestation",         icon: ShieldCheck },
  { href: "/analyze",     label: "Contract Analyzer",   icon: Microscope },
  { href: "/filings",     label: "Filings",             icon: FileText },
  { href: "/tokens",      label: "Tokens",              icon: Layers },
  { href: "/passport",    label: "Issuer Passport",     icon: Award },
]

const TOTAL_CREDITS = 5000
const USED_CREDITS  = 3247
const REMAINING     = TOTAL_CREDITS - USED_CREDITS
const PCT_USED      = (USED_CREDITS / TOTAL_CREDITS) * 100

function DudiligLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono, var(--font-mono))",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
        }}
      >
        Dudilig
      </span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--rule)" }}
    >
      {/* Logo */}
      <div
        className={cn("flex items-center py-5 relative", collapsed ? "px-4 justify-center" : "px-5")}
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        {collapsed ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <>
            <DudiligLogo />
            <p className="fig-label mt-2 ml-7 absolute bottom-1.5">Compliance OS</p>
          </>
        )}
      </div>

      {/* Issuer context */}
      {!collapsed && (
        <div
          className="px-3 py-2.5 mx-3 mt-4 rounded-xl"
          style={{ background: "var(--bg-base)", border: "1px solid var(--rule)" }}
        >
          <p className="fig-label mb-0.5">Active Issuer</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Meridian Capital Partners
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Cayman Islands · 3 Tokens
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-0.5", collapsed ? "px-2" : "px-3")}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 py-2 rounded-xl text-sm transition-all group",
                collapsed ? "justify-center px-2" : "px-3"
              )}
              style={{
                background: active ? "rgba(59,130,246,0.10)" : "transparent",
                border: active ? "1px solid rgba(59,130,246,0.20)" : "1px solid transparent",
                color: active ? "var(--accent-blue)" : "var(--text-muted)",
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <>
                  {label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "var(--accent-blue)" }} />}
                </>
              )}
            </Link>
          )
        })}

        {/* Mike — separated with extra space */}
        <div className="pt-4">
          {(() => {
            const active = pathname === "/chat" || pathname.startsWith("/chat/")
            return (
              <Link
                href="/chat"
                title={collapsed ? "Mike — Compliance AI" : undefined}
                className={cn(
                  "flex items-center gap-3 py-2 rounded-xl text-sm transition-all group relative",
                  collapsed ? "justify-center px-2" : "px-3"
                )}
                style={{
                  background: active ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.04)",
                  border: active ? "1px solid rgba(59,130,246,0.30)" : "1px solid rgba(59,130,246,0.12)",
                  color: active ? "var(--accent-blue)" : "var(--text-muted)",
                }}
              >
                <div className="relative shrink-0">
                  <MessageSquare className="w-4 h-4" />
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse-soft"
                    style={{ background: "var(--accent-blue)" }}
                  />
                </div>
                {!collapsed && (
                  <>
                    <span>Mike</span>
                    <span className="ml-1 fig-label" style={{ color: "var(--accent-blue)", opacity: 0.7 }}>AI</span>
                    <Sparkles className="w-3 h-3 ml-auto" style={{ color: "var(--accent-blue)", opacity: 0.6 }} />
                  </>
                )}
              </Link>
            )
          })()}
        </div>
      </nav>

      {/* Credit meter */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div
            className="rounded-xl p-3 space-y-2.5"
            style={{ background: "var(--bg-base)", border: "1px solid var(--rule)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" style={{ color: "var(--accent-blue)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Credits</span>
              </div>
              <span className="fig-label">Platform tier</span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--rule-strong)" }}>
                <div className="h-full rounded-full" style={{ width: `${PCT_USED}%`, background: "var(--accent-blue)" }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>{REMAINING.toLocaleString()}</span>{" "}remaining
                </span>
                <span className="fig-label">{TOTAL_CREDITS.toLocaleString()} / mo</span>
              </div>
            </div>
            <button
              className="w-full py-1.5 text-xs font-medium rounded-full transition-colors"
              style={{ color: "var(--accent-blue)", border: "1px solid rgba(59,130,246,0.20)", background: "transparent" }}
            >
              Top up credits
            </button>
          </div>
        </div>
      )}

      {/* Footer / toggle */}
      <div
        className={cn("px-3 py-3 flex items-center", collapsed ? "justify-center" : "justify-between")}
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent-blue)" }}
            >
              MC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>Meridian Admin</p>
              <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>admin@meridian.ky</p>
            </div>
          </div>
        )}
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover-elevate shrink-0"
          style={{ color: "var(--text-muted)", border: "1px solid var(--rule)" }}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  )
}
