import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Database
import { initializeDatabase } from "./config/database.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import chatDocRoutes from "./routes/chatDocRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- CORS --------------------
app.use(
  cors({
    origin: ["http://localhost:5000", "http://127.0.0.1:5000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// -------------------- MIDDLEWARE --------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -------------------- ROOT --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "patient_dashboard.html"));
});

// -------------------- START SERVER --------------------
const startServer = async () => {
  try {
    const db = await initializeDatabase();
    console.log("✅ Database initialized & synced!");

    app.use("/api/auth", authRoutes(db.models));
    app.use("/api/doctor", doctorRoutes(db.models));
    app.use("/api/patients", patientRoutes(db.models));
    app.use("/api/appointments", appointmentRoutes(db.models));
    app.use("/api/readings", readingRoutes(db.models));
    app.use("/api/alerts", alertRoutes(db.models));
    app.use("/api/medications", medicationRoutes(db.models));
    app.use("/api/chatdocs", chatDocRoutes(db.models));
    app.use("/api/ai", aiRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📂 Static files served from /public`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
