import os
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
import joblib

class ViralGenomePredictionSystem:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.is_trained = False

    def create_kmers(self, sequence, k=3):
        return [sequence[i:i+k] for i in range(len(sequence)-k+1)]

    def extract_features(self, sequences):
        kmer_sequences = []
        for seq in sequences:
            clean_seq = ''.join([base.upper() for base in seq if base.upper() in 'ATGC'])
            if len(clean_seq) < 3:
                clean_seq = "ATGC" * 10
            kmers = self.create_kmers(clean_seq, k=3)
            kmer_sequences.append(' '.join(kmers))
        if self.vectorizer is None:
            self.vectorizer = CountVectorizer(max_features=5000, token_pattern=r'\b\w+\b')
            X = self.vectorizer.fit_transform(kmer_sequences)
        else:
            X = self.vectorizer.transform(kmer_sequences)
        return X.toarray()

    def train_model(self, csv_file):
        df = pd.read_csv(csv_file)    # 2nd col: sequence, 3rd col: label
        sequences = df.iloc[:, 1].astype(str).tolist()
        labels = df.iloc[:, 2].astype(int).tolist()
        X = self.extract_features(sequences)
        y = np.array(labels)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        self.model = RandomForestClassifier(
            n_estimators=100, random_state=42, n_jobs=-1, max_depth=20, min_samples_split=5
        )
        self.model.fit(X_train, y_train)
        self.is_trained = True

    def predict_sequences(self, sequences):
        if not self.is_trained:
            return None
        X = self.extract_features(sequences)
        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)
        results = []
        for i, (seq, pred, prob) in enumerate(zip(sequences, predictions, probabilities)):
            seq_clean = ''.join([base.upper() for base in seq if base.upper() in 'ATGC'])
            gc = 100 * (seq_clean.count("G") + seq_clean.count("C")) / len(seq_clean) if len(seq_clean) else 0
            at = 100 * (seq_clean.count("A") + seq_clean.count("T")) / len(seq_clean) if len(seq_clean) else 0
            results.append({
                "id": i+1,
                "sequenceId": f"seq_{i+1}",
                "sequence": seq[:50] + "..." if len(seq) > 50 else seq,
                "prediction": "Viral" if int(pred)==1 else "Non-Viral",
                "confidence": round(float(max(prob))*100, 2),
                "viralProbability": round(float(prob[1])*100, 2),
                "modelUsed": "Random Forest",
                "timestamp": datetime.now().isoformat(),
                "features": {
                    "length": len(seq),
                    "gcContent": round(gc, 2),
                    "atContent": round(at, 2)
                }
            })
        return results

    def save_model(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        data = {
            'model': self.model,
            'vectorizer': self.vectorizer,
            'is_trained': self.is_trained
        }
        joblib.dump(data, filepath)

    def load_model(self, filepath):
        data = joblib.load(filepath)
        self.model = data['model']
        self.vectorizer = data['vectorizer']
        self.is_trained = data['is_trained']