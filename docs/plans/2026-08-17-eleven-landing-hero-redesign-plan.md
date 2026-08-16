# Eleven Landing Page & Hero Section Implementation Plan (Refined)

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build the Eleven landing page matching the reference visual target:
1. **Floating Glass Pill Navbar**: Clean pill containing "11." logo + 5 nav links (`EXPLORER`, `PITCH MAP`, `GMM MATRIX`, `U21 SCOUTING`, `SCOUT AI`), without any extra trailing badges.
2. **Typography Engine**: Google Fonts `Plus Jakarta Sans` (Heavy Italic 800/900) + `Space Grotesk` + `Inter` + `JetBrains Mono`.
3. **Left Hero Section**: `— FOOTBALL INTELLIGENCE PLATFORM` tag, massive italic display wordmark **Eleven**, tactical subtitle, and ⌘K player search bar with live team-based result grouping.
4. **Right Hero Section**: Pure SVG dark navy gradient & tactical grid background + large orange outlined "11" wireframe + `hero-players.webp` trio with GSAP cursor parallax depth.
5. **No Static Scroll Indicator**: Clean bottom section leading directly into the feature sections.

**Tech Stack:** React 19, Tailwind CSS v4, GSAP (`gsap`), Framer Motion (`framer-motion`), Lucide Icons (`lucide-react`).

---

### Task 1: Typography Setup & GSAP Installation

**Files:**
- Modify: `frontend/index.html` (Add `Plus Jakarta Sans` & `Syne` fonts)
- Modify: `frontend/package.json` (Install `gsap`)

---

### Task 2: Floating Glass Pill Navbar (`Navbar.jsx`)

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Floating container (`max-w-4xl mx-auto top-5 fixed inset-x-0 z-50 rounded-full bg-[#03151F]/80 backdrop-blur-md border border-[#0A222E] px-6 py-2.5 shadow-2xl`).
- Left: "11." logo.
- Center: 5 navigation links (`EXPLORER`, `PITCH MAP`, `GMM MATRIX`, `U21 SCOUTING`, `SCOUT AI`) with active indicator.

---

### Task 3: Autocomplete Player Search with Team Grouping (`HeroSearch.jsx`)

**Files:**
- Create: `frontend/src/components/HeroSearch.jsx`
- Real-time search across 1,802 players fetched from `/api/players`.
- Live dropdown grouped by Team (Real Madrid, Manchester City, Barcelona, Arsenal, Bayern Munich, etc.) with position badges and primary style cluster tag.
- Full keyboard navigation (Arrow Up/Down, Enter, Escape).

---

### Task 4: Hero Section & Layered SVG Background (`HeroBackground.jsx` + `HomeTab.jsx`)

**Files:**
- Modify: `frontend/src/components/HeroBackground.jsx`
  - High-performance pure SVG gradient & tactical grid background with deep navy tones (`#000C12` to `#03151F`) and subtle bottom orange ambient lighting.
- Modify: `frontend/src/pages/HomeTab.jsx`
  - 2-Column Hero layout.
  - Left: Heavy italic `Plus Jakarta Sans` "Eleven" title + tactical subtitle + `HeroSearch`.
  - Right: Large orange outlined "11" wireframe + `hero-players.webp` cutout with GSAP cursor tracking parallax.

---

### Task 5: Build & Verification

- Run `npm run lint` (`oxlint`) — ensure 0 errors.
- Run `npm run build` — ensure 0 errors.
- Playwright visual testing at 1440px, 768px, and 375px.

---

## Definition of Done:
- [ ] Floating glass navbar with 5 core tabs (no 1802 badge).
- [ ] No static scroll indicator.
- [ ] Heavy italic "Eleven" typography in `Plus Jakarta Sans`.
- [ ] `hero-players.webp` active with GSAP cursor parallax.
- [ ] Pure SVG gradient & tactical background.
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
