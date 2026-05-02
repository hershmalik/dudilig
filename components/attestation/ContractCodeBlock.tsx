import { contractSolidity } from "@/lib/mock-data/tokens"
import { tokens } from "@/lib/mock-data/tokens"

export function ContractCodeBlock() {
  const token = tokens[0]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">On-Chain Contract</p>
          <p className="text-xs text-slate-500 mt-1 font-mono">{token.contractAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{token.network}</p>
          <p className="text-xs text-slate-600">Block #{token.deploymentBlock.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/50">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-2 text-xs text-slate-500 font-mono">MeridianPrivateCreditFund.sol</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-400 overflow-x-auto leading-relaxed">
          <code>
            {contractSolidity.split("\n").map((line, i) => {
              const isHighlighted =
                line.includes("MAX_INVESTORS") ||
                line.includes("TRANSFER_LOCKUP") ||
                line.includes("ACCREDITED_ONLY") ||
                line.includes("jurisdictionWhitelist")

              return (
                <span key={i} className="block">
                  <span className="text-slate-700 select-none mr-4 inline-block w-6 text-right text-xs">
                    {i + 1}
                  </span>
                  <span className={isHighlighted ? "text-violet-300" : "text-slate-400"}>
                    {line
                      .replace(/(\/\/.*)/g, "COMMENT:$1")
                      .split("COMMENT:")
                      .map((part, j) =>
                        j === 1 ? (
                          <span key={j} className="text-slate-600">{part}</span>
                        ) : (
                          part
                            .replace(/(uint256|bool|string\[\]|address|mapping|bytes32)/g, "TYPE:$1")
                            .replace(/(public|private|constant|override|internal|require|emit)/g, "KW:$1")
                            .split(/(?=TYPE:|KW:)/)
                            .map((seg, k) => {
                              if (seg.startsWith("TYPE:")) return <span key={k} className="text-blue-400">{seg.slice(5)}</span>
                              if (seg.startsWith("KW:")) return <span key={k} className="text-violet-400">{seg.slice(3)}</span>
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
