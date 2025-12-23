let Doctor, Patient;

// Initialize models
export const initModels = (db) => {
  Doctor = db.Doctor;
  Patient = db.Patient;
};

// -------------------- DOCTOR CONTROLLERS --------------------

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json(doctors);
  } catch (err) {
    console.error("❌ Fetch doctors error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error("❌ Fetch doctor error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all patients of a doctor
export const getPatientsOfDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, { include: Patient });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor.Patients || []);
  } catch (err) {
    console.error("❌ Fetch patients of doctor error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


