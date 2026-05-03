"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Certificate } from "@/lib/types/certificate";

const POWER4_OUT: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: POWER4_OUT },
  },
};

function BrandMark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 transition-opacity hover:opacity-100"
      style={{ opacity: 0.6 }}
      data-testid="link-brand-home"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "#ffffff",
        }}
      >
        Dudilig
      </span>
    </Link>
  );
}

type CertMeta = { color: string; bg: string; border: string; label: string };

function statusMeta(status: Certificate["analysis"]["overallStatus"]): CertMeta {
  if (status === "pass") {
    return { color: "#22c55e", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.30)", label: "PASS" };
  }
  if (status === "warning") {
    return { color: "#eab308", bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.30)", label: "REVIEW" };
  }
  return { color: "#ef4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)", label: "MISMATCH" };
}

function CertCard({ cert }: { cert: Certificate }) {
  const meta = statusMeta(cert.analysis.overallStatus);
  return (
    <Link
      href={`/trust/${cert.id}`}
      data-testid={`link-trust-${cert.id}`}
      className="group flex flex-col h-full rounded-2xl p-6 md:p-4 lg:p-6 transition-colors duration-200"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <span
          className="inline-flex items-center rounded-full"
          style={{
            color: meta.color,
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.10em",
            padding: "4px 10px",
            textTransform: "uppercase",
          }}
        >
          {meta.label}
        </span>
        <span
          className="tabular-nums"
          style={{
            color: meta.color,
            opacity: 0.8,
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
          }}
        >
          {cert.analysis.score}/100
        </span>
      </div>
      <h3
        className="font-semibold mt-3.5"
        style={{ fontSize: "16px", lineHeight: 1.3, color: "#ffffff" }}
      >
        {cert.tokenName}
      </h3>
      <p
        className="mt-1.5 truncate"
        style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}
      >
        {cert.standardName} · {cert.issuerName}
      </p>
    </Link>
  );
}

export default function HeroSection({ showcase }: { showcase: Certificate[] }) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#08080a", color: "#ffffff" }}
    >
      <div className="absolute inset-0 bg-grid-soft pointer-events-none" />
      <div className="absolute inset-0 hero-radial pointer-events-none" />

      <header className="absolute top-8 left-8 z-20">
        <BrandMark />
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-5xl px-6 pt-28 sm:pt-36 pb-12 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span
            className="inline-flex items-center gap-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "6px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.70)",
            }}
            data-testid="badge-eyebrow"
          >
            <span
              className="rounded-full animate-pulse-soft"
              style={{ width: 4, height: 4, background: "#22c55e" }}
            />
            Agentic Due Diligence
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif"
          style={{
            marginTop: 24,
            fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            maxWidth: "20ch",
          }}
        >
          The Compliance OS for{" "}
          <span className="text-gradient-accent font-serif italic">Tokenized Assets</span>
        </motion.h1>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ marginTop: 40 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "#ffffff",
              color: "#08080a",
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            data-testid="link-get-started"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full transition-colors duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.85)",
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            data-testid="link-view-demo"
          >
            View Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Live Trust Certificates */}
        {showcase.length > 0 && (
          <motion.section
            variants={itemVariants}
            className="w-full"
            style={{ marginTop: 72 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.40)",
                }}
              >
                Live Trust Certificates
              </p>
              <Link
                href="/analyze"
                className="transition-colors hover:text-[#60a5fa]"
                style={{ fontSize: 13, color: "#3b82f6" }}
                data-testid="link-publish-yours"
              >
                Publish yours →
              </Link>
            </div>

            <p
              className="text-left"
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "rgba(255,255,255,0.40)",
              }}
            >
              Public, signed compliance attestations — generated by reading the actual contract through Claude Opus 4.5.
            </p>

            <div
              className="grid grid-cols-1 md:grid-cols-3 items-stretch text-left"
              style={{ marginTop: 20, gap: 16 }}
            >
              {showcase.map((cert) => (
                <CertCard key={cert.id} cert={cert} />
              ))}
            </div>

            <p
              className="text-left"
              style={{
                marginTop: 20,
                fontSize: 12,
                color: "rgba(255,255,255,0.40)",
              }}
            >
              Every certificate above was generated in real time by an AI agent reading the actual smart contract and offering documents.{" "}
              <Link
                href="/analyze"
                className="transition-colors hover:text-[#60a5fa]"
                style={{ color: "#3b82f6" }}
                data-testid="link-verify-any"
              >
                Verify any of them →
              </Link>
            </p>
          </motion.section>
        )}

        {/* Section footer */}
        <motion.footer
          variants={itemVariants}
          className="w-full text-center"
          style={{
            marginTop: 64,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.30)",
            }}
          >
            Demo Environment · Meridian Capital Partners
          </p>
          <p
            style={{
              marginTop: 6,
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            demo.dudilig.com · not for production use
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
