import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from backend.clustering.preprocess import FBREF_FEATURE_COLUMNS

def train_and_evaluate_position_classifiers():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.normpath(os.path.join(base_dir, "..", "data", "processed", "players_processed.csv"))
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Processed dataset not found at {data_path}")

    print(f"[INFO] Reading processed dataset: {data_path}")
    df = pd.read_csv(data_path)

    # Features and Target
    scaled_feature_cols = [f"{col}_scaled" for col in FBREF_FEATURE_COLUMNS]
    X = df[scaled_feature_cols].values
    y = df['position_group'].values
    classes = sorted(list(set(y))) # ['Defender', 'Forward', 'Midfielder']

    # Stratified 80/20 Train/Test Split
    X_train, X_test, y_train, y_test, idx_train, idx_test = train_test_split(
        X, y, df.index, test_size=0.20, random_state=42, stratify=y
    )

    print(f"[INFO] Dataset split: Train={len(X_train)} players, Test={len(X_test)} players.")

    # 1. Logistic Regression Model
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train, y_train)
    lr_pred = lr_model.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_pred)
    lr_cm = confusion_matrix(y_test, lr_pred, labels=classes)
    lr_report = classification_report(y_test, lr_pred, labels=classes, output_dict=True)

    # 2. Random Forest Model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)
    rf_cm = confusion_matrix(y_test, rf_pred, labels=classes)
    rf_report = classification_report(y_test, rf_pred, labels=classes, output_dict=True)

    # Select best model
    best_model_name = "RandomForest" if rf_acc >= lr_acc else "LogisticRegression"
    best_model = rf_model if best_model_name == "RandomForest" else lr_model
    best_pred = rf_pred if best_model_name == "RandomForest" else lr_pred

    # Identify Boundary Misclassifications for Cluster Cross-Check
    df_test = df.iloc[idx_test].copy()
    df_test['predicted_position'] = best_pred
    misclassified = df_test[df_test['position_group'] != df_test['predicted_position']]

    misclassified_examples = []
    for _, row in misclassified.head(5).iterrows():
        misclassified_examples.append({
            "player_id": row['player_id'],
            "player_name": row['player_name'],
            "actual_position_group": row['position_group'],
            "predicted_position_group": row['predicted_position'],
            "cluster_name": row['cluster_name'],
            "pca_x": float(row['pca_x']),
            "pca_y": float(row['pca_y']),
            "minutes_played": int(row['minutes_played']),
            "explanation": f"Sits near the {row['position_group']}/{row['predicted_position']} positional boundary in 8D metric space."
        })

    # Assemble JSON report
    report_data = {
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "classes": classes,
        "models": {
            "LogisticRegression": {
                "accuracy": round(float(lr_acc), 4),
                "confusion_matrix": lr_cm.tolist(),
                "classification_report": lr_report
            },
            "RandomForest": {
                "accuracy": round(float(rf_acc), 4),
                "confusion_matrix": rf_cm.tolist(),
                "classification_report": rf_report
            }
        },
        "chosen_model": best_model_name,
        "boundary_misclassifications": misclassified_examples
    }

    # Save JSON report
    json_path = os.path.join(base_dir, "position_classifier_report.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"[SUCCESS] Saved position classifier report to {json_path}")

    # Save fitted model artifact
    pkl_path = os.path.join(base_dir, "position_classifier.pkl")
    joblib.dump({"model": best_model, "classes": classes, "feature_cols": scaled_feature_cols}, pkl_path)
    print(f"[SUCCESS] Saved fitted position classifier model to {pkl_path}")

    return report_data

if __name__ == "__main__":
    train_and_evaluate_position_classifiers()
