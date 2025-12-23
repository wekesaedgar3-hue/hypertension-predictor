import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# === Load dataset ===
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "hypertension_dataset.csv")

data = pd.read_csv(DATA_PATH)

# === Basic cleaning ===
data = data.dropna()

# === Features & target ===
X = data.drop("hypertension", axis=1)
y = data["hypertension"]

# === Split ===
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === Scaling ===
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# === Train model ===
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train_scaled, y_train)

# === Evaluate ===
acc = model.score(X_test_scaled, y_test)
print(f"✅ Model trained successfully! Accuracy: {acc:.2f}")

# === Save model & scaler ===
MODEL_PATH = os.path.join(os.path.dirname(__file__), "hypertension_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")

with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

with open(SCALER_PATH, "wb") as f:
    pickle.dump(scaler, f)

print(f"💾 Saved model to {MODEL_PATH}")
print(f"💾 Saved scaler to {SCALER_PATH}")
