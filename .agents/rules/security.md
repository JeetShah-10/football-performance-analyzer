# Security & Hardening Rules for Antigravity AI

Refer to [SECURITY.md](../../SECURITY.md) in the project root for full details.

## Mandates for AI Coders:
1. **Rate Limiting:** Enforce rate limiting on FastAPI routes (`slowapi` middleware).
2. **Secrets:** Server-side `.env` only. Zero keys in frontend code.
3. **Input Validation:** Mandatory Pydantic models and sanitization for all inputs.
4. **Database RLS:** Enable Row Level Security on every table; default private.
5. **Auth:** Protected routes require JWT/Bearer token verification.
6. **Error Sanitization:** Never return stack traces or raw DB errors in production JSON.
7. **Logging:** Log security violations and rate limit breaches.
