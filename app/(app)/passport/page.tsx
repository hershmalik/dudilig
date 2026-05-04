import { CheckCircle2, ExternalLink, Download, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { tokens } from "@/lib/mock-data/tokens"
import { formatDate } from "@/lib/utils"

function DudiligLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>Dudilig</span>
    </div>
  )
}

export default function PassportPage() {
  const token = tokens[0]

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-6" style={{ background: "var(--bg-base)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <DudiligLogo />
        <span style={{ color: "var(--rule-strong)" }}>/</span>
        <span className="fig-label">Issuer Passport</span>
      </div>

      {/* Passport card */}
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--rule)" }}>

        {/* Top bar */}
        <div className="px-8 py-5 flex items-center gap-4" style={{ background: "rgba(74,222,128,0.06)", borderBottom: "1px solid rgba(74,222,128,0.15)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.12)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 12L11 14L15 10" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--accent-green)" }}>Compliance Attestation Passed</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>All compliance claims verified against deployed contract</p>
          </div>
          <Badge variant="success">Valid</Badge>
        </div>

        {/* Token details */}
        <div className="px-8 py-6 space-y-4" style={{ borderBottom: "1px solid var(--rule)" }}>
          <div>
            <p className="fig-label mb-1">Tokenized Asset</p>
            <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>{token.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Jurisdiction", value: token.jurisdiction },
              { label: "Token Standard", value: token.standard },
              { label: "Network", value: token.network },
              { label: "Issuer", value: "Meridian Capital Partners" },
            ].map(item => (
              <div key={item.label}>
                <p className="fig-label mb-0.5">{item.label}</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="fig-label mb-1">Contract Address</p>
            <div className="flex items-center gap-2">
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{token.contractAddress}</p>
              <button style={{ color: "var(--text-tertiary)" }}><Copy className="w-3 h-3" /></button>
              <button style={{ color: "var(--text-tertiary)" }}><ExternalLink className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        {/* Verified fields */}
        <div className="px-8 py-6" style={{ borderBottom: "1px solid var(--rule)" }}>
          <p className="fig-label mb-4">Verified Compliance Fields (7/7)</p>
          <div className="space-y-2.5">
            {[
              { field: "Investor Cap",             contract: "MAX_INVESTORS = 250",          claim: "250 investors max" },
              { field: "Transfer Lock-up",          contract: "TRANSFER_LOCKUP = 365 days",  claim: "12 month lockup" },
              { field: "Accreditation Enforcement", contract: "ACCREDITED_ONLY = true",      claim: "Accredited investors only" },
              { field: "Jurisdiction Whitelist",    contract: "KY, SG, AE, HK, VG, BVI",    claim: "6 approved jurisdictions" },
              { field: "Token Standard",            contract: "ERC-1400",                    claim: "ERC-1400" },
              { field: "Network",                   contract: "Polygon (chainId: 137)",      claim: "Polygon" },
              { field: "Transfer Restrictions",     contract: "Enabled — enforced on-chain", claim: "Enabled" },
            ].map(item => (
              <div key={item.field} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent-green)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.field}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    Contract: <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{item.contract}</span>
                  </p>
                </div>
                <Badge variant="success" className="shrink-0 text-xs">Match</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic proof */}
        <div className="px-8 py-6 space-y-3" style={{ borderBottom: "1px solid var(--rule)" }}>
          <p className="fig-label">Cryptographic Proof</p>
          <div className="rounded-xl p-3 space-y-2" style={{ background: "var(--bg-deepest)", border: "1px solid var(--rule)" }}>
            <div className="flex items-center justify-between">
              <span className="fig-label">Attestation Hash</span>
              <button style={{ color: "var(--text-tertiary)" }}><Copy className="w-3 h-3" /></button>
            </div>
            <p className="text-xs break-all" style={{ fontFamily: "var(--font-mono)", color: "var(--accent-blue)" }}>
              sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
            </p>
          </div>
          {[
            { label: "Attested by",          value: "Dudilig Attestation Engine v2.1" },
            { label: "Attested at",          value: formatDate(token.lastAttested) },
            { label: "Next scheduled run",   value: "May 9, 2026" },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-xs">
              <span style={{ color: "var(--text-tertiary)" }}>{row.label}</span>
              <span style={{ color: "var(--text-muted)" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Plain language */}
        <div className="px-8 py-6" style={{ borderBottom: "1px solid var(--rule)" }}>
          <p className="fig-label mb-3">What this passport means</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            This passport confirms that the smart contract deployed at the address above independently enforces the same rules stated in the offering documents. Dudilig read the contract code directly, checked each compliance claim — investor limits, transfer restrictions, accreditation requirements — and produced this cryptographic proof. Any LP, regulator, or liquidity provider can verify this without reading the contract code themselves.
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 flex gap-3">
          <button className="btn-ghost flex-1 justify-center text-xs py-2">
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-full transition-colors"
            style={{ background: "rgba(74,222,128,0.10)", color: "var(--accent-green)", border: "1px solid rgba(74,222,128,0.20)" }}
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      <p className="fig-label mt-8">Dudilig Issuer Passports update automatically on each attestation run.</p>
    </div>
  )
}
