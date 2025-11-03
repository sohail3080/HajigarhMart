const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getShopOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  assignDelivery,
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateOrder } = require('../validators/order.validator');

// Customer routes
router.post('/', protect, authorize('customer'), validateOrder, createOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);

// Shop Owner routes
router.get('/shop-orders', protect, authorize('shop_owner'), getShopOrders);
router.patch('/:id/status', protect, authorize('shop_owner', 'admin'), updateOrderStatus);
router.patch('/:id/assign-delivery', protect, authorize('shop_owner', 'admin'), assignDelivery);

// Common protected routes
router.get('/:id', protect, getOrder);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;

