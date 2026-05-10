const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const calculateOrderPrices = (items) => {
  const itemsPrice = items.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  const shippingPrice = itemsPrice >= 1000 ? 0 : 50;
  const taxPrice = Number((itemsPrice * 0.14).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = "cash_on_delivery" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: "One or more products in your cart are no longer available",
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} item(s) available for ${product.name}`,
        });
      }

      const currentPrice =
        product.discountPrice && product.discountPrice > 0
          ? product.discountPrice
          : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: currentPrice,
      });
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderPrices(orderItems);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stockQuantity: -item.quantity,
          },
        },
        { runValidators: true }
      );
    }

    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name image price discountPrice stockQuantity");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: populatedOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image price discountPrice")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Order history retrieved successfully",
      count: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("user", "name email phone")
      .populate("items.product", "name image price discountPrice stockQuantity");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      user,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (user) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      filter.user = user;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name image price discountPrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      count: orders.length,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalOrders,
        totalPages,
      },
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email phone address")
      .populate("items.product", "name image price discountPrice stockQuantity");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;

      if (paymentStatus === "paid" && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    if (orderStatus === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();

      if (order.paymentMethod === "cash_on_delivery") {
        order.paymentStatus = "paid";

        if (!order.paidAt) {
          order.paidAt = new Date();
        }
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("items.product", "name image price discountPrice stockQuantity");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: {
        order: updatedOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

const cancelMyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled after processing has started",
      });
    }

    order.orderStatus = "cancelled";

    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stockQuantity: item.quantity,
          },
        },
        { runValidators: true }
      );
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name image price discountPrice stockQuantity");

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        order: updatedOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  cancelMyOrder,
};