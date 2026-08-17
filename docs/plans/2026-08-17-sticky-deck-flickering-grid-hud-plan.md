# Sticky Cards Background & Section Enhancement — Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the 5 Superpowers Sticky Cards section on `HomeTab.jsx` with a GPU-accelerated **`FlickeringGrid`** background (with radial spotlight mask), a **Floating Vertical Tactical Deck HUD** tracking active cards on scroll, and **Dynamic Ambient Color Morphing** that reflects each card's tactical signature color.

**Architecture:**
- **Component 1**: `FlickeringGrid.jsx` — Pure HTML5 canvas GPU-accelerated flickering grid (Float32Array) with responsive resize observer and intersection observer.
- **Component 2**: `StickyCard002.jsx` — Upgraded with the Floating Vertical HUD, dynamic active card tracking callback, and animated ambient aura morphing.
- **Component 3**: `HomeTab.jsx` — Wraps the section with the radial masked `FlickeringGrid` and synchronizes the deck.

**Tech Stack:**
- React 19, Tailwind CSS v4, HTML5 Canvas API, GSAP 3 + ScrollTrigger, Framer Motion, Lucide React.

---

### Task 1: Create `FlickeringGrid.jsx` Component
**Files:**
- Create: `frontend/src/components/FlickeringGrid.jsx`
- Pure Canvas GPU implementation with `Float32Array`, customizable `squareSize={4}`, `gridGap={6}`, `flickerChance={0.25}`, and `maxOpacity={0.25}`.

---

### Task 2: Enhance `StickyCard002.jsx` with Floating Vertical Tactical HUD & Color Morphing
**Files:**
- Modify: `frontend/src/components/StickyCard002.jsx`
- Track active card index in state (`activeCardIndex`).
- Add Floating Vertical Deck HUD on the right side (`hidden lg:flex flex-col gap-3 fixed/absolute right-8 top-1/2 -translate-y-1/2 z-30`):
  - 5 interactive pips showing module numbers (`01`, `02`, `03`, `04`, `05`) and short names.
  - Active pip illuminates with the card's accent color and pulse ring.
- Add Dynamic Ambient Spotlight Glow behind the active card that smoothly transitions between colors (`#3AA6D9`, `#E8B33D`, `#FF4E32`, `#E8437A`, `#10B981`).

---

### Task 3: Embed `FlickeringGrid` and Masking in `HomeTab.jsx`
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Place `FlickeringGrid` behind the `StickyCard002` section with `[mask-image:radial-gradient(850px_circle_at_center,white,transparent_80%)]`.

---

### Task 4: Multi-Viewport Verification & Oxlint Checks
- Run `npm run lint` in `frontend/` (0 errors).
- Run `npm run build` in `frontend/` (0 errors).
- Test Playwright in 1920x1080 (Desktop), 1440x780 (Laptop), and 768x1024 (Tablet) to verify smooth 60fps rendering without CPU lag.

---

## Definition of Done:
- [ ] `FlickeringGrid.jsx` created and rendering smoothly on canvas.
- [ ] Floating Vertical Tactical HUD tracks active cards in real-time.
- [ ] Ambient background spotlight shifts color per active card.
- [ ] Radial gradient mask contains grid focus behind the deck.
- [ ] `npm run build` succeeds with 0 errors.
