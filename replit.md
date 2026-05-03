# Dudilig — Compliance OS for Tokenized Real-World Assets

## Overview
Dudilig is an AI-native compliance work platform designed for tokenized real-world asset (RWA) issuers. It streamlines and automates critical compliance tasks such as KYC/AML monitoring, smart contract attestation, regulatory filings, and investor registry management. The platform aims to transform compliance from a bottleneck into a continuous, verifiable trust signal, enhancing the credibility and market potential of tokenized assets. The project's vision is to provide a comprehensive Compliance OS for tokenized assets, supporting applications for programs like a16z Speedrun.

## User Preferences
I want to interact with the agent as if it were a co-founder CTO.
I prefer detailed explanations.
Do not make changes to `AGENTS.md` and `CLAUDE.md`.
Do not change the design system which uses CSS custom properties from `globals.css`.
Do not introduce a database for the 24-hour sprint; file-based JSON is fine.
Do not fake the cryptographic hash; it must be a real SHA-256 over a deterministic canonical payload.
The public certificate route must be authentication-free.
Don't break `/api/analyze` or the `/analyze` UI.

## System Architecture

### UI/UX Decisions
The application uses a custom design system based on CSS variables defined in `app/globals.css` (e.g., `--bg-base`, `--accent-blue`, `--accent-green`), rather than shadcn theming. UI components leverage Radix dialog/slot, Lucide icons for iconography, Framer Motion for animations, and Recharts for data visualization. The public `/trust/[id]` route is designed to be auth-free and without the main app shell, ensuring broad accessibility. An embeddable `/trust/[id]/embed` route provides a transparent-background, iframe-friendly card for easy integration into other platforms.

### Technical Implementations
The frontend is built with **Next.js 16.2.4 App Router** and **React 19.2.4**, styled using **Tailwind 4**. The backend implements **API routes** under `app/api/` and integrates with the **Anthropic SDK** using the `claude-opus-4-5` model for AI analysis. A file-based JSON persistence system under `data/certificates/` is used for storing trust certificate records, utilizing URL-safe 12-character IDs and a canonical JSON serializer with SHA-256 hashing for cryptographic attestation. Security measures include anti-forgery tokens for analysis publication, single-use analysis tokens stored on disk, and streaming body-size guards to prevent Denial-of-Service attacks on API endpoints. Hash verification is implemented both server-side and client-side (in-browser) to ensure consistency and transparency.

### Feature Specifications
- **AI-native Compliance:** Automates KYC/AML, smart contract attestation, regulatory filings, and investor registry management.
- **Trust Certificates:** Publicly routable, signed, and embeddable trust certificates for tokenized RWAs. These certificates include a "Scope of Trust" disclosure detailing what is and isn't proven by the attestation.
- **Contract Analysis:** Utilizes Claude Opus 4.5 for rule-by-rule pass/fail/warning analysis of Solidity contracts against standards like Reg D 506(c), Reg S, MiCA, and ERC-1400.
- **Persistence:** File-based JSON storage for analysis runs and certificates, ensuring data integrity without a traditional database for rapid iteration.
- **Security:** Anti-forgery tokens, single-use analysis tokens, and body-size limits on API endpoints (`/api/analyze`, `/api/certificates`) to prevent abuse and DoS attacks.
- **In-Browser Hash Verification:** Allows users to independently verify the cryptographic hash of a certificate directly in their browser.
- **Open Graph Image Generation:** Provides shareable previews for trust certificates.

## External Dependencies
- **Anthropic SDK:** Integrated for AI model interaction, specifically using the `claude-opus-4-5` model. Requires `ANTHROPIC_API_KEY`.
- **Next.js:** The primary web framework.
- **React:** Frontend library.
- **Tailwind CSS:** For styling.
- **Radix UI:** For UI primitives (e.g., dialog, slot).
- **Lucide Icons:** For iconography.
- **Framer Motion:** For animations.
- **Recharts:** For data visualization.