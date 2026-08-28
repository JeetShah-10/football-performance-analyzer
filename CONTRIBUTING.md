# Contributing & Team Collaboration Guide

Welcome to the **Football Player Style Dashboard** project repository! This project is split into clean team domains to ensure smooth parallel development and clean viva evaluation.

---

## 👥 Team Member Roles & Work Distribution

| Team Member | Domain & Ownership | Feature Branch | Core Deliverable |
| :--- | :--- | :--- | :--- |
| **Jeet Shah** | Project Lead, ML, Security, Full Frontend & Docs | `feature/ds-pipeline` | Data Science & ML pipeline, full React 19 frontend architecture, OWASP security hardening, 52-test test suite, and ADRs. |
| **Dev** | Backend & Security Contributor | `feature/fastapi-api` | FastAPI REST API, routing architecture, Pydantic schemas, CORS, and rate limiting. |
| **Pooja** | Frontend Contributor | `feature/react-ui` | Baseline frontend scaffolding, initial UI layout setup, and base component styling. |
| **Vishvam** | Asset Acquisition & Data Support | `main` / `docs` | Player face photo retrieval, headshot image extraction, and dataset asset management. |

---

## 🌿 Git Branching Workflow

1. **Never commit directly to `main`** during feature development.
2. Checkout your assigned feature branch:
   - Data Science (Jeet): `git checkout feature/ds-pipeline`
   - Backend (Dev): `git checkout feature/fastapi-api`
   - Frontend (Pooja): `git checkout feature/react-ui`
3. Pull updates from `main` regularly:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
4. Create a Pull Request (PR) to merge into `main` once a Phase Definition of Done (DoD) is met.

---

## 🛠️ Development Standards & Verification

Before submitting a Pull Request, ensure all local verification checks pass:

1. **Backend Tests**:
   ```bash
   python -m pytest backend/tests/ -v
   ```
   *All 52 tests covering security headers, mathematical invariants, and endpoints must pass.*

2. **Frontend Build & Lint**:
   ```bash
   cd frontend
   npm run build
   ```
   *Production build must complete with zero errors or bundle warnings.*

3. **Code Style**:
   - Adhere to the design system tokens in [`DESIGN.md`](DESIGN.md).
   - Follow OWASP API security hardening guidelines in [`SECURITY.md`](SECURITY.md).
   - Review architectural decisions in [`docs/decisions/`](docs/decisions/).

