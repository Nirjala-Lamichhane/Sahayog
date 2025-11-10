const asyncHandler = require("../utils/asyncHandler");
const bookingService = require("../services/bookingService");

const createBooking = asyncHandler(async (req, res) => {
  const required = [
    "fullName",
    "age",
    "address",
    "contact",
    "department",
    "doctor",
    "preferredDate",
    "preferredTime"
  ];
  const missing = required.filter((key) => !req.body[key]);
  if (missing.length > 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const booking = await bookingService.createBooking(req.user.id, req.body);
  return res.status(201).json({ success: true, data: booking });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (req.user.role !== "admin" && booking.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  return res.json({ data: booking });
});

const listMyBookings = asyncHandler(async (req, res) => {
  const list = await bookingService.getBookingsForUser(req.user.id);
  return res.json({ data: list });
});

const updateBooking = asyncHandler(async (req, res) => {
  const updated = await bookingService.updateBooking(req.params.id, req.user.id, req.body);
  return res.json({ data: updated });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const updated = await bookingService.cancelBooking(req.params.id, req.user.id);
  return res.json({ data: updated });
});

module.exports = {
  createBooking,
  getBookingById,
  listMyBookings,
  updateBooking,
  cancelBooking
};
