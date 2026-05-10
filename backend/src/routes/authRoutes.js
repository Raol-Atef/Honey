const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");

const {
  signupValidation,
  loginValidation,
} = require("../validations/authValidation");

const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);

module.exports = router;