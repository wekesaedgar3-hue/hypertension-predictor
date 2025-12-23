// -------------------- HYPERTENSION STAGE CONTROLLER --------------------

// Predict hypertension stage based on SBP & DBP
export const predictHypertensionStage = ({ sbp = null, dbp = null }) => {
  if (sbp === null || dbp === null) {
    return { stage: "Unknown", message: "SBP or DBP missing" };
  }

  let stage = "Normal";

  if (sbp >= 140 || dbp >= 90) {
    stage = "Stage 2";
  } else if ((sbp >= 120 && sbp < 140) || (dbp >= 80 && dbp < 90)) {
    stage = "Stage 1";
  }

  return { stage };
};

// -------------------- EXPRESS ENDPOINT --------------------

// Express endpoint wrapper for frontend/backend calls
export const hypertensionStageEndpoint = (req, res) => {
  try {
    const { sbp, dbp } = req.body;

    if (sbp === undefined || dbp === undefined) {
      return res.status(400).json({ error: "SBP and DBP are required" });
    }

    const result = predictHypertensionStage({ sbp, dbp });

    res.status(200).json({
      message: "Hypertension stage calculated successfully",
      ...result,
    });
  } catch (error) {
    console.error("❌ Hypertension stage calculation error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
