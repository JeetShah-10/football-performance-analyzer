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
    pca_x: float
    pca_y: float
    # Per-90 metrics for client-side filtering
    npxG_per90: float = 0.0
    xAG_per90: float = 0.0
    KP_per90: float = 0.0
    PrgP_per90: float = 0.0
    PrgC_per90: float = 0.0
    Tkl_per90: float = 0.0
    Int_per90: float = 0.0
    Succ_per90: float = 0.0


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


class HealthResponse(BaseModel):
    status: str
    dataset: str
    total_players: int
