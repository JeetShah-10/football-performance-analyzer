from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.schemas.player_schemas import PlayerSummary, PlayerDetail
from backend.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Players"])


def _list_players_handler(
    position_group: Optional[str] = None,
    league: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
) -> List[PlayerSummary]:
    service = AnalyticsService.get_instance()
    return service.list_players(
        position_group=position_group,
        league=league,
        search=search,
        limit=limit,
        offset=offset,
    )


def _get_player_detail_handler(player_id: str) -> PlayerDetail:
    service = AnalyticsService.get_instance()
    player = service.get_player_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail=f"Player '{player_id}' not found.")
    return player


# Canonical bare paths per docs/api-contract.md
@router.get("/players", response_model=List[PlayerSummary])
def list_players(
    position_group: Optional[str] = None,
    league: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    return _list_players_handler(position_group, league, search, limit, offset)


@router.get("/players/{player_id}", response_model=PlayerDetail)
def get_player(player_id: str):
    return _get_player_detail_handler(player_id)


# Alias paths under /api/* for compatibility with phase5-plan.md
@router.get("/api/players", response_model=List[PlayerSummary], include_in_schema=False)
def list_players_api_alias(
    position_group: Optional[str] = None,
    league: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    return _list_players_handler(position_group, league, search, limit, offset)


@router.get("/api/players/{player_id}", response_model=PlayerDetail, include_in_schema=False)
def get_player_api_alias(player_id: str):
    return _get_player_detail_handler(player_id)
