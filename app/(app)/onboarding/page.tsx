"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Layers, FileText, CheckCircle2, ArrowRight, ArrowLeft, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const steps = [
  { id: 1, label: "Your Identity", icon: Wallet },
  { id: 2, label: "Your Token", icon: Layers },
  { id: 3, label: "Compliance Setup", icon: FileText },
  { id: 4, label: "First Attestation", icon: ShieldCheck },
]

const jurisdictions = ["Cayman Islands", "Singapore", "ADGM", "BVI", "Luxembourg", "Delaware"]
const standards = ["ERC-1400", "ERC-3643", "ERC-20 (restricted)"]
const networks = ["Ethereum", "Polygon", "Solana", "Base"]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    entityName: "",
    jurisdiction: "",
    contactEmail: "",
    tokenName: "",
    standard: "",
    network: "",
    contractAddress: "",
    maxInvestors: "",
    lockupMonths: "",
    accreditedOnly: true,
    kycProvider: "Dudilig Native",
    amlEnabled: true,
    sanctionsScreening: true,
  })

  function next() { if (step < 4) setStep(s => s + 1) }
  function back() { if (step > 1) setStep(s => s - 1) }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--bg-elevated)] border-r border-[var(--rule)] p-8 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-[var(--accent-blue)] rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] text-sm">Dudilig</span>
        </div>

        <div className="space-y-1">
          {steps.map(s => {
            const Icon = s.icon
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  done ? "bg-[var(--accent-green)] text-white" :
                  active ? "bg-[var(--accent-blue)] text-white" :
                  "bg-[rgba(247,244,237,0.06)] text-[var(--text-tertiary)]"
                }`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-sm ${active ? "text-[var(--text-primary)] font-medium" : done ? "text-[var(--text-muted)]" : "text-[var(--text-tertiary)]"}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-auto">
          <div className="bg-[rgba(59,130,246,0.10)] border border-[var(--accent-blue)]/20 rounded-xl p-4">
            <p className="text-xs text-[var(--accent-blue)] font-medium mb-1">Setup takes ~3 minutes</p>
            <p className="text-xs text-[var(--text-tertiary)]">Your first attestation runs automatically when setup is complete.</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1 h-1 bg-[rgba(247,244,237,0.06)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-blue)] rounded-full transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">Step {step} of 4</span>
          </div>

          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tell us about your entity</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">We use this to configure your compliance workspace and jurisdiction rules.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Legal Entity Name</label>
                  <input
                    value={form.entityName}
                    onChange={e => setForm(f => ({ ...f, entityName: e.target.value }))}
                    placeholder="Meridian Capital Partners Ltd."
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Domicile Jurisdiction</label>
                  <select
                    value={form.jurisdiction}
                    onChange={e => setForm(f => ({ ...f, jurisdiction: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                  >
                    <option value="">Select jurisdiction</option>
                    {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Contact Email</label>
                  <input
                    value={form.contactEmail}
                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="compliance@yourfund.ky"
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Token */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">About your token</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Connect your deployed smart contract or tell us what you plan to launch.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Token / Fund Name</label>
                  <input
                    value={form.tokenName}
                    onChange={e => setForm(f => ({ ...f, tokenName: e.target.value }))}
                    placeholder="Meridian Private Credit Fund I"
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Token Standard</label>
                    <select
                      value={form.standard}
                      onChange={e => setForm(f => ({ ...f, standard: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    >
                      <option value="">Select</option>
                      {standards.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Network</label>
                    <select
                      value={form.network}
                      onChange={e => setForm(f => ({ ...f, network: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    >
                      <option value="">Select</option>
                      {networks.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Contract Address <span className="text-[var(--text-tertiary)]">(optional — paste if deployed)</span></label>
                  <input
                    value={form.contractAddress}
                    onChange={e => setForm(f => ({ ...f, contractAddress: e.target.value }))}
                    placeholder="0x742dF4b8e77e..."
                    className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono"
                  />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">We will fetch and analyze the contract bytecode automatically.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Compliance config */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Compliance configuration</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">These become the claims your attestation engine will verify against the contract.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Max Investors</label>
                    <input
                      value={form.maxInvestors}
                      onChange={e => setForm(f => ({ ...f, maxInvestors: e.target.value }))}
                      placeholder="250"
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Transfer Lock-up (months)</label>
                    <input
                      value={form.lockupMonths}
                      onChange={e => setForm(f => ({ ...f, lockupMonths: e.target.value }))}
                      placeholder="12"
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    />
                  </div>
                </div>

                {[
                  { key: "accreditedOnly", label: "Accredited investors only", description: "Enforce accreditation check on all token holders" },
                  { key: "amlEnabled", label: "AML monitoring enabled", description: "Continuous AML screening on investor activity" },
                  { key: "sanctionsScreening", label: "Sanctions screening", description: "OFAC, EU, UN sanctions list checks on all investors" },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.description}</p>
                    </div>
                    <button
                      onClick={() => setForm(f => ({ ...f, [item.key]: !f[item.key as keyof typeof f] }))}
                      className={`relative shrink-0 w-10 h-5 rounded-full transition-colors ${form[item.key as keyof typeof form] ? "bg-[var(--accent-blue)]" : "bg-[rgba(247,244,237,0.08)]"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[item.key as keyof typeof form] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: First attestation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your workspace is ready</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">We ran your first attestation automatically. Here is what we found.</p>
              </div>

              <div className="bg-[var(--accent-green)]/10 border border-[rgba(74,222,128,0.20)] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[rgba(74,222,128,0.20)] rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent-green)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--accent-green)]">Attestation Passed</p>
                    <p className="text-xs text-[var(--text-muted)]">7 of 7 compliance fields verified</p>
                  </div>
                  <Badge variant="success" className="ml-auto">Dudilig Certified</Badge>
                </div>
                <div className="space-y-2">
                  {[
                    "Investor cap enforced correctly",
                    "Transfer lock-up implemented",
                    "Accreditation check active",
                    "Jurisdiction whitelist present",
                    "KYC hook wired correctly",
                    "AML screening enabled",
                    "Sanctions list integrated",
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-green)] shrink-0" />
                      <span className="text-xs text-[var(--text-primary)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-xl p-4">
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Your Trust Certificate URL</p>
                <p className="text-xs font-mono text-[var(--accent-blue)]">dudilig.io/certificate/meridian-pcf-i</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Share this with LPs and liquidity providers for instant verification.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
