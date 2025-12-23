import db from "../config/database.js";

const { Patient } = db;

// -------------------- PATIENT CONTROLLERS --------------------

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const { full_name, email, dob, gender, height_cm, weight_kg } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ error: "Full name and email are required" });
    }

    const patient = await Patient.create({
      full_name,
      email,
      dob,
      gender,
      height_cm,
      weight_kg,
    });

    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    console.error("❌ Patient creation error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error) {
    console.error("❌ Fetch patients error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("❌ Fetch patient error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Patient.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("❌ Update patient error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("❌ Delete patient error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
