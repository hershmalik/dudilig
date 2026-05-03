# Dudilig Design System
## Dark Editorial-Terminal Aesthetic for Agentic Compliance OS

---

## 🎨 **Design Philosophy**

Dudilig uses a **dark editorial-terminal** design language that positions the product as infrastructure-grade compliance tooling. The aesthetic combines:
- **High-craft developer tooling** (monospace typography, terminal aesthetics)
- **Technical precision** (cryptographic verification, agent-based automation)
- **Minimalist editorial** (tight typography, no em dashes, substance over marketing)

Think: Linear meets Stripe meets Retool — modern B2B SaaS with developer-first sensibilities.

---

## 🔤 **Typography**

### Font Stack
```css
--font-sans: 'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

**Load Inter Tight** (modern geometric sans):
```html
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Load JetBrains Mono** (technical monospace):
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Typography Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|------|--------|-------------|----------------|-------|
| **H1 Display** | Inter Tight | `clamp(3rem, 7vw, 6rem)` | 300 | 1.05 | -0.024em | Hero headlines |
| **H2 Display** | Inter Tight | `clamp(2.25rem, 5vw, 4.5rem)` | 300 | 1.05 | -0.02em | Section headlines |
| **H3 Display** | Inter Tight | `clamp(1.75rem, 3vw, 3rem)` | 300 | 1.10 | -0.015em | Card headlines |
| **H4** | Inter Tight | 24px | 400 | 1.30 | -0.005em | Subsection titles |
| **Body** | Inter Tight | 14px | 400 | 1.55 | -0.011em | Paragraph text |
| **Body Large** | Inter Tight | 17px | 400 | 1.65 | -0.011em | Feature descriptions |
| **Label** | Inter Tight | 14px | 500 | 1.4 | -0.005em | Form labels |
| **Button** | Inter Tight | 14px | 500 | 1 | -0.005em | CTA buttons |
| **Fig Label** | JetBrains Mono | 10px | 400 | 1 | 0.08em | Terminal-style labels |
| **Eyebrow** | JetBrains Mono | 11px | 500 | 1 | 0.06em | Section identifiers |

### Display Font Class
```css
.font-display {
  font-family: var(--font-sans);
  font-weight: 300;
  letter-spacing: -0.02em;
}
```

### Terminal-Style Labels
```css
.fig-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
```

### Eyebrow Tags
```css
.eyebrow-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}
```

---

## 🎨 **Color System**

### Dark Editorial Theme (Always Dark)

#### Background Layers
```css
--bg-base: #0B0E16;      /* Main background - deep navy */
--bg-elevated: #13171F;  /* Cards, modals - slightly lighter */
--bg-deepest: #06080D;   /* Code blocks, terminal - darkest */
```

#### Text Hierarchy
```css
--text-primary: #F7F4ED;                  /* Primary text - warm cream */
--text-muted: rgba(247, 244, 237, 0.55);  /* Secondary text - 55% opacity */
--text-tertiary: rgba(247, 244, 237, 0.35); /* Labels, metadata - 35% opacity */
```

#### Borders & Rules
```css
--rule: rgba(247, 244, 237, 0.10);        /* Subtle dividers - 10% opacity */
--rule-strong: rgba(247, 244, 237, 0.18); /* Emphasized borders - 18% opacity */
```

#### Accent Colors
```css
--accent-blue: #3B82F6;   /* Primary actions, links, trust indicators */
--accent-green: #4ADE80;  /* Success, verified, live status */
--accent-amber: #C8842A;  /* Warnings, highlights */
--accent-red: #EF4444;    /* Errors, alerts, destructive actions */
```

### Color Usage Guide

| Color | Hex | Usage |
|-------|-----|-------|
| **Blue** | `#3B82F6` | CTAs, links, agent icons, compliance scores |
| **Green** | `#4ADE80` | Success states, verified badges, live indicators, cost savings |
| **Amber** | `#C8842A` | Value propositions, warnings, attention |
| **Red** | `#EF4444` | Errors, alerts, cost comparisons (old pricing) |
| **Cream** | `#F7F4ED` | All text, logos, primary UI elements |

---

## 📏 **Spacing System**

### Base Grid: 8px

| Value | rem | px | Usage |
|-------|-----|----|----|
| `0.5` | 0.125rem | 2px | Tight gaps |
| `1` | 0.25rem | 4px | Small gaps |
| `2` | 0.5rem | 8px | Default small spacing |
| `3` | 0.75rem | 12px | Medium-small |
| `4` | 1rem | 16px | Default medium |
| `6` | 1.5rem | 24px | Large |
| `8` | 2rem | 32px | Extra large |
| `10` | 2.5rem | 40px | Section padding |
| `12` | 3rem | 48px | Component spacing |
| `16` | 4rem | 64px | Major sections |
| `20` | 5rem | 80px | Hero spacing |

### Common Patterns
```css
/* Card padding */
padding: 40px; /* Large cards */
padding: 24px; /* Medium cards */
padding: 16px; /* Small cards */

/* Section spacing */
padding-top: 80px;     /* py-20 */
padding-bottom: 80px;

/* Component gaps */
gap: 8px;  /* Tight */
gap: 12px; /* Default */
gap: 24px; /* Generous */
```

