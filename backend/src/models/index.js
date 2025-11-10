const sequelize = require("../config/db");
const User = require("./User");
const Booking = require("./Booking");
const Ambulance = require("./Ambulance");
const Cabin = require("./Cabin");
const Transaction = require("./Transaction");
const Notification = require("./Notification");
const Report = require("./Report");
const Rating = require("./Rating");

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Ambulance, { foreignKey: "userId", as: "ambulanceRequests" });
Ambulance.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Cabin, { foreignKey: "userId", as: "cabinBookings" });
Cabin.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Report, { foreignKey: "userId" });
Report.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Booking,
  Ambulance,
  Cabin,
  Transaction,
  Notification,
  Report,
  Rating
};
