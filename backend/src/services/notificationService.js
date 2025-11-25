const { Notification } = require("../models");

const getNotificationsForUser = async (userId) => {
  return Notification.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
};

const getUnreadCount = async (userId) => {
  const count = await Notification.count({ where: { userId, isRead: false } });
  return { unreadCount: count };
};

const markAsRead = async (id, userId) => {
  const notif = await Notification.findByPk(id);
  if (!notif || (notif.userId && notif.userId !== userId)) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }

  notif.isRead = true;
  await notif.save();
  return notif;
};

const markAllAsRead = async (userId) => {
  await Notification.update({ isRead: true }, { where: { userId } });
  return { message: "All notifications marked as read" };
};

const deleteNotification = async (id, userId) => {
  const notif = await Notification.findByPk(id);
  if (!notif || (notif.userId && notif.userId !== userId)) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }

  await notif.destroy();
  return { message: "Notification deleted" };
};

const deleteAllNotifications = async (userId) => {
  await Notification.destroy({ where: { userId } });
  return { message: "Notifications deleted" };
};

const getAllNotifications = async () => {
  return Notification.findAll({ order: [["createdAt", "DESC"]] });
};

const getRemindersForUser = async (userId) => {
  return Notification.findAll({ where: { userId, type: "reminder" }, order: [["createdAt", "DESC"]] });
};

module.exports = {
  getNotificationsForUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getAllNotifications,
  getRemindersForUser
};
