# Repository Cleanup & Professional Packaging Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Execute this plan in single-flow mode.

**Goal:** Clean up the repository structure, untrack `.agents/` while preserving it locally in `.gitignore`, remove redundant root files, and provide a comprehensive local installation and user guide in `docs/SETUP_GUIDE.md`.

**Architecture:** Update `.gitignore`, untrack `.agents/` via `git rm --cached`, relocate `APP_FLOW.md` to `docs/archive/`, remove duplicate `PRODUCT.md`, rewrite `CONTRIBUTING.md` to standard open-source conventions, and create a complete `docs/SETUP_GUIDE.md` with cross-links in `README.md`.

**Tech Stack:** Git, Markdown, Python Pytest, Vite.

---

### Task 1: Update `.gitignore` and Untrack `.agents/`

**Files:**
- Modify: `.gitignore`
- Untrack: `.agents/`

**Step 1: Update `.gitignore`**
Add `.agents/` under IDEs & System.

**Step 2: Remove `.agents/` from git cache**
Command: `git rm -r --cached .agents`

---

### Task 2: Root Clutter Cleanup & Archive

**Files:**
- Delete: `PRODUCT.md`
- Move: `APP_FLOW.md` -> `docs/archive/APP_FLOW.md`
- Modify: `CONTRIBUTING.md` (remove internal IDE agent references)

---

### Task 3: Author Comprehensive Installation & User Guide

**Files:**
- Create: `docs/SETUP_GUIDE.md`
- Modify: `README.md` (add links to `docs/SETUP_GUIDE.md`)

---

### Task 4: Verification & Quality Assurance

**Steps:**
1. Run `python -m pytest backend/tests/`
2. Run `npm run build` in `frontend/`
3. Run `git status` to verify `.agents/` is untracked and working tree is clean.
