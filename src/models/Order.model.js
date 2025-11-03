const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      landmark: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    contactPhone: {
      type: String,
      required: true,
    },
    pricing: {
      itemsTotal: {
        type: Number,
        required: true,
      },
      deliveryFee: {
        type: Number,
        default: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'ready', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
      },
    ],
    specialInstructions: String,
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

