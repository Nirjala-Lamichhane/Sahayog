const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    testType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    findings: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visitDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    testDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "reports",
    timestamps: true
  }
);

module.exports = Report;
