"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Check, X, Sparkles, Loader2 } from "lucide-react"

interface CreditPack {
  id: string
  credits: number
  priceUsd: number
  badge?: string
  perks: string[]
}

const PACKS: CreditPack[] = [
  {
    id: "starter",
    credits: 1000,
    priceUsd: 49,
    perks: ["~200 attestation runs", "Carries over 30 days"],
  },
  {
    id: "growth",
    credits: 5000,
    priceUsd: 199,
    badge: "Most popular",
    perks: ["~1,000 attestation runs", "Priority Claude routing", "Carries over 90 days"],
  },
  {
    id: "scale",
    credits: 25000,
    priceUsd: 799,
    perks: ["~5,000 attestation runs", "Priority Claude routing", "Dedicated audit log"],
  },
]

const EASE: [number, number, number, number] = [0.165, 0.84, 0.44, 1]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchase: (credits: number) => void
  remaining: number
  total: number
}

type Stage = "select" | "processing" | "success"

export function CreditTopUpDialog({ open, onOpenChange, onPurchase, remaining, total }: Props) {
  const [selected, setSelected] = useState<string>("growth")
  const [stage, setStage] = useState<Stage>("select")
  const [purchased, setPurchased] = useState<CreditPack | null>(null)

  const reset = () => {
    setStage("select")
    setSelected("growth")
    setPurchased(null)
  }

  const handlePurchase = async () => {
    const pack = PACKS.find((p) => p.id === selected)
    if (!pack) return
    setStage("processing")
    // Simulate payment processor latency
    await new Promise((r) => setTimeout(r, 1100))
    setPurchased(pack)
    setStage("success")
    onPurchase(pack.credits)
  }

  const handleClose = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      // Reset after exit animation
      setTimeout(reset, 250)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50"
                style={{ background: "rgba(8,8,10,0.7)", backdropFilter: "blur(4px)" }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden focus:outline-none"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--rule)",
                  boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
                }}
                data-testid="dialog-topup"
              >
                {/* Close button */}
                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:scale-105"
                    style={{
                      background: "var(--bg-base)",
                      border: "1px solid var(--rule)",
                      color: "var(--text-muted)",
                    }}
                    aria-label="Close"
                    data-testid="button-topup-close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Dialog.Close>

                <AnimatePresence mode="wait">
                  {stage === "select" && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="px-7 pt-7 pb-5" style={{ borderBottom: "1px solid var(--rule)" }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Zap className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
                          <span className="fig-label">Top up credits</span>
                        </div>
                        <Dialog.Title asChild>
                          <h2
                            className="text-xl font-semibold"
                            style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                          >
                            Buy more compliance credits
                          </h2>
                        </Dialog.Title>
                        <Dialog.Description asChild>
                          <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                            You have{" "}
                            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                              {remaining.toLocaleString()}
                            </span>{" "}
                            of {total.toLocaleString()} credits remaining this month. Top up never expires.
                          </p>
                        </Dialog.Description>
                      </div>

                      {/* Packs */}
                      <div className="px-7 py-5 space-y-2.5">
                        {PACKS.map((pack) => {
                          const isSelected = selected === pack.id
                          return (
                            <button
                              key={pack.id}
                              onClick={() => setSelected(pack.id)}
                              className="w-full text-left rounded-xl p-4 transition-all"
                              style={{
                                background: isSelected
                                  ? "rgba(59,130,246,0.08)"
                                  : "var(--bg-base)",
                                border: isSelected
                                  ? "1px solid rgba(59,130,246,0.45)"
                                  : "1px solid var(--rule)",
                              }}
                              data-testid={`button-pack-${pack.id}`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-base font-semibold"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {pack.credits.toLocaleString()} credits
                                  </span>
                                  {pack.badge && (
                                    <span
                                      className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                                      style={{
                                        background: "rgba(59,130,246,0.15)",
                                        color: "var(--accent-blue)",
                                        fontFamily: "var(--font-mono)",
                                      }}
                                    >
                                      {pack.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <div
                                    className="text-base font-semibold"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    ${pack.priceUsd}
                                  </div>
                                  <div
                                    className="text-[10px] uppercase tracking-wider"
                                    style={{
                                      color: "var(--text-tertiary)",
                                      fontFamily: "var(--font-mono)",
                                    }}
                                  >
                                    ${(pack.priceUsd / pack.credits * 1000).toFixed(2)} / 1k
                                  </div>
                                </div>
                              </div>
                              <ul className="space-y-1">
                                {pack.perks.map((perk) => (
                                  <li
                                    key={perk}
                                    className="text-xs flex items-center gap-1.5"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    <Check
                                      className="w-3 h-3 shrink-0"
                                      style={{ color: "var(--accent-green)" }}
                                    />
                                    {perk}
                                  </li>
                                ))}
                              </ul>
                            </button>
                          )
                        })}
                      </div>

                      {/* Footer */}
                      <div
                        className="px-7 py-4 flex items-center justify-between gap-3"
                        style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-base)" }}
                      >
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                          Demo mode · no charge will be processed
                        </p>
                        <button
                          onClick={handlePurchase}
                          className="px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: "var(--accent-blue)",
                            color: "#ffffff",
                            boxShadow: "0 6px 20px -6px rgba(59,130,246,0.6)",
                          }}
                          data-testid="button-confirm-purchase"
                        >
                          Purchase{" "}
                          {PACKS.find((p) => p.id === selected)?.credits.toLocaleString()} credits
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {stage === "processing" && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-7 py-16 flex flex-col items-center justify-center text-center"
                      data-testid="state-processing"
                    >
                      <Loader2
                        className="w-8 h-8 animate-spin mb-4"
                        style={{ color: "var(--accent-blue)" }}
                      />
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Processing your top-up
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        Crediting your workspace
                      </p>
                    </motion.div>
                  )}

                  {stage === "success" && purchased && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="px-7 py-12 flex flex-col items-center justify-center text-center"
                      data-testid="state-success"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
                        className="relative mb-4"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(74,222,128,0.12)",
                            border: "1px solid rgba(74,222,128,0.4)",
                          }}
                        >
                          <Check className="w-7 h-7" style={{ color: "var(--accent-green)" }} />
                        </div>
                        <Sparkles
                          className="absolute -top-1 -right-1 w-4 h-4"
                          style={{ color: "var(--accent-blue)" }}
                        />
                      </motion.div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                      >
                        {purchased.credits.toLocaleString()} credits added
                      </h3>
                      <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        ${purchased.priceUsd} charged · receipt sent to admin@meridian.ky
                      </p>
                      <button
                        onClick={() => handleClose(false)}
                        className="mt-6 px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "var(--accent-blue)",
                          color: "#ffffff",
                        }}
                        data-testid="button-success-done"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
