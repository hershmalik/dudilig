"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from "lucide-react"
import { activityEvents } from "@/lib/mock-data/activity"
import { timeAgo, cn } from "@/lib/utils"

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const severityIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const

const severityColorVar: Record<string, string> = {
  success: "var(--accent-green)",
  warning: "var(--accent-amber)",
  error: "var(--accent-red)",
  info: "var(--accent-blue)",
}

const typeRoute: Record<string, string> = {
  kyc: "/investors",
  aml: "/investors",
  investor: "/investors",
  attestation: "/attestation",
  filing: "/filings",
}

const READ_STORAGE_KEY = "dudilig.notifications.readIds"

export function TopBar({ title, subtitle, action }: TopBarProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  // Hydrate read state from localStorage on mount.
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(READ_STORAGE_KEY) : null
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]))
    } catch {
      /* ignore corrupt storage */
    }
  }, [])

  // Click-outside + escape to close.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function persistRead(next: Set<string>) {
    setReadIds(next)
    try {
      window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...next]))
    } catch {
      /* ignore quota */
    }
  }

  function markOneRead(id: string) {
    if (readIds.has(id)) return
    persistRead(new Set([...readIds, id]))
  }

  function markAllRead() {
    persistRead(new Set(activityEvents.map((e) => e.id)))
  }

  function handleItemClick(id: string, type: string) {
    markOneRead(id)
    setOpen(false)
    const route = typeRoute[type]
    if (route) router.push(route)
  }

  // Most recent first.
  const sorted = [...activityEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  const unreadCount = sorted.filter((e) => !readIds.has(e.id)).length

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
      <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={containerRef}>
        {action}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
            aria-expanded={open}
            aria-haspopup="menu"
            data-testid="button-notifications"
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors relative hover-elevate"
            style={{ color: "var(--text-muted)" }}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 min-w-[10px] h-[10px] px-[3px] rounded-full flex items-center justify-center text-[8px] font-bold leading-none animate-pulse-soft"
                style={{ background: "var(--accent-red)", color: "#fff" }}
                data-testid="badge-notification-count"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Notifications"
              data-testid="panel-notifications"
              className="absolute right-0 mt-2 w-[360px] sm:w-[400px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--rule-strong)",
                zIndex: 50,
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="fig-label" style={{ color: "var(--text-muted)" }}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    data-testid="button-mark-all-read"
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto">
                {sorted.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      No notifications
                    </p>
                  </div>
                ) : (
                  sorted.map((event, i) => {
                    const Icon = severityIcon[event.severity]
                    const isUnread = !readIds.has(event.id)
                    const route = typeRoute[event.type]
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleItemClick(event.id, event.type)}
                        data-testid={`notification-${event.id}`}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left hover-elevate transition-colors",
                          i !== 0 && "border-t"
                        )}
                        style={{
                          borderTopColor: i !== 0 ? "var(--rule)" : undefined,
                          cursor: route ? "pointer" : "default",
                        }}
                      >
                        <Icon
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: severityColorVar[event.severity] }}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs leading-relaxed"
                            style={{
                              color: isUnread ? "var(--text-primary)" : "var(--text-muted)",
                              fontWeight: isUnread ? 500 : 400,
                            }}
                          >
                            {event.message}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {timeAgo(event.timestamp)}
                          </p>
                        </div>
                        {isUnread && (
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ background: "var(--accent-blue)" }}
                            aria-label="Unread"
                          />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2.5"
                style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-deepest)" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    router.push("/dashboard")
                  }}
                  data-testid="button-view-all-activity"
                  className="text-xs hover:opacity-80 transition-opacity w-full text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  View all activity →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
