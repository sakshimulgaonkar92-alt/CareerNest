const express = require("express");
const router = express.Router();
const { register, login, sendOtp, verify, signup } = require("../controllers/authController");

router.post("/register", signup);
router.post("/login", login);
router.post("/otp", sendOtp);
router.post("/verify", verify);

module.exports = router;
