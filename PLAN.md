# Implementation Plan — Eleven Landing Page Hero Background Redesign

## Objective
Build the hero section background for the Eleven landing page redesign, applying the new dark-navy/orange-red palette, without touching any backend/data logic or out-of-scope frontend components.

---

## 1. File Modification Scope

### New Files to Create:
- `frontend/src/components/HeroBackground.jsx`: Layered hero background component featuring a full-bleed dark-navy radial gradient falloff, an abstract geometric accent motif, a restrained box-shadow pop (`0 0 24px rgba(255,60,0,0.35)`), and an explicit insertion point placeholder for a future 3D canvas layer.

### Existing Files to Modify:
- `frontend/src/index.css`: Register new design tokens as CSS custom properties under `:root` and `@layer base` without removing old tokens required by other untouched components.
- `frontend/src/pages/HomeTab.jsx`: Integrate `HeroBackground.jsx` into the hero container, removing the previous cyan/emerald gradient blobs and applying the new palette structure.

### Files Specifically Excluded & Protected (Must NOT Touch):
- `backend/` (All files)
- `.agents/` (All files)
- `PRD.md`, `SECURITY.md`, `DESIGN.md`
- `DirectoryTab.jsx`, `ClusterMap2D.jsx`, `PlayerProfileModal.jsx`, `U21ScoutingTab.jsx`, `ScoutAgentChat.jsx`, `api/client.js`

---

## 2. Design Token Registration (New Dark-Navy & Orange-Red Palette)

The following tokens will be registered in `frontend/src/index.css`:

```css
:root {
  --bg-page:        #000C12;
  --bg-card:        #03151F;
  --border:         #0A222E;
  --border-hover:   #102D3A;
  --accent:         #FF3C00;
  --accent-hover:   #FF6A33;
  --accent-pressed: #CC2F00;
  --accent-wash-bg: #2E1207;
  --accent-pop-text: #FF9466;
  --text-primary:    #F5F1EB;
  --text-secondary:  #8FA3AD;
  --text-muted:      #5A7280;
  --pos-defender:    #3AA6D9;
  --pos-midfielder:  #E8B33D;
  --pos-forward:     #E8437A;
}
```

---

## 3. Background Layer Architecture (`HeroBackground.jsx`)

1. **Base Fill Layer**:
   - Background gradient with tonal falloff within one single hue family: radial gradient from `#000C12` (`--bg-page`) to `#0A222E` (`--border`) toward outer corners. No third hue, no purple gradient.
2. **Abstract Geometric Accent Motif**:
   - Subtle geometric structural pitch lines / grid lines (`stroke: #0A222E`, `stroke-width: 1px`).
   - Single focal accent element with flat fill `--accent` (`#FF3C00`) and soft pop glow via `box-shadow: 0 0 24px rgba(255, 60, 0, 0.35)`.
   - Zero clipart, zero emojis, zero stock photos, zero jersey #11 clichés.
3. **Layer Separation & 3D Extensibility**:
   - `position: absolute; inset: 0; pointer-events: none; overflow: hidden;`
   - Explicit placeholder / insertion comment for future 3D canvas layer (without adding Three.js/WebGL dependencies now).

---

## 4. Flagged Follow-Up: Old Palette References Elsewhere in Codebase

The following files contain legacy teal/emerald/indigo tokens (`#10b981`, `#0f6e56`, `#6366f1`, `#06b6d4`). They are preserved untouched for now to prevent breaking other pages, and are flagged for future migration phases:

- `frontend/src/components/ClusterMap2D.jsx` (uses `#10b981` in cluster color map)
- `frontend/src/components/RadarChart.jsx` (uses `#10b981` for radar fill/stroke)
- `frontend/src/components/DualRadarCompare.jsx` (uses `#06b6d4`)
- `frontend/src/components/Navbar.jsx` (custom "11" monogram)
- `frontend/src/lib/constants.js` (uses `#10b981`)
- `frontend/src/pages/Dashboard.jsx` (uses `#6366f1`, `#10b981`)
- `frontend/public/llms.txt` (legacy design documentation reference)

---

## 5. Responsive Verification Plan
- **Mobile (375px)**: Ensure background fits without clipping or awkward gradient banding.
- **Tablet (768px)**: Verify proportional spacing and centering.
- **Desktop (1440px)**: Verify full-bleed backdrop framing the hero text.
- **Automated checks**:
  - `npm run build` in `frontend/` (0 compile errors)
  - `npm run lint` (0 oxlint errors)
  - Playwright visual capture at 375px, 768px, 1440px.
