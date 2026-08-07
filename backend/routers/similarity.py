from typing import List
from fastapi import APIRouter, HTTPException, Query
from backend.schemas.player_schemas import SimilarPlayerResponse
from backend.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Similarity Search"])


def _get_similar_players_handler(player_id: str, n: int = 5) -> List[SimilarPlayerResponse]:
    service = AnalyticsService.get_instance()
    # Check if target player exists
    player = service.get_player_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{player_id}' not found.")

    return service.get_similar_players(player_id, n=n)


# Canonical bare path per docs/api-contract.md
@router.get("/similar/{player_id}", response_model=List[SimilarPlayerResponse])
def get_similar_players(player_id: str, n: int = Query(5, ge=1, le=20)):
    return _get_similar_players_handler(player_id, n)


# Alias path under /api/* for compatibility
@router.get("/api/similar/{player_id}", response_model=List[SimilarPlayerResponse], include_in_schema=False)
def get_similar_players_api_alias(player_id: str, n: int = Query(5, ge=1, le=20)):
    return _get_similar_players_handler(player_id, n)
