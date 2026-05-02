import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trust Certificate · Dudilig",
  description:
    "Public, cryptographically signed compliance attestations for tokenized real-world assets.",
}

export default function TrustLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
