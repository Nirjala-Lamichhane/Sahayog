const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const ambulanceController = require("../controllers/ambulanceController");

const router = express.Router();

router.post("/request", authMiddleware, ambulanceController.requestAmbulance);
router.get("/my-requests", authMiddleware, ambulanceController.getMyRequests);
router.get("/:id", authMiddleware, ambulanceController.getAmbulanceById);

router.get("/", authMiddleware, adminMiddleware, ambulanceController.getAllRequests);
router.get("/pending", authMiddleware, adminMiddleware, ambulanceController.getPendingRequests);
router.put("/:id/approve", authMiddleware, adminMiddleware, ambulanceController.approveRequest);
router.put("/:id/reject", authMiddleware, adminMiddleware, ambulanceController.rejectRequest);
router.put("/:id/complete", authMiddleware, adminMiddleware, ambulanceController.completeRequest);

module.exports = router;
