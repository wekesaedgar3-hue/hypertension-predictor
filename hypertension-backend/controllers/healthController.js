// controllers/healthController.js
export const analyzeHypertensionRisk = (req, res) => {
  try {
    const data = req.body;
    
    // Simple mock AI logic — replace with your real AI function
    const sbp = parseInt(data.sbp || 0);
    const dbp = parseInt(data.dbp || 0);

    let risk = "Unknown";
    if(sbp < 120 && dbp < 80) risk = "Normal";
    else if(sbp < 130 && dbp < 85) risk = "Elevated";
    else if(sbp < 140 || dbp < 90) risk = "Stage 1 Hypertension";
    else if(sbp >= 140 || dbp >= 90) risk = "Stage 2 Hypertension";

    res.json({
      prediction: risk,
      sbp,
      dbp
    });
  } catch (err) {
    console.error("❌ AI Prediction Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
