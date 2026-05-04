import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MeshBackground } from "@/components/MeshBackground";

function DudiligLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
      <span style={{
        fontFamily: "var(--font-jetbrains-mono, monospace)",
        fontSize: "16px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        color: "var(--text-primary)",
      }}>
        Dudilig
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <MeshBackground />
      <div className="gradient-cool" style={{ top: "-300px", left: "-200px" }} />
      <div className="gradient-warm" style={{ top: "-300px", right: "-200px" }} />

      <div className="max-w-md w-full space-y-8 text-center relative z-10">

        <div className="flex justify-center">
          <DudiligLogo />
        </div>

        <div className="flex justify-center">
          <div className="eyebrow-tag">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: "var(--accent-green)" }} />
            Agentic Compliance OS
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "var(--text-primary)" }}>
            The Compliance OS for<br />
            <span style={{ color: "var(--accent-blue)" }}>Tokenized Assets</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
            Automate KYC/AML, smart contract attestation, and regulatory filings for your RWA issuance.
          </p>
        </div>

        <div
          className="text-left rounded-2xl p-5 space-y-3"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)" }}
        >
          {[
            "Continuous KYC/AML monitoring and sanctions screening",
            "Smart contract attestation — verify on-chain matches off-chain",
            "Regulatory filing tracker across 6+ jurisdictions",
            "Investor registry with accreditation management",
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent-green)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{feature}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/login" className="btn-primary w-full justify-center">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="btn-ghost w-full justify-center">
            View Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="fig-label">Demo environment · Meridian Capital Partners</p>
      </div>
    </div>
  );
}
