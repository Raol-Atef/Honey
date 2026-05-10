const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  cancelMyOrder,
} = require("../controllers/orderController");

const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require("../validations/orderValidation");

const validateRequest = require("../middleware/validateRequest");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createOrderValidation, validateRequest, createOrder);

router.get("/my-orders", getMyOrders);
router.get("/my-orders/:id", getMyOrderById);
router.patch("/my-orders/:id/cancel", cancelMyOrder);

router.get("/admin/all", adminOnly, getAllOrders);
router.get("/admin/:id", adminOnly, getOrderByIdAdmin);
router.patch(
  "/admin/:id/status",
  adminOnly,
  updateOrderStatusValidation,
  validateRequest,
  updateOrderStatus
);

module.exports = router;