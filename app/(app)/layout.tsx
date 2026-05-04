import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { FloatingMike } from "@/components/layout/FloatingMike"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
      </div>
    </SidebarProvider>
  )
}
