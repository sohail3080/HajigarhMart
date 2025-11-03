const asyncHandler = require('../middleware/asyncHandler');
const UserService = require('../services/user.service');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await UserService.registerUser(req.body);
  successResponse(res, 201, 'User registered successfully', user);
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await UserService.loginUser(email, password);
  successResponse(res, 200, 'Login successful', result);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await UserService.getUserById(req.user.id);
  successResponse(res, 200, 'User retrieved successfully', user);
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await UserService.updateUser(req.user.id, req.body);
  successResponse(res, 200, 'Profile updated successfully', user);
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await UserService.deleteUser(req.params.id);
  successResponse(res, 200, 'User deleted successfully');
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await UserService.getAllUsers(req.query);
  successResponse(res, 200, 'Users retrieved successfully', users);
});

