const { Op } = require("sequelize");
const { Cabin, Notification, User } = require("../models");

// Cabin pricing per day
const CABIN_PRICES = {
  "General Ward": 500,
  "Semi-Private": 1000,
  "Private": 2000,
  "ICU": 5000,
  "Deluxe": 3000
};

const calculateCabinPrice = (cabinType, checkInDate, checkOutDate) => {
  const pricePerDay = CABIN_PRICES[cabinType] || 1000;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
  const totalAmount = pricePerDay * numberOfDays;
  
  return { pricePerDay, numberOfDays, totalAmount };
};

const checkAvailability = async ({ cabinType, checkInDate, checkOutDate }) => {
  const overlap = await Cabin.findOne({
    where: {
      cabinType,
      status: { [Op.ne]: "rejected" },
      [Op.or]: [
        {
          checkInDate: { [Op.between]: [checkInDate, checkOutDate] }
        },
        {
          checkOutDate: { [Op.between]: [checkInDate, checkOutDate] }
        }
      ]
    }
  });

  const pricing = calculateCabinPrice(cabinType, checkInDate, checkOutDate);
  return { available: !overlap, ...pricing };
};

const bookCabin = async (userId, payload) => {
  const pricing = calculateCabinPrice(
    payload.cabinType,
    payload.checkInDate,
    payload.checkOutDate
  );

  const booking = await Cabin.create({
    userId,
    fullName: payload.fullName,
    age: payload.age,
    contact: payload.contact,
    address: payload.address,
    cabinType: payload.cabinType,
    checkInDate: payload.checkInDate,
    checkOutDate: payload.checkOutDate,
    numberOfAttendants: payload.numberOfAttendants || 1,
    reasonForStay: payload.reasonForStay || null,
    specialPreferences: payload.specialPreferences || null,
    pricePerDay: pricing.pricePerDay,
    numberOfDays: pricing.numberOfDays,
    totalAmount: pricing.totalAmount
  });

  await Notification.create({
    userId,
    title: "Cabin booking requested",
    message: "Your cabin booking is pending approval.",
    type: "booking"
  });

  return booking;
};

const getCabinById = async (id) => {
  const cabin = await Cabin.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }]
  });
  if (!cabin) {
    const error = new Error("Cabin booking not found");
    error.status = 404;
    throw error;
  }
  return cabin;
};

const getBookingsForUser = async (userId) => {
  return Cabin.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const getAllBookings = async () => {
  return Cabin.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const getPendingBookings = async () => {
  return Cabin.findAll({
    where: { status: "pending" },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const updateStatus = async (id, status) => {
  const booking = await Cabin.findByPk(id);
  if (!booking) {
    const error = new Error("Cabin booking not found");
    error.status = 404;
    throw error;
  }

  booking.status = status;
  await booking.save();

  await Notification.create({
    userId: booking.userId,
    title: "Cabin booking update",
    message: `Your cabin booking status is now ${status}.`,
    type: "booking"
  });

  return booking;
};

module.exports = {
  checkAvailability,
  bookCabin,
  getCabinById,
  getBookingsForUser,
  getAllBookings,
  getPendingBookings,
  updateStatus
};
