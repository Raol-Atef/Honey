const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const populateCart = async (cartId) => {
  return await Cart.findById(cartId).populate({
    path: "items.product",
    select:
      "name description price discountPrice stockQuantity image weight origin honeyType isActive",
    populate: {
      path: "category",
      select: "name description image",
    },
  });
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

const getMyCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populatedCart = await populateCart(cart._id);

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        cart: populatedCart,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const requestedQuantity = Number(quantity);

    if (product.stockQuantity < requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} item(s) available in stock`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const productPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    if (existingItem) {
      const newQuantity = existingItem.quantity + requestedQuantity;

      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} item(s) available in stock`,
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.priceAtTime = productPrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: requestedQuantity,
        priceAtTime: productPrice,
      });
    }

    await cart.save();

    const populatedCart = await populateCart(cart._id);

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cart: populatedCart,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(cartItem.product);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const newQuantity = Number(quantity);

    if (product.stockQuantity < newQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} item(s) available in stock`,
      });
    }

    cartItem.quantity = newQuantity;
    cartItem.priceAtTime =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    await cart.save();

    const populatedCart = await populateCart(cart._id);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: {
        cart: populatedCart,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items.pull(itemId);

    await cart.save();

    const populatedCart = await populateCart(cart._id);

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: {
        cart: populatedCart,
      },
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};