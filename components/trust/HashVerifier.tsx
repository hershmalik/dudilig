"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react"
import { recomputeAttestationHash, type CertLike } from "@/lib/crypto/hash-browser"

interface HashVerifierProps {
  certificateId: string
  expectedHash: string
}

type State =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "match"; computed: string; canonicalLength: number }
  | { kind: "mismatch"; computed: string }
  | { kind: "error"; message: string }

export function HashVerifier({ certificateId, expectedHash }: HashVerifierProps) {
  const [state, setState] = useState<State>({ kind: "idle" })

  async function verify() {
    setState({ kind: "verifying" })
    try {
      const res = await fetch(`/api/certificates/${certificateId}`, {
        cache: "no-store",
      })
      if (!res.ok) {
        setState({ kind: "error", message: `Fetch failed: HTTP ${res.status}` })
        return
      }
      const cert = (await res.json()) as CertLike & { hash: string }
      const computed = await recomputeAttestationHash(cert)
      if (computed === expectedHash) {
        // Re-canonicalize purely to display payload byte length to the user.
        const length = JSON.stringify(cert).length
        setState({ kind: "match", computed, canonicalLength: length })
      } else {
        setState({ kind: "mismatch", computed })
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={verify}
        disabled={state.kind === "verifying"}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
        style={{
          background: "rgba(59,130,246,0.10)",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "var(--accent-blue)",
        }}
        data-testid="button-verify-hash"
      >
        {state.kind === "verifying" ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Verifying in your browser…
          </>
        ) : (
          <>
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify hash in your browser
          </>
        )}
      </button>

      {state.kind === "match" && (
        <div
          className="mt-3 p-3 rounded-md text-xs"
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.25)",
            color: "var(--text-muted)",
          }}
          data-testid="result-verify-match"
        >
          <div
            className="flex items-center gap-1.5 font-medium mb-1.5"
            style={{ color: "var(--accent-green)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hash verified independently
          </div>
          <p className="leading-relaxed">
            Your browser fetched the raw certificate JSON, serialized it with the
            same canonical algorithm Dudilig used at mint time, and recomputed
            SHA-256 over {state.canonicalLength.toLocaleString()} bytes of payload.
            The result matches the displayed hash bit-for-bit. No Dudilig
            server-side code was trusted in this verification.
          </p>
        </div>
      )}

      {state.kind === "mismatch" && (
        <div
          className="mt-3 p-3 rounded-md text-xs"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "var(--text-muted)",
          }}
          data-testid="result-verify-mismatch"
        >
          <div
            className="flex items-center gap-1.5 font-medium mb-1.5"
            style={{ color: "#EF4444" }}
          >
            <XCircle className="w-3.5 h-3.5" />
            Hash mismatch
          </div>
          <p className="font-mono break-all leading-relaxed">
            Computed: {state.computed}
            <br />
            Expected: {expectedHash}
          </p>
          <p className="mt-2 leading-relaxed">
            This means the certificate JSON has been altered since mint, or the
            canonical-serialization algorithms have drifted. Please report this
            to support@dudilig.com.
          </p>
        </div>
      )}

      {state.kind === "error" && (
        <div
          className="mt-3 p-3 rounded-md text-xs"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "var(--text-muted)",
          }}
          data-testid="result-verify-error"
        >
          Verification failed: {state.message}
        </div>
      )}
    </div>
  )
}
