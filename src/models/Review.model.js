const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewType: {
      type: String,
      enum: ['shop', 'product', 'delivery'],
      required: true,
    },
    // Reference to what's being reviewed
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    response: {
      comment: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per order per review type
reviewSchema.index({ order: 1, reviewType: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

