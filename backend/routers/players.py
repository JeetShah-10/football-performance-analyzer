from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Request
from backend.schemas.player_schemas import PlayerSummary, PlayerDetail
from backend.services.analytics_service import AnalyticsService
from backend.limiter import limiter

router = APIRouter(tags=["Players"])


@router.get("/players", response_model=List[PlayerSummary])
@limiter.limit("60/minute")
def list_players(
    request: Request,
    position_group: Optional[str] = None,
    league: Optional[str] = None,
    search: Optional[str] = None,
    u21_only: bool = Query(False, description="Convenience wrapper to filter players aged 21 or under"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
) -> List[PlayerSummary]:
    service = AnalyticsService.get_instance()
    max_age = 21 if u21_only else None
    return service.list_players(
        position_group=position_group,
        league=league,
        search=search,
        max_age=max_age,
        limit=limit,
        offset=offset,
    )


@router.get("/players/{player_id}", response_model=PlayerDetail)
@limiter.limit("60/minute")
def get_player(request: Request, player_id: str) -> PlayerDetail:
    service = AnalyticsService.get_instance()
    player = service.get_player_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{player_id}' not found.")
    return player
