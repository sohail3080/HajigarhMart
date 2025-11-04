// Custom hook for shop-related operations
import { useState, useEffect } from 'react';
import { shopApi } from '@/services/api.helpers';

export function useNearbyShops(latitude?: number, longitude?: number, radius: number = 10) {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    if (!latitude || !longitude) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await shopApi.getNearbyShops(latitude, longitude, radius);
      if (response.success && response.data) {
        setShops(response.data.shops || []);
      } else {
        setError(response.error || 'Failed to fetch shops');
      }
    } catch (err) {
      setError('An error occurred while fetching shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [latitude, longitude, radius]);

  return { shops, loading, error, refetch: fetchShops };
}

export function useShop(shopId: string) {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShop = async () => {
    if (!shopId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await shopApi.getShopById(shopId);
      if (response.success && response.data) {
        // Backend returns shop directly in data
        setShop(response.data);
      } else {
        setError(response.error || 'Failed to fetch shop');
      }
    } catch (err) {
      setError('An error occurred while fetching shop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  return { shop, loading, error, refetch: fetchShop };
}

export function useMyShop() {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyShop = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shopApi.getMyShop();
      if (response.success && response.data) {
        // Backend returns shop directly in data
        setShop(response.data);
      } else {
        setError(response.error || 'Failed to fetch shop');
      }
    } catch (err) {
      setError('An error occurred while fetching shop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  return { shop, loading, error, refetch: fetchMyShop };
}

export function useAllShops(params?: { page?: number; limit?: number; search?: string; approvalStatus?: string; isActive?: string }) {
  const [shops, setShops] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shopApi.getAllShops(params);
      if (response.success && response.data) {
        setShops(response.data.shops || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch shops');
      }
    } catch (err) {
      setError('An error occurred while fetching shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [params?.page, params?.search, params?.approvalStatus, params?.isActive]);

  return { shops, pagination, loading, error, refetch: fetchShops };
}

