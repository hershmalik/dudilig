import { promises as fs } from "node:fs"
import path from "node:path"

export type SeedManifest = {
  clean?: string
  warning?: string
  mismatch?: string
  [key: string]: string | undefined
}

const MANIFEST_PATH = path.join(
  process.cwd(),
  "data",
  "certificates",
  "_seed.json"
)

export async function readSeedManifest(): Promise<SeedManifest> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8")
    return JSON.parse(raw) as SeedManifest
  } catch {
    return {}
  }
}
