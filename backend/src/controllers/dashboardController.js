const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../services/notificationService");
const reportService = require("../services/reportService");
const ratingService = require("../services/ratingService");
const userService = require("../services/userService");

const getDashboard = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  return res.json({ user });
});

const getReports = asyncHandler(async (req, res) => {
  const list = await reportService.getReportsForUser(req.user.id);
  return res.json({ data: list });
});

const getReminders = asyncHandler(async (req, res) => {
  const list = await notificationService.getRemindersForUser(req.user.id);
  return res.json({ data: list });
});

const submitRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.submitRating(req.user.id, req.body);
  return res.status(201).json({ data: rating });
});

const getApprovedRatings = asyncHandler(async (req, res) => {
  const list = await ratingService.getApprovedRatings();
  return res.json({ data: list });
});

module.exports = {
  getDashboard,
  getReports,
  getReminders,
  submitRating,
  getApprovedRatings
};
