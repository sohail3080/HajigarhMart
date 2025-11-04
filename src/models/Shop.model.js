const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide shop name'],
      trim: true,
      maxlength: [100, 'Shop name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide shop description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please select shop category'],
      enum: [
        'Grocery',
        'Medical',
        'Electronics',
        'Clothing',
        'Hardware',
        'Stationery',
        'Restaurant',
        'Bakery',
        'Other',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide shop phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    address: {
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
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    logo: {
      public_id: String,
      url: String,
    },
    documents: {
      gstNumber: String,
      panNumber: String,
      aadhaarNumber: String,
      businessLicense: {
        public_id: String,
        url: String,
      },
    },
    timings: {
      openTime: {
        type: String,
        default: '09:00',
      },
      closeTime: {
        type: String,
        default: '21:00',
      },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 5, // Percentage commission taken by platform
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to sync location with address coordinates
shopSchema.pre('save', function (next) {
  if (this.address && this.address.coordinates) {
    this.location = {
      type: 'Point',
      coordinates: [this.address.coordinates.longitude, this.address.coordinates.latitude],
    };
  }
  next();
});

// Index for geospatial queries
shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);

