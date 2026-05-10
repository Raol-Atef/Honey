const { body } = require("express-validator");

const createOrderValidation = [
  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street is required"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("shippingAddress.postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required"),

  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("paymentMethod")
    .optional()
    .isIn(["cash_on_delivery", "card", "wallet"])
    .withMessage("Payment method must be cash_on_delivery, card, or wallet"),
];

const updateOrderStatusValidation = [
  body("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage(
      "Order status must be pending, confirmed, processing, shipped, delivered, or cancelled"
    ),

  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Payment status must be pending, paid, failed, or refunded"),
];

module.exports = {
  createOrderValidation,
  updateOrderStatusValidation,
};