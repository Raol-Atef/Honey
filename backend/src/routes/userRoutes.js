const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUserStatus,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.patch("/:id/status", protect, adminOnly, updateUserStatus);

module.exports = router;