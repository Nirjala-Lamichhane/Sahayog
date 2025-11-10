const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createBooking,
  getBookingById,
  listMyBookings,
  updateBooking,
  cancelBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, listMyBookings);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;
