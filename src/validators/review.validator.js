const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Validation middleware wrapper
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ErrorResponse(errorMessages.join(', '), 400);
  }
  next();
};

/**
 * Review creation validation
 */
exports.validateReview = [
  body('order')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID'),
  body('reviewType')
    .notEmpty()
    .withMessage('Review type is required')
    .isIn(['shop', 'product', 'delivery'])
    .withMessage('Review type must be either shop, product, or delivery'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  body('product')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID'),
  validate,
];

