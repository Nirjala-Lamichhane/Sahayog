const { Booking, Notification, User } = require("../models");

const createBooking = async (userId, payload) => {
  const booking = await Booking.create({
    userId,
    fullName: payload.fullName,
    age: payload.age,
    address: payload.address,
    contact: payload.contact,
    department: payload.department,
    doctor: payload.doctor,
    preferredDate: payload.preferredDate,
    preferredTime: payload.preferredTime,
    notes: payload.notes || null
  });

  await Notification.create({
    userId,
    title: "Appointment booked",
    message: "Your appointment request has been submitted for confirmation.",
    type: "booking"
  });

  return booking;
};

const getBookingById = async (id) => {
  return Booking.findByPk(id);
};

const getBookingsForUser = async (userId) => {
  return Booking.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const getAllBookings = async () => {
  return Booking.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const updateBooking = async (bookingId, userId, updates) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.userId !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  await booking.update({
    preferredDate: updates.preferredDate || booking.preferredDate,
    preferredTime: updates.preferredTime || booking.preferredTime,
    fullName: updates.fullName || booking.fullName,
    age: updates.age || booking.age,
    address: updates.address || booking.address,
    contact: updates.contact || booking.contact,
    department: updates.department || booking.department,
    doctor: updates.doctor || booking.doctor,
    notes: updates.notes || booking.notes
  });

  return booking;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.userId !== userId) {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};

const confirmBooking = async (bookingId) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  booking.status = "confirmed";
  await booking.save();

  await Notification.create({
    userId: booking.userId,
    title: "Appointment confirmed",
    message: "Your appointment has been confirmed by admin.",
    type: "booking"
  });

  return booking;
};

const updateBookingAdmin = async (bookingId, updates) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  await booking.update({
    preferredDate: updates.preferredDate || booking.preferredDate,
    preferredTime: updates.preferredTime || booking.preferredTime,
    fullName: updates.fullName || booking.fullName,
    age: updates.age || booking.age,
    address: updates.address || booking.address,
    contact: updates.contact || booking.contact,
    department: updates.department || booking.department,
    doctor: updates.doctor || booking.doctor,
    notes: updates.notes || booking.notes,
    status: updates.status || booking.status
  });

  return booking;
};

const deleteBooking = async (bookingId) => {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  await booking.destroy();
  return { message: "Booking deleted" };
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsForUser,
  getAllBookings,
  updateBooking,
  updateBookingAdmin,
  cancelBooking,
  confirmBooking,
  deleteBooking
};
