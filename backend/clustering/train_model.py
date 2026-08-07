import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score
from backend.clustering.preprocess import load_and_preprocess_fbref_data, FBREF_FEATURE_COLUMNS

def compute_cluster_signature_stats(df_pos: pd.DataFrame, cluster_id: int, feature_cols: list) -> list:
    """
    Computes the 2-3 'signature stats' for a cluster — the features where the cluster mean 
    deviates most (in std-dev Z-score units) from the overall position group mean.
    """
    sub = df_pos[df_pos['cluster_id'] == cluster_id]
    signatures = []
    
    for col in feature_cols:
        pos_mean = df_pos[col].mean()
        pos_std = df_pos[col].std()
        if pos_std == 0:
            continue
        cluster_mean = sub[col].mean()
        z_diff = (cluster_mean - pos_mean) / pos_std
        signatures.append({
            'feature': col,
            'cluster_mean': round(float(cluster_mean), 3),
            'pos_mean': round(float(pos_mean), 3),
            'z_score_diff': round(float(z_diff), 3)
        })
    
    # Sort by absolute Z-score deviation
    signatures.sort(key=lambda x: abs(x['z_score_diff']), reverse=True)
    return signatures[:3]

def train_and_export_fbref_pipeline():
    """
    Trains FBref Outfield Pipeline:
    - Runs per-position silhouette sweep over k=2..6 and saves to silhouette_report.json
    - Fits KMeans per position group based on sweep results
    - Computes cluster signature stats and assigns archetype names
    - Calculates 2D PCA visual projection
    - Fits Cosine NearestNeighbors similarity engine
    - Exports players_processed.csv and model.pkl
    """
    base_dir = os.path.dirname(__file__)
    cleaned_csv = os.path.normpath(os.path.join(base_dir, "..", "data", "raw", "fbref_cleaned_players.csv"))
    processed_dir = os.path.normpath(os.path.join(base_dir, "..", "data", "processed"))
    os.makedirs(processed_dir, exist_ok=True)

    df_proc, scaler, scaled_feature_cols = load_and_preprocess_fbref_data(cleaned_csv)

    df_proc['cluster_id'] = 0
    df_proc['cluster_name'] = "Unassigned"

    # 1. PER-POSITION SILHOUETTE SWEEP (k=2..6)
    silhouette_report = {}
    position_models = {}
    cluster_signatures = {}

    position_archetype_maps = {
        'Defender': {
            0: {"name": "Ball-Playing Defender", "desc": "High progressive passing and build-up vision"},
            1: {"name": "Stopper / Defensive Destroyer", "desc": "High tackles and interception volume"}
        },
        'Midfielder': {
            0: {"name": "Deep-Lying Playmaker", "desc": "High key passes and progressive distribution"},
            1: {"name": "Box-to-Box / Pressing Engine", "desc": "High tackles, carries, and box arrivals"}
        },
        'Forward': {
            0: {"name": "Clinical Finisher / Poacher", "desc": "High non-penalty expected goals (npxG)"},
            1: {"name": "Dynamic Winger / Dribbler", "desc": "High successful take-ons and progressive carries"}
        }
    }

    for pos_group in ['Defender', 'Midfielder', 'Forward']:
        sub_df = df_proc[df_proc['position_group'] == pos_group]
        X_sub = sub_df[scaled_feature_cols].values
        
        scores = {}
        for k in range(2, 7):
            km_test = KMeans(n_clusters=k, random_state=42, n_init=10)
            lbls_test = km_test.fit_predict(X_sub)
            sil = silhouette_score(X_sub, lbls_test)
            scores[str(k)] = round(float(sil), 4)

        # Pick best k based on highest silhouette score
        best_k = int(max(scores, key=lambda k: scores[k]))
        silhouette_report[pos_group] = {
            "player_count": len(sub_df),
            "scores": scores,
            "chosen_k": best_k,
            "best_silhouette_score": scores[str(best_k)]
        }

        # Train final model for this position group
        kmeans_final = KMeans(n_clusters=best_k, random_state=42, n_init=10)
        labels = kmeans_final.fit_predict(X_sub)

        df_proc.loc[sub_df.index, 'cluster_id'] = labels
        
        # Compute signature stats and map archetype labels
        cluster_signatures[pos_group] = {}
        for cid in range(best_k):
            archetype_info = position_archetype_maps[pos_group].get(
                cid, {"name": f"{pos_group} Archetype {cid}", "desc": "Tactical cluster"}
            )
            df_proc.loc[(df_proc['position_group'] == pos_group) & (df_proc['cluster_id'] == cid), 'cluster_name'] = archetype_info["name"]
            
            sig_stats = compute_cluster_signature_stats(df_proc[df_proc['position_group'] == pos_group], cid, FBREF_FEATURE_COLUMNS)
            cluster_signatures[pos_group][cid] = {
                "name": archetype_info["name"],
                "description": archetype_info["desc"],
                "signature_stats": sig_stats
            }

        position_models[pos_group] = kmeans_final

    # Save silhouette report JSON
    json_report_path = os.path.join(base_dir, "silhouette_report.json")
    with open(json_report_path, "w", encoding="utf-8") as f:
        json.dump(silhouette_report, f, indent=2)
    print(f"[INFO] Silhouette sweep report saved to {json_report_path}")

    # 2. PCA 2D PROJECTION
    X_full = df_proc[scaled_feature_cols].values
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_full)
    df_proc['pca_x'] = pca_coords[:, 0].round(3)
    df_proc['pca_y'] = pca_coords[:, 1].round(3)
    
    explained_var = pca.explained_variance_ratio_
    total_var = float(explained_var.sum())
    print(f"[INFO] 2D PCA Explained Variance: PC1={explained_var[0]*100:.2f}%, PC2={explained_var[1]*100:.2f}%, Total={total_var*100:.2f}%")

    # 3. COSINE NEAREST NEIGHBORS SIMILARITY ENGINE
    # Train on 8D scaled feature space
    nn_model = NearestNeighbors(n_neighbors=10, metric='cosine')
    nn_model.fit(X_full)

    # 4. EXPORT ARTIFACTS
    csv_output_path = os.path.join(processed_dir, "players_processed.csv")
    model_output_path = os.path.join(processed_dir, "model.pkl")

    df_proc.to_csv(csv_output_path, index=False)

    artifacts = {
        'scaler': scaler,
        'position_models': position_models,
        'pca': pca,
        'nn_model': nn_model,
        'cluster_signatures': cluster_signatures,
        'feature_columns': FBREF_FEATURE_COLUMNS,
        'scaled_feature_columns': scaled_feature_cols,
        'pca_explained_variance_ratio': explained_var.tolist()
    }
    joblib.dump(artifacts, model_output_path)

    print(f"[SUCCESS] Exported processed CSV to: {csv_output_path} ({len(df_proc)} rows)")
    print(f"[SUCCESS] Exported model artifacts to: {model_output_path}")

    return df_proc, silhouette_report, total_var

