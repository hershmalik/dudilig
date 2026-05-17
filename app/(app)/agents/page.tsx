"use client"

import { useState, useRef } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Combobox } from "@/components/ui/Combobox"
import { Play, Loader2, RotateCcw } from "lucide-react"

const TM_VENDORS = ["Nasdaq Surveillance", "NICE Actimize", "Behavox", "Oracle Financial Crime", "Other"]
const SANCTIONS_VENDORS = ["ComplyAdvantage", "Refinitiv World-Check", "Dow Jones Risk", "Accuity", "Other"]

const CONNECTED_SOURCES = [
  "Stratum Entity Profile",
  "MAS AML Program Doc",
  "FINRA NMA Rule Pack v2024.11",
]

type Tab = "coverage-mapper" | "vendor-gap" | "program-decision"

// ── Coverage Mapper ─────────────────────────────────────────────────────────

function CoverageMapper() {
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function runAnalysis() {
    if (running) {
      abortRef.current?.abort()
      return
    }
    setRunning(true)
    setOutput("")
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/agents/coverage-mapper", {
        method: "POST",
        signal: abortRef.current.signal,
      })
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setOutput(prev => prev + "\n[Connection error — please retry]")
      }
    } finally {
      setRunning(false)
    }
  }

  function reset() {
    abortRef.current?.abort()
    setOutput("")
    setRunning(false)
  }

  return (
    <div className="space-y-5">
      {/* Connected sources strip */}
      <div className="flex items-center flex-wrap gap-2">
        {CONNECTED_SOURCES.map(src => (
          <div
            key={src}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--rule)",
              color: "var(--text-muted)",
            }}
          >
            <span style={{ color: "var(--accent-blue)", fontSize: "10px" }}>⬡</span>
            {src}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={runAnalysis}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: running ? "rgba(239,68,68,0.10)" : "var(--accent-blue)",
            color: running ? "var(--accent-red)" : "#fff",
            border: running ? "1px solid rgba(239,68,68,0.30)" : "none",
          }}
        >
          {running ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Stop</>
          ) : (
            <><Play className="w-4 h-4" /> Run Coverage Analysis</>
          )}
        </button>
        {output && !running && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--rule)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Output */}
      {(output || running) && (
        <div
          className="rounded-2xl p-5 min-h-[200px]"
          style={{ background: "var(--bg-deepest)", border: "1px solid var(--rule)" }}
        >
          <pre
            className="text-sm leading-relaxed whitespace-pre-wrap font-mono"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {output}
            {running && <span className="animate-pulse" style={{ color: "var(--accent-blue)" }}>▋</span>}
          </pre>
        </div>
      )}

      {!output && !running && (
        <div
          className="rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center"
          style={{ background: "var(--bg-deepest)", border: "1px dashed var(--rule-strong)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Coverage mapper will analyze Stratum Digital's MAS AML program against FinCEN/BSA requirements.
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Analysis takes approximately 15–20 seconds.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Vendor Gap Pricer ────────────────────────────────────────────────────────

function VendorGapPricer() {
  const [tmVendor, setTmVendor] = useState("")
  const [sanctionsVendor, setSanctionsVendor] = useState("")
  const [firmName, setFirmName] = useState("Stratum Digital US LLC")
  const [annualTxVol, setAnnualTxVol] = useState("")
  const [clearingFirm, setClearingFirm] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Field label="Firm Name">
        <input
          value={firmName}
          onChange={e => setFirmName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
        />
      </Field>

      <Field label="Annual Transaction Volume">
        <input
          value={annualTxVol}
          onChange={e => setAnnualTxVol(e.target.value)}
          placeholder="e.g. $250M"
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
        />
      </Field>

      <Field label="Transaction Monitoring Vendor">
        <Combobox
          options={TM_VENDORS}
          value={tmVendor}
          onChange={setTmVendor}
          placeholder="Select TM vendor..."
        />
      </Field>

      <Field label="Sanctions Screening Vendor">
        <Combobox
          options={SANCTIONS_VENDORS}
          value={sanctionsVendor}
          onChange={setSanctionsVendor}
          placeholder="Select sanctions vendor..."
        />
      </Field>

      <Field label="Clearing Firm">
        <input
          value={clearingFirm}
          onChange={e => setClearingFirm(e.target.value)}
          placeholder="e.g. Apex Clearing"
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
        />
      </Field>

      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl text-sm font-medium"
        style={{ background: "var(--accent-blue)", color: "#fff" }}
      >
        {submitted ? "✓ Submitted — analysis queued" : "Price Vendor Gap"}
      </button>
    </form>
  )
}

// ── Program Decision ─────────────────────────────────────────────────────────

function ProgramDecision() {
  const [tmVendor, setTmVendor] = useState("")
  const [sanctionsVendor, setSanctionsVendor] = useState("")
  const [scope, setScope] = useState("")
  const [budget, setBudget] = useState("")
  const [timeline, setTimeline] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Field label="Program Scope">
        <textarea
          value={scope}
          onChange={e => setScope(e.target.value)}
          rows={3}
          placeholder="Describe the program scope, regulatory requirements, and business context..."
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
        />
      </Field>

      <Field label="Budget Range">
        <select
          value={budget}
          onChange={e => setBudget(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: budget ? "var(--text-primary)" : "var(--text-tertiary)" }}
        >
          <option value="" disabled>Select range...</option>
          <option>Under $500K</option>
          <option>$500K – $1M</option>
          <option>$1M – $2.5M</option>
          <option>$2.5M+</option>
        </select>
      </Field>

      <Field label="Implementation Timeline">
        <select
          value={timeline}
          onChange={e => setTimeline(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: timeline ? "var(--text-primary)" : "var(--text-tertiary)" }}
        >
          <option value="" disabled>Select timeline...</option>
          <option>0–3 months</option>
          <option>3–6 months</option>
          <option>6–12 months</option>
          <option>12+ months</option>
        </select>
      </Field>

      <Field label="Transaction Monitoring Vendor">
        <Combobox
          options={TM_VENDORS}
          value={tmVendor}
          onChange={setTmVendor}
          placeholder="Select TM vendor..."
        />
      </Field>

      <Field label="Sanctions Screening Vendor">
        <Combobox
          options={SANCTIONS_VENDORS}
          value={sanctionsVendor}
          onChange={setSanctionsVendor}
          placeholder="Select sanctions vendor..."
        />
      </Field>

      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl text-sm font-medium"
        style={{ background: "var(--accent-blue)", color: "#fff" }}
      >
        {submitted ? "✓ Submitted — decision queued" : "Generate Program Decision"}
      </button>
    </form>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; agent: string }[] = [
  { id: "coverage-mapper",    label: "Coverage Mapper",    agent: "Agent 1" },
  { id: "vendor-gap",         label: "Vendor Gap Pricer",  agent: "Agent 2" },
  { id: "program-decision",   label: "Program Decision",   agent: "Agent 3" },
]

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("coverage-mapper")

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Compliance Agents"
        subtitle="Automated analysis and decision engines"
      />

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* Tab bar */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)" }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: activeTab === tab.id ? "rgba(59,130,246,0.12)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                color: activeTab === tab.id ? "var(--accent-blue)" : "var(--text-muted)",
              }}
            >
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-base)",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tab.agent}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)" }}
        >
          {activeTab === "coverage-mapper" && <CoverageMapper />}
          {activeTab === "vendor-gap" && <VendorGapPricer />}
          {activeTab === "program-decision" && <ProgramDecision />}
        </div>
      </div>
    </div>
  )
}
