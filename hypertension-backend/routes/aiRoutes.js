// routes/aiRoutes.js
import express from "express";
import { analyzeHypertensionRisk } from "../controllers/healthController.js";

const router = express.Router();

// Predict hypertension risk
// Expects body: { sbp, dbp, heart_rate, bmi, age, sex, smoking, diabetes, cholesterol }
router.post("/predict", analyzeHypertensionRisk);

export default router;
