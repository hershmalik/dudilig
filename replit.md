# Dudilig — Compliance OS

## Overview

Dudilig is a compliance operating system for tokenized real-world assets (RWAs). It helps fund managers and token issuers automate and track regulatory compliance across multiple jurisdictions. The app provides:

- **KYC/AML Investor Management** — Track investor verification status, flag PEP matches, and run sanctions screening
- **Smart Contract Attestation Engine** — Verify that deployed on-chain contracts actually enforce the compliance claims in legal documents (e.g., max investors, lockup periods, accredited-only restrictions)
- **Contract Analyzer** — AI-powered analysis of Solidity contracts against regulatory standards (Reg D, Reg S, MiCA, ERC-1400)
- **Regulatory Filings Tracker** — Monitor filing deadlines across 6+ jurisdictions (Cayman, Singapore, SEC, ADGM, etc.)
- **Issuer Passport** — Shareable public compliance certificate for tokens
- **Compliance AI Chat** — Natural language interface for compliance queries

The app is a demo/prototype using mock data throughout. There is no real database or authentication system yet.

## User Preferences

- **Tone**: Treat the user (Hersh Malik, Dudilig CEO) as a co-founder/CTO. Detailed technical explanations are welcome. Em dashes are allowed.
- **Production deployment**: dudilig.com (Render). Don't break `/api/analyze` — it's the only live API and powers the contract analyzer demo.
- **Hard constraints**:
  - Real SHA-256 hashing only (never mock or stub hash output)
  - `/trust/[id]` and the Issuer Passport must remain auth-free (publicly shareable)
  - File-based JSON for any persistence — no database
  - Do NOT modify `app/globals.css` design tokens, `AGENTS.md`, or `CLAUDE.md`
- **Stack lock**: Stay on the existing libraries — Framer Motion, Recharts, Radix, Lucide, Anthropic SDK. Don't introduce new UI frameworks.

## Mobile Responsive Baseline

The app must remain usable on iOS Safari and small Android viewports. Conventions in place:

- **Bottom nav (`MobileNav`)**: 56px tap targets (`min-h-[56px]`) and `paddingBottom: env(safe-area-inset-bottom)` to clear the iOS home indicator. Visible below `lg` (1024px).
- **Main content**: `pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0` in `app/(app)/layout.tsx` so content never hides behind the bottom nav.
- **Chat page**: Uses `h-full` (NOT `h-screen`) so the composer respects the layout's mobile-nav padding.
- **Tokens page rows**: `flex-col lg:flex-row` so the status panel stacks under the meta block on mobile; metrics grid uses `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`.
- **Onboarding**: Sidebar stacks on top below `lg`, form pairs use `grid-cols-1 sm:grid-cols-2`.
- **TopBar**: `px-4 sm:px-8`, subtitle hidden below `sm` to preserve room for the title.
- **ComplianceScoreRing**: `flex-col sm:flex-row` so the ring and legend stack on phones.
- **Page padding convention**: `p-4 sm:p-8` (or `px-4 sm:px-8`) on every interior page wrapper.

## System Architecture

### Framework & Runtime
- **Next.js 16.2.4** with the App Router (not Pages Router)
- **React 19** and **TypeScript 5**
- **IMPORTANT**: The `AGENTS.md` file warns that this version of Next.js has breaking changes from older versions. Always read `node_modules/next/dist/docs/` before writing Next.js-specific code

