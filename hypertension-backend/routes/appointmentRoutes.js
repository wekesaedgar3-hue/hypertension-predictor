import express from "express";

export default (models) => {
  const router = express.Router();
  const { Appointment } = models;

  router.get("/", async (req, res) => {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  });

  router.post("/", async (req, res) => {
    const appointment = await Appointment.create(req.body);
    res.json(appointment);
  });

  return router;
};

