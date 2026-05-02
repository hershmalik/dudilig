# Dudilig — Compliance OS for Tokenized Real-World Assets

## Overview
Dudilig is the AI-native compliance work platform for tokenized real-world asset (RWA) issuers. It automates KYC/AML monitoring, smart contract attestation (verifying on-chain code matches off-chain claims), regulatory filings, and investor registry management — turning compliance from a launch-blocker into a continuously verifiable trust signal.

**Tagline:** The Compliance OS for Tokenized Assets

**Real production app:** dudilig.com
**Real repo:** github.com/hershmalik/dudilig

## Current State
**Stack version:** Next.js 16.2.4 + React 19.2.4 + Tailwind 4 + Anthropic SDK
**Status:** Real product in production. The 24-hour Replit Agent 4 sprint to ship the public Trust Certificate flow is **complete and hardened**. Three live, signed, publicly-routable demo certificates are seeded; homepage links to them; embed + OG image routes live; abuse guards on POST endpoint; canonical hash matches JSON.stringify semantics; bad cert IDs render 404 (not 500); findings panel defaults open for demos.
**Last Updated:** May 2, 2026

## Sprint Output (shipped)

### In-app publish flow (May 2)
- `app/(app)/analyze/page.tsx` — added "Publish as Trust Certificate" card that appears after a Claude analysis completes. Form fields: issuer name (required), token name (required), contract address (optional), network (optional). On success shows the new cert URL + hash + "Open certificate" button + "Publish another" reset.
- `lib/storage/certificates.ts` — extracted `createCertificate()` helper that owns id generation, canonical hash payload, SHA-256 hashing, and disk write. Both the public POST endpoint and the in-app server action call this helper, so the canonical payload format stays in lockstep. Architect verified all 3 seeded cert hashes still match after refactor.
- `app/api/certificates/route.ts` — refactored POST to delegate to `createCertificate()` (no behavior change; seeder still works).
- **Anti-forgery via single-use analysis token (architect-flagged severe issue, fixed):**
  - `lib/storage/analysis-cache.ts` — in-memory map keyed by 48-hex-char opaque tokens, 30-min TTL, 500-entry cap with FIFO eviction, single-use (consume = delete).
  - `app/api/analyze/route.ts` — issues a fresh `analysisToken` on every successful analysis, also caps `code` at 60KB before burning a Claude call.
  - `app/(app)/analyze/actions.ts` — Server Action `saveAnalysisAsCertificate` accepts only the token + presentation fields. Looks up the trusted analysis server-side via `consumeAnalysis(token)`. The client cannot supply or modify the analysis content. Same field-byte caps as the public POST endpoint.
  - Why this matters: the `(app)/` routes have no auth gate. Without this, a malicious visitor could open devtools, mutate the analysis to a forged "PASS", and mint a Dudilig-signed certificate that lies about the contract. With the token, the analysis is server-controlled.
  - Bonus side effect: each publish requires first running a real Claude call (to mint a token), which is a natural cost-based rate limit on abuse.
- API smoke tests verified: `/api/analyze` returns valid 48-hex token + analysis; legacy `/api/certificates` POST path still creates certs for the seeder; `/trust/[id]` renders 200; oversized contracts (>60KB) are rejected before Claude.
- **Streaming body-size guard (architect-flagged DoS, fixed):**
  - `lib/http/read-body.ts` — `readBodyText(req, maxBytes)` streams the body with a running byte counter and cancels the reader the instant the cap is exceeded. Closes the chunked / no-Content-Length DoS path that `req.text()`/`req.json()` (which buffer the entire body before any check) leave open.
  - Applied to both `POST /api/analyze` (100KB body cap) and `POST /api/certificates` (100KB body cap). Verified via curl: oversized bodies are rejected with HTTP 413 in both Content-Length and Transfer-Encoding: chunked modes.
  - `app/(app)/analyze/actions.ts` — added 4KB serialized cap on `claimedFacts` to prevent nested-object abuse on the in-app publish path.

