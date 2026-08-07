import os
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Real 100% FBref Outfield Feature Columns (Zero synthetic/random data)
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

MINUTES_THRESHOLD = 450

def load_and_preprocess_fbref_data(csv_path: str):
    """
    Loads preprocessed FBref outfield dataset.
    Note: Goalkeepers (GK) are explicitly excluded during data aggregation 
    in process_raw_fbref.py to ensure zero outfield feature degeneration.
    
    Standardizes the 8 real FBref per-90 metrics using StandardScaler.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Cleaned FBref dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Confirm zero Goalkeepers in outfield pipeline
    assert not df['position_group'].isin(['Goalkeeper']).any(), "Goalkeepers must be excluded from outfield clustering."

    # Fit StandardScaler on the 8 real feature columns
    scaler = StandardScaler()
    scaled_feature_cols = [f"{c}_scaled" for c in FBREF_FEATURE_COLUMNS]
    scaled_features = scaler.fit_transform(df[FBREF_FEATURE_COLUMNS])

    scaled_df = pd.DataFrame(scaled_features, columns=scaled_feature_cols, index=df.index)

    # Combine metadata + per90 stats + percentiles + scaled features
    processed_df = pd.concat([df, scaled_df], axis=1)

    return processed_df, scaler, scaled_feature_cols

if __name__ == "__main__":
    raw_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "data", "raw", "fbref_cleaned_players.csv"))
    df_proc, scaler, scaled_cols = load_and_preprocess_fbref_data(raw_path)
    print(f"[SUCCESS] Loaded {len(df_proc)} outfield players with {len(scaled_cols)} scaled features.")
