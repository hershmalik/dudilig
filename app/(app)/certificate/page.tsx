import { ShieldCheck, CheckCircle2, ExternalLink, Download, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { tokens } from "@/lib/mock-data/tokens"
import { formatDate } from "@/lib/utils"

export default function CertificatePage() {
  const token = tokens[0]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-16 px-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-50">Dudilig</span>
        <span className="text-slate-600 mx-2">/</span>
        <span className="text-slate-400 text-sm">Trust Certificate</span>
      </div>

      {/* Certificate card */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="bg-emerald-600/10 border-b border-emerald-600/20 px-8 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-emerald-400">Compliance Attestation Passed</p>
            <p className="text-xs text-slate-400 mt-0.5">All compliance claims cryptographically verified against deployed contract</p>
          </div>
          <Badge variant="success">Valid</Badge>
        </div>

        {/* Token details */}
        <div className="px-8 py-6 border-b border-slate-800 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tokenized Asset</p>
            <p className="text-lg font-bold text-slate-50">{token.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Jurisdiction", value: token.jurisdiction },
              { label: "Token Standard", value: token.standard },
              { label: "Network", value: token.network },
              { label: "Issuer", value: "Meridian Capital Partners" },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Contract Address</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-slate-400">{token.contractAddress}</p>
              <button className="text-slate-600 hover:text-slate-400">
                <Copy className="w-3 h-3" />
              </button>
              <button className="text-slate-600 hover:text-violet-400">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Verified fields */}
        <div className="px-8 py-6 border-b border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Verified Compliance Fields (7/7)</p>
          <div className="space-y-2.5">
            {[
              { field: "Investor Cap", contract: "MAX_INVESTORS = 250", claim: "250 investors max", match: true },
              { field: "Transfer Lock-up", contract: "TRANSFER_LOCKUP = 365 days", claim: "12 month lockup", match: true },
              { field: "Accreditation Enforcement", contract: "ACCREDITED_ONLY = true", claim: "Accredited investors only", match: true },
              { field: "Jurisdiction Whitelist", contract: "KY, SG, AE, HK, VG, BVI", claim: "6 approved jurisdictions", match: true },
              { field: "Token Standard", contract: "ERC-1400", claim: "ERC-1400", match: true },
              { field: "Network", contract: "Polygon (chainId: 137)", claim: "Polygon", match: true },
              { field: "Transfer Restrictions", contract: "Enabled — enforced on-chain", claim: "Enabled", match: true },
            ].map(item => (
              <div key={item.field} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300">{item.field}</p>
                  <p className="text-xs text-slate-600 mt-0.5">Contract: <span className="font-mono text-slate-500">{item.contract}</span></p>
                </div>
                <Badge variant="success" className="shrink-0 text-xs">Match</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Attestation proof */}
        <div className="px-8 py-6 border-b border-slate-800 space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Cryptographic Proof</p>
          <div className="bg-slate-950 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Attestation Hash</span>
              <button className="text-slate-600 hover:text-slate-400">
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs font-mono text-violet-300 break-all">sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456</p>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Attested by</span>
            <span className="text-slate-300">Dudilig Attestation Engine v2.1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Attested at</span>
            <span className="text-slate-300">{formatDate(token.lastAttested)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Next scheduled run</span>
            <span className="text-slate-300">May 9, 2026</span>
          </div>
        </div>

        {/* Plain language explainer */}
        <div className="px-8 py-6 border-b border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">What this certificate means</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            This certificate confirms that the smart contract deployed at the address above has been independently verified to enforce the same rules stated in the offering documents. Dudilig read the contract code directly, checked each compliance claim — investor limits, transfer restrictions, accreditation requirements — and produced this cryptographic proof. Any liquidity provider, institutional investor, or regulator can verify this independently without reading the contract code themselves.
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors">
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium rounded-xl transition-colors">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-700 mt-8">
        Dudilig Trust Certificates are issued continuously and update automatically on each attestation run.
      </p>
    </div>
  )
}
