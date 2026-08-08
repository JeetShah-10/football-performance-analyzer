# DESIGN SYSTEM & COMPLETE ANTI-SLOP SPECIFICATION (DESIGN.md)

This document serves as the absolute authority for visual taste, technical SEO, performance, accessibility, and anti-slop rules for all human and AI coders (Antigravity IDE, Cursor, Claude, Windsurf).

---

## 🚫 EXHAUSTIVE ANTI-SLOP & FORBIDDEN PATTERNS CHECKLIST

Every item below is strictly **FORBIDDEN**. Code reviews and AI pre-flight checks must reject any PR containing these flaws:

### 🎨 Visual & Aesthetic Flaws
1. **Purple Gradients:** No cliché AI neon purple/indigo text or background gradients (`from-purple-600 to-indigo-600`).
2. **AI Slop Photos:** No generic Midjourney/AI stock photos of unrealistically hyper-perfect people or futuristic glowing objects.
3. **Pill-Shaped Desktop Buttons:** No generic `rounded-full` buttons for desktop primary actions.
4. **Pure Colors:** No pure `#000000` black or `#FFFFFF` white. Use the Zinc scale (`#0b0f17` slate background, `#f9fafb` text).
5. **Text-Only Unstyled Logos:** No generic plain text rendered with standard system font as the application logo.
6. **Low-Contrast Hero Text Colour:** No illegible or poorly contrasted hero headline colors.
7. **Cursive / Script Fonts:** No decorative cursive fonts or script fallbacks.
8. **Emoji Icons:** No raw emoji characters (⚽, 🚀, 🔥, 💡) used as primary UI icons or buttons.
9. **Jittery Scroll Animations:** No intrusive scroll-jacking or over-animated parallax that slows down navigation.

### 📝 Content & Copy Flaws
10. **Vague Hero Headlines:** No meaningless fluff like "Unlock Your Potential", "Transform Your Game", or "Next-Gen AI Platform".
11. **Fake Metrics & Statistics:** No fabricated stats or unverified numbers.
12. **Fake Visitor Count:** No artificial "🔥 42 people are viewing this right now" widgets.
13. **Fake Customer Count & Reviews:** No fake "Used by 10,000+ players" badges or fake review cards with stock photos.
14. **Excessive Em-Dashes (—):** No robotic AI formatting with excessive em-dashes.
15. **Lorem Ipsum:** Zero generic placeholder text anywhere in the codebase.

### 🌐 SEO, HTML & Web Standards Flaws
16. **Same Page Titles:** No copy-pasting the same `<title>` tag across routes; every page MUST have a distinct, descriptive title.
17. **Multiple H1s or No H1:** Every route must contain EXACTLY ONE `<h1>` tag.
18. **No Meta Description:** Missing `<meta name="description">` tag.
19. **No OpenGraph Image (`og:image`):** Missing social sharing preview images.
20. **No Structured Data:** Missing JSON-LD structured data schemas.
21. **No Canonical Tag:** Missing `<link rel="canonical">` tags on routes.
22. **No `llms.txt`:** Missing `llms.txt` documentation for AI crawlers.
23. **AI-Blocked `robots.txt`:** Incorrectly configured `robots.txt` that blocks search indexing or AI documentation readers.
24. **No Favicon:** Missing SVG/PNG favicon leading to 404 browser logs.
25. **No `sitemap.xml`:** Missing XML sitemap for search crawlers.
26. **No Lang Attribution:** Missing `<html lang="en">` on the root HTML document.
27. **Empty View-Source Shell:** SSR/static shell rendering completely empty body without fallbacks.

### ⚙️ Engineering, Accessibility & Compliance Flaws
28. **No 404 Page:** Missing a dedicated, polished custom 404 Error page component.
29. **Missing Alt Text:** Images missing descriptive `alt` tags (`<img alt="...">`).
30. **Console Errors:** ZERO runtime errors or unhandled warnings in browser developer tools.
31. **Massive JS Bundles:** Unsplit code resulting in massive bundle sizes. Code splitting is required.
32. **Broken Buttons & Handlers:** Dead or unhandled click events (`onClick={() => {}}`).
33. **Lazy One-Page Site:** Packaging a multi-feature system as a single superficial landing page instead of a real routed application.
34. **No Privacy Policy & Terms Links:** Missing required legal footer links (`/privacy`, `/terms`).

---

## 🛠️ REQUIRED TECHNICAL SPECIFICATIONS

| Category | Mandated Standard |
| :--- | :--- |
| **Typography** | Inter / Outfit for body; JetBrains Mono / Monospace for football stats |
| **Primary Theme** | Deep Pitch Slate (`#0b0f17`), Card (`#111827`), Emerald Accent (`#10b981`) |
| **Borders & Depth** | 1px subtle borders (`border-zinc-800`) over heavy fuzzy drop shadows |
| **Icons** | SVG Icon sets (Heroicons / Lucide tuned to matching stroke widths) |
| **Routing & SEO** | React Router / Vite with route-level metadata and dedicated 404 page |

---

## 🤖 HONEST AI & ML TERMINOLOGY SPECIFICATION

To ensure complete academic honesty and accuracy for university evaluation:
1. **AI Scout Agent**: Described as a composite pipeline consisting of a **trained TF-IDF + Logistic Regression Intent Classifier** (88.24% test accuracy), a **rule-based fuzzy entity extractor** (`difflib` against 1,802 database names), and **templated report synthesis**. It must NOT be described as "autonomous generative AI" or an "end-to-end neural network".
2. **Supervised Position Classifier**: Described as a **trained multi-class classification model** (`LogisticRegression` vs `RandomForest`) evaluated on an 80/20 stratified split (81.16% test accuracy), with confusion matrix reports saved in `position_classifier_report.json`.
