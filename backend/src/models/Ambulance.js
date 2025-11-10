const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ambulance = sequelize.define(
  "Ambulance",
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
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ambulanceType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "basic"
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
      allowNull: false,
      defaultValue: "pending"
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pricePerKm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "ambulances",
    timestamps: true
  }
);

module.exports = Ambulance;
