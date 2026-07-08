const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin", "user"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
