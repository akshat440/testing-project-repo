import pandas as pd
import pickle
from backend.rf_training_service import GenomicRandomForestTrainer
import os

print("✅ Script started")

# -------------------------------
# Step 0: Paths
# -------------------------------
TRAIN_CSV = 'backend/fullset_train.csv'
MODEL_DIR = 'backend/models'
MODEL_PATH = os.path.join(MODEL_DIR, 'trained_model.pkl')

# Ensure models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------------------
# Step 1: Load training data
# -------------------------------
try:
    df_train = pd.read_csv(TRAIN_CSV)
    print(f"✅ Training CSV loaded: {TRAIN_CSV}")
except Exception as e:
    print(f"❌ Error loading training CSV: {e}")
    exit()

# Separate features and label
# Replace 'label' with your actual target column name in CSV
target_column = 'label'
X_train = df_train.drop(columns=[target_column], errors='ignore')
y_train = df_train.get(target_column)

# -------------------------------
# Step 2: Initialize trainer
# -------------------------------
try:
    trainer = GenomicRandomForestTrainer()
    print("✅ Trainer initialized")
except Exception as e:
    print(f"❌ Error initializing trainer: {e}")
    exit()

# -------------------------------
# Step 3: Train model
# -------------------------------
try:
    # Save the returned Random Forest object
    trained_model = trainer.train_model(TRAIN_CSV, n_estimators=10)  # smaller n_estimators for quick test
    print("✅ Model trained successfully")
except Exception as e:
    print(f"❌ Error during training: {e}")
    exit()

# -------------------------------
# Step 4: Save trained model properly
# -------------------------------
try:
    with open(MODEL_PATH, 'wb') as f:  # ✅ binary mode
        pickle.dump(trained_model, f)
    print(f"✅ Model saved successfully at: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error saving model: {e}")
    exit()