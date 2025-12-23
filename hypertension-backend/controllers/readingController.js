import db from "../config/database.js";
import axios from "axios";

const { Reading } = db;

// -------------------- READING CONTROLLERS --------------------

// Create a new reading
export const createReading = async (req, res) => {
  try {
    const { patient_id, sbp, dbp, heart_rate, device_id } = req.body;

    if (!patient_id || !sbp || !dbp) {
      return res.status(400).json({ error: "Patient ID, SBP, and DBP are required" });
    }

    const reading = await Reading.create({
      patient_id,
      sbp,
      dbp,
      heart_rate,
      device_id,
    });

    res.status(201).json({ message: "Reading recorded successfully", reading });
  } catch (error) {
    console.error("❌ Create reading error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all readings for a patient
export const getReadingsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const readings = await Reading.findAll({ where: { patient_id } });
    res.status(200).json(readings);
  } catch (error) {
    console.error("❌ Fetch readings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- AI HYPERTENSION RISK --------------------

// Send latest reading data to Flask AI API for risk prediction
export const analyzeReadingRisk = async (req, res) => {
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
      cholesterol,
    });

    res.status(200).json({
      message: "Prediction received successfully",
      prediction: response.data.prediction,
    });
  } catch (error) {
    console.error("❌ AI Prediction Error:", error.message);
    res.status(500).json({ error: "Error connecting to AI service" });
  }
};
