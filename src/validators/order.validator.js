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
 * Order creation validation
 */
exports.validateOrder = [
  body('shop')
    .notEmpty()
    .withMessage('Shop ID is required')
    .isMongoId()
    .withMessage('Invalid shop ID'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Delivery street address is required'),
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Delivery city is required'),
  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Delivery state is required'),
  body('deliveryAddress.pincode')
    .notEmpty()
    .withMessage('Delivery pincode is required')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid Indian pincode'),
  body('contactPhone')
    .notEmpty()
    .withMessage('Contact phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cod', 'online'])
    .withMessage('Payment method must be either cod or online'),
  validate,
];

