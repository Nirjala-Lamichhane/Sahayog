const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authMiddleware, notificationController.getNotifications);
router.get("/unread", authMiddleware, notificationController.getUnreadCount);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);
router.put("/read-all", authMiddleware, notificationController.markAllAsRead);
router.delete("/:id", authMiddleware, notificationController.deleteNotification);
router.delete("/", authMiddleware, notificationController.deleteAllNotifications);

module.exports = router;
