// models/appointment.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Appointment = sequelize.define("Appointment", {
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
  });

  return Appointment;
};



