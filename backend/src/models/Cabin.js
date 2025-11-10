const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cabin = sequelize.define(
  "Cabin",
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
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cabinType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    numberOfAttendants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    reasonForStay: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialPreferences: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending"
    },
    pricePerDay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numberOfDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "cabins",
    timestamps: true
  }
);

module.exports = Cabin;
