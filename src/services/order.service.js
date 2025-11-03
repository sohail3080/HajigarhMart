const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const Shop = require('../models/Shop.model');
const ErrorResponse = require('../utils/errorResponse');

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData) {
    const { items, shop: shopId, deliveryAddress, contactPhone, paymentMethod, specialInstructions } = orderData;

    // Validate shop
    const shop = await Shop.findById(shopId);
    if (!shop || shop.approvalStatus !== 'approved' || !shop.isActive) {
      throw new ErrorResponse('Shop is not available', 400);
    }

    // Validate and calculate items
    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        throw new ErrorResponse(`Product ${item.product} is not available`, 400);
      }

      if (product.stock < item.quantity) {
        throw new ErrorResponse(`Insufficient stock for ${product.name}`, 400);
      }

      itemsTotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || null,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate pricing
    const deliveryFee = 30; // Fixed or calculate based on distance
    const platformFee = itemsTotal * 0.02; // 2% platform fee
    const tax = itemsTotal * 0.05; // 5% tax
    const total = itemsTotal + deliveryFee + platformFee + tax;

    const order = await Order.create({
      customer: orderData.customer,
      shop: shopId,
      items: orderItems,
      deliveryAddress,
      contactPhone,
      pricing: {
        itemsTotal,
        deliveryFee,
        platformFee,
        tax,
        total,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      specialInstructions,
      statusHistory: [
        {
          status: 'placed',
          timestamp: new Date(),
          updatedBy: orderData.customer,
        },
      ],
    });

    // Update shop total orders
    shop.totalOrders += 1;
    await shop.save();

    return order.populate(['customer', 'shop']);
  }

  /**
   * Get all orders
   */
  async getAllOrders(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (queryParams.status) {
      query.orderStatus = queryParams.status;
    }

    if (queryParams.paymentStatus) {
      query.paymentStatus = queryParams.paymentStatus;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('shop', 'name address')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(customerId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { customer: customerId };

    if (queryParams.status) {
      query.orderStatus = queryParams.status;
    }

    const orders = await Order.find(query)
      .populate('shop', 'name address phone')
      .populate('delivery')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get shop orders
   */
  async getShopOrders(shopId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { shop: shopId };

    if (queryParams.status) {
      query.orderStatus = queryParams.status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name phone address')
      .populate('delivery')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId, user) {
    const order = await Order.findById(orderId)
      .populate('customer', 'name phone email address')
      .populate('shop', 'name address phone')
      .populate('delivery');

    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    // Check authorization
    if (
      user.role !== 'admin' &&
      order.customer._id.toString() !== user.id &&
      order.shop.owner?.toString() !== user.id
    ) {
      throw new ErrorResponse('Not authorized to view this order', 403);
    }

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status, userId, note) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    // Update status
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: userId,
      note,
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'completed';
    }

    await order.save();
    return order;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId, userId, reason) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      throw new ErrorResponse('Cannot cancel this order', 400);
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledBy = userId;

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();
    return order;
  }

  /**
   * Assign delivery to order
   */
  async assignDelivery(orderId, deliveryPersonId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    const DeliveryService = require('./delivery.service');
    const delivery = await DeliveryService.createDelivery(orderId, deliveryPersonId);

    order.delivery = delivery._id;
    order.orderStatus = 'assigned';
    await order.save();

    return order;
  }
}

module.exports = new OrderService();

