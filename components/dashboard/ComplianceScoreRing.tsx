"use client"

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"

interface ComplianceScoreRingProps {
  score: number
}

export function ComplianceScoreRing({ score }: ComplianceScoreRingProps) {
  const data = [
    { name: "score", value: score, fill: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444" },
    { name: "bg", value: 100, fill: "#1e293b" },
  ]

  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const label = score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "At Risk"

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
      <div className="relative w-28 h-28" style={{ minWidth: 112, minHeight: 112 }}>
        <ResponsiveContainer width={112} height={112}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-50">{score}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color }}>{label}</p>
        <p className="text-xs text-slate-500 mt-1">Overall compliance</p>
        <p className="text-xs text-slate-500">health score</p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">KYC: 96%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-400">Filings: 71%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">Attestation: 94%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
