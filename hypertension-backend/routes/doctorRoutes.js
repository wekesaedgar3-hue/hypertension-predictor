// routes/doctorRoutes.js
import express from "express";
import { Op } from "sequelize";

export default (models) => {
  const router = express.Router();
  const { Patient, Reading } = models;

  // GET /api/doctor/patients?q=<search>
  router.get("/patients", async (req, res) => {
    try {
      const query = req.query.q || "";

      // Fetch patients filtered by search
      const patients = await Patient.findAll({
        where: {
          full_name: { [Op.like]: `%${query}%` },
        },
        order: [["full_name", "ASC"]],
      });

      // Fetch latest reading for each patient
      const patientsWithReadings = await Promise.all(
        patients.map(async (patient) => {
          const latestReading = await Reading.findOne({
            where: { patient_id: patient.id },
            order: [["createdAt", "DESC"]],
          });

          return {
            ...patient.get({ plain: true }),
            latestReading: latestReading ? latestReading.get({ plain: true }) : null,
          };
        })
      );

      res.json(patientsWithReadings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch patients", error: err.message });
    }
  });

  return router;
};