### Hardening fixes (post-architect-review)
- `lib/crypto/hash.ts` — `canonicalize()` now matches `JSON.stringify` semantics for non-serializable values: `undefined` in arrays → `null`; `undefined` object values omitted; functions/symbols treated like undefined. Determinism across key order verified.
- `lib/storage/certificates.ts` — `getCertificate()` returns `null` for malformed ids (was throwing) so invalid `/trust/<bad>` URLs render Next's 404 instead of a 500.
- `app/api/certificates/route.ts` (POST) — added: optional `CERT_API_TOKEN` env / `X-Cert-Token` header gate (when env unset, endpoint stays open for dev/seeder), 100KB body cap, 60KB contractCode cap, 1KB caps on text fields. Closes the cost-amplification + disk-fill DoS surface flagged by the architect.
- `scripts/seed-certificates.ts` — sends `X-Cert-Token` header when `CERT_API_TOKEN` is set in env.
- `components/trust/TrustCertificate.tsx` — rule findings panel defaults to OPEN (better demo UX, also fixes flaky e2e click-toggle).

### Production env (Render) — set this
- `CERT_API_TOKEN` — any random string. Required to gate public POST submissions.

### New code paths
- `lib/services/analyze-claude.ts` — extracted Claude Opus 4.5 call, shared by `/api/analyze` and `/api/certificates`. The `/api/analyze` UX is unchanged; this is a non-breaking refactor.
- `lib/crypto/hash.ts` — canonical JSON serializer + real SHA-256 attestation hash.
- `lib/storage/certificates.ts` — file-based JSON persistence under `data/certificates/{id}.json`, URL-safe 12-char IDs.
- `lib/storage/seed.ts` + `data/certificates/_seed.json` — manifest mapping the three demo cert keys to ids.
- `app/api/certificates/route.ts` (POST + GET) — create cert from contract+claims, lists all.
- `app/api/certificates/[id]/route.ts` — fetch raw cert JSON.
- `app/api/og/[id]/route.tsx` — `next/og` ImageResponse for OG previews.
- `app/trust/[id]/page.tsx` + `app/trust/layout.tsx` — public, auth-free certificate page.
- `app/trust/[id]/embed/page.tsx` + `embed/layout.tsx` — transparent-background iframe-friendly card.
- `components/trust/TrustCertificate.tsx` + `TrustCertificateEmbed.tsx` — UI components.
- `app/page.tsx` — homepage now reads the seed manifest server-side and showcases the three live certs.
- `scripts/seed-certificates.ts` — idempotent seed script (`npx tsx scripts/seed-certificates.ts`); uses the live API.
- `docs/a16z-speedrun.md` — Speedrun application writeup.

### Demo certificate IDs (current seed)
- **Clean pass (ERC-1400):** `/trust/z3ud7652qmq4` — Meridian Private Credit Fund I, PASS 88/100
- **Warnings (Reg D 506(c)):** `/trust/c9zg8s7ayn3q` — Aspen Ranchland REIT Series A, REVIEW 58/100
- **Mismatch (Reg D 506(c)):** `/trust/3fppf3bxwx47` — Gulf Real Estate Income Trust, FAIL 32/100 (claimed 250 cap / on-chain 500)

To re-seed (will burn 3 Claude calls): `npx tsx scripts/seed-certificates.ts --force`

## Hackathon Sprint Goal (24h)
Ship a real, public, signed, embeddable Trust Certificate URL backed by the production Claude analyzer — the network-effect lever identified in the PRD as the 90-day milestone.

### In scope
1. Persistence layer for analysis runs (file-based JSON for the sprint)
2. Public route `/trust/[id]` — no auth, no app shell
3. Real SHA-256 hash of canonical attestation payload (replaces hardcoded placeholder)
4. Embeddable lightweight `/trust/[id]/embed` route + copy-paste iframe snippet
5. Three pre-seeded certificates linked from the homepage:
   - Clean pass (well-formed ERC-3643)
   - Pass with warnings (partial accreditation enforcement)
   - Mismatch demo (claimed 250 investor cap / enforced 500)
6. Open Graph image generation for shareable previews
7. a16z Speedrun writeup

