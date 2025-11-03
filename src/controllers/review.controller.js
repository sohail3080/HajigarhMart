const asyncHandler = require('../middleware/asyncHandler');
const ReviewService = require('../services/review.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.customer = req.user.id;
  const review = await ReviewService.createReview(req.body);
  successResponse(res, 201, 'Review submitted successfully', review);
});

/**
 * @desc    Get reviews for a shop
 * @route   GET /api/reviews/shop/:shopId
 * @access  Public
 */
exports.getShopReviews = asyncHandler(async (req, res, next) => {
  const result = await ReviewService.getShopReviews(req.params.shopId, req.query);
  successResponse(res, 200, 'Shop reviews retrieved successfully', result);
});

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const result = await ReviewService.getProductReviews(req.params.productId, req.query);
  successResponse(res, 200, 'Product reviews retrieved successfully', result);
});

/**
 * @desc    Get reviews for a delivery person
 * @route   GET /api/reviews/delivery/:deliveryPersonId
 * @access  Public
 */
exports.getDeliveryPersonReviews = asyncHandler(async (req, res, next) => {
  const result = await ReviewService.getDeliveryPersonReviews(req.params.deliveryPersonId, req.query);
  successResponse(res, 200, 'Delivery person reviews retrieved successfully', result);
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private (Customer)
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await ReviewService.updateReview(req.params.id, req.body, req.user.id);
  successResponse(res, 200, 'Review updated successfully', review);
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Customer/Admin)
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  await ReviewService.deleteReview(req.params.id, req.user.id, req.user.role);
  successResponse(res, 200, 'Review deleted successfully');
});

/**
 * @desc    Respond to review
 * @route   POST /api/reviews/:id/respond
 * @access  Private (Shop Owner)
 */
exports.respondToReview = asyncHandler(async (req, res, next) => {
  const { comment } = req.body;
  const review = await ReviewService.respondToReview(req.params.id, req.user.id, comment);
  successResponse(res, 200, 'Response added successfully', review);
});

/**
 * @desc    Mark review as helpful
 * @route   PATCH /api/reviews/:id/helpful
 * @access  Private
 */
exports.markHelpful = asyncHandler(async (req, res, next) => {
  const review = await ReviewService.markReviewHelpful(req.params.id);
  successResponse(res, 200, 'Review marked as helpful', review);
});

