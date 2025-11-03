const Review = require('../models/Review.model');
const Order = require('../models/Order.model');
const Shop = require('../models/Shop.model');
const Product = require('../models/Product.model');
const ErrorResponse = require('../utils/errorResponse');

class ReviewService {
  /**
   * Create a review
   */
  async createReview(reviewData) {
    const { order: orderId, reviewType, rating, comment, customer } = reviewData;

    // Verify order exists and belongs to customer
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    if (order.customer.toString() !== customer.toString()) {
      throw new ErrorResponse('Not authorized to review this order', 403);
    }

    if (order.orderStatus !== 'delivered') {
      throw new ErrorResponse('Can only review delivered orders', 400);
    }

    // Set the appropriate reference based on review type
    if (reviewType === 'shop') {
      reviewData.shop = order.shop;
    } else if (reviewType === 'product' && reviewData.product) {
      // Verify product is in the order
      const productInOrder = order.items.find(
        (item) => item.product.toString() === reviewData.product.toString()
      );
      if (!productInOrder) {
        throw new ErrorResponse('Product not in this order', 400);
      }
    } else if (reviewType === 'delivery') {
      const delivery = await require('../models/Delivery.model').findOne({ order: orderId });
      if (!delivery) {
        throw new ErrorResponse('No delivery found for this order', 404);
      }
      reviewData.deliveryPerson = delivery.deliveryPerson;
    }

    const review = await Review.create(reviewData);

    // Update ratings
    await this.updateRatings(reviewType, review);

    return review.populate(['customer', reviewType === 'shop' ? 'shop' : reviewType]);
  }

  /**
   * Update ratings after review
   */
  async updateRatings(reviewType, review) {
    if (reviewType === 'shop') {
      const reviews = await Review.find({ shop: review.shop, isActive: true });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      
      await Shop.findByIdAndUpdate(review.shop, {
        ratings: avgRating,
        numOfReviews: reviews.length,
      });
    } else if (reviewType === 'product') {
      const reviews = await Review.find({ product: review.product, isActive: true });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      
      await Product.findByIdAndUpdate(review.product, {
        ratings: avgRating,
        numOfReviews: reviews.length,
      });
    }
  }

  /**
   * Get shop reviews
   */
  async getShopReviews(shopId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {
      shop: shopId,
      reviewType: 'shop',
      isActive: true,
    };

    const reviews = await Review.find(query)
      .populate('customer', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {
      product: productId,
      reviewType: 'product',
      isActive: true,
    };

    const reviews = await Review.find(query)
      .populate('customer', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get delivery person reviews
   */
  async getDeliveryPersonReviews(deliveryPersonId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {
      deliveryPerson: deliveryPersonId,
      reviewType: 'delivery',
      isActive: true,
    };

    const reviews = await Review.find(query)
      .populate('customer', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update review
   */
  async updateReview(reviewId, updateData, userId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ErrorResponse('Review not found', 404);
    }

    if (review.customer.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to update this review', 403);
    }

    review.rating = updateData.rating || review.rating;
    review.comment = updateData.comment || review.comment;
    review.images = updateData.images || review.images;

    await review.save();

    // Update ratings
    await this.updateRatings(review.reviewType, review);

    return review;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId, userId, userRole) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ErrorResponse('Review not found', 404);
    }

    // Only customer who wrote review or admin can delete
    if (review.customer.toString() !== userId.toString() && userRole !== 'admin') {
      throw new ErrorResponse('Not authorized to delete this review', 403);
    }

    review.isActive = false;
    await review.save();

    // Update ratings
    await this.updateRatings(review.reviewType, review);

    return true;
  }

  /**
   * Respond to review (shop owner)
   */
  async respondToReview(reviewId, userId, comment) {
    const review = await Review.findById(reviewId).populate('shop');
    if (!review) {
      throw new ErrorResponse('Review not found', 404);
    }

    // Verify shop ownership
    if (review.shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to respond to this review', 403);
    }

    review.response = {
      comment,
      respondedBy: userId,
      respondedAt: new Date(),
    };

    await review.save();
    return review;
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      throw new ErrorResponse('Review not found', 404);
    }

    return review;
  }
}

module.exports = new ReviewService();

