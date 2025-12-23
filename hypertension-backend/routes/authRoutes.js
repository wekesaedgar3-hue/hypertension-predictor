// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default (models) => {
  const router = express.Router();
  const { Patient, Doctor } = models;

  const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

  // -------------------- PATIENT REGISTER --------------------
  router.post("/patient/register", async (req, res) => {
    try {
      const { full_name, age, email, password } = req.body;
      if (!full_name || !age || !email || !password)
        return res.status(400).json({ error: "All fields are required" });

      if (isNaN(age) || age <= 0)
        return res.status(400).json({ error: "Age must be a valid number greater than 0" });

      const existing = await Patient.findOne({ where: { email } });
      if (existing) return res.status(400).json({ error: "Patient already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const patient = await Patient.create({ full_name, age, email, password: hashed });

      res.status(201).json({ message: "Patient registered successfully", patient });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // -------------------- DOCTOR REGISTER --------------------
  router.post("/doctor/register", async (req, res) => {
    try {
      const { full_name, email, password } = req.body;
      if (!full_name || !email || !password)
        return res.status(400).json({ error: "All fields are required" });

      const existing = await Doctor.findOne({ where: { email } });
      if (existing) return res.status(400).json({ error: "Doctor already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const doctor = await Doctor.create({ full_name, email, password: hashed });

      res.status(201).json({ message: "Doctor registered successfully", doctor });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // -------------------- PATIENT LOGIN --------------------
  router.post("/patient/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

      // Explicitly select password
      const patient = await Patient.findOne({ 
        where: { email },
        attributes: ["id", "full_name", "age", "email", "password"]
      });

      if (!patient) return res.status(404).json({ error: "Patient not found" });

      console.log("Password from request:", password);
      console.log("Password in DB:", patient.password);

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: patient.id, role: "patient" }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ 
        token, 
        patient: { id: patient.id, full_name: patient.full_name, age: patient.age, email: patient.email } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // -------------------- DOCTOR LOGIN --------------------
  router.post("/doctor/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

      // Explicitly select password
      const doctor = await Doctor.findOne({ 
        where: { email },
        attributes: ["id", "full_name", "email", "password"]
      });

      if (!doctor) return res.status(404).json({ error: "Doctor not found" });

      console.log("Password from request:", password);
      console.log("Password in DB:", doctor.password);

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: doctor.id, role: "doctor" }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ 
        token, 
        doctor: { id: doctor.id, full_name: doctor.full_name, email: doctor.email } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};


