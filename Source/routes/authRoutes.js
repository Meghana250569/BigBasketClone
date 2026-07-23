const express = require("express");
const router = express.Router();

const {
  generateOtp,
  verifyOtp,
  getProfile
} = require("../controllers/authController");

const  authMiddleware= require("../middleware/auth");

router.post("/generateotp", generateOtp);
router.post("/verifyotp", verifyOtp);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;