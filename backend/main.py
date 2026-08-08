import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from backend.routers import players, clusters, similarity, scout_agent
from backend.schemas.player_schemas import HealthResponse
from backend.services.analytics_service import AnalyticsService

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("football_backend")

# NOTE FOR FRONTEND LEAD (Pooja):
# Bare paths (/players, /players/{id}, /clusters, /similar/{id}) are canonical per docs/api-contract.md.
# Alias paths under /api/* are also mounted for backward compatibility.

from backend.limiter import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Try loading dataset and model artifacts into RAM
    try:
        service = AnalyticsService.get_instance()
        logger.info(f"[STARTUP] Successfully loaded dataset into RAM ({service.get_total_players_count()} players).")
    except Exception as e:
        logger.warning(f"[STARTUP] AnalyticsService initialization deferred or missing dataset: {e}")
    yield
    # Shutdown
    logger.info("[SHUTDOWN] FastAPI backend shutting down.")


app = FastAPI(
    title="Football Player Style API",
    description="REST API for player clustering, percentile stats, and scouting similarity engine",
    version="1.0.0",
    lifespan=lifespan,
)

# Slowapi state and exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# GZip middleware for responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS middleware for React Vite frontend (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global 500 error handler (masks stack traces per SECURITY.md)
@app.exception_handler(Exception)
async def custom_500_handler(request: Request, exc: Exception):
    logger.error(f"Internal Server Error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    total_players = 0
    try:
        service = AnalyticsService.get_instance()
        total_players = service.get_total_players_count()
    except Exception:
        pass

    return HealthResponse(
        status="online",
        dataset="FBref 2024-2025",
        total_players=total_players,
    )


# Include Routers
app.include_router(players.router)
app.include_router(clusters.router)
app.include_router(similarity.router)
app.include_router(scout_agent.router)
