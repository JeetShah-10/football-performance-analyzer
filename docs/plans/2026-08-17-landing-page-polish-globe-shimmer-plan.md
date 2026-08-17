# Landing Page Final Polish: Global Tactical Grid, 3D Globe Fix, Shimmer Buttons & Section Streamlining

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a continuous high-contrast tactical grid background, fix 3D Cobe Globe continental rendering, remove the Rigor & Transparency bento grid, and convert all buttons across the landing page to ShimmerButton.

**Architecture:** Continuous CSS/SVG engineering grid on the main container with 60fps performance, official Cobe WebGL map configurations with dynamic canvas resizing, and polymorphic ShimmerButtons with laser perimeter animations.

**Tech Stack:** React 19, Tailwind CSS v4, Cobe WebGL, GSAP ScrollTrigger, Framer Motion, Vite.

---

### Task 1: Enhance ShimmerButton for Universal Page-Wide Use
**Files:**
- Modify: `frontend/src/components/ShimmerButton.jsx`

**Step 1:** Add support for polymorphic navigation / link rendering (`to` prop / `asChild`) and custom laser shimmer colors.

---

### Task 2: Fix 3D Cobe Globe WebGL Rendering & Canvas Sizing
**Files:**
- Modify: `frontend/src/components/Globe.jsx`

**Step 1:** Configure official Cobe dark mode parameters (`dark: 1`, `diffuse: 1.2`, `mapBrightness: 6`, `baseColor: [0.3, 0.3, 0.3]`, `markerColor: [1, 0.3, 0.1]`) and responsive container measurement.

---

### Task 3: Streamline HomeTab & Apply Universal Grid & Shimmer Buttons
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Modify: `frontend/src/components/StickyCard002.jsx`

**Step 1:** Add crisp tactical blueprint grid pattern across all post-orange sections.
**Step 2:** Delete the "RIGOR & TRANSPARENCY" Bento Grid (Section 4).
**Step 3:** Convert all buttons (Orange section CTAs, Card CTAs, Globe section CTAs) to `ShimmerButton`.

---

### Task 4: Verification & Performance Audit
**Step 1:** Run `npm run lint` and `npm run build`.
**Step 2:** Inspect in Playwright MCP across Desktop (1920x1080) and Laptop (1440x780).
