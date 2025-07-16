// lib/auth/adminAuthManager.ts - New Auth Management System
class AdminAuthManager {
  private static refreshInProgress = false;
  private static refreshPromise: Promise<boolean> | null = null;

  static async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // First, try the request with current token
    let response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
    });

    // If token expired, try to refresh
    if (response.status === 401 && !this.refreshInProgress) {
      const refreshed = await this.refreshToken();
      
      if (refreshed) {
        // Retry the original request
        response = await fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/admin/login';
        throw new Error('Authentication failed');
      }
    }

    return response;
  }

  static async refreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshInProgress) {
      return this.refreshPromise || Promise.resolve(false);
    }

    this.refreshInProgress = true;
    this.refreshPromise = this._performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshInProgress = false;
      this.refreshPromise = null;
    }
  }

  private static async _performRefresh(): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.log('Token refresh failed');
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  static startAutoRefresh() {
    // Refresh token every 12 minutes (before 15-minute expiry)
    setInterval(async () => {
      await this.refreshToken();
    }, 12 * 60 * 1000); // 12 minutes
  }

  static async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest('/api/admin/auth/me');
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default AdminAuthManager;

