const User = require('../models/User.model');
const ErrorResponse = require('../utils/errorResponse');

class UserService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorResponse('User already exists', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Login user
   */
  async loginUser(email, password) {
    // Validate input
    if (!email || !password) {
      throw new ErrorResponse('Please provide email and password', 400);
    }

    // Find user by email (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    return user;
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    return true;
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new UserService();

