// Custom hook for delivery-related operations
import { useState, useEffect } from 'react';
import { deliveryApi } from '@/services/api.helpers';

export function useMyDeliveries(params?: { page?: number; limit?: number; status?: string }) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deliveryApi.getMyDeliveries(params);
      if (response.success && response.data) {
        setDeliveries(response.data.deliveries || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch deliveries');
      }
    } catch (err) {
      setError('An error occurred while fetching deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [params?.page, params?.status]);

  return { deliveries, pagination, loading, error, refetch: fetchDeliveries };
}

export function useDelivery(deliveryId: string) {
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDelivery = async () => {
    if (!deliveryId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await deliveryApi.getDeliveryById(deliveryId);
      if (response.success && response.data) {
        setDelivery(response.data.delivery);
      } else {
        setError(response.error || 'Failed to fetch delivery');
      }
    } catch (err) {
      setError('An error occurred while fetching delivery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, [deliveryId]);

  return { delivery, loading, error, refetch: fetchDelivery };
}

export function useDeliveryEarnings(params?: { startDate?: string; endDate?: string }) {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deliveryApi.getEarnings(params);
      if (response.success && response.data) {
        setEarnings(response.data.earnings);
      } else {
        setError(response.error || 'Failed to fetch earnings');
      }
    } catch (err) {
      setError('An error occurred while fetching earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [params?.startDate, params?.endDate]);

  return { earnings, loading, error, refetch: fetchEarnings };
}