---

## 🔘 **Border Radius**

### Radius Scale
```css
--radius: 1rem; /* Base: 16px */
--radius-sm: calc(var(--radius) - 8px);  /* 8px */
--radius-md: calc(var(--radius) - 4px);  /* 12px */
--radius-lg: var(--radius);              /* 16px */
--radius-xl: calc(var(--radius) + 8px);  /* 24px */
--radius-2xl: calc(var(--radius) + 16px); /* 32px */
```

### Usage Guide

| Element | Radius | Value | Class |
|---------|--------|-------|-------|
| **Cards** | Large | 16px | `rounded-2xl` |
| **Buttons** | Full | 9999px | `rounded-full` |
| **Inputs** | Medium | 8px | `rounded-md` |
| **Tags** | Small | 6px | `rounded-lg` |
| **Modals** | Large | 16px | `rounded-2xl` |
| **Code blocks** | Medium | 12px | `rounded-xl` |

---

## 📦 **Cards**

### Standard Card (`.dud-card`)
```css
.dud-card {
  background: var(--bg-elevated);
  border: 1px solid var(--rule);
  border-radius: 16px;
  padding: 40px;
  transition: border-color 250ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dud-card:hover {
  border-color: var(--rule-strong);
  transform: translateY(-2px);
}
```

### Usage
```jsx
<div className="dud-card">
  <div className="fig-label">FIG.01_COMPONENT</div>
  <h3 className="font-display mt-3 text-[var(--text-primary)]" style={{ fontSize: 28 }}>
    Card Title
  </h3>
  <p className="mt-2 text-[14px]" style={{ color: "var(--text-muted)" }}>
    Card description text
  </p>
</div>
```

### Elevated Dark Card
```jsx
<div className="dud-card relative" style={{ background: "var(--bg-deepest)" }}>
  {/* Terminal-style content */}
</div>
```

---

## 🔘 **Buttons**

### Primary Button (`.btn-primary`)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--text-primary); /* Cream on dark */
  color: var(--bg-base); /* Dark text */
  font-weight: 500;
  font-size: 14px;
  padding: 14px 28px;
  border-radius: 999px; /* Full pill */
  border: none;
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
```

### Ghost Button (`.btn-ghost`)
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--rule-strong);
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 14px;
  transition: border-color 200ms ease-out;
}

.btn-ghost:hover {
  border-color: rgba(247, 244, 237, 0.6);
}
```

### Usage
```jsx
{/* Primary CTA */}
<button className="btn-primary">
  Test Now <ArrowRight className="w-4 h-4" />
</button>

{/* Secondary CTA */}
<button className="btn-ghost">
  <Play className="w-3 h-3 fill-current" /> Demo
</button>
```

---

## 🎭 **Logo System**

### Dudilig Logo (Cryptographic Shield + Wordmark)

```jsx
<a href="#" className="flex items-center gap-2 group">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z"
      stroke="var(--text-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="transition-all duration-300 group-hover:stroke-[var(--accent-blue)]"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="var(--accent-blue)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="var(--accent-blue)"
      opacity="0.2"
      className="transition-all duration-300 group-hover:opacity-40"
    />
  </svg>
  <span
    className="text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-blue)]"
    style={{
      fontFamily: "var(--font-mono)",
      fontSize: "15px",
      fontWeight: 500,
      letterSpacing: "-0.01em"
    }}
  >
    Dudilig
  </span>
</a>
```

**Logo Symbolism:**
- **Shield**: Cryptographic compliance infrastructure
- **Checkmark**: Verification and attestation
- **Blue accent**: AI automation layer
- **Monospace wordmark**: Developer-first tooling

---

## 🎨 **Ambient Gradients**

### Background Gradients
```css
.gradient-warm {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(200, 132, 42, 0.10) 0%, transparent 60%);
  pointer-events: none;
  animation: drift-warm 24s ease-in-out infinite;
}

.gradient-cool {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
  pointer-events: none;
  animation: drift-cool 24s ease-in-out infinite;
}

@keyframes drift-warm {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-40px, 30px); }
}

@keyframes drift-cool {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(40px, -30px); }
}
```

### Usage
```jsx
<section className="relative pt-28 pb-12 overflow-hidden">
  <div className="gradient-cool" style={{ top: "-200px", left: "-200px" }} />
  <div className="gradient-warm" style={{ top: "-200px", right: "-200px" }} />
  {/* Content */}
</section>
```

---

## ✨ **Animations**

### Easing Function
**Primary easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — smooth, premium feel

### Common Animations

