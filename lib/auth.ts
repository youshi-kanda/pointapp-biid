import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

class AuthService {
  private tokenKey = 'auth_tokens';
  private userKey = 'auth_user';

  getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const tokens = localStorage.getItem(this.tokenKey);
    return tokens ? JSON.parse(tokens) : null;
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, JSON.stringify(tokens));
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.access;
  }

  async login(credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: User }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, credentials);
      const tokens: AuthTokens = response.data;
      
      const userResponse = await axios.get(`${API_BASE_URL}/api/user/me/`, {
        headers: { Authorization: `Bearer ${tokens.access}` }
      });
      const user: User = userResponse.data;

      this.setTokens(tokens);
      this.setUser(user);

      return { tokens, user };
    } catch (error) {
      throw new Error('ログインに失敗しました');
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = this.getTokens();
    if (!tokens?.refresh) {
      throw new Error('リフレッシュトークンがありません');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
        refresh: tokens.refresh
      });
      const newTokens: AuthTokens = { ...tokens, access: response.data.access };
      this.setTokens(newTokens);
      return newTokens;
    } catch (error) {
      this.clearAuth();
      throw new Error('トークンの更新に失敗しました');
    }
  }

  logout(): void {
    this.clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export const authService = new AuthService();
