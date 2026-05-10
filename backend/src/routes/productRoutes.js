const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createProductValidation,
  updateProductValidation,
} = require("../validations/productValidation");

const validateRequest = require("../middleware/validateRequest");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    adminOnly,
    upload.single("image"),
    createProductValidation,
    validateRequest,
    createProduct
  );

router
  .route("/:id")
  .get(getProductById)
  .patch(
    protect,
    adminOnly,
    upload.single("image"),
    updateProductValidation,
    validateRequest,
    updateProduct
  )
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;