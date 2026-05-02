import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { readSeedManifest } from "@/lib/storage/seed";
import { getCertificate } from "@/lib/storage/certificates";
import type { Certificate } from "@/lib/types/certificate";

export const dynamic = "force-dynamic";

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

function CertCard({ cert, label }: { cert: Certificate; label: string }) {
  const status = cert.analysis.overallStatus;
  const meta =
    status === "pass"
      ? {
          icon: ShieldCheck,
          color: "var(--accent-green)",
          bg: "rgba(74,222,128,0.10)",
          border: "rgba(74,222,128,0.20)",
          text: "PASS",
        }
      : status === "warning"
      ? {
          icon: AlertTriangle,
          color: "var(--accent-amber)",
          bg: "rgba(200,132,42,0.10)",
          border: "rgba(200,132,42,0.20)",
          text: "REVIEW",
        }
      : {
          icon: XCircle,
          color: "var(--accent-red)",
          bg: "rgba(239,68,68,0.10)",
          border: "rgba(239,68,68,0.20)",
          text: "MISMATCH",
        };
  const Icon = meta.icon;

  return (
    <Link
      href={`/trust/${cert.id}`}
      className="block rounded-xl p-4 transition-all"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--rule)",
      }}
      data-testid={`link-trust-${cert.id}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
        </div>
        <span
          className="text-xs font-medium tracking-wider"
          style={{ color: meta.color, fontFamily: "var(--font-mono)" }}
        >
          {meta.text}
        </span>
        <span
          className="text-xs ml-auto font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          {cert.analysis.score}/100
        </span>
      </div>
      <p
        className="text-sm font-medium leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        {cert.tokenName}
      </p>
      <p
        className="text-xs mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {cert.standardName} · {cert.issuerName}
      </p>
      <p
        className="text-xs mt-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label} →
      </p>
    </Link>
  );
}

export default async function Home() {
  const manifest = await readSeedManifest();
  const [clean, warning, mismatch] = await Promise.all([
    manifest.clean ? getCertificate(manifest.clean) : null,
    manifest.warning ? getCertificate(manifest.warning) : null,
    manifest.mismatch ? getCertificate(manifest.mismatch) : null,
  ]);

  const showcase: { cert: Certificate; label: string }[] = [];
  if (clean) showcase.push({ cert: clean, label: "Clean ERC-1400 pass" });
  if (warning)
    showcase.push({ cert: warning, label: "Pass with critical warnings" });
  if (mismatch)
    showcase.push({ cert: mismatch, label: "Claim vs. on-chain mismatch" });

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-12 sm:py-16 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="gradient-cool" style={{ top: "-300px", left: "-200px" }} />
      <div className="gradient-warm" style={{ top: "-300px", right: "-200px" }} />

      <div className="max-w-2xl w-full space-y-12 relative z-10">
        {/* Hero */}
        <div className="space-y-8 text-center">
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
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
              Automate KYC/AML, smart contract attestation, and regulatory filings for your RWA issuance.
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/login" className="btn-primary" data-testid="link-get-started">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-ghost" data-testid="link-view-demo">
              View Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Trust Certificates */}
        {showcase.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="fig-label">Live Trust Certificates</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Public, signed compliance attestations — generated by reading
                  the actual contract through Claude Opus 4.5.
                </p>
              </div>
              <Link
                href="/analyze"
                className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: "var(--accent-blue)" }}
                data-testid="link-publish-yours"
              >
                Publish yours →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {showcase.map(({ cert, label }) => (
                <CertCard key={cert.id} cert={cert} label={label} />
              ))}
            </div>
          </div>
        )}

        {/* Feature card */}
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

        <p className="fig-label text-center">Demo environment · Meridian Capital Partners</p>
      </div>
    </div>
  );
}
