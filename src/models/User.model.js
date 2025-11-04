const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['admin', 'shop_owner', 'customer', 'delivery'],
      default: 'customer',
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      unique: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    // Shop Owner specific fields
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    shops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    }],
    // Delivery personnel specific fields
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'bicycle', 'car', 'other'],
    },
    vehicleNumber: String,
    drivingLicense: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Approval status (for shop owners and delivery personnel)
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function() {
        return ['shop_owner', 'delivery'].includes(this.role) ? 'pending' : 'approved';
      },
    },
    rejectionReason: String,
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', userSchema);

