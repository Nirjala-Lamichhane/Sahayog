const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const adminController = require("../controllers/adminController");
const reportController = require("../controllers/reportController");
const ratingController = require("../controllers/ratingController");
const upload = require("../routes/upload");

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get("/dashboard/summary", adminController.getDashboardSummary);


router.post("/users", adminController.createUser);
router.get("/users", adminController.getUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/bookings", adminController.getBookings);
router.get("/appointments", adminController.getAppointments);
router.put("/appointments/:id/confirm", adminController.confirmAppointment);
router.put("/appointments/:id", adminController.updateAppointment);
router.delete("/appointments/:id", adminController.deleteAppointment);

router.get("/transactions", adminController.getTransactions);
router.get("/transactions/pending", adminController.getPendingTransactions);
router.put("/transactions/:id/approve", adminController.approveTransaction);
router.put("/transactions/:id/complete", adminController.completeTransaction);

router.get("/reports", adminController.getReports);
router.post("/reports", upload.single("image"), reportController.createReport);
router.put("/reports/:id", upload.single("image"), reportController.updateReport);
router.delete("/reports/:id", reportController.deleteReport);

router.get("/ratings/approved", adminController.getApprovedRatings);
router.get("/ratings/pending", adminController.getPendingRatings);
router.put("/ratings/:id/approve", ratingController.approveRating);
router.put("/ratings/:id/reject", ratingController.rejectRating);

router.get("/cabin-bookings", adminController.getCabinBookings);
router.get("/cabin-bookings/pending", adminController.getPendingCabinBookings);
router.put("/cabin-bookings/:id/approve", adminController.approveCabinBooking);
router.put("/cabin-bookings/:id/reject", adminController.rejectCabinBooking);

router.get("/ambulance", adminController.getAmbulanceRequests);
router.get("/ambulance/pending", adminController.getPendingAmbulanceRequests);
router.put("/ambulance/:id/approve", adminController.approveAmbulanceRequest);
router.put("/ambulance/:id/reject", adminController.rejectAmbulanceRequest);
router.put("/ambulance/:id/complete", adminController.completeAmbulanceRequest);

router.get("/notifications", adminController.getNotifications);

module.exports = router;
