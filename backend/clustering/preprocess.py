import os
import pandas as pd
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    'goals_per90',
    'assists_per90',
    'shots_per90',
    'key_passes_per90',
    'tackles_per90',
    'interceptions_per90',
    'progressive_passes_per90',
    'successful_dribbles_per90'
]

MINUTES_THRESHOLD = 450

def load_and_preprocess_data(raw_csv_path: str):
    """
    Loads raw Transfermarkt CSV, filters low-minute outliers (<450 mins),
    calculates per-90 metrics, and standardizes features using StandardScaler.
    """
    if not os.path.exists(raw_csv_path):
        raise FileNotFoundError(f"Raw dataset not found at {raw_csv_path}")

    df = pd.read_csv(raw_csv_path)

    # 1. Filter out low-minute noise (players with < 450 total minutes played)
    # Excludes extreme per-90 outliers (e.g. 1 goal in 20 mins = 4.5 goals/90)
    df_filtered = df[df['minutes_played'] >= MINUTES_THRESHOLD].copy()

    # 2. Engineer per-90 performance metrics
    df_filtered['goals_per90'] = (df_filtered['goals'] / df_filtered['minutes_played']) * 90
    df_filtered['assists_per90'] = (df_filtered['assists'] / df_filtered['minutes_played']) * 90
    df_filtered['shots_per90'] = (df_filtered['shots'] / df_filtered['minutes_played']) * 90
    df_filtered['key_passes_per90'] = (df_filtered['key_passes'] / df_filtered['minutes_played']) * 90
    df_filtered['tackles_per90'] = (df_filtered['tackles'] / df_filtered['minutes_played']) * 90
    df_filtered['interceptions_per90'] = (df_filtered['interceptions'] / df_filtered['minutes_played']) * 90
    df_filtered['progressive_passes_per90'] = (df_filtered['progressive_passes'] / df_filtered['minutes_played']) * 90
    df_filtered['successful_dribbles_per90'] = (df_filtered['successful_dribbles'] / df_filtered['minutes_played']) * 90

    # Round float per-90 values for clean reporting
    for col in FEATURE_COLUMNS:
        df_filtered[col] = df_filtered[col].round(2)

    # 3. Fit StandardScaler on per-90 feature matrix (z-score normalization: mean=0, std=1)
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df_filtered[FEATURE_COLUMNS])
    scaled_df = pd.DataFrame(scaled_features, columns=[f"{c}_scaled" for c in FEATURE_COLUMNS], index=df_filtered.index)

    # Combine original metadata + per90 stats + scaled features
    processed_df = pd.concat([df_filtered, scaled_df], axis=1)

    return processed_df, scaler

if __name__ == "__main__":
    raw_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "transfermarkt_players.csv")
    df_proc, scaler = load_and_preprocess_data(raw_path)
    print(f"[SUCCESS] Successfully preprocessed {len(df_proc)} players (Filtered {44 - len(df_proc)} low-minute outliers).")
    print("Feature column means:\n", df_proc[[f"{c}_scaled" for c in FEATURE_COLUMNS]].mean().round(4))
    print("Feature column stds:\n", df_proc[[f"{c}_scaled" for c in FEATURE_COLUMNS]].std().round(4))
