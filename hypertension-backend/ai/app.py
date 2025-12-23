import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import AI Blueprint
from medical_agent import ai_bp  # Agentic AI chat blueprint

# Load environment variables
load_dotenv()

# --- Create Flask app ---
app = Flask(__name__)
CORS(app)

# --- Register AI Chat Blueprint ---
app.register_blueprint(ai_bp, url_prefix="/api/ai")

# --- Home route ---
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hypertension Risk Prediction API is running 🚀"})

# --- Predict route (POST) ---
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Get inputs with defaults
    sbp = data.get("sbp", 120)
    dbp = data.get("dbp", 80)
    hr = data.get("hr", 70)
    age = data.get("age", 40)
    weight = data.get("weight", 70)
    height = data.get("height", 170)
    smoking = data.get("smoking", False)
    diabetes = data.get("diabetes", False)
    cholesterol = data.get("cholesterol", 200)
    medication_adherence = data.get("medication_adherence", 90)
    activity_level = data.get("activity_level", 3)
    sodium_intake = data.get("sodium_intake", 2000)

    # Input validation
    if height <= 0 or weight <= 0:
        return jsonify({"error": "Height and weight must be greater than 0"}), 400

    # BMI calculation
    bmi = weight / ((height / 100) ** 2)

    # Risk calculation
    risk = 0.05
    risk += max(0, (sbp - 120) * 0.004)
    risk += max(0, (dbp - 80) * 0.005)
    risk += max(0, (hr - 70) * 0.002)
    risk += max(0, (age - 40) * 0.003)
    risk += max(0, (bmi - 25) * 0.01)
    if not medication_adherence or medication_adherence < 50:
        risk += 0.1
    if activity_level <= 2:
        risk += 0.05
    if smoking:
        risk += 0.1
    if diabetes:
        risk += 0.1
    if cholesterol > 200:
        risk += 0.05
    if sodium_intake > 2300:
        risk += 0.03
    risk = min(max(risk, 0), 1)

    return jsonify({"risk": round(risk * 100, 1)})

# --- GET route for testing ---
@app.route("/predict", methods=["GET"])
def predict_get():
    return jsonify({"message": "Use POST with JSON to get prediction"}), 200

# --- Run Flask app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
