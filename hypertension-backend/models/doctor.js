// models/doctor.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Doctor = sequelize.define("Doctor", {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
    },
  });

  return Doctor;
};


