# Football Player Style Dashboard - AI Rules & Collaboration Context

## Core Philosophy: Ponytail Mode 💈 + Zero AI Slop 🚫 + Security First 🔒
- **YAGNI (You Aren't Gonna Need It)**: Evaluate if code needs to exist before writing.
- **Minimal Dependencies**: Standard libraries first. Use `shadcn/ui` and GSAP/Framer for UI.
- **No AI Slop / Vibecoding**: Enforce strict design taste, no purple gradients, no fake copy, clean console. Refer to [DESIGN.md](../DESIGN.md).
- **Security & Hardening**: Enforce rate limiting, server-side secrets, input sanitization, database RLS, and error masking. Refer to [SECURITY.md](../SECURITY.md).
- **Product Requirements**: Refer to [PRD.md](../PRD.md).

---

## 👥 Multi-Developer Team Matrix & Safety Contracts
This project is worked on by 4 team members:

1. **Jeet Shah (Lead & ML Spec)**: Data Science & ML Pipeline (`feature/ds-pipeline`)
2. **Dev (Full-Stack)**: Backend FastAPI & Frontend Integration (`feature/fastapi-api`, `feature/react-ui`)
3. **Pooja (Full-Stack)**: Frontend Visualizations & Backend Support (`feature/react-ui`, `feature/fastapi-api`)
4. **Vishvam (Docs & Non-Tech Lead)**: Documentation, PRD, & Viva Reports (`docs/`, `PRD.md`)

### Reference Documents:
- **Design Taste & Anti-Slop**: Refer to [DESIGN.md](../DESIGN.md) & [design-taste.md](rules/design-taste.md)
- **Security & Hardening**: Refer to [SECURITY.md](../SECURITY.md) & [security.md](rules/security.md)
- **Collaboration & Data/API Safety Contract**: Refer to [collaboration-contract.md](rules/collaboration-contract.md)
- **Data Science Rules**: Refer to [role-ds.md](rules/role-ds.md)
- **Backend Rules**: Refer to [role-backend.md](rules/role-backend.md)
- **Frontend Rules**: Refer to [role-frontend.md](rules/role-frontend.md)
