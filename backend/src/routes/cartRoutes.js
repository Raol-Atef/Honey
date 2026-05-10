const express = require("express");

const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const {
  addToCartValidation,
  updateCartItemValidation,
} = require("../validations/cartValidation");

const validateRequest = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getMyCart)
  .post(addToCartValidation, validateRequest, addToCart)
  .delete(clearCart);

router
  .route("/items/:itemId")
  .patch(updateCartItemValidation, validateRequest, updateCartItem)
  .delete(removeCartItem);

module.exports = router;