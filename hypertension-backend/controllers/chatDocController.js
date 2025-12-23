import db from "../config/database.js";

const { ChatDoc } = db;

// -------------------- CHAT DOC CONTROLLERS --------------------

// Upload or register a new document
export const createDoc = async (req, res) => {
  try {
    const { title, source, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Title and text are required" });
    }

    const doc = await ChatDoc.create({ title, source, text });
    res.status(201).json({ message: "Document added successfully", doc });
  } catch (error) {
    console.error("❌ ChatDoc creation error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all ChatDocs
export const getAllDocs = async (req, res) => {
  try {
    const docs = await ChatDoc.findAll();
    res.status(200).json(docs);
  } catch (error) {
    console.error("❌ Fetch docs error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single document by ID
export const getDocById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ChatDoc.findByPk(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(doc);
  } catch (error) {
    console.error("❌ Fetch doc error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
