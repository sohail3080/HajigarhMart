// Custom hook for order-related operations
import { useState, useEffect } from 'react';
import { orderApi } from '@/services/api.helpers';

export function useMyOrders(params?: { page?: number; limit?: number; status?: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderApi.getMyOrders(params);
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params?.page, params?.status]);

  return { orders, pagination, loading, error, refetch: fetchOrders };
}

export function useShopOrders(params?: { page?: number; limit?: number; status?: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderApi.getShopOrders(params);
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [params?.page, params?.status]);

  return { orders, pagination, loading, error, refetch: fetchOrders };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderApi.getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data.order);
      } else {
        setError(response.error || 'Failed to fetch order');
      }
    } catch (err) {
      setError('An error occurred while fetching order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  return { order, loading, error, refetch: fetchOrder };
}

