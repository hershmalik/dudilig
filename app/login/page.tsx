import Link from "next/link"
import { ShieldCheck, Wallet, ArrowRight, Eye } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 border-r border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-50">Dudilig</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-50 leading-tight">
              The Compliance OS<br />for Tokenized Assets
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Automate KYC/AML, verify smart contracts match their compliance claims, and track regulatory filings — all in one place.
            </p>
          </div>

          {/* Social proof */}
          <div className="space-y-3">
            {[
              { stat: "$85M+", label: "Assets under compliance monitoring" },
              { stat: "6+", label: "Jurisdictions covered" },
              { stat: "100%", label: "Attestation accuracy on audited contracts" },
            ].map(item => (
              <div key={item.stat} className="flex items-center gap-3">
                <span className="text-violet-400 font-bold text-lg w-16">{item.stat}</span>
                <span className="text-sm text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">Trusted by tokenized fund managers across Cayman, Singapore, and ADGM</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-50">Dudilig</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-50">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your tokenized asset compliance</p>
          </div>

          {/* Wallet connect */}
          <Link
            href="/onboarding"
            className="flex items-center gap-3 w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-medium text-sm"
          >
            <Wallet className="w-4 h-4" />
            Connect with MetaMask / Phantom
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@fund.ky"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
          </div>

          <p className="text-center text-xs text-slate-600">
            New issuer?{" "}
            <Link href="/onboarding" className="text-violet-400 hover:text-violet-300">
              Set up your compliance workspace
            </Link>
          </p>

          {/* Demo shortcut */}
          <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center space-y-2">
            <p className="text-xs text-slate-500">Just here to explore?</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              <Eye className="w-3 h-3" />
              Enter demo as Meridian Capital Partners
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
