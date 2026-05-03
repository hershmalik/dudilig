import { Playfair_Display } from "next/font/google";
import { readSeedManifest } from "@/lib/storage/seed";
import { getCertificate } from "@/lib/storage/certificates";
import type { Certificate } from "@/lib/types/certificate";
import HeroSection from "@/components/landing/HeroSection";

export const dynamic = "force-dynamic";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export default async function Home() {
  const manifest = await readSeedManifest();
  const [clean, warning, mismatch] = await Promise.all([
    manifest.clean ? getCertificate(manifest.clean) : null,
    manifest.warning ? getCertificate(manifest.warning) : null,
    manifest.mismatch ? getCertificate(manifest.mismatch) : null,
  ]);

  const showcase: Certificate[] = [];
  if (clean) showcase.push(clean);
  if (warning) showcase.push(warning);
  if (mismatch) showcase.push(mismatch);

  return (
    <div className={playfairDisplay.variable}>
      <HeroSection showcase={showcase} />
    </div>
  );
}
