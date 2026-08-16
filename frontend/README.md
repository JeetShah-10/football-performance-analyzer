# Eleven — Frontend Web Application

The interactive client interface for **Eleven — Football Intelligence Platform**, built with React 19, Vite, Tailwind CSS, Framer Motion, and Recharts.

---

## ⚡ Tech Stack & UI Architecture

* **Framework**: React 19 (SPA Architecture with React Router DOM)
* **Build Tooling**: Vite 8 (Hot Module Replacement, optimized chunks)
* **Styling & Theme**: Tailwind CSS with custom Apple Liquid Glassmorphism (`backdrop-blur-2xl`, `backdrop-saturate-[180%]`, specular top-rim bevel highlights)
* **Animation & Physics**: Framer Motion (`useSpring`, layout transitions, magnetic cursor tracking)
* **Data Visualizations**: Recharts (Custom 8D Metric Radar Charts, Dual Player Comparison Polygons)
* **Icons**: Lucide React
* **Linting & Code Hygiene**: Oxlint (0 errors)

---

## 📂 Project Structure

```
frontend/src/
├── assets/                  # Hero background, player cutout, and display fonts
│   ├── BaftivaThin.ttf      # Brand display typeface
│   ├── hero-bg.jpg          # Full-bleed tactical stadium backdrop
│   └── hero-player.webp     # Monumental grounded player cutout
├── components/              # Reusable UI modules & design spells
│   ├── DualRadarCompare.jsx # 2-player overlapping percentile radar
│   ├── HeroSearch.jsx       # Weighted relevance & fuzzy autocomplete engine
│   ├── Navbar.jsx           # Floating Apple liquid glass navigation capsule
│   ├── RadarChart.jsx       # 8D normalized player performance radar
│   ├── SimilarPlayers.jsx   # Cosine nearest-neighbor peer recommendation
│   └── SplashLoader.jsx     # Cinematic startup intro sequence
├── lib/                     # API helpers and constants
│   ├── api.js               # Axios instance with rate-limit and error handling
│   └── constants.js         # Positional colors, radar metrics, and leagues
├── pages/                   # Application views
│   ├── DirectoryTab.jsx     # 1,802-player directory with multi-filter grid
│   ├── GMMTab.jsx           # 7 Gaussian Mixture Model tactical archetypes
│   ├── HomeTab.jsx          # Non-F11 locked landing hero with Design Spells
│   ├── PitchMapTab.jsx      # 2D PCA dimension-reduced scatter map
│   ├── PlayerDetailPage.jsx # Comprehensive 8D player profile with peer comparison
│   ├── ScoutChatTab.jsx     # Natural language AI scout terminal
│   └── U21ScoutingTab.jsx   # Next-gen wonderkid replacement scouting
├── App.jsx                  # Root router with splash gate & toast notifications
└── index.css                # Custom font declarations & glassmorphic utility classes
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
