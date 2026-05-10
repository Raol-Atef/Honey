const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const parseArrayField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      seller,
      minPrice,
      maxPrice,
      honeyType,
      origin,
      isFeatured,
      sort,
      page = 1,
      limit = 10,
      includeInactive,
    } = req.query;

    const filter = {};

    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.category = category;
    }

    if (seller) {
      if (!mongoose.Types.ObjectId.isValid(seller)) {
        return res.status(400).json({
          success: false,
          message: "Invalid seller ID",
        });
      }

      filter.seller = seller;
    }

    if (honeyType) {
      filter.honeyType = { $regex: honeyType, $options: "i" };
    }

    if (origin) {
      filter.origin = { $regex: origin, $options: "i" };
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "rating") {
      sortOption = { ratingAverage: -1 };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .populate("category", "name description image")
      .populate("seller", "name email role")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      count: products.length,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
      },
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id)
      .populate("category", "name description image")
      .populate("seller", "name email role");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stockQuantity,
      category,
      weight,
      origin,
      honeyType,
      flavorProfile,
      ingredients,
      tags,
      isFeatured,
      isActive,
    } = req.body;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stockQuantity,
      category,
      seller: req.user._id,
      image,
      images: image ? [image] : [],
      weight,
      origin,
      honeyType,
      flavorProfile,
      ingredients: parseArrayField(ingredients),
      tags: parseArrayField(tags),
      isFeatured,
      isActive,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name description image")
      .populate("seller", "name email role");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product: populatedProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.ingredients) {
      updateData.ingredients = parseArrayField(req.body.ingredients);
    }

    if (req.body.tags) {
      updateData.tags = parseArrayField(req.body.tags);
    }

    if (req.file) {
      const image = `/uploads/${req.file.filename}`;
      updateData.image = image;
      updateData.images = [image, ...product.images];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name description image")
      .populate("seller", "name email role");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};