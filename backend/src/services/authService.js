const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { signToken } = require("../utils/jwt");

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "user" });
  const token = signToken({ id: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = signToken({ id: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const createUserByAdmin = async ({ name, email, password, role }) => {
  if (!role || !["admin", "user"].includes(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const setResetCode = async ({ email, code, expiresAt }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.resetCode = code;
  user.resetCodeExpires = expiresAt;
  await user.save();

  return { message: "Reset code generated" };
};

const verifyResetCode = async ({ email, code }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.resetCode || !user.resetCodeExpires) {
    const error = new Error("Invalid reset code");
    error.status = 400;
    throw error;
  }

  if (user.resetCode !== code || new Date(user.resetCodeExpires) < new Date()) {
    const error = new Error("Invalid reset code");
    error.status = 400;
    throw error;
  }

  return { message: "Code verified" };
};

const resetPassword = async ({ email, code, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.resetCode || !user.resetCodeExpires) {
    const error = new Error("Invalid reset code");
    error.status = 400;
    throw error;
  }

  if (user.resetCode !== code || new Date(user.resetCodeExpires) < new Date()) {
    const error = new Error("Invalid reset code");
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = null;
  user.resetCodeExpires = null;
  await user.save();

  return { message: "Password reset successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  createUserByAdmin,
  setResetCode,
  verifyResetCode,
  resetPassword
};
