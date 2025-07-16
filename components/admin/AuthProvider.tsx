'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthManager from '@/lib/auth/adminAuthManager';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await AdminAuthManager.makeAuthenticatedRequest('/api/admin/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Start auto-refresh only after successful auth
        AdminAuthManager.startAutoRefresh();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();

    // Listen for storage events (multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-logout') {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Activity-based token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      // Refresh token on user activity if it's been a while
      AdminAuthManager.refreshToken();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    let lastActivity = Date.now();

    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastActivity > 5 * 60 * 1000) { // 5 minutes
        lastActivity = now;
        handleActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledHandler, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandler, true);
      });
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}