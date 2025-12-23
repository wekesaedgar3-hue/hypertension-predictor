import express from "express";

export default (models) => {
  const router = express.Router();
  const { ChatDoc } = models;

  router.get("/", async (req, res) => {
    const chats = await ChatDoc.findAll();
    res.json(chats);
  });

  router.post("/", async (req, res) => {
    const chat = await ChatDoc.create(req.body);
    res.json(chat);
  });

  return router;
};
