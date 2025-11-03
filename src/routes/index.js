const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const shopRoutes = require('./shop.routes');
const orderRoutes = require('./order.routes');
const deliveryRoutes = require('./delivery.routes');
const reviewRoutes = require('./review.routes');
const adminRoutes = require('./admin.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/shops', shopRoutes);
router.use('/orders', orderRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

