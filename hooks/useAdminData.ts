// hooks/useAdminData.ts - Fixed Admin Data Hook
import { useState, useCallback } from 'react';
import { AdminApi } from '@/lib/admin/adminApi';
import { DashboardStats, UserListItem, VerificationItem, SessionItem } from '@/types/admin';

export function useAdminData() {
  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Verifications
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [verificationsLoading, setVerificationsLoading] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // Default to 'all' for verifications
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Global loading state
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await AdminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20
      };

      if (searchTerm) params.search = searchTerm;
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus;

      const data = await AdminApi.getUsers(params);
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  // Load verifications
  const loadVerifications = useCallback(async () => {
    setVerificationsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20
      };

      // Only add status filter if it's not 'all'
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const data = await AdminApi.getVerifications(params);
      setVerifications(data.verifications);
      setTotalPages(data.pagination.pages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to load verifications:', error);
      setVerifications([]);
    } finally {
      setVerificationsLoading(false);
    }
  }, [currentPage, filterStatus]);

  // Load sessions
  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20
      };

      if (filterStatus !== 'all') params.status = filterStatus;

      const data = await AdminApi.getSessions(params);
      setSessions(data.sessions);
      setTotalPages(data.pagination.pages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  }, [currentPage, filterStatus]);

  // Update user
  const updateUser = useCallback(async (userId: string, updates: any) => {
    try {
      await AdminApi.updateUser(userId, updates);
      // Reload users to reflect changes
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [loadUsers]);

  // Process verification
  const processVerification = useCallback(async (verificationId: string, action: string, data?: any) => {
    try {
      await AdminApi.processVerification(verificationId, action, data);
      // Reload verifications to reflect changes
      await loadVerifications();
      // Also reload stats to update counts
      await loadStats();
    } catch (error) {
      console.error('Failed to process verification:', error);
      throw error;
    }
  }, [loadVerifications, loadStats]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadVerifications(),
        loadSessions()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadStats, loadUsers, loadVerifications, loadSessions]);

  // Reset pagination when filters change
  const handleFilterChange = useCallback((newFilter: string, type: 'role' | 'status') => {
    setCurrentPage(1);
    if (type === 'role') {
      setFilterRole(newFilter);
    } else {
      setFilterStatus(newFilter);
    }
  }, []);

  // Reset pagination when search changes
  const handleSearchChange = useCallback((newSearch: string) => {
    setCurrentPage(1);
    setSearchTerm(newSearch);
  }, []);

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

    // Filters and pagination
    searchTerm,
    filterRole,
    filterStatus,
    currentPage,
    totalPages,
    totalItems,

    // Setters with pagination reset
    setSearchTerm: handleSearchChange,
    setFilterRole: (role: string) => handleFilterChange(role, 'role'),
    setFilterStatus: (status: string) => handleFilterChange(status, 'status'),
    setCurrentPage,

    // Actions
    loadStats,
    loadUsers,
    loadVerifications,
    loadSessions,
    updateUser,
    processVerification,
    refreshAll
  };
}