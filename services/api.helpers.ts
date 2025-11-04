// API Helper Functions for all endpoints
import apiService, { ApiResponse } from './api.service';
import { User, Shop, Product, Order, Delivery, Review } from '@/types';

// ==================== USER ENDPOINTS ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'shop_owner' | 'delivery' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  vehicleType?: string;
  vehicleNumber?: string;
  drivingLicense?: string;
}

export const userApi = {
  login: (data: LoginRequest) =>
    apiService.post<{ user: any; token: string }>('/users/login', data),

  register: (data: RegisterRequest) =>
    apiService.post<{ user: any; token: string }>('/users/register', data),

  getProfile: () =>
    apiService.get<any>('/users/me'),

  updateProfile: (data: Partial<User>) =>
    apiService.put<{ user: any }>('/users/profile', data),

  getAllUsers: (query?: { page?: number; limit?: number; role?: string }) =>
    apiService.get<{ users: any[]; pagination: any }>(
      `/users?${new URLSearchParams(query as any).toString()}`
    ),
};

// ==================== SHOP ENDPOINTS ====================

export interface CreateShopRequest {
  name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  timings: {
    openTime: string;
    closeTime: string;
    workingDays: string[];
  };
}

export const shopApi = {
  createShop: (data: CreateShopRequest) =>
    apiService.post<{ shop: any }>('/shops', data),

  getAllShops: (query?: { page?: number; limit?: number; search?: string; approvalStatus?: string; isActive?: string }) =>
    apiService.get<{ shops: any[]; pagination: any }>(
      `/shops?${new URLSearchParams(query as any).toString()}`
    ),

  getShopById: (shopId: string) =>
    apiService.get<{ shop: any }>(`/shops/${shopId}`),

  getNearbyShops: (latitude: number, longitude: number, radius: number = 10) =>
    apiService.get<{ shops: any[]; count: number }>(
      `/shops/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    ),

  getMyShop: () =>
    apiService.get<{ shop: any }>('/shops/my-shop'),

  updateShop: (shopId: string, data: Partial<CreateShopRequest>) =>
    apiService.put<{ shop: any }>(`/shops/${shopId}`, data),

  deleteShop: (shopId: string) =>
    apiService.delete(`/shops/${shopId}`),

  approveShop: (shopId: string) =>
    apiService.patch<{ shop: any }>(`/shops/${shopId}/approve`, {}),

  rejectShop: (shopId: string, reason: string) =>
    apiService.patch<{ shop: any }>(`/shops/${shopId}/reject`, { reason }),

  toggleShopStatus: (shopId: string) =>
    apiService.patch<{ shop: any }>(`/shops/${shopId}/toggle-status`, {}),
};

// ==================== PRODUCT ENDPOINTS ====================

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  unit: string;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  images?: Array<{
    public_id: string;
    url: string;
  }>;
}

export const productApi = {
  createProduct: (data: CreateProductRequest) =>
    apiService.post<{ product: any }>('/products', data),

  getProductById: (productId: string) =>
    apiService.get<{ product: any }>(`/products/${productId}`),

  getShopProducts: (
    shopId: string,
    query?: { page?: number; limit?: number; search?: string; category?: string }
  ) =>
    apiService.get<{ products: any[]; pagination: any }>(
      `/products/shop/${shopId}?${new URLSearchParams(query as any).toString()}`
    ),

  getMyProducts: (query?: { page?: number; limit?: number; search?: string }) =>
    apiService.get<{ products: any[]; pagination: any }>(
      `/products/my-products?${new URLSearchParams(query as any).toString()}`
    ),

  updateProduct: (productId: string, data: Partial<CreateProductRequest>) =>
    apiService.put<{ product: any }>(`/products/${productId}`, data),

  deleteProduct: (productId: string) =>
    apiService.delete(`/products/${productId}`),

  toggleAvailability: (productId: string) =>
    apiService.patch<{ product: any }>(`/products/${productId}/toggle-availability`, {}),
};

// ==================== ORDER ENDPOINTS ====================

export interface CreateOrderRequest {
  shop: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contactPhone: string;
  paymentMethod: 'cod' | 'online';
  specialInstructions?: string;
}

export const orderApi = {
  createOrder: (data: CreateOrderRequest) =>
    apiService.post<{ order: any; orderNumber: string; pricing: any }>('/orders', data),

  getOrderById: (orderId: string) =>
    apiService.get<{ order: any }>(`/orders/${orderId}`),

  getMyOrders: (query?: { page?: number; limit?: number; status?: string }) =>
    apiService.get<{ orders: any[]; pagination: any }>(
      `/orders/my-orders?${new URLSearchParams(query as any).toString()}`
    ),

  getShopOrders: (query?: { page?: number; limit?: number; status?: string }) =>
    apiService.get<{ orders: any[]; pagination: any }>(
      `/orders/shop-orders?${new URLSearchParams(query as any).toString()}`
    ),

  updateOrderStatus: (orderId: string, status: string, note?: string) =>
    apiService.patch<{ order: any }>(`/orders/${orderId}/status`, { status, note }),

  cancelOrder: (orderId: string, reason: string) =>
    apiService.patch<{ order: any }>(`/orders/${orderId}/cancel`, { reason }),

  assignDelivery: (orderId: string, deliveryPersonId: string) =>
    apiService.patch<{ order: any; delivery: any }>(
      `/orders/${orderId}/assign-delivery`,
      { deliveryPersonId }
    ),
};

// ==================== DELIVERY ENDPOINTS ====================

export const deliveryApi = {
  getMyDeliveries: (query?: { page?: number; limit?: number; status?: string }) =>
    apiService.get<{ deliveries: any[]; pagination: any }>(
      `/deliveries/my-deliveries?${new URLSearchParams(query as any).toString()}`
    ),

  getDeliveryById: (deliveryId: string) =>
    apiService.get<{ delivery: any }>(`/deliveries/${deliveryId}`),

  acceptDelivery: (deliveryId: string) =>
    apiService.patch<{ delivery: any }>(`/deliveries/${deliveryId}/accept`, {}),

  rejectDelivery: (deliveryId: string, reason: string) =>
    apiService.patch<{ delivery: any }>(`/deliveries/${deliveryId}/reject`, { reason }),

  updateDeliveryStatus: (deliveryId: string, status: string, note?: string) =>
    apiService.patch<{ delivery: any }>(`/deliveries/${deliveryId}/status`, { status, note }),

  updateLocation: (deliveryId: string, latitude: number, longitude: number) =>
    apiService.patch<{ delivery: any }>(`/deliveries/${deliveryId}/location`, {
      latitude,
      longitude,
    }),

  completeDelivery: (
    deliveryId: string,
    verificationCode: string,
    proofOfDelivery?: { signature?: string; photo?: string }
  ) =>
    apiService.patch<{ delivery: any }>(`/deliveries/${deliveryId}/complete`, {
      verificationCode,
      proofOfDelivery,
    }),

  toggleAvailability: () =>
    apiService.patch<{ isAvailable: boolean }>('/deliveries/toggle-availability', {}),

  getEarnings: (query?: { startDate?: string; endDate?: string }) =>
    apiService.get<{ earnings: any }>(
      `/deliveries/earnings?${new URLSearchParams(query as any).toString()}`
    ),
};

// ==================== REVIEW ENDPOINTS ====================

export interface CreateReviewRequest {
  order: string;
  reviewType: 'shop' | 'product' | 'delivery';
  rating: number;
  comment: string;
  product?: string;
}

export const reviewApi = {
  createReview: (data: CreateReviewRequest) =>
    apiService.post<{ review: any }>('/reviews', data),

  getShopReviews: (shopId: string, query?: { page?: number; limit?: number }) =>
    apiService.get<{ reviews: any[]; pagination: any; averageRating: number }>(
      `/reviews/shop/${shopId}?${new URLSearchParams(query as any).toString()}`
    ),

  getProductReviews: (productId: string, query?: { page?: number; limit?: number }) =>
    apiService.get<{ reviews: any[]; pagination: any; averageRating: number }>(
      `/reviews/product/${productId}?${new URLSearchParams(query as any).toString()}`
    ),

  respondToReview: (reviewId: string, comment: string) =>
    apiService.post<{ review: any }>(`/reviews/${reviewId}/respond`, { comment }),

  deleteReview: (reviewId: string) =>
    apiService.delete(`/reviews/${reviewId}`),
};

// ==================== ADMIN ENDPOINTS ====================

export const adminApi = {
  getDashboard: () =>
    apiService.get<{
      users: any;
      shops: any;
      orders: any;
      revenue: any;
    }>('/admin/dashboard'),

  getApprovals: () =>
    apiService.get<{ shops: any[]; users: any[] }>('/admin/approvals'),

  approveUser: (userId: string) =>
    apiService.patch<{ user: any }>(`/admin/users/${userId}/approve`, {}),

  rejectUser: (userId: string, reason: string) =>
    apiService.patch<{ user: any }>(`/admin/users/${userId}/reject`, { reason }),

  updateShopCommission: (shopId: string, commission: number) =>
    apiService.patch<{ shop: any }>(`/admin/shops/${shopId}/commission`, { commission }),

  getFinancialReports: (query?: { startDate?: string; endDate?: string }) =>
    apiService.get<{ report: any }>(
      `/admin/reports/financial?${new URLSearchParams(query as any).toString()}`
    ),

  getAllOrders: (query?: { page?: number; limit?: number; status?: string }) =>
    apiService.get<{ orders: any[]; pagination: any }>(
      `/admin/orders?${new URLSearchParams(query as any).toString()}`
    ),
};

// Export all APIs
export default {
  user: userApi,
  shop: shopApi,
  product: productApi,
  order: orderApi,
  delivery: deliveryApi,
  review: reviewApi,
  admin: adminApi,
};

