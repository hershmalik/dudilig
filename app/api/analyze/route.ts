import { NextRequest, NextResponse } from "next/server"
import {
  analyzeContract,
  type ComplianceStandard,
  STANDARD_RULES,
} from "@/lib/services/analyze-claude"

export async function POST(req: NextRequest) {
  const { code, standard } = await req.json()

  if (!code || !standard) {
    return NextResponse.json(
      { error: "Missing code or standard" },
      { status: 400 }
    )
  }

  if (!(standard in STANDARD_RULES)) {
    return NextResponse.json({ error: "Unknown standard" }, { status: 400 })
  }

  try {
    const { analysis, standardName } = await analyzeContract({
      code,
      standard: standard as ComplianceStandard,
    })
    return NextResponse.json({ analysis, standard: standardName })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
