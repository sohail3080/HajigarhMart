const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct, validateReview } = require('../validators/product.validator');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', protect, validateReview, createProductReview);

// Admin routes
router.post('/', protect, authorize('admin'), validateProduct, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;

