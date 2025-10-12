# Dudilig Design Guidelines
## AI Compliance Analysis Tool for VC Due Diligence

---

## Design Approach: Enterprise Design System

**Selected Framework:** Material Design with Fluent Design influences  
**Rationale:** This is a data-intensive, utility-focused enterprise tool requiring clarity, hierarchy, and trust. VCs need to quickly parse compliance data and make critical decisions. Visual consistency and information architecture take precedence over creative expression.

**Core Principles:**
- **Precision over personality** - Every element serves data clarity
- **Speed of comprehension** - Information hierarchy is paramount  
- **Trust through structure** - Professional, deterministic visual language
- **Citation-first design** - Source credibility is always visible

---

## Color System

### Light Mode (Primary Interface)
- **Background:** 0 0% 100% (pure white)
- **Surface:** 210 20% 98% (slate-50 equivalent)
- **Surface Elevated:** 210 20% 96%
- **Border:** 215 20% 85% 
- **Text Primary:** 222 47% 11% (slate-900)
- **Text Secondary:** 215 16% 47% (slate-600)

### Accent & Status Colors
- **Primary (Brand):** 221 83% 53% (professional blue - #2563EB equivalent)
- **Primary Hover:** 221 83% 48%
- **Success (Green Badge):** 142 71% 45%
- **Warning (Yellow Badge):** 38 92% 50%
- **Error (Red Badge):** 0 84% 60%
- **Citation Link:** 217 91% 60% (lighter blue for links)

### Dark Mode
- **Background:** 222 47% 11%
- **Surface:** 217 33% 17%
- **Text Primary:** 210 20% 98%
- Maintain same accent colors with adjusted opacity where needed

---

## Typography

**Font Stack:**  
- Primary: 'Inter' from Google Fonts (400, 500, 600, 700)
- Monospace: 'JetBrains Mono' for data/citations (400, 500)

**Scale:**
- H1 (Page Titles): 2rem (32px), font-weight 700, tracking-tight
- H2 (Section Headers): 1.5rem (24px), font-weight 600
- H3 (Card Headers): 1.125rem (18px), font-weight 600
- Body: 0.875rem (14px), font-weight 400, line-height 1.5
- Small (Metadata): 0.75rem (12px), font-weight 500
- Data Values: 1rem (16px), font-weight 600
- Citations: 0.8125rem (13px), monospace

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16  
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8  
- Card spacing: p-6
- Dense data areas: p-3 to p-4

**Grid System:**
- Main container: max-w-7xl mx-auto px-6
- Two-column analysis view: 60/40 split (results/details)
- Card grids: grid-cols-1 md:grid-cols-2 with gap-4

---

## Component Library

### Upload Interface
- **Drop Zone:** Dashed border (2px), rounded-lg, min-h-64, centered icon and text
- **Active State:** Solid border, bg-primary/5 tint
- **File Preview:** Compact card with file icon, name, size, remove button

### Classification Display
- **Tier Badge:** Pill shape, uppercase text, icon prefix, size lg
- **High Risk:** Red background (error color), white text
- **Medium Risk:** Yellow background, slate-900 text  
- **Low Risk:** Green background, white text
- **Citation Chips:** Inline, rounded-md, text-xs, border, hover:bg-slate-100, external link icon

### Gap Analysis Cards
- **Card Structure:** White bg, border, rounded-lg, p-6, shadow-sm
- **Status Badge:** Absolute top-right, circle icon with R/Y/G color
- **Action Text:** font-medium, text-slate-900, mb-2
- **Source Chip:** Link with document icon, text-citation-blue, underline-offset-2

### Scenario Panel
- **Container:** Bordered section, bg-slate-50, rounded-lg, p-6
- **Cost/Timeline Ranges:** Large numbers (text-2xl, font-bold), with +/- prefix
- **Deal Term Suggestions:** Numbered list, each with icon prefix, bg-white cards
- **Confidence Indicator:** Small badge, "High/Med/Low" with dot indicator

### PDF Export Preview
- **Button:** Primary CTA, size lg, icon (download), prominent placement
- **Preview Modal:** Shows miniature first page, branded header visible

### Navigation
- **Top Bar:** Sticky, bg-white, border-bottom, h-16
- **Logo:** Left-aligned, text + minimal icon mark
- **Actions:** Right-aligned, button group with clear hierarchy
- **Progress Indicator:** Linear progress bar during analysis (indeterminate)

### Data Tables (if needed)
- **Headers:** bg-slate-50, font-semibold, text-xs, uppercase, tracking-wide
- **Rows:** border-bottom, hover:bg-slate-50, py-3
- **Density:** Compact (more rows visible)

---

## Interaction Patterns

### Loading States
- **Skeleton Loaders:** For cards and content areas during extraction
- **Spinner:** Centered, medium size, for PDF generation
- **Progress Bar:** For upload and analysis stages (0-100%)

### Hover States
- **Cards:** scale-[1.01], shadow-md transition
- **Buttons:** Darken by 5-8% (primary), subtle shadow increase
- **Links/Citations:** Underline on hover, color shift to darker blue

### Animations
- **Minimal Only:** Fade-in for results (300ms), slide-in for scenario panel (400ms)
- **No Distractions:** No scroll animations, parallax, or decorative motion
- **Instant Feedback:** Button clicks, form interactions feel immediate

---

## Visual Hierarchy Rules

1. **Classification Result** - Largest element, immediate eye-draw
2. **Gap Badges** - Color-coded, scannable at a glance  
3. **Citation Chips** - Always visible but subordinate to main content
4. **Scenario Impact** - Prominent card, clear numerical ranges
5. **Actions/Export** - Bottom or right-rail, clear CTAs

---

## Trust & Credibility Elements

- **"Not Legal Advice" Banner:** Fixed bottom, bg-amber-50, border-amber-200, text-xs, dismissible
- **Confidence Tags:** Every major claim has High/Med/Low indicator
- **Timestamp:** All reports show generation time (ISO format, local time)
- **Version Number:** Subtle footer text (e.g., "v1.2 Demo")
- **Source Attribution:** Every regulatory statement links to specific article/recital

---

## Responsive Behavior

- **Desktop (1024px+):** Side-by-side results and details, full data tables
- **Tablet (768-1023px):** Stacked layout, condensed cards, scrollable tables
- **Mobile (< 768px):** Single column, collapsible sections, bottom sheet for citations

---

## Accessibility

- **Color Contrast:** All text meets WCAG AA (4.5:1 minimum)
- **Focus Indicators:** 2px solid ring, offset 2px, primary color
- **Keyboard Navigation:** Full tab order, escape to close modals
- **Screen Reader:** Proper ARIA labels on all interactive elements, status announcements for analysis completion

---

## Images

**No hero images or marketing visuals.** This is a data-focused tool. Use icons only:
- **File Type Icons:** Document, PDF, link (from Heroicons)
- **Status Icons:** Check circle, exclamation triangle, info circle  
- **Citation Icons:** External link, document text
- **Action Icons:** Download, refresh, settings