// models/chatDoc.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ChatDoc = sequelize.define("ChatDoc", {
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answered_at: {
      type: DataTypes.DATE,
    },
  });

  return ChatDoc;
};
