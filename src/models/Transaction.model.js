const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    type: {
      type: String,
      enum: ['order_payment', 'commission', 'delivery_payment', 'refund', 'settlement'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // Who is paying
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who is receiving
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'reversed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online', 'wallet', 'bank_transfer'],
    },
    paymentGateway: {
      name: String,
      transactionId: String,
      response: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      commission: Number,
      platformFee: Number,
      deliveryFee: Number,
      tax: Number,
    },
    description: String,
    failureReason: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate transaction ID before saving
transactionSchema.pre('save', async function (next) {
  if (!this.transactionId) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);

