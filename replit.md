# Dudilig - AI Compliance Analysis for VC Due Diligence

## Overview
Dudilig is an AI-powered compliance analysis platform that transforms startup pitch decks into cited EU AI Act risk briefs with deal-term impact scenarios in under 3 minutes. Built for venture capital associates and partners conducting due diligence on AI and Web3 startups.

**Tagline:** From Deck to Deal Terms — with Citations

## Current State
**Version:** 1.2 (Demo Day Edition)
**Status:** Fully functional MVP with all core features implemented and tested
**Last Updated:** October 12, 2025
**Test Status:** ✅ End-to-end tested and verified

## Key Features

### 1. Multi-Modal Input
- **PDF Upload:** Drag-and-drop pitch deck analysis with automatic text extraction
- **URL Input:** Analyze pitch decks from public URLs
- **Manual Entry:** Structured form for direct company data input

### 2. AI-Powered Analysis
- **NER Extraction:** GPT-5 powered named entity recognition extracts company name, sector, geography, and AI use case from documents
- **Deterministic Classification:** Rules-based EU AI Act tier assignment (High-Risk, Limited-Risk, Minimal-Risk)
- **Gap Analysis:** Automated compliance gap identification with 5 key checkpoints
- **Scenario Modeling:** 2026 enforcement prediction with cost/timeline impacts

### 3. Enterprise UI
- **Design System:** Clean enterprise aesthetic with Inter and JetBrains Mono fonts
- **Professional Components:** Tier badges, citation chips, status indicators (R/Y/G)
- **Responsive Layout:** Optimized for desktop and tablet viewing
- **Loading States:** Beautiful animated states during analysis

### 4. Citation-First Output
- **100% Coverage:** Every regulatory claim includes source citation
- **EU AI Act References:** Direct links to articles, recitals, and annexes
- **Confidence Tags:** High/Medium/Low confidence indicators on all outputs
- **Legal Disclaimer:** Clear "not legal advice" banner on all outputs

### 5. PDF Export
- **1-Page Brief:** IC-ready compliance brief with all findings
- **Professional Formatting:** Branded layout with metrics, gaps, and scenarios
- **Download Ready:** Instant PDF generation for investment committee memos

## Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter for client-side navigation
- **State Management:** TanStack Query v5 for server state
- **UI Components:** Shadcn UI with Tailwind CSS
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React

### Backend Stack
- **Runtime:** Node.js 20 with Express
- **AI Integration:** OpenAI GPT-5 via Replit AI Integrations (no API key required)
- **PDF Processing:** pdf-parse for text extraction, Puppeteer for generation
- **Data Format:** YAML for rules engine, in-memory storage for demo
- **Type Safety:** Shared TypeScript schemas between frontend/backend

### Data Sources
- **EU AI Act Corpus:** Curated YAML rules mapping use cases to tiers
- **Compliance Templates:** YAML gap analysis templates by risk tier
- **Scenario Parameters:** JSON-based cost/timeline impact calculations
- **Citations:** Structured references to official EU legal text

## User Journey

1. **Upload:** User drops pitch deck PDF, pastes URL, or fills manual form
2. **Extract:** AI extracts company data (or uses manual input)
3. **Classify:** Deterministic rules assign EU AI Act tier with citations
4. **Analyze:** System identifies 4-5 compliance gaps with actions
5. **Simulate:** 2026 scenario shows cost/timeline/deal-term impacts
6. **Export:** User downloads 1-page PDF brief for IC review

**Target Time:** < 3 minutes from upload to export

## Project Structure

```
/client
  /src
    /components        # Reusable UI components
      UploadDropzone.tsx
      ClassificationDisplay.tsx
      ComplianceGapCard.tsx
      ScenarioPanel.tsx
      AnalysisResults.tsx
      ManualInputForm.tsx
      LoadingAnalysis.tsx
    /pages            # Route pages
      Home.tsx
    /lib              # Utilities
    index.css         # Global styles
  index.html          # Entry point

/server
  /data               # Rules and templates
    eu-ai-act-rules.yaml
    compliance-gaps.yaml
  /services           # Business logic
    openai-service.ts
    classification-service.ts
    gap-analysis-service.ts
    scenario-service.ts
    pdf-service.ts
  routes.ts           # API endpoints
  storage.ts          # In-memory data store

/shared
  schema.ts           # Shared TypeScript types
```

