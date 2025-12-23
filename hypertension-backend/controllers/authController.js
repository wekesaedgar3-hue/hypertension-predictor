import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";

dotenv.config();

/* ============================
   DOCTOR AUTH CONTROLLERS
============================ */

// ✅ Register Doctor
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "✅ Doctor registered successfully!",
      doctor: { id: doctor.id, name: doctor.name, email: doctor.email },
    });
  } catch (error) {
    console.error("Doctor registration error:", error);
    res.status(500).json({ error: "Server error during doctor registration" });
  }
};

// ✅ Login Doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: doctor.id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

/* ============================
   PATIENT AUTH CONTROLLERS
============================ */

// ✅ Register Patient
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "✅ Patient registered successfully!",
      patient: { id: patient.id, name: patient.name, email: patient.email },
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({ error: "Server error during patient registration" });
  }
};

// ✅ Login Patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ where: { email } });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: patient.id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Patient login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

