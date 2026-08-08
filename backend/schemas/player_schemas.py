from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class StatPercentile(BaseModel):
    value: float = Field(..., description="Raw per-90 metric value")
    percentile: float = Field(..., description="Position-group percentile rank (0-100%)")


class PlayerSummary(BaseModel):
    player_id: str
    player_name: str
    squad: str
    league: str
    position: str
    position_group: str
    minutes_played: int
    age: Optional[int] = None
    cluster_id: int
    cluster_name: str
    photo_url: Optional[str] = Field(default=None, description="Resolved Wikimedia Commons photo URL or local demo photo path")
    pca_x: float
    pca_y: float


class PlayerDetail(BaseModel):
    player_id: str
    player_name: str
    squad: str
    league: str
    position: str
    position_group: str
    minutes_played: int
    age: Optional[int] = None
    cluster_id: int
    cluster_name: str
    photo_url: Optional[str] = Field(default=None, description="Resolved Wikimedia Commons photo URL or local demo photo path")
    gmm_probabilities: Dict[str, float] = Field(default_factory=dict, description="GMM soft-clustering probability distribution")
    pca_x: float
    pca_y: float
    stats: Dict[str, StatPercentile]


class SignatureStat(BaseModel):
    feature: str
    cluster_mean: float
    pos_mean: float
    z_score_diff: float


class ClusterSummary(BaseModel):
    cluster_id: int
    cluster_name: str
    description: str
    signature_stats: List[SignatureStat]


# GET /clusters returns a dict mapping position_group name to a list of ClusterSummary objects
ClustersResponse = Dict[str, List[ClusterSummary]]


class SimilarPlayerResponse(BaseModel):
    player_id: str
    player_name: str
    squad: str
    league: str
    position_group: str
    cluster_name: str
    similarity_score: float
    photo_url: Optional[str] = Field(default=None, description="Resolved Wikimedia Commons photo URL or local demo photo path")


class HealthResponse(BaseModel):
    status: str
    dataset: str
    total_players: int
