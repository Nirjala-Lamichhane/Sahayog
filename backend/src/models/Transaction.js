const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define(
  "Transaction",
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
    bookingType: {
      type: DataTypes.ENUM("appointment", "cabin", "ambulance"),
      allowNull: false
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "approved", "completed"),
      allowNull: false,
      defaultValue: "pending"
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    tableName: "transactions",
    timestamps: true
  }
);

module.exports = Transaction;
