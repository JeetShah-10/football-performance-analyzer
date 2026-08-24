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

## 🤖 Antigravity AI IDE Instructions for Team Members

Antigravity IDE automatically enforces rules across `.agents/`:
- **PRD Specification**: [PRD.md](PRD.md)
- **AI Rules File**: [.agents/AGENTS.md](file:///.agents/AGENTS.md)
- **Design Taste**: [DESIGN.md](DESIGN.md)
- **Security & Hardening**: [SECURITY.md](SECURITY.md)
- **Collaboration Contracts**: [.agents/rules/collaboration-contract.md](file:///.agents/rules/collaboration-contract.md)
