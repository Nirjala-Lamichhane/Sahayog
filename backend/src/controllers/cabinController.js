const asyncHandler = require("../utils/asyncHandler");
const cabinService = require("../services/cabinService");

const checkAvailability = asyncHandler(async (req, res) => {
  const { cabinType, checkInDate, checkOutDate } = req.body;
  if (!cabinType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ message: "cabinType, checkInDate and checkOutDate are required" });
  }
  const result = await cabinService.checkAvailability({ cabinType, checkInDate, checkOutDate });
  return res.json(result);
});

const getCabinById = asyncHandler(async (req, res) => {
  const cabin = await cabinService.getCabinById(req.params.id);
  if (!cabin) {
    return res.status(404).json({ message: "Cabin booking not found" });
  }
  return res.json({ data: cabin });
});

const bookCabin = asyncHandler(async (req, res) => {
  const booking = await cabinService.bookCabin(req.user.id, req.body);
  return res.status(201).json({ success: true, data: booking });
});

const getMyCabinBookings = asyncHandler(async (req, res) => {
  const list = await cabinService.getBookingsForUser(req.user.id);
  return res.json({ data: list });
});

const getAllCabinBookings = asyncHandler(async (req, res) => {
  const list = await cabinService.getAllBookings();
  return res.json({ data: list });
});

const getPendingCabinBookings = asyncHandler(async (req, res) => {
  const list = await cabinService.getPendingBookings();
  return res.json({ data: list });
});

const approveCabinBooking = asyncHandler(async (req, res) => {
  const booking = await cabinService.updateStatus(req.params.id, "approved");
  return res.json({ data: booking });
});

const rejectCabinBooking = asyncHandler(async (req, res) => {
  const booking = await cabinService.updateStatus(req.params.id, "rejected");
  return res.json({ data: booking });
});

module.exports = {
  checkAvailability,
  getCabinById,
  bookCabin,
  getMyCabinBookings,
  getAllCabinBookings,
  getPendingCabinBookings,
  approveCabinBooking,
  rejectCabinBooking
};
