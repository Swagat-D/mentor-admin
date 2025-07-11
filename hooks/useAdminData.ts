// hooks/useAdminData.ts
import { useState, useEffect, useCallback } from 'react';
import { AdminApi } from '@/lib/admin/adminApi';
import { DashboardStats, UserListItem, VerificationItem, SessionItem } from '@/types/admin';

interface UseAdminDataReturn {
  // Data
  stats: DashboardStats | null;
  users: UserListItem[];
  verifications: VerificationItem[];
  sessions: SessionItem[];
  
  // Loading states
  statsLoading: boolean;
  usersLoading: boolean;
  verificationsLoading: boolean;
  sessionsLoading: boolean;
  refreshing: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Filters
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  
  // Actions
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setFilterRole: (role: string) => void;
  setFilterStatus: (status: string) => void;
  loadStats: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadVerifications: () => Promise<void>;
  loadSessions: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateUser: (userId: string, updates: any) => Promise<void>;
  processVerification: (verificationId: string, action: string, data?: any) => Promise<void>;
}

export function useAdminData(): UseAdminDataReturn {
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  
  // Loading states
  const [statsLoading, setStatsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [verificationsLoading, setVerificationsLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const itemsPerPage = 20;

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await AdminApi.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole !== 'all' && { role: filterRole }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const { users: usersData, pagination } = await AdminApi.getUsers(params);
      setUsers(usersData);
      setTotalPages(pagination.pages);
      setTotalItems(pagination.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  // Load verifications
  const loadVerifications = useCallback(async () => {
    try {
      setVerificationsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus === 'all' ? 'pending' : filterStatus
      };
      
      const { verifications: verificationsData, pagination } = await AdminApi.getVerifications(params);
      setVerifications(verificationsData);
      setTotalPages(pagination.pages);
      setTotalItems(pagination.total);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setVerificationsLoading(false);
    }
  }, [currentPage, filterStatus]);

  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      setSessionsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const { sessions: sessionsData, pagination } = await AdminApi.getSessions(params);
      setSessions(sessionsData);
      setTotalPages(pagination.pages);
      setTotalItems(pagination.total);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  }, [currentPage, filterStatus]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadVerifications(),
      loadSessions()
    ]);
    setRefreshing(false);
  }, [loadStats, loadUsers, loadVerifications, loadSessions]);

  // Update user
  const updateUser = useCallback(async (userId: string, updates: any) => {
    try {
      await AdminApi.updateUser(userId, updates);
      await loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [loadUsers]);

  // Process verification
  const processVerification = useCallback(async (verificationId: string, action: string, data?: any) => {
    try {
      await AdminApi.processVerification(verificationId, action, data);
      await loadVerifications(); // Refresh verifications list
      await loadStats(); // Refresh stats to update pending count
    } catch (error) {
      console.error('Failed to process verification:', error);
      throw error;
    }
  }, [loadVerifications, loadStats]);

  // Load initial stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  return {
    // Data
    stats,
    users,
    verifications,
    sessions,
    
    // Loading states
    statsLoading,
    usersLoading,
    verificationsLoading,
    sessionsLoading,
    refreshing,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    
    // Filters
    searchTerm,
    filterRole,
    filterStatus,
    
    // Actions
    setCurrentPage,
    setSearchTerm,
    setFilterRole,
    setFilterStatus,
    loadStats,
    loadUsers,
    loadVerifications,
    loadSessions,
    refreshAll,
    updateUser,
    processVerification,
  };
}