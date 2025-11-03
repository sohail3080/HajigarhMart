const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getPendingApprovals,
  approveUser,
  rejectUser,
  getFinancialReport,
  getPlatformAnalytics,
  updateShopCommission,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are admin-only
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/approvals', getPendingApprovals);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.get('/reports/financial', getFinancialReport);
router.get('/analytics', getPlatformAnalytics);
router.patch('/shops/:id/commission', updateShopCommission);

module.exports = router;

