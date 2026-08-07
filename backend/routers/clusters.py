from fastapi import APIRouter, Request
from backend.schemas.player_schemas import ClustersResponse
from backend.services.analytics_service import AnalyticsService
from backend.limiter import limiter

router = APIRouter(tags=["Clusters"])


@router.get("/clusters", response_model=ClustersResponse)
@limiter.limit("60/minute")
def get_clusters(request: Request) -> ClustersResponse:
    service = AnalyticsService.get_instance()
    return service.get_clusters()
