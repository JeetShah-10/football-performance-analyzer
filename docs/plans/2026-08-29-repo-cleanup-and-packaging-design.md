# Repository Cleanup & Professional Packaging Design

## Overview
This design outlines the complete cleanup, professional restructuring, and packaging of the **Eleven AI Football Player Intelligence Platform** repository. The goal is to make the codebase clean, professional, and ready for public GitHub presentation and academic viva evaluation, while keeping internal agent instructions preserved locally via `.gitignore`.

---

## 1. Scope of Changes

### A. Git Index & Root Directory Cleanup
1. **`.gitignore`**: Add `.agents/` to `.gitignore`.
2. **Untrack `.agents/` from Git**: Run `git rm -r --cached .agents` to remove `.agents/` from the repository index while preserving all files locally on the author's disk for ongoing and future Antigravity sessions.
3. **Remove Redundant Root Files**:
   - Delete `PRODUCT.md` (duplicate of `PRD.md` and `DESIGN.md`).
   - Move `APP_FLOW.md` into `docs/archive/APP_FLOW.md`.
4. **Clean up `CONTRIBUTING.md`**: Replace internal AI agent instructions with standard developer contributing standards (Code Quality, PR Workflow, Pytest & Build Verification).

### B. Setup & Installation Packaging
1. **Create `docs/SETUP_GUIDE.md`**:
   - Prerequisites (Python 3.10+, Node.js 18+, Git, npm).
   - 1-Click Startup scripts (`start_app.bat`, `start_app.ps1`, `stop_app.bat`).
   - Manual setup walkthrough for backend and frontend.
   - Test execution commands (`pytest backend/tests/`, `npm run build`).
   - Troubleshooting FAQ for common ports/environment issues.
2. **Update `README.md`**:
   - Link prominently to `docs/SETUP_GUIDE.md` in the Quickstart section.

---

## 2. Impact & Risk Assessment
- **Code Imports**: Verified 0 imports across `frontend/src/` and `backend/` touch `.agents/`, `PRODUCT.md`, or `APP_FLOW.md`.
- **Runtime Stability**: All 52 automated tests and Vite frontend build pass with zero errors.
- **Local AI Preservation**: `.agents/` remains on local disk, ensuring Antigravity IDE continues to load custom rules seamlessly.

---

## 3. Verification Plan
- `git status` verifies `.agents/` is untracked and working tree is clean.
- `python -m pytest backend/tests/` passes 52/52 tests.
- `npm run build` in `frontend/` succeeds.
