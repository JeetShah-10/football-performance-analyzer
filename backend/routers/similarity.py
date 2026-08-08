from typing import List
from fastapi import APIRouter, HTTPException, Query, Request
from backend.schemas.player_schemas import SimilarPlayerResponse
from backend.services.analytics_service import AnalyticsService
from backend.limiter import limiter

router = APIRouter(tags=["Similarity Search"])


@router.get("/similar/{player_id}", response_model=List[SimilarPlayerResponse])
@limiter.limit("60/minute")
def get_similar_players(
    request: Request,
    player_id: str,
    n: int = Query(5, ge=1, le=20),
    u21_only: bool = Query(False, description="Filter results to players aged 21 or under"),
) -> List[SimilarPlayerResponse]:
    service = AnalyticsService.get_instance()
    player = service.get_player_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{player_id}' not found.")
    return service.get_similar_players(player_id, n=n, u21_only=u21_only)
