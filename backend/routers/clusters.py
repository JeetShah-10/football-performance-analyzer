from typing import Dict, List
from fastapi import APIRouter
from backend.schemas.player_schemas import ClusterSummary, ClustersResponse
from backend.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Clusters"])


def _get_clusters_handler() -> ClustersResponse:
    service = AnalyticsService.get_instance()
    return service.get_clusters()


# Canonical bare path per docs/api-contract.md
@router.get("/clusters", response_model=ClustersResponse)
def get_clusters():
    return _get_clusters_handler()


# Alias path under /api/* for compatibility
@router.get("/api/clusters", response_model=ClustersResponse, include_in_schema=False)
def get_clusters_api_alias():
    return _get_clusters_handler()