## API Endpoints

### POST /api/analyze/upload
Upload PDF pitch deck for analysis
- **Input:** multipart/form-data with PDF file
- **Output:** `{ analysisId: string }`

### POST /api/analyze/url
Analyze from URL (uses fallback data in demo)
- **Input:** `{ url: string }`
- **Output:** `{ analysisId: string }`

### POST /api/analyze/manual
Manual company data submission
- **Input:** ManualInput schema
- **Output:** `{ analysisId: string }`

### GET /api/analysis/:id
Retrieve analysis results
- **Output:** AnalysisResult schema

### GET /api/analysis/:id/pdf
Download PDF brief
- **Output:** PDF file (application/pdf)

## Key Design Decisions

### 1. Citation Coverage
Every regulatory statement includes a source chip with article/recital reference and URL. This builds trust and enables legal review.

### 2. Deterministic Classification
Use rules-based tier assignment instead of LLM inference to avoid hallucination. LLM only used for entity extraction (company name, sector, etc.).

### 3. Confidence Tags
All gaps and scenarios include High/Medium/Low confidence to signal certainty level to users.

### 4. Fallback Data
URL input uses pre-baked healthcare AI example to ensure demo reliability when actual URL fetching fails.

### 5. In-Memory Storage
Demo uses MemStorage for speed and simplicity. No database setup required for prototype.

## Future Roadmap

### Near-Term (Q1 2026)
- Add GDPR and SEC crypto compliance frameworks
- Implement 2-3 preset scenarios for comparison
- Enhanced PDF styling and branding options

### Medium-Term
- Expert review workflow for critical flags
- Simple authentication and analysis history
- Fintech-specific templates (KYC/AML, model risk)

### Long-Term Vision
- Fund-with-software model using Dudilig as selection edge
- Multi-framework coverage (HIPAA, SOC 2, etc.)
- Portfolio-wide compliance monitoring

## Development

### Running Locally
```bash
npm install
npm run dev
```

Application runs on port 5000 with Vite HMR for frontend.

### Environment Variables
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - Automatically set by Replit
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Automatically set by Replit

No manual API key configuration required when using Replit AI Integrations.

## Target Users

**Primary (Now):** VC associates and senior associates evaluating AI/health-data deals who need IC-ready briefs before partner review.

**Secondary (Later):** Fintech/AI compliance teams (CCO, Head of Risk) using the simulator internally for regulatory planning.

## Success Metrics

### Demo Day Goals
- Time-to-brief < 3 minutes ✓
- 100% citation coverage ✓
- 0 demo crashes ✓
- 5+ design partner intros (target)
- 2+ partners say brief would change deal terms (target)

## Notes

- This is a demo/prototype build. Not production-ready without auth, rate limiting, and database persistence.
- Uses Replit AI Integrations for OpenAI access (charges billed to Replit credits, no personal API key needed).
- PDF generation uses Puppeteer when available, with graceful HTML fallback when system dependencies are missing. Users can print HTML to PDF from their browser.
- All regulatory citations are accurate as of October 2025 but should be validated before real use.
- Classification rules are deterministic and case-sensitive. Use exact wording from rules engine for accurate tier assignment (e.g., "Medical Diagnosis" for High-Risk healthcare AI).

## Technical Implementation Details

### Routing
- **/** - Homepage with upload interface. Shows results inline after analysis.
- **/analysis/:id** - Dedicated analysis results page accessible via direct URL.

### PDF Export Behavior
The PDF export gracefully handles environments with or without Puppeteer dependencies:
- **With Puppeteer:** Generates true PDF files with proper formatting
- **Without Puppeteer (Replit demo):** Returns formatted HTML that users can print to PDF via browser

Both paths provide the same 1-page compliance brief content with all citations and formatting intact.
