# Eleven — Frontend Web Application

The interactive client interface for **Eleven — Football Intelligence Platform**, built with React 19, Vite, Tailwind CSS, Framer Motion, GSAP, and Native Mathematical SVG Visualizations.

---

## ⚡ Tech Stack & UI Architecture

* **Framework**: React 19 (SPA Architecture with React Router DOM v7)
* **Build Tooling**: Vite 8 (Hot Module Replacement, optimized vendor chunks)
* **Styling & Theme**: Tailwind CSS with Obsidian Glass design tokens (`#000C12`, `#01080E`, `#03151F`, `#38B6FF`, `#FFB800`, `#FF3C00`)
* **Animation & Physics**: Framer Motion & GSAP ScrollTrigger (Kinetic text curtains, magnetic hover, smooth spring transitions)
* **Data Visualizations**: Native Pure Mathematical SVGs (8D Radar webs, Gaussian normal density curves, 1,802-node PCA scatter pitch map)
* **Icons**: Lucide React & Custom Tactical SVGs
* **Performance**: Code-split routes via React `lazy()` and `Suspense`, bundle build <750ms

---

## 📂 Project Structure

```
frontend/src/
├── assets/                  # Hero background, league logos, and display fonts
├── components/              # Reusable UI modules & design systems
│   ├── GMMArchetypeCanvas.jsx # Interactive Gaussian density bell curve studio
│   ├── MetricCorrelationCanvas.jsx # Pearson/Spearman 8D correlation matrix
│   ├── OrbitingCirclesGlobe.jsx # 3D mathematical particle globe
│   ├── PCAHoverHUD.jsx      # Live hover telemetry card with mini-radar
│   ├── RadarChart.jsx       # Native SVG 8D multi-polygon radar web
│   ├── TacticalRadar.jsx    # Animated single-player radar bento card
│   └── icons/               # High-contrast tactical SVG icons
├── lib/                     # API helpers, math utilities, and constants
│   ├── api.js               # Fetch API client with rate-limit and error handling
│   ├── gmmUtils.js          # Gaussian probability math and color tokens
│   └── metricConfigs.js     # 8 standard metrics and percentile mappings
├── pages/                   # Application views
│   ├── ComparePage.jsx      # Side-by-side tactical face-off with ambient aura
│   ├── DirectoryTab.jsx     # 1,802-player directory with multi-filter grid
│   ├── GMMTab.jsx           # 16-cluster GMM archetype lab with soft probabilities
│   ├── HomeTab.jsx          # Hero arena with 3D globe and scout preview
│   ├── PitchMapTab.jsx      # 2D PCA dimension-reduced tactical pitch map
│   ├── PlayerDetailPage.jsx # Bento grid player profile with peer comparison
│   ├── ScoutChatTab.jsx     # 100dvh zero-scroll AI scout intelligence terminal
│   └── U21ScoutingTab.jsx   # Next-gen wonderkid replacement scouting engine
├── App.jsx                  # Root router with splash gate & route code-splitting
└── index.css                # Obsidian glass variables & custom font declarations
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite development server
npm run dev

# 3. Lint codebase with Oxlint
npm run lint

# 4. Create production build
npm run build
```
