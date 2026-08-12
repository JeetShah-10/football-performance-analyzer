import pandas as pd
import json
import numpy as np

def soften_probabilities(csv_path, T=5.0):
    df = pd.read_csv(csv_path)
    
    for idx, row in df.iterrows():
        try:
            d = json.loads(row['gmm_probabilities_json'])
            # Add a small epsilon to avoid log(0)
            vals = np.array(list(d.values())) + 1e-9
            
            # Apply temperature scaling
            log_vals = np.log(vals) / T
            # Softmax
            p_T = np.exp(log_vals)
            p_T = p_T / np.sum(p_T)
            
            softened_dict = {k: round(float(v), 4) for k, v in zip(d.keys(), p_T)}
            df.at[idx, 'gmm_probabilities_json'] = json.dumps(softened_dict)
        except Exception as e:
            print(f"Error at row {idx}: {e}")
            continue

    df.to_csv(csv_path, index=False)
    print(f"Successfully softened GMM probabilities in {csv_path} with Temperature T={T}")

if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(__file__)
    csv_path = os.path.normpath(os.path.join(base_dir, "..", "data", "processed", "players_processed.csv"))
    soften_probabilities(csv_path, T=5.0)
