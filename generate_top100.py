import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('backend/data/processed/players_processed.csv')
feature_cols = [c for c in df.columns if c.endswith('_scaled')]
X = df[feature_cols].values
sim_matrix = cosine_similarity(X)

# Select top 100 star players (combining famous star list + top performers across positions)
star_ids = [
    "erling_haaland_no_nor_2000_0", "bukayo_saka_eng_eng_2001_0", "jude_bellingham_eng_eng_2003_0",
    "lamine_yamal_es_esp_2007_0", "achraf_hakimi_ma_mar_1998_0", "vinicius_j_nior_br_bra_2000_0",
    "kylian_mbapp__fr_fra_1998_0", "pedri_es_esp_2002_0", "florian_wirtz_de_ger_2003_0",
    "cole_palmer_eng_eng_2002_0", "martin__degaard_no_nor_1998_0", "gabriel_martinelli_br_bra_2001_0",
    "lautaro_mart_nez_ar_arg_1997_0", "alexis_mac_allister_ar_arg_1998_0", "bruno_guimar_es_br_bra_1997_0",
    "william_saliba_fr_fra_2001_0", "jo_ko_gvardiol_hr_cro_2002_0", "enzo_fern_ndez_ar_arg_2001_0",
    "virgil_van_dijk_nl_ned_1991_0", "declan_rice_eng_eng_1999_0", "jamal_musiala_de_ger_2003_0",
    "nico_williams_es_esp_2002_0", "kobbie_mainoo_eng_eng_2005_0", "khvicha_kvaratskhelia_ge_geo_2001_0",
    "rafael_le_o_pt_por_1999_0", "antoine_griezmann_fr_fra_1991_0"
]

selected_rows = []
seen = set()

# Add priority stars first
for sid in star_ids:
    sub = df[df['player_id'] == sid]
    if not sub.empty:
        selected_rows.append(sub.iloc[0])
        seen.add(sid)

# Add remaining top players ordered by minutes played
remaining = df.sort_values(by='minutes_played', ascending=False)
for idx, r in remaining.iterrows():
    if len(selected_rows) >= 100:
        break
    if r['player_id'] not in seen:
        selected_rows.append(r)
        seen.add(r['player_id'])

top_df = pd.DataFrame(selected_rows)

out_lines = []
out_lines.append("# Top 100 Premier Footballers & Similar Player Matches\n")
out_lines.append("Here is the curated list of 100 key players from the dataset along with their position, club, age, style archetype, and **3 top tactical equivalents** (computed using 8D cosine similarity in feature space):\n")
out_lines.append("| # | Player Name | Squad | Position | Age | Cluster Archetype | Similar Players (Tactical Equivalents) |")
out_lines.append("|---|-------------|-------|----------|-----|-------------------|---------------------------------------|")

for i, (idx, row) in enumerate(top_df.iterrows(), 1):
    orig_idx = df.index[df['player_id'] == row['player_id']][0]
    sims = sim_matrix[orig_idx]
    top_sim_indices = np.argsort(sims)[::-1]
    
    # Exclude self
    sim_names = [df.iloc[j]['player_name'] for j in top_sim_indices if df.iloc[j]['player_id'] != row['player_id']][:3]
    sim_str = ", ".join(sim_names)
    
    age_str = str(int(row['Age'])) if pd.notnull(row['Age']) else 'N/A'
    squad_str = str(row['Squad'])
    cluster_str = str(row['cluster_name'])
    
    out_lines.append(f"| {i} | **{row['player_name']}** | {squad_str} | {row['position_group']} | {age_str} | {cluster_str} | {sim_str} |")

md_content = "\n".join(out_lines)

with open('TOP_100_PLAYERS.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print(f"Successfully generated TOP_100_PLAYERS.md with {len(top_df)} players!")
