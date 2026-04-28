import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-50 tracking-tight">Dudilig</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-50">
            The Compliance OS for<br />
            <span className="text-violet-400">Tokenized Assets</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automate KYC/AML, smart contract attestation, and regulatory filings
            for your RWA issuance. Like Vanta, but built for the tokenized economy.
          </p>
        </div>

        <div className="space-y-2 text-left bg-slate-900 border border-slate-800 rounded-xl p-5">
          {[
            "Continuous KYC/AML monitoring & sanctions screening",
            "Smart contract attestation — verify on-chain matches off-chain",
            "Regulatory filing tracker across 6+ jurisdictions",
            "Investor registry with accreditation management",
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-300">{feature}</p>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 w-full justify-center py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
        >
          Enter Demo
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-slate-600">Demo environment · Meridian Capital Partners</p>
      </div>
    </div>
  );
}
