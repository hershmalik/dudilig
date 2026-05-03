import Link from "next/link";
import { ArrowRight, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
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
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono, monospace)",
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
        }}
      >
        Dudilig
      </span>
    </div>
  );
}

function CertCard({ cert }: { cert: Certificate }) {
  const status = cert.analysis.overallStatus;
  const meta =
    status === "pass"
      ? { color: "var(--accent-green)", bg: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.20)", text: "PASS" }
      : status === "warning"
      ? { color: "var(--accent-amber)", bg: "rgba(200,132,42,0.10)", border: "rgba(200,132,42,0.20)", text: "REVIEW" }
      : { color: "var(--accent-red)", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.20)", text: "MISMATCH" };

  return (
    <Link
      href={`/trust/${cert.id}`}
      data-testid={`link-trust-${cert.id}`}
      className="group flex flex-col h-full rounded-xl p-4 transition-colors duration-200 bg-[var(--bg-elevated)] border border-[var(--rule)] hover:border-[var(--accent-blue)]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider"
          style={{
            color: meta.color,
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            fontFamily: "var(--font-mono)",
          }}
        >
          {meta.text}
        </span>
        <span
          className="text-[11px] tabular-nums"
          style={{ color: meta.color, fontFamily: "var(--font-mono)" }}
        >
          {cert.analysis.score}/100
        </span>
      </div>
      <h3
        className="text-base font-semibold leading-snug mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {cert.tokenName}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {cert.standardName} · {cert.issuerName}
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

  const showcase: Certificate[] = [];
  if (clean) showcase.push(clean);
  if (warning) showcase.push(warning);
  if (mismatch) showcase.push(mismatch);

  return (
    <div
      className="min-h-screen flex flex-col px-6 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="gradient-cool" style={{ top: "-300px", left: "-200px" }} />
      <div className="gradient-warm" style={{ top: "-300px", right: "-200px" }} />

      <main className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-between relative z-10 pt-16 sm:pt-24 pb-20 sm:pb-28 gap-16 sm:gap-24">
        {/* Hero */}
        <section className="text-center">
          <div className="flex justify-center mb-14">
            <DudiligLogo />
          </div>

          <div className="flex justify-center mb-12">
            <div className="eyebrow-tag">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
                style={{ background: "var(--accent-green)" }}
              />
              Agentic Compliance OS
            </div>
          </div>

          <h1
            className="font-display mb-14"
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "var(--text-primary)" }}
          >
            The Compliance OS for<br />
            <span style={{ color: "var(--accent-blue)" }}>Tokenized Assets</span>
          </h1>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/login" className="btn-primary" data-testid="link-get-started">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-ghost" data-testid="link-view-demo">
              View Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Live Trust Certificates */}
        {showcase.length > 0 && (
          <section className="mt-24 sm:mt-32">
            <header className="flex items-center gap-3 mb-6 flex-wrap">
              <p className="fig-label">Live Trust Certificates</p>
              <span aria-hidden style={{ color: "var(--rule-strong)" }}>|</span>
              <Link
                href="/analyze"
                className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: "var(--accent-blue)" }}
                data-testid="link-publish-yours"
              >
                Publish yours →
              </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {showcase.map((cert) => (
                <CertCard key={cert.id} cert={cert} />
              ))}
            </div>

            <p
              className="text-xs leading-relaxed mt-8"
              style={{ color: "var(--text-muted)" }}
            >
              Every certificate above was generated in real time by an AI agent reading the actual smart contract and offering documents.{" "}
              <Link
                href="/analyze"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--accent-blue)" }}
                data-testid="link-verify-any"
              >
                Verify any of them →
              </Link>
            </p>
          </section>
        )}
      </main>

      <footer
        className="relative z-10 py-6 text-center"
        style={{ borderTop: "1px solid #1f2937" }}
      >
        <p className="fig-label">Demo environment · Meridian Capital Partners</p>
        <p className="fig-label mt-1">demo.dudilig.com · not for production use</p>
      </footer>
    </div>
  );
}
