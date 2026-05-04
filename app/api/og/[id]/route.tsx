import { ImageResponse } from "next/og"
import { getCertificate } from "@/lib/storage/certificates"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cert = await getCertificate(id)

  if (!cert) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B0E16",
            color: "#F7F4ED",
            fontSize: 32,
          }}
        >
          Certificate not found
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const status = cert.analysis.overallStatus
  const statusMeta =
    status === "pass"
      ? { label: "COMPLIANCE VERIFIED", color: "#4ADE80", bg: "rgba(74,222,128,0.12)" }
      : status === "warning"
      ? { label: "VERIFIED WITH WARNINGS", color: "#C8842A", bg: "rgba(200,132,42,0.12)" }
      : { label: "COMPLIANCE MISMATCH", color: "#EF4444", bg: "rgba(239,68,68,0.12)" }

  const passCount = cert.analysis.results.filter((r) => r.status === "pass").length
  const warnCount = cert.analysis.results.filter((r) => r.status === "warning").length
  const failCount = cert.analysis.results.filter((r) => r.status === "fail").length

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0B0E16",
          color: "#F7F4ED",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3B82F6",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Dudilig
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 16,
              color: "rgba(247,244,237,0.5)",
            }}
          >
            Trust Certificate · {cert.id}
          </span>
        </div>

        {/* Status banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 20px",
            background: statusMeta.bg,
            border: `1px solid ${statusMeta.color}40`,
            borderRadius: 12,
            marginBottom: 36,
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: statusMeta.color,
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.05em",
              color: statusMeta.color,
              fontWeight: 600,
            }}
          >
            {statusMeta.label}
          </span>
        </div>

        {/* Token name */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
          <span style={{ fontSize: 16, color: "rgba(247,244,237,0.5)", marginBottom: 8 }}>
            Tokenized Asset
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {cert.tokenName}
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(247,244,237,0.7)",
              marginTop: 12,
            }}
          >
            {cert.standardName} · Issued by {cert.issuerName}
          </span>
        </div>

        {/* Bottom row: score + counts */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 24, fontSize: 18 }}>
              <span style={{ color: "#4ADE80" }}>{passCount} passed</span>
              {warnCount > 0 && (
                <span style={{ color: "#C8842A" }}>{warnCount} warnings</span>
              )}
              {failCount > 0 && (
                <span style={{ color: "#EF4444" }}>{failCount} failed</span>
              )}
            </div>
            <span
              style={{
                marginTop: 14,
                fontSize: 14,
                color: "rgba(247,244,237,0.4)",
              }}
            >
              SHA-256 · {cert.hash.slice(7, 27)}…
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 300,
                lineHeight: 1,
                color: statusMeta.color,
              }}
            >
              {cert.analysis.score}
            </span>
            <span
              style={{
                fontSize: 16,
                color: "rgba(247,244,237,0.5)",
                marginTop: 4,
              }}
            >
              compliance score / 100
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
