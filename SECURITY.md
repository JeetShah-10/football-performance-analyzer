# SECURITY & HARDENING SPECIFICATION (SECURITY.md)

This document establishes strict API security, database security, input validation, authentication, and error-handling standards for all human and AI contributors.

---

## 🔒 MANDATORY SECURITY DIRECTIVES

### 1. API Rate Limiting & Protection
- **Always-On Rate Limiting:** All public and protected API endpoints MUST be guarded by rate limiting middleware (e.g. `slowapi` or redis-backed rate limiters in FastAPI).
- **Abuse & Attack Logging:** Log suspicious requests (e.g., high rate threshold spikes, malformed payloads, injection attempts) to security logs for monitoring.

### 2. Secret & Credential Management
- **Server-Side Only Secrets:** All API keys, database connection strings, JWT secrets, and private credentials MUST reside strictly on the server environment (`.env`).
- **Zero Secrets in Frontend:** Never leak server-side keys or private secrets in frontend bundles, React components, or Vite public env vars (`VITE_`).

### 3. Input Validation & Sanitization
- **Strict Pydantic Validation:** Every incoming query parameter, path parameter, and request body MUST be validated against strict Pydantic models.
- **Input Sanitization:** Sanitize text inputs against SQL injection, XSS, and command injection attacks. Reject unexpected parameters.

### 4. Database Security & Row Level Security (RLS)
- **No Public Tables by Default:** All database tables must have zero public access by default.
- **Row Level Security (RLS):** Enable RLS on every table (Postgres / Supabase) with explicit access policies for authorized users only.

### 5. Authentication & Protected Routes
- **Protected Endpoint Guards:** All non-public endpoints MUST require valid authentication tokens (JWT / Bearer auth).
- **Route Authorization:** Verify user identity and permissions before returning or mutating data.

### 6. Production Error Sanitization
- **No Leaked Stack Traces:** Internal stack traces, raw database error codes, and server file paths must NEVER be exposed to end users in production responses.
- **Generic User Error Responses:** Return safe, sanitized error models (e.g., `{"detail": "Invalid request"}` or `{"detail": "Resource not found"}`). Internal details must stay in server logs.

---

## 🛡️ OWASP API SECURITY CHECKLIST FOR AI CODERS

- [x] Are API keys and secrets stored ONLY in server-side environment variables?
- [x] Is rate limiting configured on FastAPI endpoints?
- [x] Are request parameters validated by Pydantic models?
- [x] Is RLS enabled on all database tables?
- [x] Are stack traces suppressed in production HTTP response payloads?
- [x] Are security logs capturing anomalous requests?
