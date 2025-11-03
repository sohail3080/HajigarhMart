const asyncHandler = require('../middleware/asyncHandler');
const OrderService = require('../services/order.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.customer = req.user.id;
  const order = await OrderService.createOrder(req.body);
  successResponse(res, 201, 'Order placed successfully', order);
});

/**
 * @desc    Get all orders (with filters)
 * @route   GET /api/orders
 * @access  Private (Admin)
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const result = await OrderService.getAllOrders(req.query);
  successResponse(res, 200, 'Orders retrieved successfully', result);
});

/**
 * @desc    Get customer orders
 * @route   GET /api/orders/my-orders
 * @access  Private (Customer)
 */
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const result = await OrderService.getCustomerOrders(req.user.id, req.query);
  successResponse(res, 200, 'Your orders retrieved successfully', result);
});

/**
 * @desc    Get shop orders
 * @route   GET /api/orders/shop-orders
 * @access  Private (Shop Owner)
 */
exports.getShopOrders = asyncHandler(async (req, res, next) => {
  const result = await OrderService.getShopOrders(req.user.shop, req.query);
  successResponse(res, 200, 'Shop orders retrieved successfully', result);
});

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderService.getOrderById(req.params.id, req.user);
  successResponse(res, 200, 'Order retrieved successfully', order);
});

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Shop Owner/Admin)
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;
  const order = await OrderService.updateOrderStatus(req.params.id, status, req.user.id, note);
  successResponse(res, 200, 'Order status updated successfully', order);
});

/**
 * @desc    Cancel order
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private (Customer/Shop Owner/Admin)
 */
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const order = await OrderService.cancelOrder(req.params.id, req.user.id, reason);
  successResponse(res, 200, 'Order cancelled successfully', order);
});

/**
 * @desc    Assign delivery to order
 * @route   PATCH /api/orders/:id/assign-delivery
 * @access  Private (Shop Owner/Admin)
 */
exports.assignDelivery = asyncHandler(async (req, res, next) => {
  const { deliveryPersonId } = req.body;
  const order = await OrderService.assignDelivery(req.params.id, deliveryPersonId);
  successResponse(res, 200, 'Delivery assigned successfully', order);
});

