"use client"

import { useState, useEffect } from "react"
import { Check, X, Loader2, ShieldCheck, Download, AlertTriangle } from "lucide-react"
import { attestationSteps, attestationFailSteps, complianceClaim } from "@/lib/mock-data/attestations"
import { cn } from "@/lib/utils"

type Step = {
  label: string
  duration: number
  failMessage?: string
}

type StepState = "idle" | "running" | "done" | "failed"

interface AttestationEngineProps {
  failMode: boolean
}

export function AttestationEngine({ failMode }: AttestationEngineProps) {
  const [status, setStatus] = useState<"idle" | "running" | "complete" | "failed">("idle")
  const [stepStates, setStepStates] = useState<StepState[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [hash, setHash] = useState("")

  const steps: Step[] = failMode ? attestationFailSteps : attestationSteps

  function reset() {
    setStatus("idle")
    setStepStates([])
    setCurrentStep(-1)
    setHash("")
  }

  async function runAttestation() {
    reset()
    setStatus("running")
    setStepStates(new Array(steps.length).fill("idle"))

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      setStepStates(prev => {
        const next = [...prev]
        next[i] = "running"
        return next
      })

      await new Promise(r => setTimeout(r, steps[i].duration))

      if (failMode && steps[i].failMessage) {
        setStepStates(prev => {
          const next = [...prev]
          next[i] = "failed"
          return next
        })
        setStatus("failed")
        return
      }

      setStepStates(prev => {
        const next = [...prev]
        next[i] = "done"
        return next
      })
    }

    setHash("a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456")
    setStatus("complete")
  }

  return (
    <div className="space-y-6">
      {/* Claim summary */}
      <div className="bg-[rgba(247,244,237,0.04)] rounded-xl border border-[var(--rule-strong)] p-5">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Compliance Claim</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(complianceClaim).map(([key, val]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="text-xs text-[var(--text-tertiary)] capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="text-xs font-mono text-[var(--text-primary)]">{String(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Run button */}
      {status === "idle" && (
        <button
          onClick={runAttestation}
          className="w-full py-3 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          Run Attestation
        </button>
      )}

      {status !== "idle" && (
        <div className="space-y-2">
          {steps.map((step, i) => {
            const state = stepStates[i] ?? "idle"
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300",
                  state === "idle" && "border-[var(--rule)] bg-[var(--bg-elevated)]/50 opacity-40",
                  state === "running" && "border-[rgba(59,130,246,0.40)] bg-[rgba(59,130,246,0.05)]",
                  state === "done" && "border-[rgba(74,222,128,0.30)] bg-[rgba(74,222,128,0.05)]",
                  state === "failed" && "border-[rgba(239,68,68,0.40)] bg-[rgba(239,68,68,0.05)]",
                )}
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {state === "running" && <Loader2 className="w-4 h-4 text-[var(--accent-blue)] animate-spin" />}
                  {state === "done" && <Check className="w-4 h-4 text-[var(--accent-green)]" />}
                  {state === "failed" && <X className="w-4 h-4 text-[var(--accent-red)]" />}
                  {state === "idle" && <div className="w-3 h-3 rounded-full border border-[var(--rule-strong)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs",
                    state === "idle" && "text-[var(--text-tertiary)]",
                    state === "running" && "text-[var(--accent-blue)]",
                    state === "done" && "text-[var(--accent-green)]",
                    state === "failed" && "text-[var(--accent-red)]",
                  )}>
                    {step.label}
                  </p>
                  {state === "failed" && step.failMessage && (
                    <p className="text-xs text-[var(--accent-red)] mt-1 font-mono">{step.failMessage}</p>
                  )}
                </div>
                {state === "done" && (
                  <span className="text-xs text-[var(--text-tertiary)] font-mono">{step.duration}ms</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Result */}
      {status === "complete" && (
        <div className="border border-[rgba(74,222,128,0.30)] bg-[rgba(74,222,128,0.05)] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(74,222,128,0.20)] rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-green)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--accent-green)]">Attestation Passed</p>
              <p className="text-xs text-[var(--text-muted)]">All {steps.length} fields verified — {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[var(--bg-elevated)] rounded-lg p-3">
            <p className="text-xs text-[var(--text-tertiary)] mb-1">Attestation Hash</p>
            <p className="text-xs font-mono text-[var(--accent-blue)] break-all">sha256:{hash}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runAttestation}
              className="flex-1 py-2 bg-[rgba(247,244,237,0.06)] hover:bg-[rgba(247,244,237,0.10)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors"
            >
              Run Again
            </button>
            <button className="flex-1 py-2 bg-[rgba(74,222,128,0.20)] hover:bg-[rgba(74,222,128,0.30)] text-[var(--accent-green)] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Download className="w-3 h-3" />
              Download Certificate
            </button>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="border border-[rgba(239,68,68,0.30)] bg-[rgba(239,68,68,0.05)] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(239,68,68,0.20)] rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[var(--accent-red)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--accent-red)]">Attestation Failed</p>
              <p className="text-xs text-[var(--text-muted)]">Contract does not match compliance claim — review required</p>
            </div>
          </div>
          <button
            onClick={runAttestation}
            className="w-full py-2 bg-[rgba(247,244,237,0.06)] hover:bg-[rgba(247,244,237,0.10)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
