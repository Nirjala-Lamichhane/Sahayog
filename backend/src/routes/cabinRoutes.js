const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const cabinController = require("../controllers/cabinController");

const router = express.Router();

router.post("/check-availability", authMiddleware, cabinController.checkAvailability);
router.post("/book", authMiddleware, cabinController.bookCabin);
router.get("/my", authMiddleware, cabinController.getMyCabinBookings);
router.get("/:id", authMiddleware, cabinController.getCabinById);

router.get("/", authMiddleware, adminMiddleware, cabinController.getAllCabinBookings);
router.get("/pending", authMiddleware, adminMiddleware, cabinController.getPendingCabinBookings);
router.put("/:id/approve", authMiddleware, adminMiddleware, cabinController.approveCabinBooking);
router.put("/:id/reject", authMiddleware, adminMiddleware, cabinController.rejectCabinBooking);

module.exports = router;
