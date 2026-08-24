# ADR-004: Native Mathematical SVG Visualizations over Heavy Charting Libraries

## Status
Accepted

## Date
2026-08-25

## Context
The platform requires bespoke interactive visualizations:
1. 8-Axis Multi-Polygon Radar Spiderwebs (`RadarChart.jsx`, `TacticalRadar.jsx`)
2. Continuous Gaussian Normal Density Bell Curves with interactive $\mu$ / $\pm \sigma$ markers (`GMMArchetypeCanvas.jsx`)
3. Interactive 1,802-Node Scatter Pitch Map with hover HUDs (`PitchMapTab.jsx`)

Third-party chart libraries (Recharts, Chart.js) impose rigid coordinate systems, lack fine-grained SVG path control, and add 400KB–600KB to the frontend bundle.

## Decision
Construct all radar charts, Gaussian distributions, and pitch plots using pure mathematical SVG rendering and declarative React components with Framer Motion transitions.

## Alternatives Considered

### Recharts / D3 Component Wrappers
- **Pros**: Declarative pre-packaged components.
- **Cons**: Bundle weight (450KB+), difficult to style with obsidian translucent glass tokens, limited support for dual Gaussian curve shaded fills with dynamic $z$-score crosshairs.
- **Rejected**: Pruned from `package.json` to keep bundle lightweight and UI pixel-perfect.

### HTML5 Canvas (2D Context)
- **Pros**: Fast for millions of raw points.
- **Cons**: Loses DOM accessibility, difficult to attach crisp Tailwind tooltips, blurriness on high-DPI (Retina) screens without manual pixel ratio scaling.
- **Rejected**: Pure SVG offers vector sharpness and seamless CSS styling for 1,802 nodes.

## Consequences
- Total frontend production build size reduced by $>450\text{KB}$.
- Smooth 60fps animations with zero layout thrashing or chart wrapper reflows.
- Total styling freedom matching the Obsidian Glass design system (`#38B6FF`, `#FFB800`, `#FF3C00`).
