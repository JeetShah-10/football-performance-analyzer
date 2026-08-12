from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Request, Response
import zipfile
import os
import re
import unicodedata
import functools
from pathlib import Path
from backend.schemas.player_schemas import PlayerSummary, PlayerDetail
from backend.services.analytics_service import AnalyticsService
from backend.limiter import limiter

router = APIRouter(tags=["Players"])

BASE_DIR = Path(__file__).resolve().parent.parent
ZIP_PATH = BASE_DIR / "data" / "player_images.zip"

def normalize_name(name: str) -> str:
    if not name:
        return ""
    name = unicodedata.normalize('NFD', name).encode('ascii', 'ignore').decode('utf-8')
    return re.sub(r'[^a-z0-9]', '', name.lower())

@functools.lru_cache(maxsize=1)
def get_image_mapping():
    mapping = {}
    if not os.path.exists(ZIP_PATH):
        return mapping
    try:
        with zipfile.ZipFile(ZIP_PATH, "r") as z:
            for name in z.namelist():
                if not name.endswith(('.png', '.jpg', '.jpeg')):
                    continue
                basename = os.path.basename(name)
                # some files might not have _, handle gracefully
                clean_name = basename.split('_', 1)[-1].rsplit('.', 1)[0] if '_' in basename else basename.rsplit('.', 1)[0]
                norm_name = normalize_name(clean_name)
                mapping[norm_name] = name
    except Exception:
        pass
    return mapping

@router.get("/players", response_model=List[PlayerSummary])
@limiter.limit("60/minute")
def list_players(
    request: Request,
    position_group: Optional[str] = None,
    league: Optional[str] = None,
    search: Optional[str] = None,
    u21_only: bool = Query(False, description="Convenience wrapper to filter players aged 21 or under"),
    limit: int = Query(100, ge=1, le=2000),
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


@router.get("/players/{player_id}/image")
@limiter.limit("120/minute")
def get_player_image(request: Request, player_id: str):
    service = AnalyticsService.get_instance()
    player = service.get_player_by_id(player_id)
    
    if not player:
        search_name = player_id
    else:
        search_name = player.player_name

    mapping = get_image_mapping()
    norm_search = normalize_name(search_name)
    
    filename_in_zip = None
    if norm_search in mapping:
        filename_in_zip = mapping[norm_search]
    else:
        # Try finding a partial match
        for key, val in mapping.items():
            if norm_search in key or key in norm_search:
                filename_in_zip = val
                break
                
    if not filename_in_zip or not os.path.exists(ZIP_PATH):
        raise HTTPException(status_code=404, detail="Image not found")
        
    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        try:
            image_data = z.read(filename_in_zip)
        except KeyError:
            raise HTTPException(status_code=404, detail="Image not found")
            
    media_type = "image/png" if filename_in_zip.lower().endswith(".png") else "image/jpeg"
    
    return Response(
        content=image_data,
        media_type=media_type,
        headers={"Cache-Control": "public, max-age=31536000"}
    )
