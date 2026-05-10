const { body } = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),

  body("stockQuantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("weight.value")
    .notEmpty()
    .withMessage("Weight value is required")
    .isFloat({ min: 0 })
    .withMessage("Weight value must be a positive number"),

  body("weight.unit")
    .optional()
    .isIn(["g", "kg"])
    .withMessage("Weight unit must be either g or kg"),

  body("origin")
    .trim()
    .notEmpty()
    .withMessage("Product origin is required")
    .isLength({ max: 100 })
    .withMessage("Origin cannot exceed 100 characters"),

  body("honeyType")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Honey type cannot exceed 100 characters"),

  body("flavorProfile")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Flavor profile cannot exceed 300 characters"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),

  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("weight.value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight value must be a positive number"),

  body("weight.unit")
    .optional()
    .isIn(["g", "kg"])
    .withMessage("Weight unit must be either g or kg"),

  body("origin")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Origin cannot exceed 100 characters"),

  body("honeyType")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Honey type cannot exceed 100 characters"),

  body("flavorProfile")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Flavor profile cannot exceed 300 characters"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

module.exports = {
  createProductValidation,
  updateProductValidation,
};