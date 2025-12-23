let Appointment, Doctor, Patient;

// Initialize models
export const initModels = (db) => {
  Appointment = db.Appointment;
  Doctor = db.Doctor;
  Patient = db.Patient;
};

// -------------------- APPOINTMENT CONTROLLERS --------------------

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, time, notes } = req.body;

    if (!doctorId || !patientId || !date || !time) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const appointment = await Appointment.create({ doctorId, patientId, date, time, notes });
    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (err) {
    console.error("❌ Create appointment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ include: [Doctor, Patient] });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ Fetch appointments error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: [Doctor, Patient] });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (err) {
    console.error("❌ Fetch appointment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
