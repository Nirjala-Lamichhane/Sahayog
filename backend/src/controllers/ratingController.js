const asyncHandler = require("../utils/asyncHandler");
const ratingService = require("../services/ratingService");

const submitRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.submitRating(req.user.id, req.body);
  return res.status(201).json({ data: rating });
});

const getApprovedRatings = asyncHandler(async (req, res) => {
  const list = await ratingService.getApprovedRatings();
  return res.json({ data: list });
});

const getPendingRatings = asyncHandler(async (req, res) => {
  const list = await ratingService.getPendingRatings();
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

module.exports = {
  submitRating,
  getApprovedRatings,
  getPendingRatings,
  approveRating,
  rejectRating
};
