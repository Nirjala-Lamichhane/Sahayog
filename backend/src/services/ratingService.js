const { Rating } = require("../models");

const submitRating = async (userId, payload) => {
  const rating = await Rating.create({
    userId,
    userName: payload.userName,
    rating: payload.rating,
    comment: payload.comment,
    status: "pending"
  });
  return rating;
};

const getApprovedRatings = async () => {
  return Rating.findAll({ where: { status: "approved" }, order: [["createdAt", "DESC"]] });
};

const getPendingRatings = async () => {
  return Rating.findAll({ where: { status: "pending" }, order: [["createdAt", "DESC"]] });
};

const approveRating = async (id) => {
  const rating = await Rating.findByPk(id);
  if (!rating) {
    const error = new Error("Rating not found");
    error.status = 404;
    throw error;
  }

  rating.status = "approved";
  await rating.save();
  return rating;
};

const rejectRating = async (id) => {
  const rating = await Rating.findByPk(id);
  if (!rating) {
    const error = new Error("Rating not found");
    error.status = 404;
    throw error;
  }

  rating.status = "rejected";
  await rating.save();
  return rating;
};

module.exports = {
  submitRating,
  getApprovedRatings,
  getPendingRatings,
  approveRating,
  rejectRating
};
