// Custom hook for product-related operations
import { useState, useEffect } from 'react';
import { productApi } from '@/services/api.helpers';

export function useShopProducts(
  shopId: string,
  params?: { page?: number; limit?: number; search?: string; category?: string }
) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!shopId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getShopProducts(shopId, params);
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopId, params?.page, params?.search, params?.category]);

  return { products, pagination, loading, error, refetch: fetchProducts };
}

export function useMyProducts(params?: { page?: number; limit?: number; search?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getMyProducts(params);
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params?.page, params?.search]);

  return { products, pagination, loading, error, refetch: fetchProducts };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getProductById(productId);
      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        setError(response.error || 'Failed to fetch product');
      }
    } catch (err) {
      setError('An error occurred while fetching product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { product, loading, error, refetch: fetchProduct };
}