### Out of scope (v1)
- EAS testnet anchoring (stretch only if hours 20-24 available)
- Real-chain RPC reads
- Form D drafting agent
- Auth and DB migration

## Existing Surfaces (production code, do not regress)

### Public routes
- `/` — marketing landing
- `/login` — auth entry

### Authenticated `(app)/` routes
- `/dashboard` — KPIs, compliance score ring, activity feed, deadline timeline
- `/analyze` — **Live Claude Opus 4.5 contract analyzer.** Pasted Solidity → rule-by-rule pass/fail/warning per standard. Standards: Reg D 506(c), Reg S, MiCA, ERC-1400. This is the only real production AI surface and the foundation for the Trust Certificate work.
- `/attestation` — Attestation Engine UI (currently mock data, fail-mode toggle)
- `/certificate` — Trust Certificate viewer (currently hardcoded mock; being replaced by `/trust/[id]`)
- `/tokens`, `/investors`, `/filings`, `/chat`, `/onboarding`

### API
- `POST /api/analyze` — production Claude integration. Schema-enforced JSON output. **Do not break this.**

## Architecture Highlights

### Frontend
- **Next.js 16.2.4 App Router with Turbopack.** AGENTS.md warns: this is a new Next.js with breaking changes; consult `node_modules/next/dist/docs/` before writing new Next.js code.
- **React 19.2.4**
- **Tailwind 4** via `@tailwindcss/postcss`
- **UI:** Radix dialog/slot, Lucide icons, Framer Motion, Recharts
- **Custom CSS variables** in `app/globals.css` (`--bg-base`, `--accent-blue`, `--accent-green`, etc.) — design system relies on these, not on shadcn theming

### Backend
- **API routes** under `app/api/`
- **Anthropic SDK** with `claude-opus-4-5` model
- Reads `ANTHROPIC_API_KEY` from env

### Data
- All current data is mocked in `lib/mock-data/` (tokens, attestations, investors, filings, activity)
- Sprint adds file-based JSON persistence under `data/certificates/` for trust certificate records

## Project Structure
```
/app
  /(app)/           # Authenticated app surfaces
    dashboard/, analyze/, attestation/, certificate/,
    tokens/, investors/, filings/, chat/, onboarding/
  /api/
    analyze/        # Real Claude integration
  /trust/[id]/      # NEW — public trust certificate (sprint)
  layout.tsx, page.tsx, globals.css

/components
  /attestation/     # AttestationEngine, ContractCodeBlock
  /layout/          # TopBar, Sidebar, MobileNav
  /ui/              # badge, card

/lib
  /mock-data/       # tokens, attestations, investors, filings, activity
  /types/           # Domain types
  utils.ts          # cn, formatCurrency, formatDate, timeAgo

/data               # NEW — sprint persistence layer
  /certificates/    # JSON-per-certificate
```

## Replit Workspace Setup
- **Workflow:** "Start application" runs `npx next dev -p 5000 -H 0.0.0.0`
- **Port:** 5000 (Replit standard, mapped to external 80)
- **Node:** 20 (via Replit nodejs-20 module)
- **Secrets needed:** `ANTHROPIC_API_KEY`

## Production Deployment (Render)
- `render.yaml` configured for Render web service
- Build: `npm install && npm run build`
- Start: `npm start`
- Production port: 3000

## Key Design Constraints (do not violate)
1. **Don't break `/api/analyze` or `/analyze` UI** — production surface, paying-customer credibility depends on it
2. **Don't replace the design system** — uses CSS custom properties from `globals.css`, not shadcn defaults
3. **Don't introduce a database** for the 24-hour sprint — file-based JSON is fine
4. **Don't fake the cryptographic hash** — must be real SHA-256 over a deterministic canonical payload
5. **Public certificate route must be auth-free** — no login wall, no app chrome

## Notes
- AGENTS.md and CLAUDE.md at repo root contain agent-specific instructions for the codebase
- The user is Hersh Malik (CEO), applying to a16z Speedrun (apps due in <2 weeks). This sprint exists to strengthen that application by shipping the Trust Certificate flow as a clickable artifact.
