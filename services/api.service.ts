// API Service for making HTTP requests to backend
import { API_URL } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private tokenLoadPromise: Promise<void>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.tokenLoadPromise = this.loadToken();
  }

  // Load token from AsyncStorage on initialization
  private async loadToken() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        this.token = token;
      }
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  // Ensure token is loaded before making requests
  private async ensureTokenLoaded() {
    await this.tokenLoadPromise;
  }

  async setToken(token: string) {
    this.token = token;
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  async clearToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      // Only log errors that aren't expected (skip "Shop not found" and similar)
      if (!response.ok && data.error !== 'Shop not found') {
        console.log('🌐 data==>:', data);
      }
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'An error occurred',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      await this.ensureTokenLoaded();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async post<T>(endpoint: string, data: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
    try {
      await this.ensureTokenLoaded();
      const url = `${this.baseUrl}${endpoint}`;
      console.log('🌐 [API] POST Request:', url);
      console.log('🌐 [API] Headers:', this.getHeaders(isFormData));
      console.log('🌐 [API] Body:', isFormData ? 'FormData' : JSON.stringify(data, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      console.log('🌐 [API] Response Status:', response.status);
      
      const result = await this.handleResponse<T>(response);
      console.log('🌐 [API] Response Data:', result);

      return result;
    } catch (error) {
      console.error('❌ [API] Network Error:', error);
      console.error('❌ [API] Error Type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ [API] Error Message:', error instanceof Error ? error.message : String(error));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async put<T>(endpoint: string, data: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
    try {
      await this.ensureTokenLoaded();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      await this.ensureTokenLoaded();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      await this.ensureTokenLoaded();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

export const apiService = new ApiService(API_URL);
export default apiService;

