import os
import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score
from backend.clustering.preprocess import load_and_preprocess_data, FEATURE_COLUMNS

ARCHETYPE_LABELS = {
    0: "Clinical Poacher / Goalscorer",
    1: "Creative Playmaker",
    2: "Ball-Winning Destroyer",
    3: "Dynamic Winger / Dribbler"
}

def train_and_export_pipeline():
    """
    Trains K-Means clustering, PCA, and NearestNeighbors engine,
    validates silhouette score, and saves serialized artifacts to backend/data/processed/
    """
    base_dir = os.path.dirname(__file__)
    raw_path = os.path.normpath(os.path.join(base_dir, "..", "data", "raw", "transfermarkt_players.csv"))
    processed_dir = os.path.normpath(os.path.join(base_dir, "..", "data", "processed"))
    os.makedirs(processed_dir, exist_ok=True)

    # 1. Load and preprocess data
    df_processed, scaler = load_and_preprocess_data(raw_path)
    scaled_feature_cols = [f"{c}_scaled" for c in FEATURE_COLUMNS]
    X_scaled = df_processed[scaled_feature_cols].values

    # 2. Fit K-Means Clustering (k=4 archetypes)
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    df_processed['cluster_id'] = cluster_labels
    df_processed['cluster_name'] = df_processed['cluster_id'].map(ARCHETYPE_LABELS)

    # Calculate Silhouette Score for validation
    score = silhouette_score(X_scaled, cluster_labels)
    print(f"[INFO] K-Means Silhouette Score (k=4): {score:.4f}")

    # 3. Fit PCA (n_components=2) for 2D Scatter Plot Coordinates
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_scaled)
    df_processed['pca_x'] = pca_coords[:, 0].round(3)
    df_processed['pca_y'] = pca_coords[:, 1].round(3)

    # 4. Fit NearestNeighbors Engine (Cosine Distance) for Scout Similarity Lookup
    nn_model = NearestNeighbors(n_neighbors=5, metric='cosine')
    nn_model.fit(X_scaled)

    # 5. Export processed CSV and serialized model artifacts (.pkl)
    csv_output_path = os.path.join(processed_dir, "players_processed.csv")
    model_output_path = os.path.join(processed_dir, "model.pkl")

    df_processed.to_csv(csv_output_path, index=False)

    artifacts = {
        'scaler': scaler,
        'kmeans': kmeans,
        'pca': pca,
        'nn_model': nn_model,
        'archetypes': ARCHETYPE_LABELS,
        'feature_columns': FEATURE_COLUMNS,
        'scaled_feature_columns': scaled_feature_cols
    }
    joblib.dump(artifacts, model_output_path)

    print(f"[SUCCESS] Successfully exported processed CSV to: {csv_output_path}")
    print(f"[SUCCESS] Successfully exported model artifacts to: {model_output_path}")

    return df_processed, score

if __name__ == "__main__":
    train_and_export_pipeline()
