import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic()

const STANDARD_RULES: Record<string, { name: string; rules: string[] }> = {
  "reg-d-506c": {
    name: "Reg D 506(c)",
    rules: [
      "Investor cap enforcement (max 2,000 or fewer investors for certain exemptions)",
      "Accredited investor verification — must require proof, not just self-certification",
      "Transfer restrictions — resale prohibited without registration or another exemption",
      "No general solicitation beyond verified accredited investors",
      "Lockup period enforcement (if any)",
      "US jurisdiction whitelist/blacklist logic",
    ],
  },
  "reg-s": {
    name: "Reg S",
    rules: [
      "US investor exclusion — wallet addresses or identity checks must block US persons",
      "Offshore transaction conditions — distribution outside US markets only",
      "Directed selling efforts prohibition — no active marketing to US investors",
      "Restricted period compliance (40-day for equity, 1-year for debt)",
      "Transfer restrictions to US persons during restricted period",
      "Jurisdiction whitelist enforcement in transfer logic",
    ],
  },
  "mica": {
    name: "MiCA (EU)",
    rules: [
      "Asset reserve backing — stablecoins must maintain 1:1 reserves",
      "Whitepaper disclosure requirements reference or hash",
      "Holder redemption rights — token must be redeemable at par",
      "Transaction volume limits per day (if applicable)",
      "Issuer authorization check — only authorized entities can mint",
      "AML/KYC enforcement at wallet level",
    ],
  },
  "erc-1400": {
    name: "ERC-1400 Security Token",
    rules: [
      "Partition-based transfer restrictions (canTransfer / transferByPartition)",
      "Document management (getDocument / setDocument)",
      "Operator authorization controls",
      "Forced transfer capability for regulatory compliance",
      "Issuance controls — only authorized controllers can mint",
      "Redemption / burning controls",
    ],
  },
}

export async function POST(req: NextRequest) {
  const { code, standard } = await req.json()

  if (!code || !standard) {
    return NextResponse.json({ error: "Missing code or standard" }, { status: 400 })
  }

  const stdConfig = STANDARD_RULES[standard]
  if (!stdConfig) {
    return NextResponse.json({ error: "Unknown standard" }, { status: 400 })
  }

  const rulesText = stdConfig.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")

  const prompt = `You are a smart contract compliance auditor specializing in tokenized real-world assets (RWA) and securities law.

Analyze the following Solidity smart contract against the ${stdConfig.name} compliance standard.

For each rule below, determine if the contract:
- PASS: Correctly implements / enforces this rule
- FAIL: Explicitly violates or is missing critical enforcement for this rule
- WARNING: Partially implements or has ambiguous logic that needs human review
- N/A: Rule is not applicable to this type of contract

Rules to check:
${rulesText}

Solidity contract:
\`\`\`solidity
${code}
\`\`\`

Respond ONLY with valid JSON in this exact structure (no markdown, no explanation outside JSON):
{
  "summary": "2-3 sentence overall compliance assessment",
  "overallStatus": "pass" | "warning" | "fail",
  "score": <number 0-100>,
  "results": [
    {
      "rule": "<exact rule text from above>",
      "status": "pass" | "fail" | "warning" | "na",
      "finding": "<1-2 sentence specific finding referencing actual contract code/function names>",
      "line": "<relevant function or variable name if found, or null>"
    }
  ],
  "criticalIssues": ["<list of critical issues if any>"],
  "recommendations": ["<list of specific recommendations>"]
}`

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  })

  const rawText = message.content[0].type === "text" ? message.content[0].text : ""

  let analysis
  try {
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim()
    analysis = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response", raw: rawText }, { status: 500 })
  }

  return NextResponse.json({ analysis, standard: stdConfig.name })
}
