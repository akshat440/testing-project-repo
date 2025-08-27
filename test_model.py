import pandas as pd
import pickle
import os

# -------------------------------
# Paths
# -------------------------------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
TEST_CSV = os.path.join(PROJECT_ROOT, "fullset_test.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "backend", "models", "trained_model.pkl")
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "predictions.csv")

# -------------------------------
# Imports from src
# -------------------------------
try:
    from src.step1_load_data import load_csv
    from src.step2_kmer_tokenizer import tokenize_sequences
    from src.vectorize import vectorize_features
except ImportError as e:
    print("❌ Import error:", e)
    exit()

# -------------------------------
# Step 1: Load test CSV
# -------------------------------
try:
    df_test = load_csv(TEST_CSV)
    print("✅ Test CSV loaded")
    print("Shape of dataset:", df_test.shape)
except Exception as e:
    print("❌ Error loading test CSV:", e)
    exit()

# -------------------------------
# Step 2: Preprocess sequences
# -------------------------------
# -------------------------------
# Step 2: Detect sequence column automatically
# -------------------------------
try:
    # Heuristic: pick first object/string column that is not 'id' or 'label'
    object_cols = [col for col in df_test.columns if df_test[col].dtype == 'object']
    sequence_column = None
    for col in object_cols:
        if col.lower() not in ['id', 'label']:
            sequence_column = col
            break

    if sequence_column is None:
        # If still not found, show all columns to user
        print("❌ Cannot automatically detect sequence column. Available columns:", df_test.columns.tolist())
        raise ValueError("Please check your CSV.")

    print(f"✅ Sequence column detected: '{sequence_column}'")
except Exception as e:
    print("❌ Error detecting sequence column:", e)
    exit()

# -------------------------------
# Step 3: Load trained model
# -------------------------------
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Error loading model:", e)
    exit()

# -------------------------------
# Step 4: Make predictions
# -------------------------------
try:
    y_pred = model.predict(X_test)
    print("✅ Predictions made")
except Exception as e:
    print("❌ Error during prediction:", e)
    exit()

# -------------------------------
# Step 5: Save predictions
# -------------------------------
try:
    df_test['predictions'] = y_pred
    df_test.to_csv(OUTPUT_CSV, index=False)
    print(f"✅ Predictions saved to: {OUTPUT_CSV}")
except Exception as e:
    print("❌ Error saving predictions:", e)