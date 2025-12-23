// models/reading.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Reading = sequelize.define(
    "Reading",
    {
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "patients",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      systolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diastolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      heart_rate: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      timestamps: true, // ✅ adds createdAt & updatedAt
      underscored: true // optional: snake_case columns if you prefer
    }
  );

  return Reading;
};

