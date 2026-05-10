const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Cart item product is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Cart item quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    priceAtTime: {
      type: Number,
      required: [true, "Product price at time is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart user is required"],
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) => total + item.quantity * item.priceAtTime,
    0
  );
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;