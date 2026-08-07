import os
import json
import re
import pandas as pd
import numpy as np

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

def slugify_id(name: str, nation: str, born: str) -> str:
    """Generates a clean, unique player_id string."""
    base = f"{name}_{nation}_{born}"
    clean = re.sub(r'[^a-zA-Z0-9_]', '_', base)
    return clean.strip('_').lower()

def map_exact_position_group(pos_str: str) -> str:
    """
    Maps FBref position codes using exact primary position matching (first code before comma).
    Excludes Goalkeepers (GK) explicitly.
    """
    if pd.isna(pos_str) or not str(pos_str).strip():
        raise ValueError("Position string cannot be null or empty.")
    
    primary = str(pos_str).split(',')[0].strip().upper()
    if 'GK' in primary:
        return 'Goalkeeper'
    elif primary == 'DF':
        return 'Defender'
    elif primary == 'MF':
        return 'Midfielder'
    elif primary == 'FW':
        return 'Forward'
    else:
        raise ValueError(f"Unrecognized FBref position code: {pos_str}")

def freeze_dataset_metadata(raw_dir: str):
    """Saves metadata freezing raw dataset source and download date."""
    meta_path = os.path.join(raw_dir, "DATASET_METADATA.json")
    meta = {
        "dataset_name": "hubertsidorowicz/football-players-stats-2024-2025",
        "source": "FBref Big-5 European Leagues 2024-2025 Full-Season (267 Columns)",
        "download_date": "2026-08-07",
        "season": "2024-2025",
        "notes": "Frozen raw FBref full 38-game dataset with 267 advanced metrics (npxG, xAG, KP, PrgP, PrgC, Tkl, Int, Succ). Zero synthetic stats."
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"[INFO] Dataset metadata frozen at {meta_path}")

def process_fbref_dataset(raw_dir: str):
    """
    Processes frozen FBref 2024-2025 dataset:
    - Merges multi-club player rows (combining stats across transferred clubs)
    - Excludes Goalkeepers explicitly
    - Filters low-minute noise (Min >= 450)
    - Maps position groups using exact primary position matching
    - Calculates per-90 metrics from raw totals
    - Calculates percentiles WITHIN each position group
    """
    freeze_dataset_metadata(raw_dir)
    
    raw_csv = os.path.join(raw_dir, "players_data-2024_2025.csv")
    if not os.path.exists(raw_csv):
        raise FileNotFoundError(f"FBref raw dataset CSV not found at {raw_csv}")

    print(f"[INFO] Reading raw FBref CSV: {raw_csv}")
    df_raw = pd.read_csv(raw_csv)
    raw_total_rows = len(df_raw)

    # 1. EXPLICIT GOALKEEPER EXCLUSION
    gk_mask = df_raw['Pos'].astype(str).str.contains('GK', case=False, na=False)
    df_outfield = df_raw[~gk_mask].copy()
    gk_count = gk_mask.sum()
    print(f"[INFO] Raw rows: {raw_total_rows}. Excluded {gk_count} Goalkeeper rows explicitly.")

    # 2. MULTI-CLUB ROW AGGREGATION
    print("[INFO] Merging multi-club player rows across transferred clubs...")
    agg_dict = {
        'Min': 'sum',
        'MP': 'sum',
        'Gls': 'sum',
        'Ast': 'sum',
        'npxG': 'sum',
        'xAG': 'sum',
        'KP': 'sum',
        'PrgP': 'sum',
        'PrgC': 'sum',
        'Tkl': 'sum',
        'Int': 'sum',
        'Succ': 'sum',
        'Age': 'first',
        'Squad': lambda x: ', '.join(x.unique()),
        'Comp': lambda x: ', '.join(x.unique()),
        'Pos': lambda x: df_raw.loc[x.index].sort_values('Min', ascending=False)['Pos'].iloc[0]
    }

    grouped = df_outfield.groupby(['Player', 'Nation', 'Born'], as_index=False).agg(agg_dict)
    unique_outfield_count = len(grouped)
    print(f"[INFO] Aggregated into {unique_outfield_count} unique outfield players.")

    # 3. LOW-MINUTES THRESHOLD FILTERING (Min >= 450)
    df_filtered = grouped[grouped['Min'] >= MINUTES_THRESHOLD].copy()
    survived_filter_count = len(df_filtered)
    print(f"[INFO] Applied Min >= {MINUTES_THRESHOLD} filter: {survived_filter_count} players survived.")

    # 4. EXACT POSITION GROUP MAPPING
    df_filtered['position_group'] = df_filtered['Pos'].apply(map_exact_position_group)
    pos_counts = df_filtered['position_group'].value_counts()
    print("[INFO] Position group breakdown:")
    for grp, cnt in pos_counts.items():
        print(f"  - {grp}: {cnt} players")
    
    # Assertion: Ensure every position group has > 0 players
    assert (pos_counts > 0).all(), "CRITICAL BUG: A position group has zero assigned players!"
    assert 'Goalkeeper' not in pos_counts, "CRITICAL BUG: Goalkeeper found in outfield position groups!"

    # 5. PER-90 METRICS CALCULATION
    df_filtered['npxG_per90'] = ((df_filtered['npxG'] / df_filtered['Min']) * 90).round(3)
    df_filtered['xAG_per90'] = ((df_filtered['xAG'] / df_filtered['Min']) * 90).round(3)
    df_filtered['KP_per90'] = ((df_filtered['KP'] / df_filtered['Min']) * 90).round(3)
    df_filtered['PrgP_per90'] = ((df_filtered['PrgP'] / df_filtered['Min']) * 90).round(3)
    df_filtered['PrgC_per90'] = ((df_filtered['PrgC'] / df_filtered['Min']) * 90).round(3)
    df_filtered['Tkl_per90'] = ((df_filtered['Tkl'] / df_filtered['Min']) * 90).round(3)
    df_filtered['Int_per90'] = ((df_filtered['Int'] / df_filtered['Min']) * 90).round(3)
    df_filtered['Succ_per90'] = ((df_filtered['Succ'] / df_filtered['Min']) * 90).round(3)

    # 6. PERCENTILES COMPUTED WITHIN EACH POSITION GROUP
    for col in FBREF_FEATURE_COLUMNS:
        df_filtered[f"{col}_pct"] = (
            df_filtered.groupby('position_group')[col]
            .rank(pct=True) * 100
        ).round(1)

    # Assign clean unique player_id
    df_filtered['player_id'] = df_filtered.apply(
        lambda r: slugify_id(r['Player'], str(r['Nation']), str(r['Born'])), axis=1
    )
    df_filtered['player_name'] = df_filtered['Player']
    df_filtered['minutes_played'] = df_filtered['Min']

    output_path = os.path.join(raw_dir, "fbref_cleaned_players.csv")
    df_filtered.to_csv(output_path, index=False)
    print(f"[SUCCESS] Cleaned 2024-2025 FBref dataset saved to {output_path} ({len(df_filtered)} players)")
    return df_filtered

if __name__ == "__main__":
    raw_directory = os.path.normpath(os.path.join(os.path.dirname(__file__), "raw"))
    process_fbref_dataset(raw_directory)
