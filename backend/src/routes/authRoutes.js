const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
