// models/medication.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Medication = sequelize.define("Medication", {
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dose: {
      type: DataTypes.STRING,
    },
    frequency: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
  });

  return Medication;
};
