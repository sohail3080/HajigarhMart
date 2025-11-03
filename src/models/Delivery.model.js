const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    distance: {
      type: Number, // in kilometers
    },
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'rejected', 'arrived_at_shop', 'picked_up', 'in_transit', 'arrived', 'delivered', 'failed'],
      default: 'assigned',
    },
    pickupTime: Date,
    deliveryTime: Date,
    estimatedDeliveryTime: Date,
    deliveryFee: {
      type: Number,
      required: true,
    },
    deliveryPersonEarning: {
      type: Number,
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date,
    },
    verificationCode: {
      type: String,
    },
    proofOfDelivery: {
      signature: String,
      photo: String,
    },
    rejectionReason: String,
    failureReason: String,
    notes: String,
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        location: {
          latitude: Number,
          longitude: Number,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate verification code before saving
deliverySchema.pre('save', function (next) {
  if (!this.verificationCode) {
    this.verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);

