from typing import Dict, List
from fastapi import APIRouter, Request
from backend.schemas.player_schemas import ClusterSummary, ClustersResponse
from backend.services.analytics_service import AnalyticsService
from backend.limiter import limiter

router = APIRouter(tags=["Clusters"])


def _get_clusters_handler() -> ClustersResponse:
    service = AnalyticsService.get_instance()
    return service.get_clusters()


# Canonical bare path per docs/api-contract.md
@router.get("/clusters", response_model=ClustersResponse)
@limiter.limit("60/minute")
def get_clusters(request: Request):
    return _get_clusters_handler()


# Alias path under /api/* for compatibility
@router.get("/api/clusters", response_model=ClustersResponse, include_in_schema=False)
@limiter.limit("60/minute")
def get_clusters_api_alias(request: Request):
    return _get_clusters_handler()
