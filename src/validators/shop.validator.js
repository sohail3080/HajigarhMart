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
 * Shop registration validation
 */
exports.validateShop = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Shop description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Shop category is required')
    .isIn(['Grocery', 'Medical', 'Electronics', 'Clothing', 'Hardware', 'Stationery', 'Restaurant', 'Bakery', 'Other'])
    .withMessage('Invalid category'),
  body('phone')
    .notEmpty()
    .withMessage('Shop phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode')
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid Indian pincode'),
  body('address.coordinates.latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('address.coordinates.longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  validate,
];

