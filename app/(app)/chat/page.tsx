"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { ShieldCheck, Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const suggestedPrompts = [
  "Which investors have expired KYC?",
  "What filings are due in the next 30 days?",
  "Run attestation on Meridian Private Credit Fund I",
  "Summarize my compliance health",
  "Which investors are flagged for AML?",
  "What would fail a Reg S audit today?",
]

const cannedResponses: Record<string, string> = {
  "Which investors have expired KYC?": "**1 investor has expired KYC:**\n\n• **Thanh Nguyen** (Vietnam, Individual) — KYC expired October 2025. Last sanctions screening was 6 months ago. Invested $500K in Meridian Private Credit Fund I.\n\n**Recommended action:** Send a KYC renewal request. If documents are not received within 14 days, transfer restrictions should be applied to this investor's position per your compliance policy.",
  "What filings are due in the next 30 days?": "**2 filings due in the next 30 days:**\n\n🔴 **SEC Form D Renewal** (US SEC) — **OVERDUE by 3 days.** This is urgent. Failure to renew may invalidate your Reg D exemption. Contact counsel immediately.\n\n🟡 **CIMA Annual Return** (Cayman Islands) — Due **May 31, 2026** (33 days). In progress. Required documents: audited financials, AML attestation, investor registry.\n\n**1 filing due in 60 days:**\n🟠 **BVI Private Fund Annual Filing** — Due June 1, 2026.",
  "Summarize my compliance health": "**Compliance Health: 84/100 — Strong**\n\n✅ **KYC/AML (96%)** — 13 of 15 investors fully verified. 1 flagged (Kwame Asante — PEP), 1 expired (Thanh Nguyen).\n\n🟡 **Regulatory Filings (71%)** — 1 overdue (SEC Form D), 2 in progress, 4 not started. The overdue SEC filing is your most urgent issue.\n\n✅ **Attestation (94%)** — Meridian Private Credit Fund I fully attested. Gulf Real Estate Income Trust failed last attestation — MAX_INVESTORS mismatch (contract says 500, claim says 250). Needs remediation.\n\n**Top priority this week:** Fix the SEC Form D and resolve the Gulf REIT contract mismatch.",
  "Which investors are flagged for AML?": "**2 investors are currently flagged:**\n\n🔴 **Kwame Asante** (Ghana, Individual) — PEP match detected. Connection to Kuwait National Bank identified. Total invested: $250K in Meridian PCF I. Status: Under enhanced due diligence.\n\n🔴 **Aiko Yamamoto** (Japan, Individual) — Unusual wire transfer pattern. Multiple transfers from unverified shell entity. Total invested: $750K. Status: Compliance review in progress.\n\n**Recommended action:** Both investors require enhanced due diligence reports before any additional investment activity is permitted.",
  "Run attestation on Meridian Private Credit Fund I": "**Running attestation on Meridian Private Credit Fund I...**\n\n✅ Fetching contract bytecode from Polygon — done\n✅ Parsing transfer restriction logic — done\n✅ Comparing investor cap (250 vs 250) — match\n✅ Verifying jurisdiction whitelist (KY, SG, AE, HK, VG, BVI) — match\n✅ Checking accreditation enforcement — match\n✅ Validating lock-up period (365 days) — match\n✅ Generating attestation hash — done\n\n**Attestation passed.** All 7 fields verified. Certificate updated at sha256:a1b2c3... View the [Trust Certificate](/certificate) to share with LPs.",
  "What would fail a Reg S audit today?": "**Potential Reg S vulnerabilities identified:**\n\n🔴 **Gulf Real Estate Income Trust** — Contract MAX_INVESTORS is 500 but your offering documents state 250. This is a material discrepancy. An auditor would flag this immediately.\n\n🟡 **Thanh Nguyen** — KYC expired. Under Reg S you must maintain current KYC for all beneficial owners. Expired documentation creates audit exposure.\n\n🟡 **2 investors with pending KYC** (Ibrahim Al-Rashid, Youssef Mansour) — These investors cannot participate in additional issuances until KYC is completed.\n\n**Estimated audit risk: Medium.** The contract mismatch on Gulf REIT is the highest priority item — remediate before your next LP report.",
}

function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-slate-200 mb-1">{line.replace(/\*\*/g, "")}</p>
    }
    if (line.startsWith("• ") || line.startsWith("✅ ") || line.startsWith("🔴 ") || line.startsWith("🟡 ") || line.startsWith("🟠 ")) {
      const cleaned = line.replace(/\*\*(.*?)\*\*/g, "$1")
      return <p key={i} className="text-sm text-slate-300 ml-2 mb-1">{cleaned}</p>
    }
    if (line.trim() === "") return <div key={i} className="h-2" />
    const cleaned = line.replace(/\*\*(.*?)\*\*/g, "$1")
    return <p key={i} className="text-sm text-slate-300 mb-1">{cleaned}</p>
  })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "Hi, I'm your Dudilig compliance AI. I have full context on your investors, filings, tokens, and attestation status. Ask me anything about your compliance program.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  function sendMessage(text: string) {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages(m => [...m, userMsg])
    setInput("")
    setLoading(true)

    const response = cannedResponses[text] ||
      "I can help with that. Based on your current compliance data, I'd recommend reviewing your open filings and any flagged investors first. For a more specific answer, try one of the suggested prompts or ask about a specific investor, token, or filing."

    setTimeout(() => {
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: response }])
      setLoading(false)
    }, 800)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) sendMessage(input.trim())
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Compliance AI"
        subtitle="Ask anything about your compliance program"
      />

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              </div>
            )}
            <div className={cn(
              "max-w-xl rounded-2xl px-4 py-3",
              msg.role === "user"
                ? "bg-violet-600 text-white text-sm"
                : "bg-slate-900 border border-slate-800"
            )}>
              {msg.role === "assistant"
                ? <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                : <p className="text-sm">{msg.content}</p>
              }
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-8 pb-4">
          <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Suggested prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-violet-600/40 hover:text-violet-300 text-slate-400 text-xs rounded-xl transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-8 pb-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about investors, filings, attestations..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
