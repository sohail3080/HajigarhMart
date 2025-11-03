const asyncHandler = require('../middleware/asyncHandler');
const DeliveryService = require('../services/delivery.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Get all deliveries
 * @route   GET /api/deliveries
 * @access  Private (Admin)
 */
exports.getAllDeliveries = asyncHandler(async (req, res, next) => {
  const result = await DeliveryService.getAllDeliveries(req.query);
  successResponse(res, 200, 'Deliveries retrieved successfully', result);
});

/**
 * @desc    Get assigned deliveries for delivery person
 * @route   GET /api/deliveries/my-deliveries
 * @access  Private (Delivery Personnel)
 */
exports.getMyDeliveries = asyncHandler(async (req, res, next) => {
  const result = await DeliveryService.getDeliveryPersonDeliveries(req.user.id, req.query);
  successResponse(res, 200, 'Your deliveries retrieved successfully', result);
});

/**
 * @desc    Get single delivery
 * @route   GET /api/deliveries/:id
 * @access  Private
 */
exports.getDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveryService.getDeliveryById(req.params.id);
  successResponse(res, 200, 'Delivery retrieved successfully', delivery);
});

/**
 * @desc    Accept delivery
 * @route   PATCH /api/deliveries/:id/accept
 * @access  Private (Delivery Personnel)
 */
exports.acceptDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveryService.acceptDelivery(req.params.id, req.user.id);
  successResponse(res, 200, 'Delivery accepted', delivery);
});

/**
 * @desc    Reject delivery
 * @route   PATCH /api/deliveries/:id/reject
 * @access  Private (Delivery Personnel)
 */
exports.rejectDelivery = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const delivery = await DeliveryService.rejectDelivery(req.params.id, req.user.id, reason);
  successResponse(res, 200, 'Delivery rejected', delivery);
});

/**
 * @desc    Update delivery status
 * @route   PATCH /api/deliveries/:id/status
 * @access  Private (Delivery Personnel)
 */
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;
  const delivery = await DeliveryService.updateDeliveryStatus(req.params.id, status, req.user.id, note);
  successResponse(res, 200, 'Delivery status updated', delivery);
});

/**
 * @desc    Update delivery location
 * @route   PATCH /api/deliveries/:id/location
 * @access  Private (Delivery Personnel)
 */
exports.updateLocation = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;
  const delivery = await DeliveryService.updateLocation(req.params.id, latitude, longitude);
  successResponse(res, 200, 'Location updated', delivery);
});

/**
 * @desc    Complete delivery
 * @route   PATCH /api/deliveries/:id/complete
 * @access  Private (Delivery Personnel)
 */
exports.completeDelivery = asyncHandler(async (req, res, next) => {
  const { verificationCode, proofOfDelivery } = req.body;
  const delivery = await DeliveryService.completeDelivery(
    req.params.id,
    req.user.id,
    verificationCode,
    proofOfDelivery
  );
  successResponse(res, 200, 'Delivery completed successfully', delivery);
});

/**
 * @desc    Get delivery statistics
 * @route   GET /api/deliveries/stats
 * @access  Private (Delivery Personnel)
 */
exports.getDeliveryStats = asyncHandler(async (req, res, next) => {
  const stats = await DeliveryService.getDeliveryPersonStats(req.user.id);
  successResponse(res, 200, 'Delivery statistics retrieved', stats);
});

/**
 * @desc    Toggle availability
 * @route   PATCH /api/deliveries/toggle-availability
 * @access  Private (Delivery Personnel)
 */
exports.toggleAvailability = asyncHandler(async (req, res, next) => {
  const user = await DeliveryService.toggleAvailability(req.user.id);
  successResponse(res, 200, 'Availability updated', { isAvailable: user.isAvailable });
});

