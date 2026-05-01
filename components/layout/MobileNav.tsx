"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  MessageSquare,
  Microscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard",   label: "Dashboard", icon: LayoutDashboard },
  { href: "/investors",   label: "Investors",  icon: Users },
  { href: "/attestation", label: "Attest",     icon: ShieldCheck },
  { href: "/analyze",     label: "Analyze",    icon: Microscope },
  { href: "/chat",        label: "AI",         icon: MessageSquare },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--rule)",
        backdropFilter: "blur(12px)",
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium transition-colors"
            style={{
              color: active ? "var(--accent-blue)" : "var(--text-tertiary)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
