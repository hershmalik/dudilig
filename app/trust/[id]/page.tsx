import { notFound } from "next/navigation"
import { getCertificate } from "@/lib/storage/certificates"
import { TrustCertificate } from "@/components/trust/TrustCertificate"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const cert = await getCertificate(id)
  if (!cert) return { title: "Trust Certificate · Dudilig" }

  const status = cert.analysis.overallStatus
  const statusLabel =
    status === "pass" ? "Compliant" : status === "fail" ? "Non-Compliant" : "Needs Review"

  const title = `${cert.tokenName} — ${statusLabel} · Dudilig Trust Certificate`
  const description = `${cert.standardName} compliance attestation for ${cert.issuerName}. Score ${cert.analysis.score}/100. Cryptographically signed and independently verifiable.`
  const ogUrl = `/api/og/${cert.id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  }
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cert = await getCertificate(id)
  if (!cert) notFound()
  return <TrustCertificate certificate={cert} />
}
