const User = require('../models/User.model');
const ErrorResponse = require('../utils/errorResponse');

class UserService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { name, email, phone, password, role, address, vehicleType, vehicleNumber, drivingLicense } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      throw new ErrorResponse('User with this email or phone already exists', 400);
    }

    // Prepare user data
    const newUserData = {
      name,
      email,
      phone,
      password,
      role: role || 'customer', // Default to customer if not specified
    };

    // Add address if provided
    if (address) {
      newUserData.address = address;
    }

    // Add vehicle details for delivery personnel
    if (role === 'delivery') {
      if (!vehicleType) {
        throw new ErrorResponse('Vehicle type is required for delivery personnel', 400);
      }
      newUserData.vehicleType = vehicleType;
      newUserData.vehicleNumber = vehicleNumber;
      newUserData.drivingLicense = drivingLicense;
    }

    // Create user
    const user = await User.create(newUserData);

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus,
        address: user.address,
        vehicleType: user.vehicleType,
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
    const user = await User.findOne({ email }).select('+password').populate('shop');
    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ErrorResponse('Your account has been deactivated', 403);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check approval status for shop_owner and delivery
    if (['shop_owner', 'delivery'].includes(user.role)) {
      if (user.approvalStatus === 'pending') {
        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            approvalStatus: user.approvalStatus,
          },
          token: user.getSignedJwtToken(),
          message: 'Your account is pending approval from admin',
        };
      } else if (user.approvalStatus === 'rejected') {
        throw new ErrorResponse(
          `Your account has been rejected. Reason: ${user.rejectionReason || 'Not specified'}`,
          403
        );
      }
    }

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus,
        address: user.address,
        shop: user.shop,
        avatar: user.avatar,
        vehicleType: user.vehicleType,
        isAvailable: user.isAvailable,
      },
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).populate('shop');
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

