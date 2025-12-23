export const analyzeHypertensionRisk = async (req, res) => {
  try {
    const { sbp, dbp, age, sex, bmi, smoking, diabetes, cholesterol, medication_adherence, activity_level, sodium_intake } = req.body;

    let score = 0;
    if (sbp >= 140) score += 0.3;
    if (dbp >= 90) score += 0.3;
    if (bmi >= 30) score += 0.1;
    if (age >= 60) score += 0.1;
    if (smoking) score += 0.05;
    if (diabetes) score += 0.05;
    if (cholesterol >= 240) score += 0.05;
    if (medication_adherence < 80) score += 0.05;
    if (activity_level < 3) score += 0.05;
    if (sodium_intake > 2300) score += 0.05;

    score = Math.min(1, score);
    const risk_level = score >= 0.7 ? "High" : score >= 0.4 ? "Moderate" : "Low";

    res.json({ risk_score: score, risk_level });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
