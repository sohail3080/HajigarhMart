// User Types
export type UserRole = 'customer' | 'shop' | 'shop_owner' | 'delivery' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  orders: Order[];
}

export interface ShopOwner extends User {
  role: 'shop';
  shop: Shop;
}

export interface DeliveryPartner extends User {
  role: 'delivery';
  vehicleNumber: string;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
  earnings: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Shop Types
export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  description: string;
  category: string;
  address: Address;
  phone: string;
  email: string;
  rating: number;
  totalOrders: number;
  isActive: boolean;
  isApproved: boolean;
  images: string[];
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  unit: string; // kg, pieces, liter, etc.
  isAvailable: boolean;
  createdAt: string;
}

// Order Types
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'online';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  deliveryPartnerId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  deliveryAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Address Type
export interface Address {
  id: string;
  label: string; // Home, Work, etc.
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Delivery Types
export interface Delivery {
  id: string;
  orderId: string;
  deliveryPartnerId: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  earnings: number;
  distance: number; // in km
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  shopId?: string;
  productId?: string;
  deliveryPartnerId?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'payment' | 'shop' | 'system';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

