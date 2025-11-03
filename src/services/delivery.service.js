const Delivery = require('../models/Delivery.model');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Shop = require('../models/Shop.model');
const ErrorResponse = require('../utils/errorResponse');

class DeliveryService {
  /**
   * Create delivery assignment
   */
  async createDelivery(orderId, deliveryPersonId) {
    const order = await Order.findById(orderId).populate('shop');
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
      throw new ErrorResponse('Invalid delivery person', 400);
    }

    if (deliveryPerson.approvalStatus !== 'approved') {
      throw new ErrorResponse('Delivery person is not approved', 400);
    }

    if (!deliveryPerson.isAvailable) {
      throw new ErrorResponse('Delivery person is not available', 400);
    }

    // Calculate delivery fee (you can make this more sophisticated)
    const deliveryFee = order.pricing.deliveryFee;
    const deliveryPersonEarning = deliveryFee * 0.8; // 80% goes to delivery person

    const delivery = await Delivery.create({
      order: orderId,
      deliveryPerson: deliveryPersonId,
      shop: order.shop._id,
      customer: order.customer,
      pickupAddress: {
        street: order.shop.address.street,
        city: order.shop.address.city,
        state: order.shop.address.state,
        pincode: order.shop.address.pincode,
        coordinates: order.shop.address.coordinates,
      },
      deliveryAddress: order.deliveryAddress,
      deliveryFee,
      deliveryPersonEarning,
      timeline: [
        {
          status: 'assigned',
          timestamp: new Date(),
        },
      ],
    });

    return delivery;
  }

  /**
   * Get all deliveries
   */
  async getAllDeliveries(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    const deliveries = await Delivery.find(query)
      .populate('order')
      .populate('deliveryPerson', 'name phone')
      .populate('shop', 'name address')
      .populate('customer', 'name phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Delivery.countDocuments(query);

    return {
      deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get delivery person deliveries
   */
  async getDeliveryPersonDeliveries(deliveryPersonId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { deliveryPerson: deliveryPersonId };

    if (queryParams.status) {
      query.status = queryParams.status;
    }

    const deliveries = await Delivery.find(query)
      .populate('order')
      .populate('shop', 'name address phone')
      .populate('customer', 'name phone address')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Delivery.countDocuments(query);

    return {
      deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get delivery by ID
   */
  async getDeliveryById(deliveryId) {
    const delivery = await Delivery.findById(deliveryId)
      .populate('order')
      .populate('deliveryPerson', 'name phone vehicleType vehicleNumber')
      .populate('shop', 'name address phone')
      .populate('customer', 'name phone');

    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    return delivery;
  }

  /**
   * Accept delivery
   */
  async acceptDelivery(deliveryId, deliveryPersonId) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    if (delivery.deliveryPerson.toString() !== deliveryPersonId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    if (delivery.status !== 'assigned') {
      throw new ErrorResponse('Delivery cannot be accepted', 400);
    }

    delivery.status = 'accepted';
    delivery.timeline.push({
      status: 'accepted',
      timestamp: new Date(),
    });

    await delivery.save();
    return delivery;
  }

  /**
   * Reject delivery
   */
  async rejectDelivery(deliveryId, deliveryPersonId, reason) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    if (delivery.deliveryPerson.toString() !== deliveryPersonId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    delivery.status = 'rejected';
    delivery.rejectionReason = reason;

    await delivery.save();

    // Update order status
    await Order.findByIdAndUpdate(delivery.order, {
      orderStatus: 'confirmed',
      delivery: null,
    });

    return delivery;
  }

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(deliveryId, status, deliveryPersonId, note) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    if (delivery.deliveryPerson.toString() !== deliveryPersonId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    delivery.status = status;
    delivery.timeline.push({
      status,
      timestamp: new Date(),
      note,
    });

    // Update specific timestamps
    if (status === 'picked_up') {
      delivery.pickupTime = new Date();
    }

    await delivery.save();

    // Update order status accordingly
    const orderStatusMap = {
      arrived_at_shop: 'ready',
      picked_up: 'picked_up',
      in_transit: 'out_for_delivery',
      arrived: 'out_for_delivery',
      delivered: 'delivered',
    };

    if (orderStatusMap[status]) {
      await Order.findByIdAndUpdate(delivery.order, {
        orderStatus: orderStatusMap[status],
      });
    }

    return delivery;
  }

  /**
   * Update delivery location
   */
  async updateLocation(deliveryId, latitude, longitude) {
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    return delivery;
  }

  /**
   * Complete delivery
   */
  async completeDelivery(deliveryId, deliveryPersonId, verificationCode, proofOfDelivery) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new ErrorResponse('Delivery not found', 404);
    }

    if (delivery.deliveryPerson.toString() !== deliveryPersonId.toString()) {
      throw new ErrorResponse('Not authorized', 403);
    }

    // Verify code (optional)
    if (verificationCode && delivery.verificationCode !== verificationCode) {
      throw new ErrorResponse('Invalid verification code', 400);
    }

    delivery.status = 'delivered';
    delivery.deliveryTime = new Date();
    delivery.proofOfDelivery = proofOfDelivery;
    delivery.timeline.push({
      status: 'delivered',
      timestamp: new Date(),
    });

    await delivery.save();

    // Update order
    await Order.findByIdAndUpdate(delivery.order, {
      orderStatus: 'delivered',
      actualDeliveryTime: new Date(),
    });

    return delivery;
  }

  /**
   * Get delivery person statistics
   */
  async getDeliveryPersonStats(deliveryPersonId) {
    const totalDeliveries = await Delivery.countDocuments({
      deliveryPerson: deliveryPersonId,
    });

    const completedDeliveries = await Delivery.countDocuments({
      deliveryPerson: deliveryPersonId,
      status: 'delivered',
    });

    const pendingDeliveries = await Delivery.countDocuments({
      deliveryPerson: deliveryPersonId,
      status: { $in: ['assigned', 'accepted', 'picked_up', 'in_transit'] },
    });

    const earningsData = await Delivery.aggregate([
      { $match: { deliveryPerson: deliveryPersonId, status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$deliveryPersonEarning' },
        },
      },
    ]);

    return {
      deliveries: {
        total: totalDeliveries,
        completed: completedDeliveries,
        pending: pendingDeliveries,
      },
      earnings: earningsData[0]?.totalEarnings || 0,
    };
  }

  /**
   * Toggle delivery person availability
   */
  async toggleAvailability(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    user.isAvailable = !user.isAvailable;
    await user.save();

    return user;
  }
}

module.exports = new DeliveryService();

