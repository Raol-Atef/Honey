const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validations/categoryValidation");

const validateRequest = require("../middleware/validateRequest");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    adminOnly,
    upload.single("image"),
    createCategoryValidation,
    validateRequest,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryById)
  .patch(
    protect,
    adminOnly,
    upload.single("image"),
    updateCategoryValidation,
    validateRequest,
    updateCategory
  )
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;