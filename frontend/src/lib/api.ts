const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  username: string;
  email: string;
  member_id: string;
  points: number;
  registration_date: string;
  last_login_date: string;
  status: 'active' | 'inactive' | 'suspended';
  location: string;
  avatar: string;
}

export interface Store {
  id: number;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  registration_date: string;
  point_rate: number;
  status: 'active' | 'inactive';
  balance: number;
  monthly_fee: number;
  latitude: number;
  longitude: number;
  category: string;
  features: string;
}

export interface PointTransaction {
  id: number;
  user: number;
  store: number;
  transaction_id: string;
  amount: number;
  points_issued: number;
  transaction_date: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  user_name?: string;
  store_name?: string;
}

export interface PointIssueRequest {
  user_id: number;
  store_id: number;
  amount: number;
  description?: string;
}

export interface PointIssueResponse {
  success: boolean;
  transaction?: PointTransaction;
  message: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users/');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/api/users/${id}/`);
  }

  async getUserByMemberId(memberId: string): Promise<User> {
    const users = await this.getUsers();
    const user = users.find(u => u.member_id === memberId);
    if (!user) {
      throw new Error(`User with member ID ${memberId} not found`);
    }
    return user;
  }

  async getStores(): Promise<Store[]> {
    return this.request<Store[]>('/api/stores/');
  }

  async getStore(id: number): Promise<Store> {
    return this.request<Store>(`/api/stores/${id}/`);
  }

  async issuePoints(data: PointIssueRequest): Promise<PointIssueResponse> {
    return this.request<PointIssueResponse>('/api/transactions/', {
      method: 'POST',
      body: JSON.stringify({
        user: data.user_id,
        store: data.store_id,
        amount: data.amount,
        points_issued: Math.floor(data.amount * 0.1), // 10% point rate as default
        payment_method: 'qr_code',
        status: 'completed',
        description: data.description || 'QR code point issuance',
        transaction_id: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }),
    });
  }

  async getTransactions(): Promise<PointTransaction[]> {
    return this.request<PointTransaction[]>('/api/transactions/');
  }
}

export const apiClient = new ApiClient();
