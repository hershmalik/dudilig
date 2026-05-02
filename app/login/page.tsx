import Link from "next/link"
import { Wallet, ArrowRight, Eye } from "lucide-react"

function DudiligLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>Dudilig</span>
    </Link>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>

      {/* Left panel */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--rule)" }}
      >
        <div className="gradient-cool" style={{ top: "-100px", left: "-100px" }} />
        <div className="gradient-warm" style={{ bottom: "-100px", right: "-100px" }} />

        <DudiligLogo />

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="eyebrow-tag w-fit">Agentic Compliance OS</div>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: "var(--text-primary)" }}>
              The Compliance OS<br />for Tokenized Assets
            </h1>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
              Automate KYC/AML, verify smart contracts match compliance claims, and track regulatory filings across 6+ jurisdictions.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { stat: "$85M+", label: "Assets under compliance monitoring" },
              { stat: "6+",    label: "Jurisdictions covered" },
              { stat: "100%",  label: "Attestation accuracy on audited contracts" },
            ].map(item => (
              <div key={item.stat} className="flex items-center gap-4">
                <span className="font-medium w-16" style={{ color: "var(--accent-blue)", fontSize: "18px" }}>{item.stat}</span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="fig-label relative z-10">Trusted by tokenized fund managers across Cayman, Singapore, and ADGM</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">

          <div className="lg:hidden mb-8">
            <DudiligLogo />
          </div>

          <div>
            <h2 className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>Sign in to your account</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage your tokenized asset compliance</p>
          </div>

          <Link href="/onboarding" className="btn-primary w-full justify-between">
            <Wallet className="w-4 h-4" />
            Connect Wallet
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
            <span className="fig-label">or continue with email</span>
            <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
              <input
                type="email"
                placeholder="you@fund.ky"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)", color: "var(--text-primary)" }}
              />
            </div>
            <Link href="/dashboard" className="btn-ghost w-full justify-center">
              Sign In
            </Link>
          </div>

          <p className="text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
            New issuer?{" "}
            <Link href="/onboarding" style={{ color: "var(--accent-blue)" }}>
              Set up your compliance workspace
            </Link>
          </p>

          <div className="rounded-2xl p-4 text-center space-y-2" style={{ border: "1px dashed var(--rule-strong)" }}>
            <p className="fig-label">Just here to explore?</p>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--accent-blue)" }}>
              <Eye className="w-3 h-3" />
              Enter demo as Meridian Capital Partners
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
