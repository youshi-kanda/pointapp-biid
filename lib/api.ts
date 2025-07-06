import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config) => {
        const tokens = authService.getTokens();
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await authService.refreshToken();
            const tokens = authService.getTokens();
            if (tokens?.access) {
              originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            authService.logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  async grantPoints(uid: string, points: number, reason?: string): Promise<any> {
    return this.post('/api/points/grant/', { uid, points, reason });
  }

  async getPointsHistory(filters?: any): Promise<any> {
    return this.get('/api/points/history/', { params: filters });
  }

  async chargePoints(amount: number, paymentMethod: string): Promise<any> {
    return this.post('/api/charge/', { amount, payment_method: paymentMethod });
  }

  async getChargeHistory(): Promise<any> {
    return this.get('/api/charge/history/');
  }

  async getDashboardStats(): Promise<any> {
    return this.get('/api/dashboard/stats/');
  }

  async lookupUserByNFC(uid: string): Promise<any> {
    return this.get(`/api/nfc/lookup/${uid}/`);
  }
}

export const apiService = new ApiService();
