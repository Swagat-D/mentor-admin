// lib/admin/adminApi.ts
import { DashboardStats, UserListItem, VerificationItem, SessionItem } from '@/types/admin';

export class AdminApi {
  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    const data = await this.request('/api/admin/stats');
    return data.data;
  }

  // User Management
  static async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const data = await this.request(`/api/admin/users?${searchParams}`);
    return {
      users: data.data.users as UserListItem[],
      pagination: data.data.pagination,
    };
  }

  static async getUserDetails(userId: string) {
    const data = await this.request(`/api/admin/users/${userId}`);
    return data.data;
  }

  static async updateUser(userId: string, updates: {
    isActive?: boolean;
    role?: string;
    firstName?: string;
    lastName?: string;
  }) {
    const data = await this.request(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data;
  }

  // Verification Management
  static async getVerifications(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const data = await this.request(`/api/admin/verifications?${searchParams}`);
    return {
      verifications: data.data.verifications as VerificationItem[],
      pagination: data.data.pagination,
    };
  }

  static async processVerification(verificationId: string, action: string, data?: {
    notes?: string;
    requestedInfo?: string;
  }) {
    const response = await this.request(`/api/admin/verifications/${verificationId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, ...data }),
    });
    return response;
  }

  // Session Management
  static async getSessions(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const data = await this.request(`/api/admin/sessions?${searchParams}`);
    return {
      sessions: data.data.sessions as SessionItem[],
      pagination: data.data.pagination,
    };
  }

  // Authentication
  static async login(credentials: { email: string; password: string }) {
    const data = await this.request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return data;
  }

  static async logout() {
    const data = await this.request('/api/admin/auth/logout', {
      method: 'POST',
    });
    return data;
  }

  static async getCurrentUser() {
    const data = await this.request('/api/admin/auth/me');
    return data.data;
  }

  static async refreshToken() {
    const data = await this.request('/api/admin/auth/refresh', {
      method: 'POST',
    });
    return data;
  }
}