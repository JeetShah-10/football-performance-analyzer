# Backend Rules (FastAPI / FAI)

## Tech Constraints (Ponytail Mode)
- **Thin Layer**: The FastAPI app exists ONLY to serve pre-calculated data. No heavy calculations should happen on request.
- **Offline Clustering**: The `train_model.py` runs *offline* to process data and save `.pkl` files. 
- **Response Models**: All FastAPI endpoints MUST use strict Pydantic response models (`response_model`).
- **Dependencies**: Restrict heavy imports (like scikit-learn) strictly to where they are needed, though in this case they are required for `NearestNeighbors` similarity inference. 

## Data Validation
- Ensure 404s are correctly raised for non-existent players or clusters.
- All per-90 metrics used in training must be clearly documented.
