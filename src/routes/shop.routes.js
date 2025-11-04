const express = require('express');
const router = express.Router();
const {
  registerShop,
  getAllShops,
  getNearbyShops,
  getMyShop,
  getShop,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,
  toggleShopStatus,
  getShopStats,
} = require('../controllers/shop.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateShop } = require('../validators/shop.validator');

// Public routes
router.get('/', getAllShops);
router.get('/nearby', getNearbyShops);

// Shop Owner routes (must come before /:id to avoid conflict)
router.get('/my-shop', protect, authorize('shop_owner'), getMyShop);
router.get('/my-shops', protect, authorize('shop_owner'), getMyShop); // Returns all shops
router.post('/', protect, authorize('shop_owner'), validateShop, registerShop);
router.put('/:id', protect, authorize('shop_owner'), updateShop);
router.patch('/:id/toggle-status', protect, authorize('shop_owner'), toggleShopStatus);
router.get('/:id/stats', protect, authorize('shop_owner'), getShopStats);

// Admin routes
router.delete('/:id', protect, authorize('admin'), deleteShop);
router.patch('/:id/approve', protect, authorize('admin'), approveShop);
router.patch('/:id/reject', protect, authorize('admin'), rejectShop);

// Public route (must come last to avoid conflict with specific routes)
router.get('/:id', getShop);

module.exports = router;

