import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SEED_LINES = [
  "Connecting to compliance infrastructure sources...",
  "Reading Stratum Digital US LLC entity profile...",
  "Cross-referencing MAS AML program against FinCEN/BSA Rule 31 CFR Part 1023...",
  "Loading FINRA NMA v2024.11 rule pack (142 rules)...",
  "Scanning vendor coverage: transaction monitoring, sanctions screening, clearing firm...",
  "Generating gap analysis — this takes 15-20 seconds...",
]

const SYSTEM_PROMPT = `You are a former FinCEN examiner and BSA compliance architect. Your job is to analyze a firm's existing compliance infrastructure against US AML/BSA requirements and identify what they already have, what needs calibration, and what is missing entirely. The firm is Stratum Digital US LLC — a US-incorporated tokenization platform with an existing AML program built for MAS (Singapore) requirements. Assess what of that existing MAS program maps to FinCEN/BSA, what needs adjustment, and what gaps exist that have no coverage. Output four sections: WHAT PORTS DIRECTLY / WHAT PORTS WITH CALIBRATION / WHAT DOES NOT PORT / CRYPTO-SPECIFIC GAPS.`

export async function POST(_req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const line of SEED_LINES) {
        controller.enqueue(encoder.encode(line + "\n"))
        await new Promise<void>(resolve => setTimeout(resolve, 280))
      }

      try {
        const apiStream = client.messages.stream({
          model: "claude-opus-4-5",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content:
                "Analyze the MAS AML program for Stratum Digital US LLC and map it to FinCEN/BSA requirements. Output the four sections as specified.",
            },
          ],
        })

        for await (const chunk of apiStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } catch (err) {
        console.error("[coverage-mapper]", err)
        controller.enqueue(encoder.encode("\n[Analysis error — please retry]"))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  })
}
