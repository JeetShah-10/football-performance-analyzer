# ⚽ Comprehensive Viva & Dataset Analysis Guide: Kaggle Transfermarkt `davidcariboo/player-scores`

**Target Presenter:** Jeet Shah (Data Science & ML Lead)  
**Subject:** FAI (Foundations of AI & ML) Viva Submission & Technical Presentation  
**Dataset Source:** [Kaggle - Football Data from Transfermarkt (`davidcariboo/player-scores`)](https://www.kaggle.com/datasets/davidcariboo/player-scores)

---

## 1. Executive Overview & Dataset Schema Architecture

The **Kaggle `davidcariboo/player-scores`** dataset is a relational, multi-table database scraped from Transfermarkt. It contains historical and active player profiles, match appearances, club details, competitions, transfers, and valuation history across top European leagues.

### 📊 Relational ER Schema & Table Specifications

```
                     ┌──────────────────┐
                     │   competitions   │
                     │  PK: competition_id │
                     └────────┬─────────┘
                              │ 1:N
                     ┌────────▼─────────┐
                     │      clubs       │
                     │   PK: club_id    │
                     └────────┬─────────┘
                              │ 1:N
                     ┌────────▼─────────┐         ┌────────────────────────┐
                     │     players      │─────────┤   player_valuations    │
                     │   PK: player_id  │ 1:N     │ PK: (player_id, date) │
                     └────────┬─────────┘         └────────────────────────┘
                              │ 1:N
                     ┌────────▼─────────┐
                     │   appearances    │
                     │ PK: appearance_id│
                     └────────┬─────────┘
                              │ N:1
                     ┌────────▼─────────┐
                     │      games       │
                     │   PK: game_id    │
                     └──────────────────┘
```

#### Detailed Table Schemas & Key Constraints

| Table Name | Primary Key (PK) | Foreign Keys (FK) | Core Attributes / Schema |
| :--- | :--- | :--- | :--- |
| **`players.csv`** | `player_id` | `current_club_id` $\rightarrow$ `clubs.club_id`, `current_club_domestic_competition_id` $\rightarrow$ `competitions.competition_id` | `player_id`, `first_name`, `last_name`, `name`, `last_season`, `current_club_id`, `player_code`, `country_of_birth`, `city_of_birth`, `country_of_citizenship`, `date_of_birth`, `position`, `sub_position`, `foot`, `height_in_cm`, `market_value_in_eur`, `highest_market_value_in_eur`, `current_club_name`, `url` |
| **`appearances.csv`** | `appearance_id` | `game_id` $\rightarrow$ `games.game_id`, `player_id` $\rightarrow$ `players.player_id`, `player_club_id` $\rightarrow$ `clubs.club_id`, `player_current_club_id` $\rightarrow$ `clubs.club_id` | `appearance_id`, `game_id`, `player_id`, `player_club_id`, `player_current_club_id`, `date`, `player_name`, `competition_id`, `yellow_cards`, `red_cards`, `goals`, `assists`, `minutes_played` |
| **`clubs.csv`** | `club_id` | `domestic_competition_id` $\rightarrow$ `competitions.competition_id` | `club_id`, `club_code`, `name`, `domestic_competition_id`, `total_market_value`, `squad_size`, `average_age`, `foreigners_number`, `foreigners_percentage`, `national_team_players`, `stadium_name`, `stadium_seats`, `net_transfer_record`, `coach_name`, `last_season`, `url` |
| **`competitions.csv`** | `competition_id` | N/A | `competition_id`, `competition_code`, `name`, `sub_type`, `type`, `country_id`, `country_name`, `domestic_league_code`, `confederation`, `url` |
| **`games.csv`** | `game_id` | `competition_id` $\rightarrow$ `competitions.competition_id`, `home_club_id` $\rightarrow$ `clubs.club_id`, `away_club_id` $\rightarrow$ `clubs.club_id` | `game_id`, `competition_id`, `season`, `round`, `date`, `home_club_id`, `away_club_id`, `home_club_goals`, `away_club_goals`, `home_club_position`, `away_club_position`, `stadium`, `attendance`, `referee`, `url` |
| **`player_valuations.csv`** | Composite: `(player_id, date)` | `player_id` $\rightarrow$ `players.player_id`, `current_club_id` $\rightarrow$ `clubs.club_id` | `player_id`, `date`, `market_value_in_eur`, `current_club_id`, `player_club_domestic_competition_id` |

---

## 2. Step-by-Step Data Pipeline Implementation

### Step 1: Aggregation & Relational Joins
Because `appearances.csv` records individual match events (1 row per player per game), we must aggregate performance statistics at the player level before joining with metadata.

```python
import pandas as pd
import numpy as np

# 1. Load Raw CSV Files
players_df = pd.read_csv("backend/data/raw/players.csv")
appearances_df = pd.read_csv("backend/data/raw/appearances.csv")
clubs_df = pd.read_csv("backend/data/raw/clubs.csv")

# 2. Aggregate Match Statistics per Player
stats_agg = appearances_df.groupby('player_id').agg({
    'minutes_played': 'sum',
    'goals': 'sum',
    'assists': 'sum',
    'yellow_cards': 'sum',
    'red_cards': 'sum'
}).reset_index()

# 3. Inner Join Aggregated Stats with Player Profiles on `player_id`
merged = pd.merge(players_df, stats_agg, on='player_id', how='inner')

# 4. Join with Clubs Data to fetch official squad & competition names
merged = pd.merge(
    merged, 
    clubs_df[['club_id', 'name', 'domestic_competition_id']], 
    left_on='current_club_id', 
    right_on='club_id', 
    how='left'
)
```

---

### Step 2: Data Cleaning & Low-Minutes Thresholding

#### Handling Missing / Null Values
* Categorical fallbacks: Missing `sub_position` is filled with primary `position`. Missing club names fallback to `'Free Agent'`. Missing league codes fallback to `'Other'`.
* Numerical stability: Zero-fill missing statistical attributes.

#### Minute Thresholding ($\ge 450$ minutes)
* **Statistical Justification:** Small-sample size distorts per-90 metrics. A player who scores 1 goal in a 10-minute substitute appearance yields $9.0\text{ goals/90}$, creating extreme false positive outliers.
* Setting a minimum threshold of **450 minutes** (equivalent to 5 full 90-minute matches) filters out fringe/youth substitutes while retaining statistically stable first-team profiles.

```python
MINUTES_THRESHOLD = 450

# Filter low-minute outliers
df_filtered = merged[merged['minutes_played'] >= MINUTES_THRESHOLD].copy()

# Handle Categorical Missing Data
df_filtered['sub_position'] = df_filtered['sub_position'].fillna(df_filtered['position'])
df_filtered['squad'] = df_filtered['name_y'].fillna('Free Agent')
```

---

### Step 3: Per-90 Metric Engineering

Raw total statistics favor players who accumulate more playing time. To evaluate tactical style independently of total minutes played, metrics must be normalized per 90 minutes of gameplay.

$$\text{Metric}_{\text{per90}} = \left( \frac{\text{Total Metric}}{\text{Total Minutes Played}} \right) \times 90$$

#### Feature Selection Matrix for Clustering:
1. `goals_per90` - Finishing ability & goal threat
2. `assists_per90` - Direct goal creation
3. `shots_per90` - Shooting volume & offensive ambition
4. `key_passes_per90` - Chance creation & playmaking vision
5. `tackles_per90` - Defensive engagement & pressing
6. `interceptions_per90` - Defensive reading & positioning
7. `progressive_passes_per90` - Ball progression & transition speed
8. `successful_dribbles_per90` - 1v1 take-on capability & carrying flair

```python
FEATURE_COLUMNS = [
    'goals_per90', 'assists_per90', 'shots_per90', 'key_passes_per90',
    'tackles_per90', 'interceptions_per90', 'progressive_passes_per90', 'successful_dribbles_per90'
]

# Calculate per-90 metrics
df_filtered['goals_per90'] = (df_filtered['goals'] / df_filtered['minutes_played']) * 90
df_filtered['assists_per90'] = (df_filtered['assists'] / df_filtered['minutes_played']) * 90
df_filtered['shots_per90'] = (df_filtered['shots'] / df_filtered['minutes_played']) * 90
df_filtered['key_passes_per90'] = (df_filtered['key_passes'] / df_filtered['minutes_played']) * 90
df_filtered['tackles_per90'] = (df_filtered['tackles'] / df_filtered['minutes_played']) * 90
df_filtered['interceptions_per90'] = (df_filtered['interceptions'] / df_filtered['minutes_played']) * 90
df_filtered['progressive_passes_per90'] = (df_filtered['progressive_passes'] / df_filtered['minutes_played']) * 90
df_filtered['successful_dribbles_per90'] = (df_filtered['successful_dribbles'] / df_filtered['minutes_played']) * 90
```

---

### Step 4: Feature Scaling with `StandardScaler`

K-Means relies on distance calculations (Euclidean space). Because raw per-90 values operate on different scales (e.g., `shots_per90` ranges 0-5 while `goals_per90` ranges 0-1), unscaled features with larger variance would dominate distance computations.

Using $Z$-score standardization ($StandardScaler$), every feature is rescaled to zero mean ($\mu = 0$) and unit variance ($\sigma = 1$):

$$Z = \frac{X - \mu}{\sigma}$$

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
scaled_features = scaler.fit_transform(df_filtered[FEATURE_COLUMNS])

# Create feature matrix dataframe
scaled_cols = [f"{col}_scaled" for col in FEATURE_COLUMNS]
X_scaled = pd.DataFrame(scaled_features, columns=scaled_cols, index=df_filtered.index)
```

---

### Step 5: Unsupervised K-Means Clustering ($k=4$) & Silhouette Validation

#### Model Fitting & Centroid Archetypes ($k=4$)
We initialize `KMeans(n_clusters=4, random_state=42, n_init=10)` to partition players into 4 fundamental tactical archetypes:

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
cluster_labels = kmeans.fit_predict(X_scaled)

ARCHETYPE_LABELS = {
    0: "Clinical Poacher / Goalscorer",
    1: "Creative Playmaker",
    2: "Ball-Winning Destroyer",
    3: "Dynamic Winger / Dribbler"
}

df_filtered['cluster_id'] = cluster_labels
df_filtered['cluster_name'] = df_filtered['cluster_id'].map(ARCHETYPE_LABELS)

# Silhouette Evaluation
sil_score = silhouette_score(X_scaled, cluster_labels)
print(f"Model Silhouette Score (k=4): {sil_score:.4f}")
```

#### Silhouette Coefficient Formulation for Defense
The Silhouette score $S_i$ measures cohesion within a cluster versus separation from neighboring clusters:

$$a(i) = \frac{1}{|C_I|-1} \sum_{j \in C_I, i \neq j} d(i, j) \quad \text{(mean intra-cluster distance)}$$
$$b(i) = \min_{J \neq I} \frac{1}{|C_J|} \sum_{j \in C_J} d(i, j) \quad \text{(mean nearest-cluster distance)}$$
$$S(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}, \quad S(i) \in [-1, 1]$$

---

### Step 6: Scout Replacement Engine (`NearestNeighbors`)

To build an interactive player similarity recommendation engine, we train `NearestNeighbors` in the full 8-dimensional scaled feature space using **Cosine Distance**.

#### Why Cosine Distance over Euclidean Distance?
Cosine distance measures the **angle** between feature vectors rather than magnitude, focusing on statistical profile similarity (style/ratio of actions) rather than raw volume differences.

$$d_{\text{cosine}}(u, v) = 1 - \frac{u \cdot v}{\|u\|_2 \|v\|_2}$$

```python
from sklearn.neighbors import NearestNeighbors

# Fit NearestNeighbors in 8D scaled feature space
nn_model = NearestNeighbors(n_neighbors=6, metric='cosine')
nn_model.fit(X_scaled)

def get_similar_players(player_id, n_neighbors=5):
    idx = df_filtered[df_filtered['player_id'] == player_id].index[0]
    player_vector = X_scaled.loc[idx].values.reshape(1, -1)
    
    distances, indices = nn_model.kneighbors(player_vector, n_neighbors=n_neighbors + 1)
    
    # Exclude target player themselves (index 0)
    match_indices = indices[0][1:]
    match_distances = distances[0][1:]
    
    similar_df = df_filtered.iloc[match_indices].copy()
    similar_df['similarity_score'] = (1 - match_distances).round(4)
    return similar_df[['player_id', 'player_name', 'squad', 'cluster_name', 'similarity_score']]
```

---

## 3. High-Frequency Viva Questions & Defense Strategy

| Viva Question | Concise Model Defense Response |
| :--- | :--- |
| **Q1: Why did you aggregate `appearances.csv` instead of using `players.csv` directly?** | "`players.csv` only contains static player attributes. `appearances.csv` holds per-match stats (goals, assists, minutes). Aggregating `appearances.csv` by `player_id` provides accurate career/season aggregate metrics needed for per-90 calculation." |
| **Q2: Why filter players at $\ge 450$ minutes played?** | "To eliminate small-sample noise. A substitute playing 10 minutes who scores 1 goal yields $9.0\text{ goals/90}$, severely distorting cluster boundaries. 450 minutes (5 full games) establishes statistical stability." |
| **Q3: Why standardise features using `StandardScaler`?** | "K-Means measures Euclidean distance. Without standardization, high-magnitude features (e.g. 50 tackles vs 2 goals) dominate the distance metric. `StandardScaler` normalizes all features to $\mu=0, \sigma=1$." |
| **Q4: Why choose $k=4$ for K-Means?** | "$k=4$ aligns with both the mathematical Silhouette score elbow and domain tactical archetypes: Goalscorers, Playmakers, Destroyers, and Dribblers." |
| **Q5: Why perform similarity search in 8D space instead of 2D PCA space?** | "PCA compresses data to 2D strictly for visual rendering, discarding variance. NearestNeighbors in 8D scaled feature space maintains full statistical fidelity for accurate scouting recommendations." |

---

### Artifact Export Summary
The ML pipeline exports:
1. `players_processed.csv` (Filtered, engineered per-90 & scaled stats + cluster assignments + PCA coordinates).
2. `model.pkl` (Serialized dictionary containing `scaler`, `kmeans`, `pca`, `nn_model`, and `archetypes`).
