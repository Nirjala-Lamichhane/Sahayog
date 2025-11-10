const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const result = await authService.registerUser({ name, email, password });
  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const result = await authService.loginUser({ email, password });
  return res.json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await authService.setResetCode({ email, code, expiresAt });
  return res.json({ message: "Reset code generated", code });
});

const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  const result = await authService.verifyResetCode({ email, code });
  return res.json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Email, code and new password are required" });
  }

  const result = await authService.resetPassword({ email, code, newPassword });
  return res.json(result);
});

module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword
};
