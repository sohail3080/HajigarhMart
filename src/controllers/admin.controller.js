const asyncHandler = require('../middleware/asyncHandler');
const AdminService = require('../services/admin.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const stats = await AdminService.getDashboardStats();
  successResponse(res, 200, 'Dashboard statistics retrieved', stats);
});

/**
 * @desc    Get all pending approvals
 * @route   GET /api/admin/approvals
 * @access  Private (Admin)
 */
exports.getPendingApprovals = asyncHandler(async (req, res, next) => {
  const result = await AdminService.getPendingApprovals();
  successResponse(res, 200, 'Pending approvals retrieved', result);
});

/**
 * @desc    Approve user (shop owner/delivery)
 * @route   PATCH /api/admin/users/:id/approve
 * @access  Private (Admin)
 */
exports.approveUser = asyncHandler(async (req, res, next) => {
  const user = await AdminService.approveUser(req.params.id);
  successResponse(res, 200, 'User approved successfully', user);
});

/**
 * @desc    Reject user (shop owner/delivery)
 * @route   PATCH /api/admin/users/:id/reject
 * @access  Private (Admin)
 */
exports.rejectUser = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const user = await AdminService.rejectUser(req.params.id, reason);
  successResponse(res, 200, 'User rejected', user);
});

/**
 * @desc    Get financial reports
 * @route   GET /api/admin/reports/financial
 * @access  Private (Admin)
 */
exports.getFinancialReport = asyncHandler(async (req, res, next) => {
  const report = await AdminService.getFinancialReport(req.query);
  successResponse(res, 200, 'Financial report retrieved', report);
});

/**
 * @desc    Get platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
exports.getPlatformAnalytics = asyncHandler(async (req, res, next) => {
  const analytics = await AdminService.getPlatformAnalytics(req.query);
  successResponse(res, 200, 'Platform analytics retrieved', analytics);
});

/**
 * @desc    Manage commission rates
 * @route   PATCH /api/admin/shops/:id/commission
 * @access  Private (Admin)
 */
exports.updateShopCommission = asyncHandler(async (req, res, next) => {
  const { commission } = req.body;
  const shop = await AdminService.updateShopCommission(req.params.id, commission);
  successResponse(res, 200, 'Commission updated successfully', shop);
});