def get_similar_players(df_proc: pd.DataFrame, nn_model: NearestNeighbors, target_player_id: str, n_neighbors: int = 5) -> pd.DataFrame:
    """
    Similarity Search Helper:
    Queries n_neighbors + 1, explicitly removes the target player (self-match at index 0),
    and returns exactly n_neighbors similar player profiles with similarity score %.
    """
    scaled_cols = [f"{c}_scaled" for c in FBREF_FEATURE_COLUMNS]
    match_row = df_proc[df_proc['player_id'] == target_player_id]
    
    if len(match_row) == 0:
        raise ValueError(f"Player ID '{target_player_id}' not found.")

    target_idx = match_row.index[0]
    X_target = df_proc.loc[[target_idx], scaled_cols].values

    # Query n_neighbors + 1 to account for self-match
    distances, indices = nn_model.kneighbors(X_target, n_neighbors=n_neighbors + 1)
    
    # Filter out self-match index
    result_indices = []
    result_distances = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx != target_idx and len(result_indices) < n_neighbors:
            result_indices.append(idx)
            result_distances.append(dist)

    results_df = df_proc.loc[result_indices].copy()
    results_df['similarity_score'] = [(1 - float(d)) * 100 for d in result_distances]
    return results_df

if __name__ == "__main__":
    train_and_export_fbref_pipeline()
