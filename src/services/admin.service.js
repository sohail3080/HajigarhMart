const User = require('../models/User.model');
const Shop = require('../models/Shop.model');
const Order = require('../models/Order.model');
const Transaction = require('../models/Transaction.model');
const ErrorResponse = require('../utils/errorResponse');

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    // User statistics
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalShopOwners = await User.countDocuments({ role: 'shop_owner' });
    const totalDelivery = await User.countDocuments({ role: 'delivery' });

    // Shop statistics
    const totalShops = await Shop.countDocuments({ approvalStatus: 'approved' });
    const pendingShops = await Shop.countDocuments({ approvalStatus: 'pending' });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      orderStatus: { $nin: ['delivered', 'cancelled'] },
    });
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    // Revenue statistics
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalPlatformFees: { $sum: '$pricing.platformFee' },
        },
      },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name')
      .populate('shop', 'name')
      .sort('-createdAt')
      .limit(10);

    return {
      users: {
        customers: totalCustomers,
        shopOwners: totalShopOwners,
        deliveryPersonnel: totalDelivery,
      },
      shops: {
        total: totalShops,
        pending: pendingShops,
      },
      orders: {
        total: totalOrders,
        active: activeOrders,
        completed: completedOrders,
      },
      revenue: revenueData[0] || { totalRevenue: 0, totalPlatformFees: 0 },
      recentOrders,
    };
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals() {
    const pendingShops = await Shop.find({ approvalStatus: 'pending' })
      .populate('owner', 'name email phone')
      .sort('-createdAt');

    const pendingUsers = await User.find({
      role: { $in: ['shop_owner', 'delivery'] },
      approvalStatus: 'pending',
    }).sort('-createdAt');

    return {
      shops: pendingShops,
      users: pendingUsers,
    };
  }

  /**
   * Approve user
   */
  async approveUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        approvalStatus: 'approved',
        $unset: { rejectionReason: 1 },
      },
      { new: true }
    );

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    // If shop owner, also approve their shop
    if (user.role === 'shop_owner' && user.shop) {
      await Shop.findByIdAndUpdate(user.shop, {
        approvalStatus: 'approved',
        $unset: { rejectionReason: 1 },
      });
    }

    return user;
  }

  /**
   * Reject user
   */
  async rejectUser(userId, reason) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    // If shop owner, also reject their shop
    if (user.role === 'shop_owner' && user.shop) {
      await Shop.findByIdAndUpdate(user.shop, {
        approvalStatus: 'rejected',
        rejectionReason: reason,
      });
    }

    return user;
  }

  /**
   * Get financial report
   */
  async getFinancialReport(queryParams) {
    const startDate = queryParams.startDate
      ? new Date(queryParams.startDate)
      : new Date(new Date().setDate(1)); // First day of month
    const endDate = queryParams.endDate ? new Date(queryParams.endDate) : new Date();

    // Orders in date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      orderStatus: 'delivered',
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);
    const totalPlatformFees = orders.reduce((sum, order) => sum + order.pricing.platformFee, 0);
    const totalDeliveryFees = orders.reduce((sum, order) => sum + order.pricing.deliveryFee, 0);

    // Commission by shop
    const commissionByShop = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          orderStatus: 'delivered',
        },
      },
      {
        $lookup: {
          from: 'shops',
          localField: 'shop',
          foreignField: '_id',
          as: 'shopData',
        },
      },
      {
        $unwind: '$shopData',
      },
      {
        $group: {
          _id: '$shop',
          shopName: { $first: '$shopData.name' },
          totalSales: { $sum: '$pricing.total' },
          commission: {
            $sum: {
              $multiply: ['$pricing.total', { $divide: ['$shopData.commission', 100] }],
            },
          },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    return {
      period: { startDate, endDate },
      summary: {
        totalRevenue,
        totalPlatformFees,
        totalDeliveryFees,
        totalOrders: orders.length,
      },
      commissionByShop,
    };
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(queryParams) {
    const days = parseInt(queryParams.days, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Orders over time
    const ordersOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top performing shops
    const topShops = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, orderStatus: 'delivered' } },
      {
        $group: {
          _id: '$shop',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'shops',
          localField: '_id',
          foreignField: '_id',
          as: 'shopData',
        },
      },
      { $unwind: '$shopData' },
    ]);

    // Category-wise sales
    const categoryWiseSales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, orderStatus: 'delivered' } },
      {
        $lookup: {
          from: 'shops',
          localField: 'shop',
          foreignField: '_id',
          as: 'shopData',
        },
      },
      { $unwind: '$shopData' },
      {
        $group: {
          _id: '$shopData.category',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    return {
      ordersOverTime,
      topShops,
      categoryWiseSales,
    };
  }

  /**
   * Update shop commission
   */
  async updateShopCommission(shopId, commission) {
    if (commission < 0 || commission > 100) {
      throw new ErrorResponse('Commission must be between 0 and 100', 400);
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { commission },
      { new: true }
    );

    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    return shop;
  }
}

module.exports = new AdminService();

