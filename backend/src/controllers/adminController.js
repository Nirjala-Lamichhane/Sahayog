const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
const bookingService = require("../services/bookingService");
const transactionService = require("../services/transactionService");
const userService = require("../services/userService");
const reportService = require("../services/reportService");
const ratingService = require("../services/ratingService");
const cabinService = require("../services/cabinService");
const ambulanceService = require("../services/ambulanceService");
const notificationService = require("../services/notificationService");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }

  const user = await authService.createUserByAdmin({ name, email, password, role });
  return res.status(201).json({ data: user });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return res.json({ data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserByAdmin(req.params.id, req.body);
  return res.json({ data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUserByAdmin(req.params.id);
  return res.json(result);
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAllBookings();
  return res.json({ data: bookings });
});

const getAppointments = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAllBookings();
  return res.json({ data: bookings });
});

const confirmAppointment = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.params.id);
  return res.json({ data: booking });
});

const updateAppointment = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingAdmin(req.params.id, req.body);
  return res.json({ data: booking });
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const result = await bookingService.deleteBooking(req.params.id);
  return res.json(result);
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getAllTransactions();
  return res.json({ data: transactions });
});

const getPendingTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getPendingTransactions();
  return res.json({ data: transactions });
});

const approveTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateStatus(req.params.id, "approved");
  return res.json({ data: transaction });
});

const completeTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateStatus(req.params.id, "completed");
  return res.json({ data: transaction });
});

const getReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getAllReports();
  return res.json({ data: reports });
});

const getPendingRatings = asyncHandler(async (req, res) => {
  const list = await ratingService.getPendingRatings();
  return res.json({ data: list });
});

const getApprovedRatings = asyncHandler(async (req, res) => {
  const list = await ratingService.getApprovedRatings();
  return res.json({ data: list });
});

const approveRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.approveRating(req.params.id);
  return res.json({ data: rating });
});

const rejectRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.rejectRating(req.params.id);
  return res.json({ data: rating });
});

const getCabinBookings = asyncHandler(async (req, res) => {
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

const getAmbulanceRequests = asyncHandler(async (req, res) => {
  const list = await ambulanceService.getAllRequests();
  return res.json({ data: list });
});

const getPendingAmbulanceRequests = asyncHandler(async (req, res) => {
  const list = await ambulanceService.getPendingRequests();
  return res.json({ data: list });
});

const approveAmbulanceRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "approved");
  return res.json({ data: request });
});

const rejectAmbulanceRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "rejected");
  return res.json({ data: request });
});

const completeAmbulanceRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "completed");
  return res.json({ data: request });
});

const getNotifications = asyncHandler(async (req, res) => {
  const list = await notificationService.getAllNotifications();
  return res.json({ data: list });
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalBookings,
    totalCabins,
    totalAmbulances,
    pendingBookings,
    pendingCabins,
    pendingAmbulances,
    pendingTransactions,
    totalTransactions
  ] = await Promise.all([
    userService.getAllUsers().then(u => u.length),
    bookingService.getAllBookings().then(b => b.length),
    cabinService.getAllBookings().then(c => c.length),
    ambulanceService.getAllRequests().then(a => a.length),
    bookingService.getAllBookings().then(b => b.filter(x => x.status === 'pending').length),
    cabinService.getPendingBookings().then(c => c.length),
    ambulanceService.getPendingRequests().then(a => a.length),
    transactionService.getPendingTransactions().then(t => t.length),
    transactionService.getAllTransactions().then(t => t.length)
  ]);

  return res.json({
    data: {
      totalUsers,
      totalBookings,
      totalCabins,
      totalAmbulances,
      pendingBookings,
      pendingCabins,
      pendingAmbulances,
      pendingTransactions,
      totalTransactions,
      totalPendingRequests: pendingBookings + pendingCabins + pendingAmbulances
    }
  });
});

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getBookings,
  getAppointments,
  confirmAppointment,
  updateAppointment,
  deleteAppointment,
  getTransactions,
  getPendingTransactions,
  approveTransaction,
  completeTransaction,
  getReports,
  getPendingRatings,
  getApprovedRatings,
  approveRating,
  rejectRating,
  getCabinBookings,
  getPendingCabinBookings,
  approveCabinBooking,
  rejectCabinBooking,
  getAmbulanceRequests,
  getPendingAmbulanceRequests,
  approveAmbulanceRequest,
  rejectAmbulanceRequest,
  completeAmbulanceRequest,
  getNotifications,
  getDashboardSummary
};
