# PHASE 5 IMPLEMENTATION PLAN: HIGH-END FASTAPI BACKEND ARCHITECTURE
**Project**: Football Player Style Dashboard  
**Lead Developers**: Dev & Pooja (Full-Stack)  
**Architect**: Jeet Shah  
**Date**: 2026-08-07

---

## 1. Executive Summary & Design Philosophy

Phase 5 implements a high-end, production-ready, yet student-friendly FastAPI backend. It follows clean software design patterns (Service-Repository pattern, Pydantic V2 schemas, LRU caching, GZip compression, and slowapi rate limiting) while maintaining zero over-engineering.

---

## 2. Directory Layout & Architecture

```
backend/
├── main.py                    # FastAPI entrypoint, middleware, CORS, error handlers
├── schemas/
│   └── player_schemas.py      # Pydantic V2 response models with exact percentiles & types
├── services/
│   └── analytics_service.py   # Cached data loader, player lookups & similarity engine
├── routers/
│   ├── players.py             # GET /players and GET /players/{id}
│   ├── clusters.py            # GET /clusters
│   └── similarity.py         # GET /similar/{id}
└── tests/
    └── test_api.py            # Pytest suite for backend endpoints
```

---

## 3. High-End Technical Standards

1. **Sub-5ms Query Latency**: Data and `model.pkl` are loaded into RAM on startup. Player lookups use dictionary O(1) hash maps and cached pandas indexing.
2. **GZip Compression**: Payload responses over 1 KB are automatically compressed with GZip to ensure high-speed frontend rendering.
3. **Security & Rate Limiting (`SECURITY.md`)**: Configured with `slowapi` (60 requests/min). Stack traces on 500 errors are masked to prevent security leaks.
4. **Pydantic V2 Contracts**: Every stat field returns both raw `value` and position-group `percentile` (e.g. `{"npxG_per90": {"value": 0.312, "percentile": 64.5}}`).

---

## 4. Endpoints Specification

### `GET /health`
- **Response**: `{"status": "online", "dataset": "FBref 2024-2025", "total_players": 1802}`

### `GET /api/players`
- **Query Params**: `position_group` (Defender|Midfielder|Forward), `league`, `search`, `limit` (default 100)
- **Response**: List of `PlayerSummary`

### `GET /api/players/{player_id}`
- **Response**: Full `PlayerDetail` with per-90 stats and percentiles

### `GET /api/clusters`
- **Response**: List of `ClusterSummary` with signature stats and descriptions

### `GET /api/similar/{player_id}?n=5`
- **Query Params**: `n` (default 5, max 20)
- **Response**: Top $N$ similar players (self-match excluded)

---

## 5. Verification & Test Plan

- Run `pytest backend/tests/` to verify all routes.
- Verify sub-10ms response times.
- Verify zero stack trace exposure on bad inputs.
