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
 * Product validation
 */
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value > 0)
    .withMessage('Price must be greater than 0'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isNumeric()
    .withMessage('Stock must be a number')
    .custom((value) => value >= 0)
    .withMessage('Stock cannot be negative'),
  validate,
];


