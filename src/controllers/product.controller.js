const asyncHandler = require('../middleware/asyncHandler');
const ProductService = require('../services/product.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.shop = req.user.shop;
  const product = await ProductService.createProduct(req.body, req.user.id);
  successResponse(res, 201, 'Product created successfully', product);
});

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const result = await ProductService.getAllProducts(req.query);
  successResponse(res, 200, 'Products retrieved successfully', result);
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductService.getProductById(req.params.id);
  successResponse(res, 200, 'Product retrieved successfully', product);
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductService.updateProduct(req.params.id, req.body, req.user.id);
  successResponse(res, 200, 'Product updated successfully', product);
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  await ProductService.deleteProduct(req.params.id, req.user.id);
  successResponse(res, 200, 'Product deleted successfully');
});

/**
 * @desc    Create product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
/**
 * @desc    Get shop products
 * @route   GET /api/products/shop/:shopId
 * @access  Public
 */
exports.getShopProducts = asyncHandler(async (req, res, next) => {
  const result = await ProductService.getShopProducts(req.params.shopId, req.query);
  successResponse(res, 200, 'Shop products retrieved successfully', result);
});

