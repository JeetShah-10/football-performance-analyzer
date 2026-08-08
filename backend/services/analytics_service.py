import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from backend.schemas.player_schemas import (
    PlayerSummary,
    PlayerDetail,
    StatPercentile,
    SignatureStat,
    ClusterSummary,
    SimilarPlayerResponse,
)

FBREF_FEATURE_COLUMNS = [
    'npxG_per90',
    'xAG_per90',
    'KP_per90',
    'PrgP_per90',
    'PrgC_per90',
    'Tkl_per90',
    'Int_per90',
    'Succ_per90'
]


class AnalyticsService:
    _instance: Optional['AnalyticsService'] = None

    def __init__(
        self,
        df: Optional[pd.DataFrame] = None,
        model_artifacts: Optional[dict] = None,
        data_path: Optional[str] = None,
        model_path: Optional[str] = None,
    ):
        base_dir = os.path.dirname(__file__)
        if data_path is None:
            data_path = os.path.normpath(os.path.join(base_dir, "..", "data", "processed", "players_processed.csv"))
        if model_path is None:
            model_path = os.path.normpath(os.path.join(base_dir, "..", "data", "processed", "model.pkl"))

        if df is not None and model_artifacts is not None:
            self.df = df.copy()
            self.artifacts = model_artifacts
        else:
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Processed dataset CSV not found at {data_path}")
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model artifacts PKL not found at {model_path}")

            self.df = pd.read_csv(data_path)
            self.artifacts = joblib.load(model_path)

        # Index player lookup map O(1)
        self._player_map: Dict[str, dict] = {}
        for row in self.df.to_dict(orient='records'):
            pid = str(row.get('player_id', ''))
            if pid:
                self._player_map[pid] = row

        self.nn_model = self.artifacts.get('nn_model')
        self.cluster_signatures = self.artifacts.get('cluster_signatures', {})
        self.scaled_feature_cols = [f"{c}_scaled" for c in FBREF_FEATURE_COLUMNS]

    @classmethod
    def get_instance(cls) -> 'AnalyticsService':
        if cls._instance is None or 'gmm_probabilities_json' not in cls._instance.df.columns:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def set_instance(cls, instance: Optional['AnalyticsService']) -> None:
        cls._instance = instance

    def get_total_players_count(self) -> int:
        return len(self.df)

    def list_players(
        self,
        position_group: Optional[str] = None,
        league: Optional[str] = None,
        search: Optional[str] = None,
        max_age: Optional[int] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[PlayerSummary]:
        filtered_df = self.df

        if position_group:
            filtered_df = filtered_df[
                filtered_df['position_group'].astype(str).str.lower() == position_group.strip().lower()
            ]

        if league:
            # Check 'league' or 'Comp' column
            col_league = 'league' if 'league' in filtered_df.columns else 'Comp'
            filtered_df = filtered_df[
                filtered_df[col_league].astype(str).str.contains(league.strip(), case=False, na=False)
            ]

        if max_age is not None:
            col_age = 'Age' if 'Age' in filtered_df.columns else 'age'
            if col_age in filtered_df.columns:
                filtered_df = filtered_df[filtered_df[col_age] <= max_age]

        if search:
            query = search.strip().lower()
            name_match = filtered_df['player_name'].astype(str).str.lower().str.contains(query, na=False)
            col_squad = 'squad' if 'squad' in filtered_df.columns else 'Squad'
            squad_match = filtered_df[col_squad].astype(str).str.lower().str.contains(query, na=False)
            filtered_df = filtered_df[name_match | squad_match]

        sliced = filtered_df.iloc[offset : offset + limit]

        summaries = []
        for row in sliced.to_dict(orient='records'):
            age_val = row.get('Age', row.get('age'))
            summaries.append(
                PlayerSummary(
                    player_id=str(row.get('player_id', '')),
                    player_name=str(row.get('player_name', '')),
                    squad=str(row.get('squad', row.get('Squad', ''))),
                    league=str(row.get('league', row.get('Comp', ''))),
                    position=str(row.get('position', row.get('Pos', ''))),
                    position_group=str(row.get('position_group', '')),
                    minutes_played=int(row.get('minutes_played', row.get('Min', 0))),
                    age=int(float(age_val)) if age_val is not None and not pd.isna(age_val) else None,
                    cluster_id=int(row.get('cluster_id', 0)),
                    cluster_name=str(row.get('cluster_name', '')),
                    pca_x=float(row.get('pca_x', 0.0)),
                    pca_y=float(row.get('pca_y', 0.0)),
                )
            )
        return summaries

    def get_player_by_id(self, player_id: str) -> Optional[PlayerDetail]:
        row = self._player_map.get(player_id)
        if not row:
            return None

        stats_dict: Dict[str, StatPercentile] = {}
        for feat in FBREF_FEATURE_COLUMNS:
            val = float(row.get(feat, 0.0))
            pct_col = f"{feat}_pct"
            pct_val = float(row.get(pct_col, 50.0))
            stats_dict[feat] = StatPercentile(value=round(val, 3), percentile=round(pct_val, 1))

        # Parse GMM probabilities JSON
        gmm_probs = {}
        gmm_json_raw = row.get('gmm_probabilities_json')
        if isinstance(gmm_json_raw, str) and len(gmm_json_raw) > 2:
            try:
                gmm_probs = json.loads(gmm_json_raw)
            except Exception:
                gmm_probs = {}
        elif isinstance(gmm_json_raw, dict):
            gmm_probs = gmm_json_raw

        age_val = row.get('Age', row.get('age'))

        return PlayerDetail(
            player_id=str(row.get('player_id', '')),
            player_name=str(row.get('player_name', '')),
            squad=str(row.get('squad', row.get('Squad', ''))),
            league=str(row.get('league', row.get('Comp', ''))),
            position=str(row.get('position', row.get('Pos', ''))),
            position_group=str(row.get('position_group', '')),
            minutes_played=int(row.get('minutes_played', row.get('Min', 0))),
            age=int(float(age_val)) if age_val is not None and not pd.isna(age_val) else None,
            cluster_id=int(row.get('cluster_id', 0)),
            cluster_name=str(row.get('cluster_name', '')),
            gmm_probabilities=gmm_probs,
            pca_x=float(row.get('pca_x', 0.0)),
            pca_y=float(row.get('pca_y', 0.0)),
            stats=stats_dict,
        )

    def get_clusters(self) -> Dict[str, List[ClusterSummary]]:
        """
        Returns cluster signature profiles grouped by position_group.
        CRITICAL: Keys off (position_group, cluster_id) together to avoid 
        cross-position cluster_id collisions.
        """
        result: Dict[str, List[ClusterSummary]] = {}

        for pos_group, clusters_dict in self.cluster_signatures.items():
            result[pos_group] = []
            for cid_key, info in clusters_dict.items():
                cid = int(cid_key)
                sig_stats_data = info.get('signature_stats', [])
                sig_stats = [
                    SignatureStat(
                        feature=str(s.get('feature', '')),
                        cluster_mean=float(s.get('cluster_mean', 0.0)),
                        pos_mean=float(s.get('pos_mean', 0.0)),
                        z_score_diff=float(s.get('z_score_diff', 0.0)),
                    )
                    for s in sig_stats_data
                ]
                result[pos_group].append(
                    ClusterSummary(
                        cluster_id=cid,
                        cluster_name=str(info.get('name', f"{pos_group} Archetype {cid}")),
                        description=str(info.get('description', '')),
                        signature_stats=sig_stats,
                    )
                )

        return result

    def get_similar_players(self, player_id: str, n: int = 5, u21_only: bool = False, max_age: Optional[int] = None) -> List[SimilarPlayerResponse]:
        target = self.get_player_by_id(player_id)
        if not target:
            return []

        if self.nn_model is None:
            return []

        # Find row index in self.df
        match_mask = self.df['player_id'] == player_id
        if not match_mask.any():
            return []

        target_idx = self.df[match_mask].index[0]
        
        # Ensure scaled feature columns exist
        available_scaled_cols = [c for c in self.scaled_feature_cols if c in self.df.columns]
        if not available_scaled_cols:
            return []

        X_target = self.df.loc[[target_idx], available_scaled_cols].values

        # Determine age limit (u21_only convenience wrapper)
        effective_max_age = 21 if u21_only else max_age

        distances, indices = self.nn_model.kneighbors(X_target, n_neighbors=min(n + 50, len(self.df)))

        results: List[SimilarPlayerResponse] = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx == target_idx:
                continue  # Exclude self match

            matched_row = self.df.iloc[idx]

            if effective_max_age is not None:
                age_v = matched_row.get('Age', matched_row.get('age'))
                if age_v is None or pd.isna(age_v) or float(age_v) > effective_max_age:
                    continue

            if len(results) >= n:
                break

            sim_score = max(0.0, round((1.0 - float(dist)) * 100.0, 2))

            results.append(
                SimilarPlayerResponse(
                    player_id=str(matched_row.get('player_id', '')),
                    player_name=str(matched_row.get('player_name', '')),
                    squad=str(matched_row.get('squad', matched_row.get('Squad', ''))),
                    league=str(matched_row.get('league', matched_row.get('Comp', ''))),
                    position_group=str(matched_row.get('position_group', '')),
                    cluster_name=str(matched_row.get('cluster_name', '')),
                    similarity_score=sim_score,
                )
            )

        return results
