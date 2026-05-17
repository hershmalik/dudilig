"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"

interface ComboboxProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Combobox({ options, value, onChange, placeholder = "Select..." }: ComboboxProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm text-left"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--rule)",
          color: value ? "var(--text-primary)" : "var(--text-tertiary)",
        }}
      >
        <span className="flex-1">{value || placeholder}</span>
        <ChevronDown
          className="w-4 h-4 shrink-0"
          style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : undefined, transition: "transform 150ms" }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule-strong)" }}
        >
          <div className="p-2" style={{ borderBottom: "1px solid var(--rule)" }}>
            <div className="flex items-center gap-2 px-2 py-1">
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 text-sm bg-transparent focus:outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                No results
              </p>
            ) : (
              filtered.map(option => (
                <button
                  key={option}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{
                    background: option === value ? "rgba(59,130,246,0.10)" : "transparent",
                    color: option === value ? "var(--accent-blue)" : "var(--text-muted)",
                  }}
                  onMouseEnter={e => {
                    if (option !== value)
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(247,244,237,0.04)"
                  }}
                  onMouseLeave={e => {
                    if (option !== value)
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                  }}
                  onClick={() => {
                    onChange(option)
                    setQuery("")
                    setOpen(false)
                  }}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
