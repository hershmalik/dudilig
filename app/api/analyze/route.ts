import { NextRequest, NextResponse } from "next/server"
import {
  analyzeContract,
  type ComplianceStandard,
  STANDARD_RULES,
} from "@/lib/services/analyze-claude"
import { storeAnalysis } from "@/lib/storage/analysis-cache"
import { readBodyText } from "@/lib/http/read-body"

const MAX_BODY_BYTES = 100_000
const MAX_CODE_BYTES = 60_000

export async function POST(req: NextRequest) {
  // Stream-read with a hard byte cap. Aborts the read the moment we
  // exceed the cap so a chunked / no-Content-Length attacker cannot
  // force unbounded memory allocation.
  const read = await readBodyText(req, MAX_BODY_BYTES)
  if (read.tooLarge) {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 413 }
    )
  }

  let body: { code?: unknown; standard?: unknown }
  try {
    body = JSON.parse(read.text)
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { code, standard } = body

  if (!code || !standard) {
    return NextResponse.json(
      { error: "Missing code or standard" },
      { status: 400 }
    )
  }

  if (typeof standard !== "string" || !(standard in STANDARD_RULES)) {
    return NextResponse.json({ error: "Unknown standard" }, { status: 400 })
  }

  if (typeof code !== "string" || Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: `Contract code exceeds ${MAX_CODE_BYTES} bytes` },
      { status: 413 }
    )
  }

  try {
    const { analysis, standardName } = await analyzeContract({
      code,
      standard: standard as ComplianceStandard,
    })

    // Mint a single-use token that the in-app publish flow can present
    // to prove "this analysis came from the server, not from a tampered
    // client". Token is opaque to the browser. Persisted to disk so it
    // survives Next.js bundling the API route and the Server Action into
    // separate chunks (which would each get their own in-memory copy).
    const analysisToken = await storeAnalysis({
      analysis,
      standard: standard as ComplianceStandard,
      standardName,
      contractCode: code,
    })

    return NextResponse.json({
      analysis,
      standard: standardName,
      analysisToken,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
