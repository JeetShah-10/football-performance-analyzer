import os
import json
import joblib
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 80+ Labeled Training Dataset across 4 Intent Classes
INTENT_DATASET = [
    # --- FIND_SIMILAR (22 examples) ---
    ("find players like bukayo saka", "find_similar"),
    ("who plays similarly to virgil van dijk", "find_similar"),
    ("show me replacements for martin odegaard", "find_similar"),
    ("players like mohamed salah", "find_similar"),
    ("find tactical matches for erling haaland", "find_similar"),
    ("who is similar to declan rice", "find_similar"),
    ("who plays like alexander arnold", "find_similar"),
    ("replacement candidates for rodri", "find_similar"),
    ("give me similar players to jude bellingham", "find_similar"),
    ("who resembles vinicius junior in playing style", "find_similar"),
    ("find a replacement for william saliba", "find_similar"),
    ("scout alternatives to lautaro martinez", "find_similar"),
    ("players with identical stats to harry kane", "find_similar"),
    ("who is the next kvaratskhelia", "find_similar"),
    ("find players like florian wirtz", "find_similar"),
    ("give me tactical alternatives for cole palmer", "find_similar"),
    ("similar players to jamal musiala", "find_similar"),
    ("who plays like pedagogy gavi", "find_similar"),
    ("find matches for bruno fernandes", "find_similar"),
    ("replacements for son heung min", "find_similar"),
    ("players resembling nico williams", "find_similar"),
    ("scout replacements for ryan gravenberch", "find_similar"),

    # --- FIND_BY_CRITERIA (22 examples) ---
    ("young ball playing defenders under 21", "find_by_criteria"),
    ("find u21 midfielders with high key passes", "find_by_criteria"),
    ("show me premier league wingers under 23", "find_by_criteria"),
    ("search for defenders in la liga with high tackles", "find_by_criteria"),
    ("young forwards under 22 in serie a", "find_by_criteria"),
    ("find defensive destroyers under 21", "find_by_criteria"),
    ("show strikers with high expected goals", "find_by_criteria"),
    ("u21 players in bundesliga with high progressive carries", "find_by_criteria"),
    ("find midfielders with high interceptions under 20", "find_by_criteria"),
    ("search for clinical finishers in ligue 1", "find_by_criteria"),
    ("young deep lying playmakers under 23", "find_by_criteria"),
    ("show me fullbacks with high progressive passes", "find_by_criteria"),
    ("u21 wingers with high successful take-ons", "find_by_criteria"),
    ("find box to box midfielders in premier league", "find_by_criteria"),
    ("young stoppers under 22 years old", "find_by_criteria"),
    ("show attackers with high npxg per 90", "find_by_criteria"),
    ("u21 defenders with high aerial wins and tackles", "find_by_criteria"),
    ("search for dynamic wingers under 20", "find_by_criteria"),
    ("find defensive midfielders with high pass volume", "find_by_criteria"),
    ("show me u21 prospects in top 5 leagues", "find_by_criteria"),
    ("search for creative playmakers under 22", "find_by_criteria"),
    ("young central defenders under 21 in la liga", "find_by_criteria"),

    # --- EXPLAIN_PLAYER (20 examples) ---
    ("tell me about van dijk's style", "explain_player"),
    ("explain bukayo saka tactical archetype", "explain_player"),
    ("what is martin odegaard's playing style", "explain_player"),
    ("analyze rodri's statistical profile", "explain_player"),
    ("tell me about mohamed salah", "explain_player"),
    ("what type of player is erling haaland", "explain_player"),
    ("break down jude bellingham's stats", "explain_player"),
    ("explain declan rice's percentile ranks", "explain_player"),
    ("tell me about florian wirtz's strengths", "explain_player"),
    ("what is ryan gravenberch's tactical role", "explain_player"),
    ("explain vinicius jr playing style", "explain_player"),
    ("analyze harry kane's per 90 stats", "explain_player"),
    ("tell me about william saliba's defensive profile", "explain_player"),
    ("what archetype does cole palmer belong to", "explain_player"),
    ("break down jamal musiala's percentile chart", "explain_player"),
    ("explain son heung min's stats and cluster", "explain_player"),
    ("tell me about nico williams's style", "explain_player"),
    ("analyze lautaro martinez's metric profile", "explain_player"),
    ("what type of defender is gabriel magalhaes", "explain_player"),
    ("explain alexander arnold's statistical strengths", "explain_player"),

    # --- COMPARE_PLAYERS (20 examples) ---
    ("compare saka and mbeumo", "compare_players"),
    ("compare virgil van dijk and william saliba", "compare_players"),
    ("h2h comparison between odegaard and bellingham", "compare_players"),
    ("compare haaland and kane", "compare_players"),
    ("side by side comparison of rodri and rice", "compare_players"),
    ("compare florian wirtz and jamal musiala", "compare_players"),
    ("how does saka compare to vinicius jr", "compare_players"),
    ("compare palmer and foden", "compare_players"),
    ("compare gravenberch and chotard", "compare_players"),
    ("side by side metrics for salah and son", "compare_players"),
    ("compare gabriel magalhaes and van dijk", "compare_players"),
    ("compare nico williams and kvaratskhelia", "compare_players"),
    ("how does odegaard compare to bruno fernandes", "compare_players"),
    ("compare lautaro martinez and haaland", "compare_players"),
    ("compare alexander arnold and kyle walker", "compare_players"),
    ("side by side stats for saliba and konate", "compare_players"),
    ("compare bellingham and foden", "compare_players"),
    ("compare saka and nico williams", "compare_players"),
    ("compare rice and tchouameni", "compare_players"),
    ("compare wirtz and musiala stats", "compare_players")
]

def train_and_evaluate_intent_classifier():
    base_dir = os.path.dirname(__file__)
    
    texts = [item[0] for item in INTENT_DATASET]
    labels = [item[1] for item in INTENT_DATASET]
    classes = sorted(list(set(labels))) # ['compare_players', 'explain_player', 'find_by_criteria', 'find_similar']

    # Stratified 80/20 Train/Test Split
    texts_train, texts_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.20, random_state=42, stratify=labels
    )

    print(f"[INFO] Intent Dataset split: Train={len(texts_train)} samples, Test={len(texts_test)} samples.")

    # Pipeline: TF-IDF + LogisticRegression
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), lowercase=True)),
        ('clf', LogisticRegression(max_iter=1000, random_state=42))
    ])

    pipeline.fit(texts_train, y_train)
    y_pred = pipeline.predict(texts_test)

    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred, labels=classes)
    report = classification_report(y_test, y_pred, labels=classes, output_dict=True)

    report_data = {
        "dataset_size": len(INTENT_DATASET),
        "train_size": len(texts_train),
        "test_size": len(texts_test),
        "classes": classes,
        "accuracy": round(float(acc), 4),
        "confusion_matrix": cm.tolist(),
        "classification_report": report
    }

    # Save JSON report
    json_path = os.path.join(base_dir, "intent_classifier_report.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"[SUCCESS] Saved intent classifier report to {json_path}")

    # Save fitted model pipeline artifact
    pkl_path = os.path.join(base_dir, "intent_classifier.pkl")
    joblib.dump(pipeline, pkl_path)
    print(f"[SUCCESS] Saved fitted intent classifier pipeline to {pkl_path}")

    return report_data

if __name__ == "__main__":
    train_and_evaluate_intent_classifier()
