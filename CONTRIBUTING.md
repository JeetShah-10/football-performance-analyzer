# Contributing & Team Collaboration Guide

Welcome to the **Football Player Style Dashboard** project repository! This project is split into 3 core domains to ensure clean ownership, clear viva evaluation, and parallel development without code collisions.

---

## 👥 Team Roles & Ownership

| Role | Domain / Scope | Feature Branch | Core Deliverable |
| :--- | :--- | :--- | :--- |
| **Member 1: Data Science Lead** | Data Cleaning, Per-90 Engineering, KMeans, PCA, `.pkl` Artifact Export | `feature/ds-pipeline` | `notebooks/`, `backend/clustering/`, Model artifacts |
| **Member 2: Backend Lead** | FastAPI Server, Pydantic Schemas, API Endpoints, Model Serving | `feature/fastapi-api` | `backend/main.py`, OpenAPI contract, pytest suite |
| **Member 3: Frontend Lead** | React (Vite), Dashboard Layout, Scatter Plot, Radar Charts, GSAP/shadcn UI | `feature/react-ui` | `frontend/src/`, UI Components, Pages |

---

## 🌿 Git Branching Workflow

1. **Never commit directly to `main`** during feature development.
2. Checkout your assigned branch:
   - DS Lead: `git checkout feature/ds-pipeline`
   - Backend Lead: `git checkout feature/fastapi-api`
   - Frontend Lead: `git checkout feature/react-ui`
3. Pull updates from `main` regularly:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
4. Create a Pull Request (PR) to merge into `main` once a Phase Definition of Done (DoD) is met.

---

## 🤖 Antigravity AI IDE Instructions for Team Members

When any team member opens this repository in **Antigravity IDE**, the IDE automatically reads the context rules in `.agents/`:
- **Rules File**: [.agents/AGENTS.md](file:///.agents/AGENTS.md)
- **Collaboration Contracts**: [.agents/rules/collaboration-contract.md](file:///.agents/rules/collaboration-contract.md)
- **Role Rules**:
  - DS Lead: [.agents/rules/role-ds.md](file:///.agents/rules/role-ds.md)
  - Backend Lead: [.agents/rules/role-backend.md](file:///.agents/rules/role-backend.md)
  - Frontend Lead: [.agents/rules/role-frontend.md](file:///.agents/rules/role-frontend.md)

> [!IMPORTANT]
> Antigravity AI agents will enforce boundaries so that changes made by one team member do NOT break the contracts relied upon by another team member.
