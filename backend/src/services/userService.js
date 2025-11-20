const { User } = require("../models");

const getUserById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ["password", "resetCode", "resetCodeExpires"] } });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (id, updates) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await user.update({
    name: updates.name || user.name,
    email: updates.email || user.email,
    phone: updates.phone || user.phone,
    instagram: updates.instagram || user.instagram,
    facebook: updates.facebook || user.facebook,
    twitter: updates.twitter || user.twitter,
    linkedin: updates.linkedin || user.linkedin
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    instagram: user.instagram,
    facebook: user.facebook,
    twitter: user.twitter,
    linkedin: user.linkedin
  };
};

const deleteProfile = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await user.destroy();
  return { message: "Account deleted" };
};

const getAllUsers = async () => {
  return User.findAll({ attributes: { exclude: ["password", "resetCode", "resetCodeExpires"] }, order: [["createdAt", "DESC"]] });
};

const updateUserByAdmin = async (id, updates) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (updates.role && !["admin", "user"].includes(updates.role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  await user.update({
    name: updates.name || user.name,
    email: updates.email || user.email,
    role: updates.role || user.role,
    phone: updates.phone || user.phone
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  };
};

const deleteUserByAdmin = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await user.destroy();
  return { message: "User deleted" };
};

module.exports = {
  getUserById,
  updateProfile,
  deleteProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin
};
