"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useSidebar } from "./sidebar-context"

export function FloatingMike() {
  const { collapsed } = useSidebar()
  const pathname = usePathname()
  const onChat = pathname === "/chat" || pathname.startsWith("/chat/")

  if (!collapsed || onChat) return null

  return (
    <Link
      href="/chat"
      className="hidden lg:flex fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full items-center justify-center gap-2 shadow-2xl transition-all hover:scale-110 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #3B82F6, #6366F1)",
        boxShadow: "0 0 24px rgba(59,130,246,0.5), 0 4px 16px rgba(0,0,0,0.4)",
        width: "52px",
        height: "52px",
      }}
      title="Ask Mike"
    >
      <div className="flex flex-col items-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse-soft"
        style={{ background: "var(--accent-green)", border: "2px solid var(--bg-base)" }}
      />
    </Link>
  )
}
