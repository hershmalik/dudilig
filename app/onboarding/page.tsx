"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Wallet,
} from "lucide-react"

const steps = [
  { id: 1, label: "Your Identity",      icon: Wallet },
  { id: 2, label: "Your Token",          icon: Layers },
  { id: 3, label: "Compliance Setup",    icon: FileText },
  { id: 4, label: "First Attestation",   icon: ShieldCheck },
]

const jurisdictions = ["Cayman Islands", "Singapore", "ADGM", "BVI", "Luxembourg", "Delaware"]
const standards     = ["ERC-1400", "ERC-3643", "ERC-20 (restricted)"]
const networks      = ["Ethereum", "Polygon", "Solana", "Base"]

const EASE: [number, number, number, number] = [0.165, 0.84, 0.44, 1]

const inputClass =
  "w-full px-3 py-2.5 rounded-xl text-sm transition-colors focus:outline-none placeholder:text-[var(--text-tertiary)]"
const inputStyle = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--rule)",
  color: "var(--text-primary)",
} as const

function DudiligLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
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
          fontFamily: "var(--font-mono)",
          fontSize: "15px",
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

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
        {hint && (
          <span className="ml-1.5" style={{ color: "var(--text-tertiary)" }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

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

  const next = () => step < 4 && setStep((s) => s + 1)
  const back = () => step > 1 && setStep((s) => s - 1)

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-base)" }}
      data-testid="page-onboarding"
    >
      {/* Step rail (left) */}
      <aside
        className="hidden lg:flex w-72 shrink-0 flex-col p-8 relative overflow-hidden"
        style={{
          background: "var(--bg-elevated)",
          borderRight: "1px solid var(--rule)",
        }}
      >
        <div className="gradient-cool" style={{ top: "-200px", left: "-200px" }} />

        <div className="relative z-10 mb-10">
          <DudiligLogo />
          <p className="fig-label mt-2 ml-7">Compliance OS</p>
        </div>

        <div className="relative z-10 mb-6">
          <div className="eyebrow-tag w-fit mb-3">Setup</div>
          <h2
            className="font-display"
            style={{ fontSize: "20px", color: "var(--text-primary)", lineHeight: 1.15 }}
          >
            Spin up your compliance workspace
          </h2>
        </div>

        <div className="relative z-10 space-y-1">
          {steps.map((s) => {
            const done = step > s.id
            const active = step === s.id
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                style={{
                  background: active ? "rgba(59,130,246,0.08)" : "transparent",
                  border: active
                    ? "1px solid rgba(59,130,246,0.20)"
                    : "1px solid transparent",
                }}
                data-testid={`step-rail-${s.id}`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{
                    background: done
                      ? "var(--accent-green)"
                      : active
                        ? "var(--accent-blue)"
                        : "var(--bg-base)",
                    color: done || active ? "#ffffff" : "var(--text-tertiary)",
                    border: !done && !active ? "1px solid var(--rule)" : "none",
                  }}
                >
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: active
                      ? "var(--text-primary)"
                      : done
                        ? "var(--text-muted)"
                        : "var(--text-tertiary)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="relative z-10 mt-auto">
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.20)",
            }}
          >
            <p
              className="text-xs font-medium mb-1"
              style={{ color: "var(--accent-blue)" }}
            >
              Setup takes ~3 minutes
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Your first attestation runs automatically when setup is complete.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content (right) */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="gradient-warm" style={{ bottom: "-300px", right: "-300px" }} />

        <div className="w-full max-w-lg relative z-10">
          {/* Mobile: top step indicator */}
          <div className="lg:hidden mb-6">
            <DudiligLogo />
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "var(--rule-strong)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--accent-blue)" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
            <span className="fig-label whitespace-nowrap">
              Step {step} of 4
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                    >
                      Tell us about your entity
                    </h2>
                    <p
                      className="text-sm mt-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      We use this to configure your compliance workspace and jurisdiction rules.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field label="Legal Entity Name">
                      <input
                        value={form.entityName}
                        onChange={(e) => setForm((f) => ({ ...f, entityName: e.target.value }))}
                        placeholder="Meridian Capital Partners Ltd."
                        className={inputClass}
                        style={inputStyle}
                        data-testid="input-entity-name"
                      />
                    </Field>
                    <Field label="Domicile Jurisdiction">
                      <select
                        value={form.jurisdiction}
                        onChange={(e) => setForm((f) => ({ ...f, jurisdiction: e.target.value }))}
                        className={inputClass}
                        style={inputStyle}
                        data-testid="select-jurisdiction"
                      >
                        <option value="">Select jurisdiction</option>
                        {jurisdictions.map((j) => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Contact Email">
                      <input
                        value={form.contactEmail}
                        onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                        placeholder="compliance@yourfund.ky"
                        className={inputClass}
                        style={inputStyle}
                        data-testid="input-contact-email"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 2: Token */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                    >
                      About your token
                    </h2>
                    <p
                      className="text-sm mt-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Connect your deployed smart contract or tell us what you plan to launch.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field label="Token / Fund Name">
                      <input
                        value={form.tokenName}
                        onChange={(e) => setForm((f) => ({ ...f, tokenName: e.target.value }))}
                        placeholder="Meridian Private Credit Fund I"
                        className={inputClass}
                        style={inputStyle}
                        data-testid="input-token-name"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Token Standard">
                        <select
                          value={form.standard}
                          onChange={(e) => setForm((f) => ({ ...f, standard: e.target.value }))}
                          className={inputClass}
                          style={inputStyle}
                          data-testid="select-standard"
                        >
                          <option value="">Select</option>
                          {standards.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Network">
                        <select
                          value={form.network}
                          onChange={(e) => setForm((f) => ({ ...f, network: e.target.value }))}
                          className={inputClass}
                          style={inputStyle}
                          data-testid="select-network"
                        >
                          <option value="">Select</option>
                          {networks.map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field
                      label="Contract Address"
                      hint={<>(optional, paste if deployed)</>}
                    >
                      <input
                        value={form.contractAddress}
                        onChange={(e) => setForm((f) => ({ ...f, contractAddress: e.target.value }))}
                        placeholder="0x742dF4b8e77e..."
                        className={inputClass + " font-mono"}
                        style={inputStyle}
                        data-testid="input-contract-address"
                      />
                      <p
                        className="text-xs mt-1.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        We will fetch and analyze the contract bytecode automatically.
                      </p>
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 3: Compliance config */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                    >
                      Compliance configuration
                    </h2>
                    <p
                      className="text-sm mt-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      These become the claims your attestation engine will verify against the contract.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Max Investors">
                        <input
                          value={form.maxInvestors}
                          onChange={(e) => setForm((f) => ({ ...f, maxInvestors: e.target.value }))}
                          placeholder="250"
                          className={inputClass}
                          style={inputStyle}
                          data-testid="input-max-investors"
                        />
                      </Field>
                      <Field label="Transfer Lock-up (months)">
                        <input
                          value={form.lockupMonths}
                          onChange={(e) => setForm((f) => ({ ...f, lockupMonths: e.target.value }))}
                          placeholder="12"
                          className={inputClass}
                          style={inputStyle}
                          data-testid="input-lockup-months"
                        />
                      </Field>
                    </div>

                    {[
                      {
                        key: "accreditedOnly",
                        label: "Accredited investors only",
                        description: "Enforce accreditation check on all token holders",
                      },
                      {
                        key: "amlEnabled",
                        label: "AML monitoring enabled",
                        description: "Continuous AML screening on investor activity",
                      },
                      {
                        key: "sanctionsScreening",
                        label: "Sanctions screening",
                        description: "OFAC, EU, UN sanctions list checks on all investors",
                      },
                    ].map((item) => {
                      const isOn = !!form[item.key as keyof typeof form]
                      return (
                        <div
                          key={item.key}
                          className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--rule)",
                          }}
                        >
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.label}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              {item.description}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setForm((f) => ({ ...f, [item.key]: !f[item.key as keyof typeof f] }))
                            }
                            className="relative shrink-0 w-10 h-5 rounded-full transition-colors"
                            style={{
                              background: isOn
                                ? "var(--accent-blue)"
                                : "var(--rule-strong)",
                            }}
                            aria-pressed={isOn}
                            data-testid={`toggle-${item.key}`}
                          >
                            <motion.div
                              className="absolute top-0.5 w-4 h-4 rounded-full"
                              style={{
                                background: "#ffffff",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              }}
                              animate={{ x: isOn ? 20 : 2 }}
                              transition={{ duration: 0.2, ease: EASE }}
                            />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: First attestation */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
                    >
                      Your workspace is ready
                    </h2>
                    <p
                      className="text-sm mt-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      We ran your first attestation automatically. Here is what we found.
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-5 space-y-4"
                    style={{
                      background: "rgba(74,222,128,0.06)",
                      border: "1px solid rgba(74,222,128,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(74,222,128,0.18)",
                          border: "1px solid rgba(74,222,128,0.4)",
                        }}
                      >
                        <ShieldCheck
                          className="w-4 h-4"
                          style={{ color: "var(--accent-green)" }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--accent-green)" }}
                        >
                          Attestation Passed
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          7 of 7 compliance fields verified
                        </p>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap shrink-0"
                        style={{
                          background: "rgba(74,222,128,0.15)",
                          color: "var(--accent-green)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        Dudilig Certified
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        "Investor cap enforced correctly",
                        "Transfer lock-up implemented",
                        "Accreditation check active",
                        "Jurisdiction whitelist present",
                        "KYC hook wired correctly",
                        "AML screening enabled",
                        "Sanctions list integrated",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "var(--accent-green)" }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--rule)",
                    }}
                  >
                    <p
                      className="fig-label mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Your Trust Certificate URL
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      dudilig.io/certificate/meridian-pcf-i
                    </p>
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Share this with LPs and liquidity providers for instant verification.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            {step > 1 ? (
              <button
                onClick={back}
                className="btn-ghost"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={next}
                className="btn-primary"
                data-testid="button-continue"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary"
                data-testid="button-go-dashboard"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
