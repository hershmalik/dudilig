"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Radio, CheckCircle2, ExternalLink } from "lucide-react"

interface RegMonitoringPanelProps {
  open: boolean
  onClose: () => void
}

const FEED = [
  {
    date: "May 16, 2026 · 06:14 AM",
    title: "FINRA Regulatory Notice 2026-08 scanned",
    note: "No rule changes affecting NMA package",
    viewable: false,
  },
  {
    date: "May 15, 2026 · 06:11 AM",
    title: "SEC Release 34-99821 scanned",
    note: "Reg S-P amendment flagged for review",
    viewable: true,
  },
  {
    date: "May 14, 2026 · 06:09 AM",
    title: "FinCEN Advisory FIN-2026-A003 scanned",
    note: "No impact on current AML program",
    viewable: false,
  },
  {
    date: "May 13, 2026 · 06:14 AM",
    title: "FINRA Rule 3310 amendment scan",
    note: "No change from prior version",
    viewable: false,
  },
  {
    date: "May 12, 2026 · 06:10 AM",
    title: "OCC Bulletin 2026-12 scanned",
    note: "No impact on current filing scope",
    viewable: false,
  },
]

function Toast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl text-sm shadow-2xl"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule-strong)", color: "var(--text-muted)" }}
        >
          Full regulatory brief coming soon
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RegMonitoringPanel({ open, onClose }: RegMonitoringPanelProps) {
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(6,8,13,0.6)", backdropFilter: "blur(2px)" }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed right-0 top-0 h-full z-50 flex flex-col w-full max-w-sm sm:max-w-md overflow-hidden"
              style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--rule)" }}
            >
              {/* Header */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--rule)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
                      <h2 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Regulatory Monitoring
                      </h2>
                    </div>
                    <p className="fig-label">Continuous scan — FINRA, SEC, FinCEN, OCC</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover-elevate shrink-0"
                    style={{ color: "var(--text-muted)", border: "1px solid var(--rule)" }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status row */}
                <div
                  className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "var(--bg-base)", border: "1px solid var(--rule)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse-soft shrink-0"
                    style={{ background: "var(--accent-green)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Active
                  </span>
                  <span className="fig-label">·</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Last run 6 hours ago
                  </span>
                  <span className="fig-label">·</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    0 new rules flagged
                  </span>
                </div>
              </div>

              {/* Feed */}
              <div className="flex-1 overflow-y-auto py-2">
                {FEED.map((item, i) => (
                  <div
                    key={i}
                    className="px-5 py-3.5"
                    style={{ borderBottom: i < FEED.length - 1 ? "1px solid var(--rule)" : undefined }}
                  >
                    <p className="fig-label mb-1">{item.date}</p>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "var(--accent-green)" }} />
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.note}
                      </p>
                      {item.viewable && (
                        <button
                          onClick={showToast}
                          className="flex items-center gap-1 text-xs ml-1 hover:opacity-80 transition-opacity"
                          style={{ color: "var(--accent-blue)" }}
                        >
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 space-y-2" style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-deepest)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Next scan scheduled:{" "}
                  <span style={{ color: "var(--text-primary)" }}>May 17, 2026 · 06:00 AM</span>
                </p>
                <p className="fig-label">
                  Monitoring is active for IXS demo. Full regulatory alert routing available post-launch.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Toast visible={toast} />
    </>
  )
}
