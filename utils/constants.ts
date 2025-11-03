// App Constants

export const APP_NAME = 'HajigarhMart';
export const APP_VERSION = '1.0.0';

// Colors
export const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  secondary: '#1e40af',
  accent: '#f59e0b',
  success: '#059669',
  error: '#dc2626',
  warning: '#f59e0b',
  info: '#0284c7',
  
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#999',
  gray600: '#666',
  gray700: '#333',
  
  // Background
  background: '#f8f9fa',
  surface: '#ffffff',
  
  // Text
  textPrimary: '#333',
  textSecondary: '#666',
  textDisabled: '#999',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Font Sizes
export const FONT_SIZES = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 36,
};

// Commission Rates (%)
export const COMMISSION_RATE = 10; // 10% platform commission

// Delivery Fees
export const BASE_DELIVERY_FEE = 30;
export const PER_KM_DELIVERY_FEE = 10;

// Order Status Display Names
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  assigned: 'Assigned to Delivery',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// User Roles Display Names
export const ROLE_LABELS: Record<string, string> = {
  customer: 'Customer',
  shop: 'Shop Owner',
  delivery: 'Delivery Partner',
  admin: 'Administrator',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Groceries',
  'Vegetables & Fruits',
  'Dairy Products',
  'Bakery',
  'Beverages',
  'Snacks',
  'Personal Care',
  'Household',
  'Electronics',
  'Clothing',
  'Hardware',
  'Medicines',
  'Others',
];

