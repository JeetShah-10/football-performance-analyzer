import os
import pandas as pd
import numpy as np
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
    calculates per-90 metrics, computes percentile ranks, and standardizes features.
    """
    if not os.path.exists(raw_csv_path):
        raise FileNotFoundError(f"Raw dataset not found at {raw_csv_path}")

    df = pd.read_csv(raw_csv_path)

    # Filter out low-minute noise
    df_filtered = df[df['minutes_played'] >= MINUTES_THRESHOLD].copy()

    # Position Group fallback if missing
    if 'position_group' not in df_filtered.columns:
        df_filtered['position_group'] = df_filtered['position'].apply(
            lambda p: 'Defender' if any(k in str(p).upper() for k in ['DF', 'DEF', 'BACK'])
            else ('Midfielder' if any(k in str(p).upper() for k in ['MF', 'MID']) else 'Forward')
        )

    # Engineer per-90 performance metrics
    df_filtered['goals_per90'] = ((df_filtered['goals'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['assists_per90'] = ((df_filtered['assists'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['shots_per90'] = ((df_filtered['shots'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['key_passes_per90'] = ((df_filtered['key_passes'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['tackles_per90'] = ((df_filtered['tackles'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['interceptions_per90'] = ((df_filtered['interceptions'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['progressive_passes_per90'] = ((df_filtered['progressive_passes'] / df_filtered['minutes_played']) * 90).round(2)
    df_filtered['successful_dribbles_per90'] = ((df_filtered['successful_dribbles'] / df_filtered['minutes_played']) * 90).round(2)

    # Calculate Percentile Ranks (0 - 100%) for radar chart rendering
    percentile_df = pd.DataFrame(index=df_filtered.index)
    for col in FEATURE_COLUMNS:
        percentile_df[f"{col}_pct"] = (df_filtered[col].rank(pct=True) * 100).round(1)

    # Standardize features using StandardScaler (z-score normalization: mean=0, std=1)
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df_filtered[FEATURE_COLUMNS])
    scaled_df = pd.DataFrame(scaled_features, columns=[f"{c}_scaled" for c in FEATURE_COLUMNS], index=df_filtered.index)

    # Combine metadata + per90 stats + percentiles + scaled features
    processed_df = pd.concat([df_filtered, percentile_df, scaled_df], axis=1)

    return processed_df, scaler

if __name__ == "__main__":
    raw_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data", "raw", "transfermarkt_players.csv"))
    df_proc, scaler = load_and_preprocess_data(raw_path)
    print(f"[SUCCESS] Successfully preprocessed {len(df_proc)} players with per-90 metrics & percentiles.")
