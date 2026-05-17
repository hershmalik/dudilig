"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context"
import { FloatingMike } from "@/components/layout/FloatingMike"
import { RegMonitoringPanel } from "@/components/layout/RegMonitoringPanel"

function AppShell({ children }: { children: React.ReactNode }) {
  const { regMonOpen, setRegMonOpen } = useSidebar()
  return (
    <div className="flex h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>
      <MobileNav />
      <FloatingMike />
      <RegMonitoringPanel open={regMonOpen} onClose={() => setRegMonOpen(false)} />
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  )
}
