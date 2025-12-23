// models/Patient.js
export default (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "Patient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // hashed password stored here
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "doctors",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "patients",
      underscored: true,
      timestamps: false,
    }
  );

  Patient.associate = (models) => {
    Patient.belongsTo(models.Doctor, { foreignKey: "doctor_id" });
  };

  return Patient;
};