#### Fade In Up
```css
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

#### Pulse Soft (Status Indicators)
```css
@keyframes pulse-soft {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.animate-pulse-soft {
  animation: pulse-soft 2.5s ease-in-out infinite;
}
```

#### Shimmer (Loading States)
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

### Scroll Reveal Pattern
```jsx
import { Reveal } from "./components/Reveal";

<Reveal>
  <Section />
</Reveal>
```

---

## 📐 **Layout System**

### Max Width Container
```jsx
<div className="max-w-[1280px] mx-auto px-6 lg:px-16">
  {/* Content */}
</div>
```

### Section Spacing
```jsx
<section className="relative py-20 lg:py-28">
  {/* 80px mobile, 112px desktop */}
</section>
```

### Grid Patterns

#### 12-Column Grid
```jsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
  <div className="lg:col-span-6">
    {/* Left content */}
  </div>
  <div className="lg:col-span-6">
    {/* Right content */}
  </div>
</div>
```

#### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## 🎯 **Component Patterns**

### Section Label
```jsx
<div className="flex items-center gap-3 mb-6">
  <div className="fig-label">FIG.01_PROBLEM</div>
  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-soft" />
  <div className="fig-label" style={{ color: "var(--accent-green)" }}>GATE_LOCKED</div>
</div>
```

### Terminal Code Block
```jsx
<div className="rounded-xl p-5 border border-[var(--rule)] font-mono text-[12px]" 
     style={{ background: "var(--bg-deepest)", lineHeight: 1.7 }}>
  <div className="flex items-center gap-2">
    <span className="text-[var(--text-primary)]">&gt; COMMAND OUTPUT</span>
    <span className="text-[var(--accent-green)]">✓</span>
  </div>
</div>
```

### Live Indicator
```jsx
<div className="flex items-center gap-2">
  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-soft" />
  <span className="fig-label">LIVE</span>
</div>
```

---

## 📱 **Responsive Breakpoints**

```css
/* Tailwind default breakpoints */
sm:  640px  /* Small tablets */
md:  768px  /* Tablets - show nav */
lg:  1024px /* Desktop - full layout */
xl:  1280px /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Patterns
```jsx
{/* Stack on mobile, side-by-side on desktop */}
<div className="flex flex-col md:flex-row gap-6">
  {/* Content */}
</div>

{/* Hidden on mobile, visible on desktop */}
<div className="hidden lg:flex">
  {/* Desktop-only content */}
</div>

{/* Responsive padding */}
<div className="px-6 lg:px-16">
  {/* Responsive container */}
</div>
```

---

## 🎨 **Voice & Tone**

### Writing Principles
1. **No em dashes** — use periods or restructure sentences
2. **Substance over marketing** — quantify value ($500K → $20K)
3. **Technical precision** — use specific terms (KYC, ERC-3643, attestation)
4. **Concise copy** — remove unnecessary words
5. **Developer-first** — terminal metaphors, API language

### Examples

❌ **Avoid:**
```
"Our platform leverages cutting-edge AI technology to revolutionize 
compliance workflows—making it easier than ever to stay compliant."
```

✅ **Use:**
```
"AI agents automate KYC verification, sanctions screening, and smart 
contract attestation. $500K per offering now runs for $20K."
```

---

## 📋 **Quick Reference**

### CSS Variables
```css
/* Backgrounds */
var(--bg-base)      /* #0B0E16 */
var(--bg-elevated)  /* #13171F */
var(--bg-deepest)   /* #06080D */

/* Text */
var(--text-primary)   /* #F7F4ED */
var(--text-muted)     /* rgba(247, 244, 237, 0.55) */
var(--text-tertiary)  /* rgba(247, 244, 237, 0.35) */

/* Borders */
var(--rule)        /* rgba(247, 244, 237, 0.10) */
var(--rule-strong) /* rgba(247, 244, 237, 0.18) */

/* Accents */
var(--accent-blue)   /* #3B82F6 */
var(--accent-green)  /* #4ADE80 */
var(--accent-amber)  /* #C8842A */
var(--accent-red)    /* #EF4444 */

/* Fonts */
var(--font-sans)  /* 'Inter Tight' */
var(--font-mono)  /* 'JetBrains Mono' */
```

### Helper Classes
```css
.font-display      /* Display headlines */
.font-mono         /* Monospace text */
.fig-label         /* Terminal labels */
.eyebrow-tag       /* Pill badges */
.dud-card          /* Standard card */
.btn-primary       /* Primary button */
.btn-ghost         /* Secondary button */
.gradient-warm     /* Amber ambient */
.gradient-cool     /* Blue ambient */
```

---

## 🚀 **Implementation Checklist**

When implementing Dudilig design system:

- [ ] Load Inter Tight and JetBrains Mono fonts
- [ ] Set base font size to 16px
- [ ] Apply dark background (#0B0E16) to html/body
- [ ] Use warm cream text (#F7F4ED) as default
- [ ] Implement 8px spacing grid
- [ ] Use 16px border radius for cards
- [ ] Apply pill buttons (border-radius: 999px)
- [ ] Add subtle borders (10% opacity)
- [ ] Include ambient gradients on hero sections
- [ ] Use monospace for labels and technical UI
- [ ] Add smooth animations (cubic-bezier easing)
- [ ] Implement responsive breakpoints (mobile-first)
- [ ] Test accessibility (contrast ratios, motion preferences)

---

**Design System Version:** 1.0  
**Last Updated:** May 2026  
**Brand:** Dudilig — Agentic Compliance OS for RWA Tokenization
