# Football Player Style Dashboard - AI Rules & Collaboration Context

## Core Philosophy: Ponytail Mode 💈 + Zero AI Slop 🚫 + Security First 🔒
- **YAGNI (You Aren't Gonna Need It)**: Evaluate if code needs to exist before writing.
- **Minimal Dependencies**: Standard libraries first. Use `shadcn/ui` and GSAP/Framer for UI.
- **No AI Slop / Vibecoding**: Enforce strict design taste, no purple gradients, no fake copy, clean console. Refer to [DESIGN.md](../DESIGN.md).
- **Security & Hardening**: Enforce rate limiting, server-side secrets, input sanitization, database RLS, and error masking. Refer to [SECURITY.md](../SECURITY.md).
- **Product Requirements**: Refer to [PRD.md](../PRD.md).

---

## 👥 Team Matrix & Roles
This project was developed with the following work distribution:

1. **Jeet Shah (Project Lead, ML, Security, Full Frontend & Docs)**: Data Science & ML Pipeline, Full React 19 Frontend Architecture & Visuals, OWASP Security Hardening & Invariant Tests, Core Documentation & ADRs.
2. **Dev (Backend & Security Contributor)**: FastAPI REST API, Routing Architecture & Endpoints, CORS & Rate Limiting.
3. **Pooja (Frontend Contributor)**: Baseline Frontend Scaffolding & Base UI Layout Setup.
4. **Vishvam (Asset Acquisition & Data Support)**: Player Headshot & Face Image Acquisition and Cataloging.

### Reference Documents:
- **Design Taste & Anti-Slop**: Refer to [DESIGN.md](../DESIGN.md) & [design-taste.md](rules/design-taste.md)
- **Security & Hardening**: Refer to [SECURITY.md](../SECURITY.md) & [security.md](rules/security.md)
- **Collaboration & Data/API Safety Contract**: Refer to [collaboration-contract.md](rules/collaboration-contract.md)
- **Data Science Rules**: Refer to [role-ds.md](rules/role-ds.md)
- **Backend Rules**: Refer to [role-backend.md](rules/role-backend.md)
- **Frontend Rules**: Refer to [role-frontend.md](rules/role-frontend.md)
