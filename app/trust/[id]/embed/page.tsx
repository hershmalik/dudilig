import { notFound } from "next/navigation"
import { getCertificate } from "@/lib/storage/certificates"
import { TrustCertificateEmbed } from "@/components/trust/TrustCertificateEmbed"

export const dynamic = "force-dynamic"

export default async function TrustEmbedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cert = await getCertificate(id)
  if (!cert) notFound()
  return <TrustCertificateEmbed certificate={cert} />
}
