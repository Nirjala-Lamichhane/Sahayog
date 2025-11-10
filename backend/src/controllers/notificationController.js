const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../services/notificationService");

const getNotifications = asyncHandler(async (req, res) => {
  const list = await notificationService.getNotificationsForUser(req.user.id);
  return res.json({ data: list });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  return res.json({ data: result });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notif = await notificationService.markAsRead(req.params.id, req.user.id);
  return res.json({ data: notif });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  return res.json(result);
});

const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user.id);
  return res.json(result);
});

const deleteAllNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteAllNotifications(req.user.id);
  return res.json(result);
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};
