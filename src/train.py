import argparse
import json
import os
import yaml
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, confusion_matrix
from .vectorize import KmerVectorizer

def build_clf(name: str):
    if name.lower() == "knn":
        return KNeighborsClassifier()
    raise ValueError(f"Unsupported classifier: {name}")

def main(args):
    with open(args.config, "r") as f:
        cfg = yaml.safe_load(f)

    os.makedirs("models", exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    # Load data
    df = pd.read_csv("data/data.csv")  # expects 'sequence' and 'label'
    X_text = df["sequence"].astype(str).tolist()
    y = df["label"].astype(int).values

    # Vectorize
    vec = KmerVectorizer(k=cfg.get("k", 6), **cfg.get("vectorizer", {}))
    X = vec.fit_transform(X_text)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=cfg.get("test_size", 0.2), random_state=cfg.get("random_state", 42), stratify=y
    )

    # Model + grid search
    base = build_clf(cfg.get("clf", {}).get("name", "knn"))
    grid = cfg.get("clf", {}).get("grid", {})
    cv = cfg.get("cv", 10)

    gs = GridSearchCV(base, grid, cv=cv, n_jobs=-1, verbose=1, scoring="f1")
    gs.fit(X_train, y_train)

    y_pred = gs.predict(X_test)
    report = classification_report(y_test, y_pred, output_dict=True)
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Save artifacts
    joblib.dump(gs.best_estimator_, "models/model.joblib")
    joblib.dump(vec, "models/vectorizer.joblib")
    with open("reports/metrics.json", "w") as f:
        json.dump({
            "best_params": gs.best_params_,
            "classification_report": report,
            "confusion_matrix": cm
        }, f, indent=2)

    print("Saved models/model.joblib, models/vectorizer.joblib and reports/metrics.json")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, help="Path to YAML config")
    args = parser.parse_args()
    main(args)
