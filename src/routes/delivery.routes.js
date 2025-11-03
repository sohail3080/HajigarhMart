const express = require('express');
const router = express.Router();
const {
  getAllDeliveries,
  getMyDeliveries,
  getDelivery,
  acceptDelivery,
  rejectDelivery,
  updateDeliveryStatus,
  updateLocation,
  completeDelivery,
  getDeliveryStats,
  toggleAvailability,
} = require('../controllers/delivery.controller');
const { protect, authorize } = require('../middleware/auth');

// Admin routes
router.get('/', protect, authorize('admin'), getAllDeliveries);

// Delivery Personnel routes
router.get('/my-deliveries', protect, authorize('delivery'), getMyDeliveries);
router.get('/stats', protect, authorize('delivery'), getDeliveryStats);
router.patch('/toggle-availability', protect, authorize('delivery'), toggleAvailability);
router.patch('/:id/accept', protect, authorize('delivery'), acceptDelivery);
router.patch('/:id/reject', protect, authorize('delivery'), rejectDelivery);
router.patch('/:id/status', protect, authorize('delivery'), updateDeliveryStatus);
router.patch('/:id/location', protect, authorize('delivery'), updateLocation);
router.patch('/:id/complete', protect, authorize('delivery'), completeDelivery);

// Common protected routes
router.get('/:id', protect, getDelivery);

module.exports = router;

