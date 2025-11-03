/**
 * Application constants for Rural E-Commerce Platform
 */

// User roles
exports.USER_ROLES = {
  ADMIN: 'admin',
  SHOP_OWNER: 'shop_owner',
  CUSTOMER: 'customer',
  DELIVERY: 'delivery',
};

// Approval status
exports.APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Order status
exports.ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Delivery status
exports.DELIVERY_STATUS = {
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ARRIVED_AT_SHOP: 'arrived_at_shop',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

// Payment status
exports.PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment methods
exports.PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online',
};

// Shop categories
exports.SHOP_CATEGORIES = [
  'Grocery',
  'Medical',
  'Electronics',
  'Clothing',
  'Hardware',
  'Stationery',
  'Restaurant',
  'Bakery',
  'Other',
];

// Product categories (example - adjust based on your needs)
exports.PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Groceries',
  'Medicines',
  'Books & Stationery',
  'Home & Garden',
  'Sports',
  'Toys',
  'Food & Beverages',
  'Hardware & Tools',
  'Other',
];

// Vehicle types
exports.VEHICLE_TYPES = {
  BIKE: 'bike',
  SCOOTER: 'scooter',
  BICYCLE: 'bicycle',
  CAR: 'car',
  OTHER: 'other',
};

// Review types
exports.REVIEW_TYPES = {
  SHOP: 'shop',
  PRODUCT: 'product',
  DELIVERY: 'delivery',
};

// Transaction types
exports.TRANSACTION_TYPES = {
  ORDER_PAYMENT: 'order_payment',
  COMMISSION: 'commission',
  DELIVERY_PAYMENT: 'delivery_payment',
  REFUND: 'refund',
  SETTLEMENT: 'settlement',
};

// HTTP status codes
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Pagination defaults
exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Commission rates
exports.COMMISSION = {
  DEFAULT_SHOP_COMMISSION: 5, // 5% commission
  PLATFORM_FEE_PERCENTAGE: 2, // 2% platform fee
  TAX_PERCENTAGE: 5, // 5% tax
  DELIVERY_PERSON_SHARE: 80, // 80% of delivery fee goes to delivery person
};

// Distance and delivery
exports.DELIVERY = {
  DEFAULT_DELIVERY_FEE: 30,
  MAX_DELIVERY_RADIUS_KM: 15,
  MIN_ORDER_VALUE: 0,
};

