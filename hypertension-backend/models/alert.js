// models/alert.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Alert = sequelize.define("Alert", {
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reading_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "unread",
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Alert;
};
