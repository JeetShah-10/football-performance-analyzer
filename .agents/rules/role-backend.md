# Backend & Security Contributor Rules (Dev)

## Scope
- Focus Area: `backend/main.py`, `backend/routers/`, `backend/schemas/`
- Branch: `feature/fastapi-api`

## Guidelines for Antigravity AI
- **Pydantic Validation**: Use strict Pydantic schemas for all request/response bodies.
- **FastAPI Standards**: Use explicit HTTP status codes (200, 404 for bad player ID).
- **No Heavy On-Demand Computations**: Serve pre-computed dataset and pre-fitted nearest-neighbors model loaded from `model.pkl`.
- **CORS**: Ensure CORS middleware is enabled to allow `localhost:5173` (React Vite) calls without browser security blocks.
