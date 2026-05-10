const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0,
    },

    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product seller/admin is required"],
    },

    image: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    weight: {
      value: {
        type: Number,
        required: [true, "Product weight value is required"],
        min: [0, "Weight cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["g", "kg"],
        default: "g",
      },
    },

    origin: {
      type: String,
      required: [true, "Product origin is required"],
      trim: true,
      maxlength: [100, "Origin cannot exceed 100 characters"],
    },

    honeyType: {
      type: String,
      trim: true,
      maxlength: [100, "Honey type cannot exceed 100 characters"],
      default: "",
    },

    flavorProfile: {
      type: String,
      trim: true,
      maxlength: [300, "Flavor profile cannot exceed 300 characters"],
      default: "",
    },

    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: [0, "Rating count cannot be negative"],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text", honeyType: "text", tags: "text" });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;