// database/index.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    define: {
      timestamps: false, // default for all models, individual models can override
      underscored: true,
    },
  }
);

const db = {};
const modelsDir = path.join(__dirname, "../models");

// Dynamically load all models
const loadModels = async () => {
  const files = fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith(".js") && file !== "index.js");

  for (const file of files) {
    const modelPath = path.join(modelsDir, file);
    const module = await import(`file://${modelPath}`);
    const model = module.default(sequelize, DataTypes); // each model exports default function(sequelize, DataTypes)
    db[model.name] = model;
  }

  // Define associations
  const { Patient, Reading, Alert, Medication, Doctor, Appointment, ChatDoc } = db;

  if (Patient && Reading) {
    Patient.hasMany(Reading, { foreignKey: "patient_id", onDelete: "CASCADE" });
    Reading.belongsTo(Patient, { foreignKey: "patient_id" });
  }

  if (Patient && Alert) {
    Patient.hasMany(Alert, { foreignKey: "patient_id", onDelete: "CASCADE" });
    Alert.belongsTo(Patient, { foreignKey: "patient_id" });
  }

  if (Reading && Alert) {
    Reading.hasMany(Alert, { foreignKey: "reading_id", onDelete: "CASCADE" });
    Alert.belongsTo(Reading, { foreignKey: "reading_id" });
  }

  if (Patient && Medication) {
    Patient.hasMany(Medication, { foreignKey: "patient_id", onDelete: "CASCADE" });
    Medication.belongsTo(Patient, { foreignKey: "patient_id" });
  }

  if (Doctor && Patient) {
    Doctor.hasMany(Patient, { foreignKey: "doctor_id", onDelete: "SET NULL" });
    Patient.belongsTo(Doctor, { foreignKey: "doctor_id" });
  }

  if (Doctor && Appointment && Patient) {
    Doctor.hasMany(Appointment, { foreignKey: "doctor_id", onDelete: "CASCADE" });
    Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });

    Patient.hasMany(Appointment, { foreignKey: "patient_id", onDelete: "CASCADE" });
    Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
  }

  db.models = { ...db };
};

// Initialize database and sync models
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await loadModels();

    // Sync all models: alters tables to add missing columns (like createdAt)
    await sequelize.sync({ alter: true });
    console.log("✅ All models synced successfully!");

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    throw err;
  }
};

export default db;
