# Frontend Rules (React/Vite)

## UI / UX Philosophy
- **Premium UI First**: The UI should wow users. Utilize Framer Motion or GSAP for smooth micro-animations.
- **Components**: Use `shadcn/ui` as the baseline to avoid writing basic components from scratch while maintaining premium styling (Tailwind CSS).
- **Styling**: Use glassmorphism, responsive grids, and high-contrast readable charts.
- **Empty & Loading States**: Do not skip loading skeletons and error boundaries. They are essential for a premium feel.

## Tech Constraints (Ponytail Mode)
- Avoid global state managers (Redux, Zustand) if React Context or basic Hooks can suffice.
- Use React Query for API fetching and caching to avoid manual `useEffect` bugs.
- Do NOT use mock data once Phase 6 begins; all data must flow from the FastAPI backend.
