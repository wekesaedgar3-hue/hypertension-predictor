import db from "../config/database.js";
import axios from "axios";

const { Alert } = db;

// -------------------- ALERT CONTROLLERS --------------------

// Create a new alert
export const createAlert = async (req, res) => {
  try {
    const { patient_id, reading_id, level, code, message } = req.body;

    if (!patient_id || !level || !message) {
      return res.status(400).json({ error: "Patient, level, and message are required" });
    }

    const alert = await Alert.create({
      patient_id,
      reading_id,
      level,
      code,
      message,
    });

    res.status(201).json({ message: "Alert created successfully", alert });
  } catch (error) {
    console.error("❌ Alert creation error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get alerts for a patient
export const getPatientAlerts = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const alerts = await Alert.findAll({ where: { patient_id } });
    res.status(200).json(alerts);
  } catch (error) {
    console.error("❌ Fetch alerts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark alert as resolved
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Alert.update({ resolved: true }, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Alert not found" });
    res.status(200).json({ message: "Alert resolved successfully" });
  } catch (error) {
    console.error("❌ Resolve alert error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- AI HYPERTENSION RISK --------------------

// Send patient data to Flask AI API for risk prediction
export const analyzeHypertensionRisk = async (req, res) => {
  try {
    const { sbp, dbp, heart_rate, bmi, age, sex, smoking, diabetes, cholesterol } = req.body;

    if (!sbp || !dbp || !heart_rate || !bmi || !age || !sex) {
      return res.status(400).json({ error: "Missing required health parameters" });
    }

    const response = await axios.post("http://127.0.0.1:8000/predict", {
      sbp,
      dbp,
      heart_rate,
      bmi,
      age,
      sex,
      smoking,
      diabetes,
      cholesterol
    });

    res.status(200).json({
      message: "Prediction received successfully",
      prediction: response.data.prediction
    });
  } catch (error) {
    console.error("❌ AI Prediction Error:", error.message);
    res.status(500).json({ error: "Error connecting to AI service" });
  }
};
