// lib/admin/adminApi.ts - Updated with correct Test Results interfaces
import { DashboardStats, UserListItem, VerificationItem, SessionItem } from '@/types/admin';
import AdminAuthManager from '@/lib/auth/adminAuthManager';

export interface PsychometricTestResult {
  _id: string;
  userId: string;
  sections: {
    interests: {
      realistic: number;
      investigative: number;
      artistic: number;
      social: number;
      enterprising: number;
      conventional: number;
      hollandCode: string;
    };
    personality: {
      L1: number;
      L2: number;
      R1: number;
      R2: number;
      dominantQuadrants: string[];
      personalityTypes: string[];
    };
    employability: {
      selfManagement: number;
      teamWork: number;
      enterprising: number;
      problemSolving: number;
      speakingListening: number;
      quotient: number;
    };
    characterStrengths: {
      top3Strengths: string[];
      categories: string[];
      values: string[];
      userResponses?: {
        whatYouLike?: string;
        whatYouAreGoodAt?: string;
        recentProjects?: string;
      };
    };
  };
  completedAt: string;
  isValid: boolean;
  rawData?: {
    riasecResult?: any;
    brainProfileResult?: any;
    employabilityResult?: any;
    personalInsightsResult?: any;
  };
}

// Additional interfaces for the raw database structure
export interface RiasecResult {
  sectionId: string;
  sectionName: string;
  completedAt: string;
  timeSpent: number;
  responses: Record<string, any>;
  scores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  interpretation: string;
  recommendations: string[];
}

export interface BrainProfileResult {
  sectionId: string;
  sectionName: string;
  completedAt: string;
  timeSpent: number;
  responses: Record<string, any>;
  quadrantScores: {
    L1: number;
    L2: number;
    R1: number;
    R2: number;
  };
  dominantQuadrants: string[];
  personalityTypes: string[];
  interpretation: string;
}

export interface EmployabilityResult {
  sectionId: string;
  sectionName: string;
  completedAt: string;
  timeSpent: number;
  responses: Record<string, any>;
  scores: {
    selfManagement: number;
    teamWork: number;
    enterprising: number;
    problemSolving: number;
    speakingListening: number;
  };
  overallScore: number;
  interpretation: string;
}

export interface PersonalInsightsResult {
  sectionId: string;
  sectionName: string;
  completedAt: string;
  responses: {
    whatYouLike: string;
    whatYouAreGoodAt: string;
    recentProjects: string;
  };
  characterStrengths: string[];
  valuesInLife: string[];
}

export class AdminApi {
  private static async request(endpoint: string, options?: RequestInit) {
    // Use AdminAuthManager for all requests (handles auth automatically)
    const response = await AdminAuthManager.makeAuthenticatedRequest(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include', // Include cookies
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
    gender?: string;
    ageRange?: string;
    studyLevel?: string;
    bio?: string;
    resetTestStatus?: boolean;
  }) {
    const data = await this.request(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data;
  }

  // Psychometric Test Results
  static async getUserTestResults(userId: string): Promise<PsychometricTestResult> {
    try {
      console.log('AdminApi: Fetching test results for user:', userId);
      
      const data = await this.request(`/api/admin/users/${userId}/test-results`);
      
      console.log('AdminApi: Received data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch test results');
      }
      
      return data.data;
    } catch (error) {
      console.error('AdminApi: getUserTestResults error:', error);
      throw error;
    }
  }

  // Get raw test structure for debugging
  static async getTestStructure(userId: string) {
    try {
      const data = await this.request(`/api/admin/debug/test-structure/${userId}`);
      return data.data;
    } catch (error) {
      console.error('AdminApi: getTestStructure error:', error);
      throw error;
    }
  }

  // Create sample test data for testing
  static async createSampleTest(userId: string) {
    try {
      const data = await this.request(`/api/admin/debug/create-sample-test/${userId}`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('AdminApi: createSampleTest error:', error);
      throw error;
    }
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

  // Notification Management
  static async getNotifications(params: {
    page?: number;
    limit?: number;
    type?: string;
    read?: string;
    search?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const data = await this.request(`/api/admin/notifications?${searchParams}`);
    return {
      notifications: data.data.notifications,
      pagination: data.data.pagination,
    };
  }

  static async getNotificationStats() {
    const data = await this.request('/api/admin/notifications/stats');
    return data.data;
  }

  static async markNotificationsRead(notificationIds: string[]) {
    const data = await this.request('/api/admin/notifications/mark-read', {
      method: 'PATCH',
      body: JSON.stringify({ notificationIds }),
    });
    return data;
  }

  static async markNotificationsUnread(notificationIds: string[]) {
    const data = await this.request('/api/admin/notifications/mark-unread', {
      method: 'PATCH',
      body: JSON.stringify({ notificationIds }),
    });
    return data;
  }

  static async markAllNotificationsRead() {
    const data = await this.request('/api/admin/notifications/mark-all-read', {
      method: 'PATCH',
    });
    return data;
  }

  static async deleteNotifications(notificationIds: string[]) {
    const data = await this.request('/api/admin/notifications/delete', {
      method: 'DELETE',
      body: JSON.stringify({ notificationIds }),
    });
    return data;
  }

  static async createNotification(notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    targetUserId?: string;
    isGlobal?: boolean;
  }) {
    const data = await this.request('/api/admin/notifications/create', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    return data;
  }

  // Analytics
  static async getAnalytics(params: {
    timeRange?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const data = await this.request(`/api/admin/analytics?${searchParams}`);
    return data.data;
  }

  static async getOverview() {
    const data = await this.request('/api/admin/overview');
    return data.data;
  }

  // Authentication
  static async login(credentials: { email: string; password: string }) {
    // Don't use AdminAuthManager for login (no auth needed)
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  }

  static async verifyOTP(otp: { email: string; otp: string }) {
    // Don't use AdminAuthManager for OTP verification
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...otp, step: 'verify-otp' }),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }
    
    return data;
  }

  static async logout() {
    try {
      await this.request('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      // Notify other tabs about logout
      localStorage.setItem('admin-logout', Date.now().toString());
      localStorage.removeItem('admin-logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still notify tabs
      localStorage.setItem('admin-logout', Date.now().toString());
      localStorage.removeItem('admin-logout');
    }
  }

  static async getCurrentUser() {
    const data = await this.request('/api/admin/auth/me');
    return data.data;
  }

  static async refreshToken() {
    // Use direct fetch for refresh (AdminAuthManager handles this internally)
    const response = await fetch('/api/admin/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }
    
    return data;
  }

  // File Management
  static async downloadFile(filePath: string) {
    // Use AdminAuthManager but return response directly for file download
    const response = await AdminAuthManager.makeAuthenticatedRequest(
      `/api/admin/files/download/${filePath}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error('File download failed');
    }
    
    return response; // Return response for blob handling
  }

  // Message Management
  static async sendMessage(userId: string, message: string) {
    const data = await this.request('/api/admin/messages/send', {
      method: 'POST',
      body: JSON.stringify({ userId, message }),
    });
    return data;
  }

  // Export functionality
  static async exportUsers(params: {
    format: 'csv' | 'json' | 'excel';
    search?: string;
    role?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await AdminAuthManager.makeAuthenticatedRequest(
      `/api/admin/users/export?${searchParams}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response; // Return response for blob handling
  }

  // Health check
  static async checkHealth() {
    try {
      const response = await AdminAuthManager.makeAuthenticatedRequest('/api/admin/auth/me');
      return response.ok;
    } catch {
      return false;
    }
  }
}