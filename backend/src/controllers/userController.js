const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  return res.json({ data: user });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  return res.json({ data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Only users can edit profiles" });
  }
  const user = await userService.updateProfile(req.user.id, req.body);
  return res.json({ data: user, user });
});

const deleteProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Only users can delete profiles" });
  }
  const result = await userService.deleteProfile(req.user.id);
  return res.json(result);
});

module.exports = {
  getMe,
  getProfile,
  updateProfile,
  deleteProfile
};
