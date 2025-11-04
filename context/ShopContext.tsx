import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shopApi } from '@/services/api.helpers';

interface Shop {
  _id: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  address: any;
  isActive: boolean;
  approvalStatus: string;
  rating?: number;
  timings?: any;
}

interface ShopContextType {
  shops: Shop[];
  selectedShop: Shop | null;
  isLoading: boolean;
  selectShop: (shopId: string) => void;
  refreshShops: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setIsLoading(true);
      console.log('🏪 [SHOP CONTEXT] Loading shops...');
      
      // Small delay to ensure token is loaded
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const response = await shopApi.getMyShop();
      console.log('🏪 [SHOP CONTEXT] Shops response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // Backend now returns array of shops
        const shopsData = Array.isArray(response.data) ? response.data : [response.data];
        console.log('🏪 [SHOP CONTEXT] Shops loaded:', shopsData.length);
        setShops(shopsData);
        
        // Load or set selected shop
        const savedShopId = await AsyncStorage.getItem('selectedShopId');
        if (savedShopId && shopsData.find((s: Shop) => s._id === savedShopId)) {
          const shop = shopsData.find((s: Shop) => s._id === savedShopId);
          setSelectedShop(shop || null);
        } else if (shopsData.length > 0) {
          // Select first shop by default
          setSelectedShop(shopsData[0]);
          await AsyncStorage.setItem('selectedShopId', shopsData[0]._id);
        }
      } else {
        console.log('🏪 [SHOP CONTEXT] No shops found');
        setShops([]);
        setSelectedShop(null);
      }
    } catch (error) {
      console.error('🏪 [SHOP CONTEXT] Error loading shops:', error);
      setShops([]);
      setSelectedShop(null);
    } finally {
      setIsLoading(false);
    }
  };

  const selectShop = async (shopId: string) => {
    const shop = shops.find(s => s._id === shopId);
    if (shop) {
      setSelectedShop(shop);
      await AsyncStorage.setItem('selectedShopId', shopId);
      console.log('🏪 [SHOP CONTEXT] Shop selected:', shop.name);
    }
  };

  const refreshShops = async () => {
    await loadShops();
  };

  return (
    <ShopContext.Provider
      value={{
        shops,
        selectedShop,
        isLoading,
        selectShop,
        refreshShops,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
}


