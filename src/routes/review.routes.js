const express = require('express');
const router = express.Router();
const {
  createReview,
  getShopReviews,
  getProductReviews,
  getDeliveryPersonReviews,
  updateReview,
  deleteReview,
  respondToReview,
  markHelpful,
} = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateReview } = require('../validators/review.validator');

// Public routes
router.get('/shop/:shopId', getShopReviews);
router.get('/product/:productId', getProductReviews);
router.get('/delivery/:deliveryPersonId', getDeliveryPersonReviews);

// Customer routes
router.post('/', protect, authorize('customer'), validateReview, createReview);
router.put('/:id', protect, authorize('customer'), updateReview);
router.delete('/:id', protect, deleteReview);

// Shop Owner routes
router.post('/:id/respond', protect, authorize('shop_owner'), respondToReview);

// Any authenticated user can mark review as helpful
router.patch('/:id/helpful', protect, markHelpful);

module.exports = router;

