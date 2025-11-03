import { User, UserRole } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
  shopName?: string;
  address?: string;
  vehicleNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual API call
    // For now, mock login
    console.log('Login:', { email, password });
    
    // Mock user data - replace with actual API response
    const mockUser: User = {
      id: '1',
      email,
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
  };

  const register = async (data: RegisterData) => {
    // TODO: Implement actual API call
    console.log('Register:', data);
    
    // Mock registration - replace with actual API response
    const newUser: User = {
      id: '1',
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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

