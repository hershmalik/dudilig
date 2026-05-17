"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface SidebarCtx {
  collapsed: boolean
  toggle: () => void
  regMonOpen: boolean
  setRegMonOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarCtx>({
  collapsed: false,
  toggle: () => {},
  regMonOpen: false,
  setRegMonOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [regMonOpen, setRegMonOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dudilig.sidebar.collapsed")
      if (stored === "true") setCollapsed(true)
    } catch {}
  }, [])

  function toggle() {
    setCollapsed(c => {
      const next = !c
      try { localStorage.setItem("dudilig.sidebar.collapsed", String(next)) } catch {}
      return next
    })
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, regMonOpen, setRegMonOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}