### Directory Structure
```
app/
  (app)/          — Authenticated app routes (layout wraps with Sidebar + MobileNav)
    dashboard/    — Main compliance overview
    investors/    — Investor KYC/AML registry
    attestation/  — Smart contract attestation engine
    analyze/      — AI-powered contract analyzer
    filings/      — Regulatory filing deadlines
    tokens/       — Token portfolio
    chat/         — Compliance AI chat
    passport/     — Issuer Passport public certificate
    onboarding/   — New user onboarding flow
  api/
    analyze/      — Server-side API route calling Anthropic Claude
  login/          — Login page (no real auth yet)
  page.tsx        — Landing/marketing page
  layout.tsx      — Root layout with fonts
components/
  layout/         — Sidebar, MobileNav, TopBar
  dashboard/      — KpiCard, ActivityFeed, ComplianceScoreRing, DeadlineTimeline
  attestation/    — AttestationEngine, ContractCodeBlock
  ui/             — Shared primitives: Card, Badge
lib/
  mock-data/      — Static mock data: investors, tokens, filings, attestations, activity
  types/          — TypeScript type definitions
  utils.ts        — Shared helpers: cn, formatCurrency, formatDate, timeAgo, daysUntil
```

### Routing
- Route group `(app)` applies a shared layout (Sidebar + MobileNav) to all interior pages
- The root `app/page.tsx` is a public landing page
- `app/login/page.tsx` is a separate public login page

### Frontend Architecture
- **All UI uses client-side state only** — no server state management library (no React Query, no Zustand)
- Pages that need interactivity are marked `"use client"`, static pages use React Server Components by default
- **Tailwind CSS v4** for styling, combined with inline CSS custom properties (`var(--bg-base)`, etc.) for the design system
- Custom design tokens are defined in `app/globals.css` as CSS variables (dark editorial theme: dark navy backgrounds, off-white text, blue/green/amber/red accents)
- **Fonts**: Inter Tight (sans) and JetBrains Mono (monospace), loaded via `next/font/google`
- **Component libraries used**:
  - `@radix-ui/react-dialog` — accessible modal primitives
  - `lucide-react` — icons
  - `recharts` — charts (RadialBarChart for compliance score ring)
  - `framer-motion` — animations
  - `class-variance-authority` + `clsx` + `tailwind-merge` — className utilities

### Backend / API
- **Single API route**: `app/api/analyze/route.ts` — calls Anthropic Claude to analyze Solidity contract code against compliance standards
- The Anthropic SDK (`@anthropic-ai/sdk`) is used server-side only in this route
- No database, no ORM, no authentication middleware — everything else is mock data

### Data Layer
- All data lives in `lib/mock-data/` as static TypeScript arrays
- Types are centrally defined in `lib/types/index.ts`
- No persistence — refreshing the page resets all state

### AI Chat
- The Chat page (`/chat`) uses **pre-written canned responses** mapped to specific prompt strings — it does NOT make real API calls
- The Contract Analyzer (`/analyze`) DOES make real API calls to Anthropic Claude via the `/api/analyze` route

### Mobile Support
- Responsive layout: Sidebar is hidden on mobile, replaced by a fixed bottom `MobileNav`
- Breakpoint: `lg` (1024px) — below this, sidebar collapses and MobileNav appears

## External Dependencies

### AI / LLM
- **Anthropic Claude** (`@anthropic-ai/sdk`) — used in the `/api/analyze` route to power the contract compliance analyzer. Requires `ANTHROPIC_API_KEY` environment variable.

### UI Component Libraries
- `@radix-ui/react-dialog` — dialog/modal primitives
- `@radix-ui/react-slot` — slot pattern for composable components
- `lucide-react` — icon set
- `recharts` — charting library (radial bar chart for compliance score)
- `framer-motion` — animation library

### Styling
- `tailwindcss` v4 with `@tailwindcss/postcss`
- `class-variance-authority`, `clsx`, `tailwind-merge` — className merging utilities

### Fonts (Google Fonts via next/font)
- Inter Tight — primary sans-serif
- JetBrains Mono — monospace for code and labels

### No Database
There is currently no database. If persistence is needed, a database (e.g., PostgreSQL via Drizzle ORM) would need to be added. All current data is mock data in TypeScript files.

### No Authentication
There is a login page UI but no real auth system. Adding authentication (e.g., NextAuth.js or Clerk) would be a future requirement.

### Environment Variables Required
- `ANTHROPIC_API_KEY` — Required for the `/api/analyze` contract analysis feature to work