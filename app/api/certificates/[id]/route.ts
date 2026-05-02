import { NextRequest, NextResponse } from "next/server"
import { getCertificate } from "@/lib/storage/certificates"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cert = await getCertificate(id)
  if (!cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
  }
  return NextResponse.json(cert)
}
