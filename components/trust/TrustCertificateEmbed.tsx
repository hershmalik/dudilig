"use client"

import { useEffect, useState } from "react"
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react"
import type { Certificate } from "@/lib/types/certificate"

interface Props {
  certificate: Certificate
}

function statusMeta(status: "pass" | "warning" | "fail") {
  if (status === "pass")
    return {
      Icon: CheckCircle2,
      label: "Compliance Verified",
      color: "var(--accent-green)",
      bg: "rgba(74,222,128,0.10)",
      border: "rgba(74,222,128,0.25)",
    }
  if (status === "warning")
    return {
      Icon: AlertTriangle,
      label: "Verified with Warnings",
      color: "var(--accent-amber)",
      bg: "rgba(200,132,42,0.10)",
      border: "rgba(200,132,42,0.25)",
    }
  return {
    Icon: XCircle,
    label: "Compliance Mismatch",
    color: "var(--accent-red)",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.25)",
  }
}

export function TrustCertificateEmbed({ certificate }: Props) {
  const meta = statusMeta(certificate.analysis.overallStatus)
  const { Icon } = meta
  const passCount = certificate.analysis.results.filter((r) => r.status === "pass").length
  const warnCount = certificate.analysis.results.filter((r) => r.status === "warning").length
  const failCount = certificate.analysis.results.filter((r) => r.status === "fail").length

  // Resolve the absolute URL on the client so the link points at the
  // hosting origin even when embedded cross-domain. SSR uses a relative
  // href to avoid hydration mismatch.
  const [certUrl, setCertUrl] = useState(`/trust/${certificate.id}`)
  useEffect(() => {
    setCertUrl(`${window.location.origin}/trust/${certificate.id}`)
  }, [certificate.id])

  return (
    <a
      href={certUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="link-embed-card"
      style={{
        display: "block",
        background: "var(--bg-elevated, #13171F)",
        border: "1px solid var(--rule, rgba(247,244,237,0.10))",
        borderRadius: "12px",
        padding: "16px",
        textDecoration: "none",
        color: "inherit",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        maxWidth: "420px",
        margin: 0,
      }}
    >
        {/* Top: status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: meta.bg,
              border: `1px solid ${meta.border}`,
            }}
          >
            <Icon style={{ width: 14, height: 14, color: meta.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: meta.color,
                fontFamily: "var(--font-mono)",
              }}
            >
              {meta.label}
            </p>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: 11,
                color: "var(--text-tertiary, rgba(247,244,237,0.55))",
              }}
            >
              {certificate.standardName}
            </p>
          </div>
          <ShieldCheck
            style={{
              width: 18,
              height: 18,
              color: "var(--text-tertiary, rgba(247,244,237,0.35))",
            }}
          />
        </div>

        {/* Body */}
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary, #F7F4ED)",
            lineHeight: 1.3,
          }}
        >
          {certificate.tokenName}
        </p>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: 11,
            color: "var(--text-muted, rgba(247,244,237,0.55))",
          }}
        >
          Issued by {certificate.issuerName}
        </p>

        {/* Counts */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 12,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ color: "var(--accent-green)" }}>{passCount} passed</span>
          {warnCount > 0 && (
            <span style={{ color: "var(--accent-amber)" }}>{warnCount} warnings</span>
          )}
          {failCount > 0 && (
            <span style={{ color: "var(--accent-red)" }}>{failCount} failed</span>
          )}
          <span
            style={{
              marginLeft: "auto",
              color: "var(--text-tertiary, rgba(247,244,237,0.35))",
            }}
          >
            {certificate.analysis.score}/100
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px solid var(--rule, rgba(247,244,237,0.10))",
            fontSize: 10,
            color: "var(--text-tertiary, rgba(247,244,237,0.35))",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>dudilig · trust certificate</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            View
            <ExternalLink style={{ width: 10, height: 10 }} />
          </span>
        </div>
    </a>
  )
}
