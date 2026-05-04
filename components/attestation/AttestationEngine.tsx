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
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Compliance Claim</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(complianceClaim).map(([key, val]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="text-xs font-mono text-slate-300">{String(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Run button */}
      {status === "idle" && (
        <button
          onClick={runAttestation}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
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
                  state === "idle" && "border-slate-800 bg-slate-900/50 opacity-40",
                  state === "running" && "border-violet-600/40 bg-violet-600/5",
                  state === "done" && "border-emerald-600/30 bg-emerald-600/5",
                  state === "failed" && "border-red-600/40 bg-red-600/5",
                )}
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {state === "running" && <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />}
                  {state === "done" && <Check className="w-4 h-4 text-emerald-400" />}
                  {state === "failed" && <X className="w-4 h-4 text-red-400" />}
                  {state === "idle" && <div className="w-3 h-3 rounded-full border border-slate-700" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs",
                    state === "idle" && "text-slate-500",
                    state === "running" && "text-violet-300",
                    state === "done" && "text-emerald-400",
                    state === "failed" && "text-red-400",
                  )}>
                    {step.label}
                  </p>
                  {state === "failed" && step.failMessage && (
                    <p className="text-xs text-red-500 mt-1 font-mono">{step.failMessage}</p>
                  )}
                </div>
                {state === "done" && (
                  <span className="text-xs text-slate-600 font-mono">{step.duration}ms</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Result */}
      {status === "complete" && (
        <div className="border border-emerald-600/30 bg-emerald-600/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Attestation Passed</p>
              <p className="text-xs text-slate-400">All {steps.length} fields verified — {new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Attestation Hash</p>
            <p className="text-xs font-mono text-violet-300 break-all">sha256:{hash}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runAttestation}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              Run Again
            </button>
            <button className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Download className="w-3 h-3" />
              Download Certificate
            </button>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="border border-red-600/30 bg-red-600/5 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400">Attestation Failed</p>
              <p className="text-xs text-slate-400">Contract does not match compliance claim — review required</p>
            </div>
          </div>
          <button
            onClick={runAttestation}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
