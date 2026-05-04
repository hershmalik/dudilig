import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { investors } from "@/lib/mock-data/investors"
import { filings } from "@/lib/mock-data/filings"
import { tokens } from "@/lib/mock-data/tokens"
import { attestationHistory } from "@/lib/mock-data/attestations"
import { readBodyText } from "@/lib/http/read-body"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BODY = 32 * 1024
const MAX_HISTORY = 20

// Same-origin guard. The workspace data is already public in the client
// bundle, so this is not a confidentiality control — it exists to keep
// arbitrary third-party origins from burning the Anthropic API budget by
// hammering this endpoint from outside the app.
function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host")
  if (!host) return false
  const origin = req.headers.get("origin")
  const referer = req.headers.get("referer")
  const matches = (raw: string | null) => {
    if (!raw) return false
    try {
      return new URL(raw).host === host
    } catch {
      return false
    }
  }
  // Allow if either Origin or Referer matches host. Browsers always send
  // at least one of these for fetch() from a real page.
  if (matches(origin) || matches(referer)) return true
  // No origin/referer at all → not a browser fetch from our page.
  return false
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

function buildContext(): string {
  const today = new Date().toISOString().slice(0, 10)
  const investorSummary = investors
    .map(
      (i) =>
        `- ${i.name} (${i.entity}, ${i.jurisdiction}) — KYC: ${i.kycStatus}, AML: ${i.amlRiskScore}, accreditation: ${i.accreditation}, invested: $${i.totalInvested.toLocaleString()}${i.flagReason ? `, flagged: ${i.flagReason}` : ""}`,
    )
    .join("\n")

  const filingSummary = filings
    .map(
      (f) =>
        `- ${f.filingType} (${f.jurisdiction}) — due ${f.dueDate.slice(0, 10)}, status: ${f.status}. ${f.description}`,
    )
    .join("\n")

  const tokenSummary = tokens
    .map(
      (t) =>
        `- ${t.name} (${t.type}, ${t.standard} on ${t.network}) — $${t.totalRaise.toLocaleString()} raise, ${t.currentInvestors}/${t.maxInvestors} investors, lockup ${t.transferLockupMonths}mo, accredited-only: ${t.accreditedOnly}, compliance score: ${t.complianceScore}, last attestation: ${t.attestationStatus} on ${t.lastAttested.slice(0, 10)}`,
    )
    .join("\n")

  const attestationSummary = attestationHistory
    .slice(0, 6)
    .map((a) => {
      const mismatches = a.checkedFields.filter((f) => !f.match)
      return `- ${a.tokenName} on ${a.runAt.slice(0, 10)} — ${a.status.toUpperCase()}${mismatches.length ? ` (mismatches: ${mismatches.map((m) => `${m.field}: contract=${m.contractValue} vs claim=${m.claimValue}`).join("; ")})` : ""} hash=${a.hash.slice(0, 16)}…`
    })
    .join("\n")

  return `Today is ${today}.

## Investors (${investors.length} total)
${investorSummary}

## Regulatory Filings (${filings.length} total)
${filingSummary}

## Tokens (${tokens.length} total)
${tokenSummary}

## Recent Attestation Runs
${attestationSummary}`
}

const SYSTEM_PROMPT = `You are Mike, the senior compliance copilot inside Dudilig — an AI-native Compliance OS for tokenized real-world assets. You speak with the calm, precise authority of a former SEC enforcement attorney who now runs compliance for a tokenized credit fund. You are direct, never hedge with marketing language, and always cite the specific data points from the workspace below.

Style rules:
- Never use emoji.
- Em dashes are fine.
- Lead with the answer, then 2–4 bullets of evidence, then a recommended action.
- When citing data, use the exact name (investor, filing, token) from the workspace.
- If a question is outside compliance, briefly redirect to what you can help with.
- Keep responses under 180 words unless the user asks for depth.
- Use markdown: **bold** for names and counts, plain bullets with "- ".
- Never invent investors, filings, or tokens that are not in the workspace.

WORKSPACE CONTEXT (live data the operator can see in the UI):

${buildContext()}`

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return new Response("Forbidden", { status: 403 })
  }

  // Stream-read with a hard byte cap so a chunked / no-Content-Length
  // request cannot force unbounded memory allocation. Mirrors /api/analyze.
  const read = await readBodyText(req, MAX_BODY)
  if (read.tooLarge) {
    return new Response("Payload too large", { status: 413 })
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = JSON.parse(read.text)
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const incoming = Array.isArray(body.messages) ? body.messages : []
  const messages = incoming
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length < 4000,
    )
    .slice(-MAX_HISTORY)

  if (messages.length === 0) {
    return new Response("No messages", { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("AI not configured", { status: 503 })
  }

  const client = new Anthropic()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        })

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        // Log full error server-side, surface a generic message to the
        // client so we don't leak SDK internals or upstream details.
        console.error("[chat stream] upstream error", err)
        controller.enqueue(
          encoder.encode(
            "\n\n[Mike could not reach the model right now. Please try again in a moment.]",
          ),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
