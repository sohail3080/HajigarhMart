import { User, UserRole } from '@/types';
import apiService from '@/services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
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

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    approvalStatus?: string;
    address?: any;
    shop?: string;
    avatar?: string;
    vehicleType?: string;
    isAvailable?: boolean;
  };
  token: string;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      await checkAuthStatus();
    };
    
    if (mounted) {
      init();
    }
    
    return () => {
      mounted = false;
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      console.log('🔍 [AUTH] Checking auth status...');
      console.log('🔍 [AUTH] Token exists:', !!token);
      console.log('🔍 [AUTH] UserData exists:', !!userData);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        console.log('🔍 [AUTH] Parsed user:', JSON.stringify(parsedUser, null, 2));
        console.log('🔍 [AUTH] User ID:', parsedUser.id);
        
        setUser(parsedUser);
        setIsLoading(false);
        // Verify token with backend in background
        refreshUser().catch((error) => {
          console.error('Background refresh failed:', error);
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔵 [AUTH] Starting login process...');
      console.log('🔵 [AUTH] Email:', email);
      console.log('🔵 [AUTH] API URL:', apiService['baseUrl']); // Log the base URL being used
      
      const response = await apiService.post<AuthResponse>('/users/login', {
        email,
        password,
      });

      console.log('🔵 [AUTH] Login response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        console.log('✅ [AUTH] Login successful');
        const { user: userData, token } = response.data;
        
        // Save token
        await apiService.setToken(token);
        console.log('✅ [AUTH] Token saved');

        // Transform backend user data to app User type
        const appUser: User = {
          id: userData.id,
          email: userData.email,
          fullName: userData.name,
          phone: userData.phone,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: new Date().toISOString(),
          approvalStatus: userData.approvalStatus,
          shop: userData.shop,
          vehicleType: userData.vehicleType,
          vehicleNumber: userData.vehicleNumber,
          isAvailable: userData.isAvailable,
          address: userData.address,
        };

        // Save user data
        await AsyncStorage.setItem('userData', JSON.stringify(appUser));
        setUser(appUser);
        console.log('✅ [AUTH] User data saved:', appUser);

        return { success: true };
      } else {
        console.log('❌ [AUTH] Login failed:', response.error);
        return {
          success: false,
          error: response.error || 'Login failed',
        };
      }
    } catch (error) {
      console.error('❌ [AUTH] Login exception:', error);
      console.error('❌ [AUTH] Error details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiService.post<AuthResponse>('/users/register', data);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Save token
        await apiService.setToken(token);

        // Transform backend user data to app User type
        const appUser: User = {
          id: userData.id,
          email: userData.email,
          fullName: userData.name,
          phone: userData.phone,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: new Date().toISOString(),
          approvalStatus: userData.approvalStatus,
          shop: userData.shop,
          vehicleType: userData.vehicleType,
          vehicleNumber: userData.vehicleNumber,
          isAvailable: userData.isAvailable,
          address: userData.address,
        };

        // Save user data
        await AsyncStorage.setItem('userData', JSON.stringify(appUser));
        setUser(appUser);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Registration failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 [AUTH] Refreshing user data...');
      const response = await apiService.get<any>('/users/me');

      console.log('🔄 [AUTH] Refresh response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        // Backend returns user object directly in response.data
        const userData = response.data;
        
        if (!userData) {
          console.error('❌ [AUTH] User data is missing in response');
          return;
        }

        console.log('🔄 [AUTH] User data from backend:', JSON.stringify(userData, null, 2));

        const appUser: User = {
          id: userData._id || userData.id,
          email: userData.email,
          fullName: userData.name,
          phone: userData.phone,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: userData.createdAt || new Date().toISOString(),
          approvalStatus: userData.approvalStatus,
          shop: userData.shop,
          vehicleType: userData.vehicleType,
          vehicleNumber: userData.vehicleNumber,
          isAvailable: userData.isAvailable,
          address: userData.address,
        };

        console.log('🔄 [AUTH] Transformed app user:', JSON.stringify(appUser, null, 2));

        await AsyncStorage.setItem('userData', JSON.stringify(appUser));
        setUser(appUser);
      } else {
        console.error('❌ [AUTH] Refresh failed:', response.error);
        // If refresh fails, keep the existing user data
      }
    } catch (error) {
      console.error('❌ [AUTH] Failed to refresh user:', error);
      // Don't logout user if refresh fails, they can continue with cached data
    }
  };

  const logout = async () => {
    try {
      console.log('🔴 [AUTH] Logging out...');
      
      // Clear token from API service
      await apiService.clearToken();
      
      // Clear all auth-related data from AsyncStorage
      await AsyncStorage.multiRemove(['authToken', 'userData', 'shopping_cart']);
      
      // Clear user state
      setUser(null);
      
      console.log('✅ [AUTH] Logout successful');
    } catch (error) {
      console.error('❌ [AUTH] Failed to logout:', error);
      // Force clear user state even if AsyncStorage fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

