const express = require("express");

const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const router = express.Router();

router.get("/models", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All models loaded successfully",
    models: {
      user: User.modelName,
      category: Category.modelName,
      product: Product.modelName,
      cart: Cart.modelName,
      order: Order.modelName,
    },
  });
});

module.exports = router;