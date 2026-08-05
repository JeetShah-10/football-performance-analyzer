# DESIGN SYSTEM & ANTI-SLOP RULES (DESIGN.md)

This document establishes strict design taste, frontend engineering standards, and anti-slop rules for all human and AI contributors (Antigravity IDE, Cursor, Claude, Windsurf).

---

## 🚫 FORBIDDEN "VIBECODED" & AI-SLOP PATTERNS (STRICT)

### 1. Visual & Aesthetic Bans
- **NO "AI Purple" Gradients:** Absolutely NO deep purple/indigo gradients (`from-purple-600 to-indigo-600`), neon glows, or glowing borders.
- **NO Pure Black or Pure White:** Never use `#000000` or `#FFFFFF` for primary backgrounds/text. Use Zinc tone scale (`#09090b` / `zinc-950` for dark backgrounds, `#09090b` for primary text on `#fafafa` / `zinc-50`).
- **NO Outer/Fuzzy Glows:** Avoid generic centered box-shadow glows. Use tight, subtle, y-axis offset shadows (`shadow-sm` or `shadow-md` in Tailwind) or subtle border-driven separation (`border-zinc-800`).
- **NO Pill-Shaped Desktop Buttons:** Avoid `rounded-full` buttons for primary CTA desktop components. Use `rounded-md` or `rounded-lg` for a sleek SaaS aesthetic.
- **NO Generic Fonts or Cursive Accents:** Use clean modern typography (Inter, Outfit, or monospaced stats fonts like JetBrains Mono). No cursive fonts or generic browser serif fallbacks.
- **NO Emoji Icons as UI Components:** Do not use raw emojis (e.g. ⚽, 🚀, 🔥) as primary UI action icons. Use clean SVG icon sets (Lucide/Heroicons tuned to matching stroke widths).

### 2. Copy & Content Bans
- **NO Fake Metrics or Social Proof:** Never generate fake visitor counters, fake customer review numbers ("Used by 10,000+ players!"), or artificial star ratings.
- **NO Generic Vague Headlines:** Never output vague marketing slop like "Unlock Your Potential", "Transform Your Game", or "The Future of Analytics". Write real, contextual football stats copy (e.g., "K-Means Archetype Profiling for Top 5 European Leagues").
- **NO Lorem Ipsum:** All placeholder content must be real, domain-relevant football stats and player profiles.
- **NO Em-Dashes or AI Formatting Quirks:** Avoid excessive em-dashes (—), overused bulleted buzzwords, or robotically structured sales copy.

---

## 📐 COMPONENT & LAYOUT PRINCIPLES

### 1. Spacing & Whitespace
- **Generous Padding:** Prefer more whitespace. When in doubt, increase layout container padding (`p-6` / `p-8`).
- **Subtle Borders:** Use 1px subtle borders (`border-zinc-800` in dark mode) instead of heavy shadows for visual depth.

### 2. Engineering & Web Quality Checklist (65-Gate Gatekeeper)
- **HTML Hierarchy:** Exactly ONE `<h1>` tag per page. Proper `<h2>` and `<h3>` visual and semantic hierarchy.
- **MetaData & SEO:** Every route must define a unique page title, valid `<meta name="description">`, `og:image`, `<meta name="viewport">`, and `<html lang="en">` attribute.
- **Favicon & Assets:** Valid favicon SVG/PNG linked; no missing favicon 404 warnings.
- **Error Handling & 404:** A dedicated, polished 404 Page Component and empty data fallbacks (no white screens of death or unhandled promise exceptions).
- **Accessibility:** All `<img>` tags must have descriptive `alt` text. Interactive elements (`<button>`, `<a>`) must have accessible names and focus rings (`focus-visible:ring-2`).
- **Clean Console:** ZERO console errors or unhandled runtime warnings in browser dev tools.

---

## 🎨 TACTICAL FOOTBALL PITCH PALETTE

| Element | Dark Mode Token | Tailwind Equivalent |
| :--- | :--- | :--- |
| **Background (Main)** | `#0b0f17` (Deep Pitch Slate) | `bg-[#0b0f17]` |
| **Surface / Card** | `#111827` (Gray-900 / Zinc-900) | `bg-zinc-900/80` |
| **Primary Accent** | `#10b981` (Pitch Emerald) | `text-emerald-500` / `bg-emerald-500` |
| **Secondary Accent** | `#3b82f6` (Tactical Blue) | `text-blue-500` |
| **Border** | `#1f2937` (Gray-800) | `border-zinc-800` |
| **Primary Text** | `#f9fafb` (Gray-50) | `text-zinc-50` |
| **Muted Text** | `#9ca3af` (Gray-400) | `text-zinc-400` |

---

## 🛡️ PRE-COMMIT CHECKLIST FOR AI CODERS
Before submitting code, any AI assistant MUST verify:
1. Did I introduce any purple gradients or glowing shadow slop? $\rightarrow$ **NO**
2. Did I leave any `console.log`, missing `alt` attributes, or default titles? $\rightarrow$ **NO**
3. Is all text realistic, football-relevant copy? $\rightarrow$ **YES**
4. Does the UI look like a high-end data platform rather than an AI boilerplate template? $\rightarrow$ **YES**
