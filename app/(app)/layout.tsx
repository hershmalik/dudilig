import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
