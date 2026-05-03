import { contractSolidity } from "@/lib/mock-data/tokens"
import { tokens } from "@/lib/mock-data/tokens"

export function ContractCodeBlock() {
  const token = tokens[0]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">On-Chain Contract</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">{token.contractAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-tertiary)]">{token.network}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Block #{token.deploymentBlock.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[var(--bg-base)] rounded-xl border border-[var(--rule)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--rule)] bg-[var(--bg-elevated)]/50">
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(239,68,68,0.60)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(200,132,42,0.60)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(74,222,128,0.60)]" />
          <span className="ml-2 text-xs text-[var(--text-tertiary)] font-mono">MeridianPrivateCreditFund.sol</span>
        </div>
        <pre className="p-4 text-xs font-mono text-[var(--text-muted)] overflow-x-auto leading-relaxed">
          <code>
            {contractSolidity.split("\n").map((line, i) => {
              const isHighlighted =
                line.includes("MAX_INVESTORS") ||
                line.includes("TRANSFER_LOCKUP") ||
                line.includes("ACCREDITED_ONLY") ||
                line.includes("jurisdictionWhitelist")

              return (
                <span key={i} className="block">
                  <span className="text-[var(--text-tertiary)] select-none mr-4 inline-block w-6 text-right text-xs">
                    {i + 1}
                  </span>
                  <span className={isHighlighted ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"}>
                    {line
                      .replace(/(\/\/.*)/g, "COMMENT:$1")
                      .split("COMMENT:")
                      .map((part, j) =>
                        j === 1 ? (
                          <span key={j} className="text-[var(--text-tertiary)]">{part}</span>
                        ) : (
                          part
                            .replace(/(uint256|bool|string\[\]|address|mapping|bytes32)/g, "TYPE:$1")
                            .replace(/(public|private|constant|override|internal|require|emit)/g, "KW:$1")
                            .split(/(?=TYPE:|KW:)/)
                            .map((seg, k) => {
                              if (seg.startsWith("TYPE:")) return <span key={k} className="text-[var(--accent-blue)]">{seg.slice(5)}</span>
                              if (seg.startsWith("KW:")) return <span key={k} className="text-[var(--accent-blue)]">{seg.slice(3)}</span>
                              return seg
                            })
                        )
                      )}
                  </span>
                </span>
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}
