# Contributing & Team Collaboration Guide

Welcome to the **Football Player Style Dashboard** project repository! This project is split into clean team domains to ensure smooth parallel development and clean viva evaluation.

---

## 👥 Team Member Roles & Matrix

| Team Member | Domain & Ownership | Feature Branch | Core Deliverable |
| :--- | :--- | :--- | :--- |
| **Jeet Shah** | Data Science & ML Lead + Cross-Stack Architect | `feature/ds-pipeline` | Data cleaning, per-90 metrics, K-Means, PCA, similarity engine, `.pkl` exports. |
| **Dev** | Full-Stack Developer (Backend + Frontend) | `feature/fastapi-api` / `feature/react-ui` | FastAPI endpoints, Pydantic models, React dashboard components. |
| **Pooja** | Full-Stack Developer (Frontend + Backend) | `feature/react-ui` / `feature/fastapi-api` | React Radar charts, player comparison view, UI polish, API error handling. |
| **Vishvam** | Documentation & Non-Tech Lead | `main` / `docs` | PRD maintenance, viva documentation, report generation, system diagrams. |

---

## 🌿 Git Branching Workflow

1. **Never commit directly to `main`** during feature development.
2. Checkout your assigned feature branch:
   - Data Science (Jeet): `git checkout feature/ds-pipeline`
   - Backend (Dev & Pooja): `git checkout feature/fastapi-api`
   - Frontend (Pooja & Dev): `git checkout feature/react-ui`
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
