"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Layers,
  MessageSquare,
  Microscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investors", label: "Investors", icon: Users },
  { href: "/attestation", label: "Attest", icon: ShieldCheck },
  { href: "/analyze", label: "Analyze", icon: Microscope },
  { href: "/chat", label: "AI", icon: MessageSquare },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 flex">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium transition-colors",
              active ? "text-violet-400" : "text-slate-500"
            )}
          >
            <Icon className={cn("w-5 h-5", active ? "text-violet-400" : "text-slate-500")} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
