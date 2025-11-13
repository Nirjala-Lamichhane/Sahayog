const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");
const cabinController = require("../controllers/cabinController");

const router = express.Router();

router.use(authMiddleware);

router.get("/data", dashboardController.getDashboard);
router.get("/reports", dashboardController.getReports);
router.get("/reminders", dashboardController.getReminders);
router.post("/submit-rating", dashboardController.submitRating);
router.get("/approved-ratings", dashboardController.getApprovedRatings);

router.post("/book-cabin", cabinController.bookCabin);
router.get("/cabin-bookings", cabinController.getMyCabinBookings);
router.post("/check-cabin-availability", cabinController.checkAvailability);

module.exports = router;
