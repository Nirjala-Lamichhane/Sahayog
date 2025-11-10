const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.post("/book", authMiddleware, bookingController.createBooking);
router.get("/my-appointments", authMiddleware, bookingController.listMyBookings);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put("/:id", authMiddleware, bookingController.updateBooking);
router.delete("/:id", authMiddleware, bookingController.cancelBooking);

module.exports = router;
