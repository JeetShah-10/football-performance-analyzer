# Eleven Hero Redesign — Pixel-Accurate Reference Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Recreate the exact visual soul, scale, depth, and atmospheric lighting of the reference mockup:
1. **Wide Floating Rounded-2xl Capsule Navbar**: `max-w-6xl rounded-2xl bg-[#080C10]/80 backdrop-blur-xl border border-white/10 px-8 py-3.5 shadow-2xl` with bold italic "11" and wide-tracked uppercase routes.
2. **Atmospheric Tactical HUD Background**: Deep navy-black canvas with technical grid, orange telemetry crosshairs, radar arcs, data nodes, and rich bottom orange ambient fog (`rgba(255, 78, 50, 0.38)`).
3. **Large Scaled Hero Player Cutout (`hero-players.webp`)**: Towering across the right 58% directly below the navbar, cinematic moody color grading, and bottom gradient mask fade into the orange baseline.
4. **Massive Outlined Orange "11" Wireframe**: Standing tall behind Yamal and Haaland.
5. **Left Branding**: `— FOOTBALL INTELLIGENCE PLATFORM` tag, **ELEVEN** in Baftiva with expanded tracking and orange dot accent, uppercase subtitle, and sleek search capsule with team-differentiated autocomplete.

---

### Task 1: Rebuild `Navbar.jsx` to Wide Floating 2XL Capsule

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Layout: `max-w-6xl mx-auto top-5 fixed inset-x-0 z-50 rounded-2xl bg-[#080C10]/80 backdrop-blur-xl border border-white/10 px-8 py-3.5 shadow-2xl flex items-center justify-between`
- Left: Italic bold "11" logo
- Center/Right: Clean wide-tracked uppercase links (`EXPLORER`, `PITCH MAP`, `GMM MATRIX`, `U21 SCOUTING`, `SCOUT AI`)

---

### Task 2: Build Atmospheric Tactical HUD Background in `HeroBackground.jsx`

**Files:**
- Modify: `frontend/src/components/HeroBackground.jsx`
- Detailed SVG tactical radar & HUD layers:
  - Base deep charcoal/navy gradient (`#05080C` to `#000305`)
  - Vector crosshairs (`+`), coordinate numbers, range rings, telemetry markers
  - Rich bottom orange atmospheric fog glow (`radial-gradient(ellipse 90% 45% at 50% 100%, rgba(255, 78, 50, 0.38) 0%, rgba(255, 78, 50, 0.1) 45%, transparent 75%)`)

---

### Task 3: Rebuild `HomeTab.jsx` with Large Hero Scale & Bottom Mask Blurring

**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Right Column:
  - Scaled large (occupying right 58% of viewport) starting right under the navbar
  - Massive orange outlined "11" wireframe
  - `hero-players.webp` with moody color grading (`brightness(0.92) contrast(1.08) saturate(0.9)`) and bottom gradient mask (`mask-image: linear-gradient(to bottom, black 55%, transparent 95%)`)
  - GSAP cursor tracking parallax
- Left Column:
  - `— FOOTBALL INTELLIGENCE PLATFORM`
  - Headline **ELEVEN** in Baftiva with orange dot accent
  - Two-line uppercase subtitle with wide tracking
  - Embedded `HeroSearch`

---

### Task 4: Verification & Responsive Testing

- Run `npm run lint` — ensure 0 errors.
- Run `npm run build` — ensure 0 errors.
- Playwright visual testing & screenshots at Desktop (1440px), Tablet (768px), and Mobile (375px).

---

## Definition of Done:
- [ ] Navbar is a wide rounded-2xl capsule with exact padding and typography.
- [ ] Background has rich tactical HUD telemetry, crosshairs, radar arcs, and warm bottom orange fog.
- [ ] Player trio is scaled large, positioned behind/beside headline, moody-graded, and blurred/faded at the bottom.
- [ ] Headline "Eleven" uses Baftiva font with orange dot accent.
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
