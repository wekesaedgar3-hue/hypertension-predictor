import db from "../config/database.js";

const { Medication } = db;

// -------------------- MEDICATION CONTROLLERS --------------------

// Add a new medication
export const createMedication = async (req, res) => {
  try {
    const { patient_id, name, dose, freq, start_date, end_date, adherence_pct } = req.body;

    if (!patient_id || !name) {
      return res.status(400).json({ error: "Patient ID and medication name are required" });
    }

    const medication = await Medication.create({
      patient_id,
      name,
      dose,
      freq,
      start_date,
      end_date,
      adherence_pct,
    });

    res.status(201).json({ message: "Medication added successfully", medication });
  } catch (error) {
    console.error("❌ Medication creation error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get medications for a patient
export const getMedicationsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const meds = await Medication.findAll({ where: { patient_id } });
    res.status(200).json(meds);
  } catch (error) {
    console.error("❌ Fetch medications error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update medication
export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Medication.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Medication not found" });
    }

    res.status(200).json({ message: "Medication updated successfully" });
  } catch (error) {
    console.error("❌ Update medication error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete medication
export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medication.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Medication not found" });
    }

    res.status(200).json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("❌ Delete medication error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
