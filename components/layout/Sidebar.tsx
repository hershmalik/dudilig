"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Microscope,
  Zap,
} from "lucide-react"

const mainNav = [
  { href: "/dashboard",   label: "Dashboard",          icon: LayoutDashboard },
  { href: "/investors",   label: "Investors",          icon: Users },
  { href: "/attestation", label: "Attestation",        icon: ShieldCheck },
  { href: "/analyze",     label: "Contract Analyzer",  icon: Microscope },
  { href: "/filings",     label: "Filings",            icon: FileText },
  { href: "/tokens",      label: "Tokens",             icon: Layers },
  { href: "/certificate", label: "Trust Certificate",  icon: Award },
]

const aiNav = { href: "/chat", label: "Mike, Compliance AI", shortLabel: "Mike", icon: Sparkles }

const TOTAL_CREDITS = 5000
const USED_CREDITS  = 3247
const REMAINING     = TOTAL_CREDITS - USED_CREDITS
const PCT_USED      = (USED_CREDITS / TOTAL_CREDITS) * 100
const STORAGE_KEY   = "dudilig.sidebar.collapsed"
const EASE: [number, number, number, number] = [0.165, 0.84, 0.44, 1]

function DudiligLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group" data-testid="link-logo">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Dudilig
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

function NavLink({
  href,
  label,
  Icon,
  active,
  collapsed,
  testId,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
  collapsed: boolean
  testId: string
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
      style={{
        background: active ? "rgba(59,130,246,0.10)" : "transparent",
        border: active ? "1px solid rgba(59,130,246,0.20)" : "1px solid transparent",
        color: active ? "var(--accent-blue)" : "var(--text-muted)",
      }}
      data-testid={testId}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap overflow-hidden flex-1"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && !collapsed && (
        <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "var(--accent-blue)" }} />
      )}
    </Link>
  )
}

