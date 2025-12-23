import express from "express";

export default (models) => {
  const router = express.Router();
  const { Alert } = models;

  router.get("/", async (req, res) => {
    const alerts = await Alert.findAll();
    res.json(alerts);
  });

  router.post("/", async (req, res) => {
    const alert = await Alert.create(req.body);
    res.json(alert);
  });

  return router;
};
