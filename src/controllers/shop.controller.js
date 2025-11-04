const asyncHandler = require('../middleware/asyncHandler');
const ShopService = require('../services/shop.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Register a new shop
 * @route   POST /api/shops
 * @access  Private (Shop Owner)
 */
exports.registerShop = asyncHandler(async (req, res, next) => {
  req.body.owner = req.user.id;
  const shop = await ShopService.createShop(req.body);
  successResponse(res, 201, 'Shop registered successfully. Waiting for admin approval.', shop);
});

/**
 * @desc    Get all shops (with filters)
 * @route   GET /api/shops
 * @access  Public
 */
exports.getAllShops = asyncHandler(async (req, res, next) => {
  const result = await ShopService.getAllShops(req.query);
  successResponse(res, 200, 'Shops retrieved successfully', result);
});

/**
 * @desc    Get nearby shops
 * @route   GET /api/shops/nearby
 * @access  Public
 */
exports.getNearbyShops = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, radius } = req.query;
  const result = await ShopService.getNearbyShops(latitude, longitude, radius);
  successResponse(res, 200, 'Nearby shops retrieved successfully', result);
});

/**
 * @desc    Get my shop (backward compatible - returns all shops)
 * @route   GET /api/shops/my-shop
 * @access  Private (Shop Owner)
 */
exports.getMyShop = asyncHandler(async (req, res, next) => {
  const shops = await ShopService.getShopByOwnerId(req.user.id);
  successResponse(res, 200, 'Shops retrieved successfully', shops);
});

/**
 * @desc    Get all my shops
 * @route   GET /api/shops/my-shops
 * @access  Private (Shop Owner)
 */
exports.getMyShops = asyncHandler(async (req, res, next) => {
  const shops = await ShopService.getShopsByOwnerId(req.user.id);
  successResponse(res, 200, 'Shops retrieved successfully', shops);
});

/**
 * @desc    Get single shop
 * @route   GET /api/shops/:id
 * @access  Public
 */
exports.getShop = asyncHandler(async (req, res, next) => {
  const shop = await ShopService.getShopById(req.params.id);
  successResponse(res, 200, 'Shop retrieved successfully', shop);
});

/**
 * @desc    Update shop
 * @route   PUT /api/shops/:id
 * @access  Private (Shop Owner)
 */
exports.updateShop = asyncHandler(async (req, res, next) => {
  const shop = await ShopService.updateShop(req.params.id, req.body, req.user.id);
  successResponse(res, 200, 'Shop updated successfully', shop);
});

/**
 * @desc    Delete shop
 * @route   DELETE /api/shops/:id
 * @access  Private (Admin)
 */
exports.deleteShop = asyncHandler(async (req, res, next) => {
  await ShopService.deleteShop(req.params.id);
  successResponse(res, 200, 'Shop deleted successfully');
});

/**
 * @desc    Approve shop
 * @route   PATCH /api/shops/:id/approve
 * @access  Private (Admin)
 */
exports.approveShop = asyncHandler(async (req, res, next) => {
  const shop = await ShopService.approveShop(req.params.id);
  successResponse(res, 200, 'Shop approved successfully', shop);
});

/**
 * @desc    Reject shop
 * @route   PATCH /api/shops/:id/reject
 * @access  Private (Admin)
 */
exports.rejectShop = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const shop = await ShopService.rejectShop(req.params.id, reason);
  successResponse(res, 200, 'Shop rejected', shop);
});

/**
 * @desc    Toggle shop open/close status
 * @route   PATCH /api/shops/:id/toggle-status
 * @access  Private (Shop Owner)
 */
exports.toggleShopStatus = asyncHandler(async (req, res, next) => {
  const shop = await ShopService.toggleShopStatus(req.params.id, req.user.id);
  successResponse(res, 200, 'Shop status updated', shop);
});

/**
 * @desc    Get shop statistics
 * @route   GET /api/shops/:id/stats
 * @access  Private (Shop Owner)
 */
exports.getShopStats = asyncHandler(async (req, res, next) => {
  const stats = await ShopService.getShopStatistics(req.params.id, req.user.id);
  successResponse(res, 200, 'Shop statistics retrieved successfully', stats);
});

