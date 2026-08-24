# ADR-002: Principal Component Analysis (PCA) for 8D Tactical Pitch Projection

## Status
Accepted

## Date
2026-08-25

## Context
Our 1,802-player feature space contains 8 continuous per-90 metrics representing attacking threat, progression, chance creation, take-ons, and defensive contributions. Scouts need an intuitive 2D spatial overview of European football to spot tactical clusters, stylistic outliers, and player progression without reading tables of numbers.

## Decision
Apply Principal Component Analysis (PCA) to project the 8-dimensional standardized metric space onto 2 principal orthogonal axes ($PC_1, PC_2$) mapped directly to a football pitch coordinate system:
- **X-Axis ($PC_1$)**: *Attacking Threat & Progression vs Defensive Volume*
- **Y-Axis ($PC_2$)**: *Wide Play & Dribbling vs Central Ball Circulation*

## Alternatives Considered

### t-SNE (t-Distributed Stochastic Neighbor Embedding)
- **Pros**: Excellent at separating dense local clusters in high dimensions.
- **Cons**: Non-deterministic (different coordinates per run), does not preserve global distances or axis interpretability, cannot project new unseen players without re-fitting the entire dataset.
- **Rejected**: Global distance comparisons and deterministic coordinates are essential for a stable scouting tool.

### UMAP (Uniform Manifold Approximation and Projection)
- **Pros**: Preserves more global structure than t-SNE.
- **Cons**: Non-linear distortions make pitch axes arbitrary and harder to interpret in tactical viva explanations.
- **Rejected**: Linear PCA axes provide straightforward interpretability ($PC_1$ progression vs $PC_2$ chance creation).

## Consequences
- Preserves $\approx 55–65\%$ of total variance across the top 2 orthogonal eigenvectors.
- Coordinates $(x, y)$ are static, deterministic, and mapped directly onto the interactive SVG Football Pitch Map.
- Enables live quadrant-based filtering (e.g. High Progression Attacking Wingers in Upper Right Quadrant).
