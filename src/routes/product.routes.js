const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getShopProducts,
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../validators/product.validator');

// Public routes
router.get('/', getAllProducts);
router.get('/shop/:shopId', getShopProducts);
router.get('/:id', getProduct);

// Shop Owner routes
router.post('/', protect, authorize('shop_owner'), validateProduct, createProduct);
router.put('/:id', protect, authorize('shop_owner'), updateProduct);
router.delete('/:id', protect, authorize('shop_owner'), deleteProduct);

module.exports = router;

