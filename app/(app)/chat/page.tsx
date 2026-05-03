"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TopBar } from "@/components/layout/TopBar"
import { ShieldCheck, Send, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  streaming?: boolean
}

const suggestedPrompts = [
  "Which investors have expired KYC?",
  "What filings are due in the next 30 days?",
  "Run attestation on Meridian Private Credit Fund I",
  "Summarize my compliance health",
  "Which investors are flagged for AML?",
  "What would fail a Reg S audit today?",
]

const introScript: { delay: number; content: string }[] = [
  {
    delay: 400,
    content:
      "I'm **Mike**, your compliance copilot. I just finished a sweep of your workspace. I'm tracking 15 investors, 8 filings, 3 tokens, and the last 6 attestation runs.",
  },
  {
    delay: 1600,
    content:
      "Three things stand out:\n- **SEC Form D** is overdue by 3 days. That's your highest-priority item.\n- **Gulf Real Estate Income Trust** failed its last attestation on a MAX_INVESTORS mismatch (contract 500 vs claim 250).\n- **Thanh Nguyen**'s KYC expired and **Kwame Asante** + **Aiko Yamamoto** are both flagged for enhanced due diligence.",
  },
  {
    delay: 2800,
    content:
      "Pick a thread below or ask me anything. I'll keep the answer short and cite the underlying data.",
  },
]

function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.trim() === "") return <div key={i} className="h-2" />
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const rendered = parts.map((p, j) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong
          key={j}
          className="font-semibold text-[var(--text-primary)]"
        >
          {p.slice(2, -2)}
        </strong>
      ) : (
        <span key={j}>{p}</span>
      ),
    )
    if (line.startsWith("- ")) {
      return (
        <p
          key={i}
          className="text-sm text-[var(--text-primary)] ml-2 mb-1 flex gap-2"
        >
          <span className="text-[var(--text-tertiary)] mt-1">•</span>
          <span>
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**") ? (
                <strong
                  key={j}
                  className="font-semibold text-[var(--text-primary)]"
                >
                  {p.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{j === 0 ? p.replace(/^- /, "") : p}</span>
              ),
            )}
          </span>
        </p>
      )
    }
    return (
      <p key={i} className="text-sm text-[var(--text-primary)] leading-relaxed mb-1">
        {rendered}
      </p>
    )
  })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Prescripted opening sequence
  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    introScript.forEach((step, idx) => {
      const t = window.setTimeout(() => {
        if (cancelled) return
        setMessages((m) => [
          ...m,
          {
            id: `intro-${idx}`,
            role: "assistant",
            content: step.content,
          },
        ])
        if (idx === introScript.length - 1) setIntroDone(true)
      }, step.delay)
      timers.push(t)
    })
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // Auto-scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  })

  async function sendMessage(text: string) {
    if (loading) return
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    }
    const assistantId = `a-${Date.now() + 1}`
    setMessages((m) => [
      ...m,
      userMsg,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ])
    setInput("")
    setLoading(true)

    abortRef.current = new AbortController()

    try {
      const history = [...messages, userMsg]
        .filter((m) => !m.id.startsWith("intro-"))
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, content: acc } : msg,
          ),
        )
      }

      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId ? { ...msg, streaming: false } : msg,
        ),
      )
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "I couldn't reach the model just now. Try again in a moment, or pick one of the suggested prompts below.",
                streaming: false,
              }
            : msg,
        ),
      )
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) sendMessage(input.trim())
  }

  const showSuggestions = introDone && messages.filter((m) => m.role === "user").length === 0

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Mike, Compliance Copilot"
        subtitle="Reads your workspace. Cites the data. Answers in plain English."
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: [0.165, 0.84, 0.44, 1] }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
              data-testid={`message-${msg.role}-${msg.id}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.20)] border border-[rgba(59,130,246,0.30)] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-xl rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-[var(--accent-blue)] text-white text-sm"
                    : "bg-[var(--bg-elevated)] border border-[var(--rule)]",
                )}
              >
                {msg.role === "assistant" ? (
                  <div className="space-y-0.5">
                    {msg.content ? (
                      formatMessage(msg.content)
                    ) : (
                      <ThinkingDots />
                    )}
                    {msg.streaming && msg.content && (
                      <span
                        className="inline-block w-1.5 h-3.5 ml-0.5 bg-[var(--accent-blue)] align-middle animate-pulse"
                        aria-hidden
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-elevated)] border border-[var(--rule)] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-4 sm:px-8 pb-4"
        >
          <p className="text-xs text-[var(--text-tertiary)] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Suggested threads
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p, i) => (
              <motion.button
                key={p}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
                onClick={() => sendMessage(p)}
                className="px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--rule)] hover:border-[rgba(59,130,246,0.40)] hover:text-[var(--accent-blue)] text-[var(--text-muted)] text-xs rounded-xl transition-colors"
                data-testid={`button-prompt-${i}`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="px-4 sm:px-8 pb-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mike about investors, filings, attestations…"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--rule)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors disabled:opacity-60"
            data-testid="input-chat"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-[var(--accent-blue)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors hover:opacity-90"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 py-1" data-testid="indicator-thinking">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
