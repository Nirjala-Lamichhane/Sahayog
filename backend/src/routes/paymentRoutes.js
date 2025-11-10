const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/validate", authMiddleware, paymentController.validatePaymentAmount);
router.post("/cabin", authMiddleware, paymentController.processCabinPayment);
router.post("/ambulance", authMiddleware, paymentController.processAmbulancePayment);
router.post("/appointment", authMiddleware, paymentController.processAppointmentPayment);
router.get("/history", authMiddleware, paymentController.getPaymentHistory);

module.exports = router;
