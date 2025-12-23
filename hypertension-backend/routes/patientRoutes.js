// routes/patientRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";

export default (models) => {
  const router = express.Router();
  const { Patient } = models;

  // Get all patients (protected)
  router.get("/", verifyToken, async (req, res) => {
    try {
      const patients = await Patient.findAll();
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get single patient by id (protected)
  router.get("/:id", verifyToken, async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      res.json(patient);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Add patient
  router.post("/", verifyToken, async (req, res) => {
    try {
      const newPatient = await Patient.create(req.body);
      res.status(201).json(newPatient);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update patient
  router.put("/:id", verifyToken, async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      await patient.update(req.body);
      res.json(patient);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete patient
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      await patient.destroy();
      res.json({ message: "Patient deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};

