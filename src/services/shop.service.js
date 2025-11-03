const Shop = require('../models/Shop.model');
const User = require('../models/User.model');
const ErrorResponse = require('../utils/errorResponse');

class ShopService {
  /**
   * Create a new shop
   */
  async createShop(shopData) {
    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: shopData.owner });
    if (existingShop) {
      throw new ErrorResponse('You already have a registered shop', 400);
    }

    const shop = await Shop.create(shopData);

    // Update user's shop reference
    await User.findByIdAndUpdate(shopData.owner, { shop: shop._id });

    return shop;
  }

  /**
   * Get all shops with filters
   */
  async getAllShops(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by approval status
    if (queryParams.approvalStatus) {
      query.approvalStatus = queryParams.approvalStatus;
    } else {
      // Default: only show approved shops for public
      query.approvalStatus = 'approved';
    }

    // Filter by category
    if (queryParams.category) {
      query.category = queryParams.category;
    }

    // Filter by city
    if (queryParams.city) {
      query['address.city'] = { $regex: queryParams.city, $options: 'i' };
    }

    // Search by name
    if (queryParams.search) {
      query.name = { $regex: queryParams.search, $options: 'i' };
    }

    // Only active shops
    if (queryParams.isActive !== 'false') {
      query.isActive = true;
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Shop.countDocuments(query);

    return {
      shops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get nearby shops based on coordinates
   */
  async getNearbyShops(latitude, longitude, radius = 10) {
    if (!latitude || !longitude) {
      throw new ErrorResponse('Please provide latitude and longitude', 400);
    }

    const radiusInRadians = radius / 6371; // Earth radius in km

    const shops = await Shop.find({
      'address.coordinates': {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusInRadians],
        },
      },
      approvalStatus: 'approved',
      isActive: true,
    }).populate('owner', 'name phone');

    return { shops, count: shops.length };
  }

  /**
   * Get shop by ID
   */
  async getShopById(shopId) {
    const shop = await Shop.findById(shopId).populate('owner', 'name email phone');
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }
    return shop;
  }

  /**
   * Update shop
   */
  async updateShop(shopId, updateData, userId) {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    // Check ownership
    if (shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to update this shop', 403);
    }

    // Don't allow updating approval status through this route
    delete updateData.approvalStatus;
    delete updateData.owner;

    const updatedShop = await Shop.findByIdAndUpdate(shopId, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedShop;
  }

  /**
   * Delete shop
   */
  async deleteShop(shopId) {
    const shop = await Shop.findByIdAndDelete(shopId);
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }
    return true;
  }

  /**
   * Approve shop
   */
  async approveShop(shopId) {
    const shop = await Shop.findByIdAndUpdate(
      shopId,
      {
        approvalStatus: 'approved',
        $unset: { rejectionReason: 1 },
      },
      { new: true }
    );

    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    // Also approve the shop owner user
    await User.findByIdAndUpdate(shop.owner, { approvalStatus: 'approved' });

    return shop;
  }

  /**
   * Reject shop
   */
  async rejectShop(shopId, reason) {
    const shop = await Shop.findByIdAndUpdate(
      shopId,
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    // Also reject the shop owner user
    await User.findByIdAndUpdate(shop.owner, {
      approvalStatus: 'rejected',
      rejectionReason: reason,
    });

    return shop;
  }

  /**
   * Toggle shop open/close status
   */
  async toggleShopStatus(shopId, userId) {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    // Check ownership
    if (shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    shop.isOpen = !shop.isOpen;
    await shop.save();

    return shop;
  }

  /**
   * Get shop statistics
   */
  async getShopStatistics(shopId, userId) {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    // Check ownership
    if (shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    const Order = require('../models/Order.model');
    const Product = require('../models/Product.model');

    // Get order statistics
    const totalOrders = await Order.countDocuments({ shop: shopId });
    const completedOrders = await Order.countDocuments({
      shop: shopId,
      orderStatus: 'delivered',
    });
    const pendingOrders = await Order.countDocuments({
      shop: shopId,
      orderStatus: { $in: ['placed', 'confirmed', 'preparing'] },
    });

    // Get revenue statistics
    const revenueData = await Order.aggregate([
      { $match: { shop: shop._id, orderStatus: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalCommission: { $sum: { $multiply: ['$pricing.total', shop.commission / 100] } },
        },
      },
    ]);

    const totalProducts = await Product.countDocuments({ shop: shopId, isActive: true });

    return {
      shop: {
        name: shop.name,
        ratings: shop.ratings,
        numOfReviews: shop.numOfReviews,
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
      },
      revenue: revenueData[0] || { totalRevenue: 0, totalCommission: 0 },
      products: {
        total: totalProducts,
      },
    };
  }
}

module.exports = new ShopService();

