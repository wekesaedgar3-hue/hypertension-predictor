// routes/readingRoutes.js
import express from "express";
import axios from "axios";

export default (models) => {
  const router = express.Router();
  const { Reading } = models;

  // ✅ Create new reading and send data to AI model
  router.post("/", async (req, res) => {
    try {
      const reading = await Reading.create(req.body);

      // Prepare data for AI model
      const aiData = {
        sbp: reading.sbp,
        dbp: reading.dbp,
        heart_rate: reading.heart_rate,
        bmi: reading.bmi,
        age: reading.age,
        sex: reading.sex,
        smoking: reading.smoking,
        diabetes: reading.diabetes,
        cholesterol: reading.cholesterol,
        medication_adherence: reading.medication_adherence,
        activity_level: reading.activity_level,
        sodium_intake: reading.sodium_intake,
      };

      // ✅ Send to Flask AI API
      const aiResponse = await axios.post("http://127.0.0.1:8000/predict", aiData);

      // ✅ Merge AI result with reading
      const result = {
        ...reading.toJSON(),
        ai_risk_score: aiResponse.data.risk_score,
        ai_risk_level: aiResponse.data.risk_level,
      };

      res.status(201).json(result);
    } catch (error) {
      console.error("AI Prediction Error:", error.message);
      res.status(500).json({ error: "Failed to record reading or get AI prediction" });
    }
  });

  // ✅ Get all readings
  router.get("/", async (req, res) => {
    const readings = await Reading.findAll();
    res.json(readings);
  });

  return router;
};
