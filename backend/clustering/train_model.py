import os
import joblib
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score
from backend.clustering.preprocess import load_and_preprocess_data, FEATURE_COLUMNS

POSITION_ARCHETYPES = {
    'Defender': {
        0: "Ball-Playing Defender",
        1: "Stopper / Aerial Destroyer",
        2: "Attacking Wingback / Fullback"
    },
    'Midfielder': {
        0: "Creative Deep Playmaker",
        1: "Box-to-Box Engine",
        2: "Pressing Destroyer",
        3: "Attacking Midfield Creator"
    },
    'Forward': {
        0: "Clinical Poacher / Goalscorer",
        1: "Target Man / Pressing Forward",
        2: "Dynamic Winger / Dribbler"
    }
}

def train_and_export_pipeline():
    """
    Trains Position-Grouped K-Means clustering, PCA, and NearestNeighbors engine.
    Exports players_processed.csv and model.pkl to backend/data/processed/
    """
    base_dir = os.path.dirname(__file__)
    raw_path = os.path.normpath(os.path.join(base_dir, "..", "data", "raw", "transfermarkt_players.csv"))
    processed_dir = os.path.normpath(os.path.join(base_dir, "..", "data", "processed"))
    os.makedirs(processed_dir, exist_ok=True)

    # 1. Load preprocessed dataset with percentiles and scaled features
    df_processed, scaler = load_and_preprocess_data(raw_path)
    scaled_feature_cols = [f"{c}_scaled" for c in FEATURE_COLUMNS]

    # Initialize columns
    df_processed['cluster_id'] = 0
    df_processed['cluster_name'] = "Unassigned"

    # 2. Position-Grouped K-Means Clustering
    position_models = {}
    for pos_group, archetypes in POSITION_ARCHETYPES.items():
        sub_df = df_processed[df_processed['position_group'] == pos_group]
        if len(sub_df) < len(archetypes):
            continue

        n_clusters = len(archetypes)
        X_sub = sub_df[scaled_feature_cols].values

        kmeans_pos = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = kmeans_pos.fit_predict(X_sub)

        df_processed.loc[sub_df.index, 'cluster_id'] = labels
        df_processed.loc[sub_df.index, 'cluster_name'] = [archetypes[lbl] for lbl in labels]
        position_models[pos_group] = kmeans_pos

    # Calculate overall Silhouette Score across full dataset
    X_full = df_processed[scaled_feature_cols].values
    overall_labels = df_processed['cluster_id'].values
    score = silhouette_score(X_full, overall_labels)
    print(f"[INFO] Position-Grouped K-Means Silhouette Score: {score:.4f}")

    # 3. Global PCA (n_components=2) for 2D Scatter Plot Coordinates
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_full)
    df_processed['pca_x'] = pca_coords[:, 0].round(3)
    df_processed['pca_y'] = pca_coords[:, 1].round(3)

    # 4. Fit Global NearestNeighbors (Cosine Distance) for Similarity Engine
    nn_model = NearestNeighbors(n_neighbors=6, metric='cosine')
    nn_model.fit(X_full)

    # 5. Export processed CSV and serialized model artifacts (.pkl)
    csv_output_path = os.path.join(processed_dir, "players_processed.csv")
    model_output_path = os.path.join(processed_dir, "model.pkl")

    df_processed.to_csv(csv_output_path, index=False)

    artifacts = {
        'scaler': scaler,
        'position_models': position_models,
        'pca': pca,
        'nn_model': nn_model,
        'position_archetypes': POSITION_ARCHETYPES,
        'feature_columns': FEATURE_COLUMNS,
        'scaled_feature_columns': scaled_feature_cols
    }
    joblib.dump(artifacts, model_output_path)

    print(f"[SUCCESS] Successfully exported processed CSV to: {csv_output_path}")
    print(f"[SUCCESS] Successfully exported upgraded model artifacts to: {model_output_path}")

    return df_processed, score

if __name__ == "__main__":
    train_and_export_pipeline()
