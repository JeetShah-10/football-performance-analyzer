# Data Science Lead Rules (Member 1)

## Scope
- Focus Area: `notebooks/`, `backend/clustering/`
- Branch: `feature/ds-pipeline`

## Guidelines for Antigravity AI
- **Explainability**: Always generate EDA notebooks with Markdown commentary explaining why specific outlier filtering thresholds were chosen (e.g. `minutes >= 450`).
- **Feature Scaling**: Ensure `StandardScaler` is applied before running K-Means or PCA.
- **Validation**: Include both Elbow (Inertia) and Silhouette Score plots before selecting *k*.
- **Artifact Export**: Export fitted model, scaler, and nearest-neighbor engine to `backend/data/processed/model.pkl` adhering to [Collaboration Contract](collaboration-contract.md).