function MikeLink({ active, collapsed }: { active: boolean; collapsed: boolean }) {
  const Icon = aiNav.icon
  return (
    <div className="relative group" title={collapsed ? aiNav.label : undefined}>
      {/* Outer glow halo — pulses always, intensifies on hover/active */}
      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(99,102,241,0.45), rgba(59,130,246,0.25) 40%, transparent 70%)",
          filter: "blur(14px)",
        }}
        animate={{ opacity: active ? [0.55, 0.85, 0.55] : [0.25, 0.5, 0.25] }}
        transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Rotating conic-gradient ring (the magic) */}
      <div className="relative rounded-xl overflow-hidden p-[1.5px]">
        <motion.div
          aria-hidden
          className="absolute inset-[-60%] pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, #3B82F6 0deg, #6366F1 90deg, #8B5CF6 180deg, #3B82F6 270deg, #3B82F6 360deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />

        {/* Inner button surface — sits above the rotating ring */}
        <Link
          href={aiNav.href}
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors"
          style={{
            background: active
              ? "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(99,102,241,0.10))"
              : "var(--bg-elevated)",
            color: active ? "#ffffff" : "var(--text-primary)",
          }}
          data-testid="link-mike"
        >
          <span className="relative shrink-0">
            <Icon
              className="w-4 h-4"
              style={{ color: active ? "#ffffff" : "var(--accent-blue)" }}
            />
            {/* Tiny live-status pulse dot */}
            <motion.span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "#4ADE80", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            />
          </span>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col min-w-0 flex-1"
              >
                <span
                  className="font-medium whitespace-nowrap overflow-hidden"
                  style={{ fontSize: "13.5px", letterSpacing: "-0.01em" }}
                >
                  {aiNav.label}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider whitespace-nowrap"
                  style={{
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Always on · streaming
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
    } catch {}
  }, [collapsed, hydrated])

  const aiActive = pathname === aiNav.href || pathname.startsWith(aiNav.href + "/")

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      initial={false}
      transition={{ duration: 0.35, ease: EASE }}
      className="hidden lg:flex shrink-0 flex-col h-screen sticky top-0 relative"
      style={{
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--rule)",
      }}
      data-testid="sidebar"
    >
      {/* Collapse toggle — floats on the right edge */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-7 z-30 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:scale-110"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--rule)",
          color: "var(--text-muted)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-testid="button-sidebar-toggle"
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ display: "inline-flex" }}
        >
          <ChevronLeft className="w-3 h-3" />
        </motion.div>
      </button>

      {/* Logo */}
      <div
        className={collapsed ? "px-4 py-5" : "px-5 py-5"}
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <DudiligLogo collapsed={collapsed} />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="fig-label mt-2 ml-7"
              style={{ overflow: "hidden" }}
            >
              Compliance OS
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Issuer context — hides when collapsed */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="px-3 py-2.5 mx-3 rounded-xl"
            style={{
              background: "var(--bg-base)",
              border: "1px solid var(--rule)",
              overflow: "hidden",
            }}
          >
            <p className="fig-label mb-0.5">Active Issuer</p>
            <p className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
              Meridian Capital Partners
            </p>
            <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
              Cayman Islands · 3 Tokens
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main nav */}
      <nav className={collapsed ? "px-2 py-4 space-y-0.5" : "px-3 py-4 space-y-0.5"}>
        {mainNav.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <NavLink
              key={href}
              href={href}
              label={label}
              Icon={icon}
              active={active}
              collapsed={collapsed}
              testId={`link-nav-${href.slice(1)}`}
            />
          )
        })}
      </nav>

      {/* Spacer pushes Mike toward the bottom area */}
      <div className="flex-1" />

      {/* Mike — visually separated with a divider + extra breathing room */}
      <div className={collapsed ? "px-2" : "px-3"}>
        <div className="relative my-3 flex items-center gap-3" aria-hidden>
          <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fig-label"
                style={{ fontSize: "9px" }}
              >
                Copilot
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
        </div>
        <MikeLink active={aiActive} collapsed={collapsed} />
      </div>

      {/* Credit meter */}
      <div className={collapsed ? "px-2 pb-3 pt-3" : "px-3 pb-3 pt-3"}>
        {collapsed ? (
          <div
            className="rounded-xl py-2 flex items-center justify-center"
            style={{ background: "var(--bg-base)", border: "1px solid var(--rule)" }}
            title={`${REMAINING.toLocaleString()} of ${TOTAL_CREDITS.toLocaleString()} credits remaining`}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--accent-blue)" }} />
          </div>
        ) : (
          <div
            className="rounded-xl p-3 space-y-2.5"
            style={{ background: "var(--bg-base)", border: "1px solid var(--rule)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" style={{ color: "var(--accent-blue)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Credits</span>
              </div>
              <span className="fig-label">Platform tier</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--rule-strong)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${PCT_USED}%`, background: "var(--accent-blue)" }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {REMAINING.toLocaleString()}
                  </span>{" "}remaining
                </span>
                <span className="fig-label">{TOTAL_CREDITS.toLocaleString()} / mo</span>
              </div>
            </div>

            <button
              className="w-full py-1.5 text-xs font-medium rounded-full transition-colors"
              style={{
                color: "var(--accent-blue)",
                border: "1px solid rgba(59,130,246,0.20)",
                background: "transparent",
              }}
              data-testid="button-topup-credits"
            >
              Top up credits
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={collapsed ? "px-3 py-4" : "px-4 py-4"} style={{ borderTop: "1px solid var(--rule)" }}>
        <div className={collapsed ? "flex justify-center" : "flex items-center gap-3"}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent-blue)" }}
            title={collapsed ? "Meridian Admin" : undefined}
          >
            MC
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="text-xs font-medium truncate whitespace-nowrap" style={{ color: "var(--text-primary)" }}>Meridian Admin</p>
                <p className="text-xs truncate whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>admin@meridian.ky</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
