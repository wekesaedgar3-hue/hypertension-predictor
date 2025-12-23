import express from "express";

export default (models) => {
  const router = express.Router();
  const { Medication } = models;

  router.get("/", async (req, res) => {
    const medications = await Medication.findAll();
    res.json(medications);
  });

  router.post("/", async (req, res) => {
    const medication = await Medication.create(req.body);
    res.json(medication);
  });

  return router;
};
