'use client'
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/components/admin/AuthProvider';
import { AdminApi } from '@/lib/admin/adminApi';
import { useAdminData } from '@/hooks/useAdminData';
import AdminNavigation from '@/components/admin/Navigation/AdminNavigation';
import Overview from '@/components/admin/Dashboard/Overview';
import UsersManagement from '@/components/admin/Dashboard/UsersManagement';
import VerificationsManagement from '@/components/admin/Dashboard/VerificationsManagement';
import NotificationsManagement from '@/components/admin/Dashboard/NotificationsManagement';
import Analytics from '@/components/admin/Dashboard/Analytics';
import Settings from '@/components/admin/Dashboard/Settings';
import SessionsManagement from '@/components/admin/Dashboard/SessionsManagement';
import UserDetailsModal from '@/components/admin/Modals/UserDetailsModal';
import VerificationDetailsModal from '@/components/admin/Modals/VerificationDetailsModal';
import { DashboardStats, VerificationItem } from '@/types/admin';

export default function AdminDashboardContent() {
  const { user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Modal states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationItem | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  // Use admin data hook for data management
  const adminData = useAdminData();

  useEffect(() => {
    loadInitialData();
    
    // Restore active tab from localStorage
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && ['overview', 'users', 'verifications', 'notifications', 'sessions', 'analytics', 'settings'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsData, notifStats] = await Promise.all([
        AdminApi.getDashboardStats(),
        AdminApi.getNotificationStats()
      ]);
      
      setStats(statsData);
      setUnreadNotifications(notifStats?.unread || 0);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotificationCount = async () => {
    try {
      const notifStats = await AdminApi.getNotificationStats();
      setUnreadNotifications(notifStats?.unread || 0);
    } catch (error) {
      console.error('Failed to refresh notification count:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    adminData.setCurrentPage(1); // Reset pagination when changing tabs
    
    // Save tab state
    localStorage.setItem('adminActiveTab', tab);
    
    // Load data for the selected tab
    switch (tab) {
      case 'users':
        adminData.loadUsers();
        break;
      case 'verifications':
        adminData.loadVerifications();
        break;
      case 'sessions':
        adminData.loadSessions();
        break;
      case 'notifications':
        refreshNotificationCount();
        break;
      case 'analytics':
        loadInitialData(); // Refresh stats
        break;
      case 'overview':
        loadInitialData();
        break;
    }

    // Smooth scroll to top on mobile when changing tabs
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await AdminApi.logout();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout API fails
      window.location.href = '/';
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setUserModalOpen(true);
  };

  const handleViewVerification = (verification: VerificationItem) => {
    setSelectedVerification(verification);
    setVerificationModalOpen(true);
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      await adminData.updateUser(userId, { 
        isActive: action === 'activate' 
      });
      // Refresh users list
      adminData.loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleVerificationAction = async (verificationId: string, action: string, data?: any) => {
    try {
      await adminData.processVerification(verificationId, action, data);
      // Refresh verifications list
      adminData.loadVerifications();
      // Refresh stats to update pending count
      loadInitialData();
    } catch (error) {
      console.error('Failed to process verification:', error);
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([
      loadInitialData(),
      adminData.refreshAll()
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        pendingVerifications={stats?.pendingVerifications || 0}
        unreadNotifications={unreadNotifications}
        refreshing={loading || adminData.refreshing}
        onRefresh={handleRefreshAll}
        onLogout={handleLogout}
      />
      
      <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <Overview 
            stats={stats} 
            loading={loading} 
            onNavigate={setActiveTab} 
          />
        )}
        
        {activeTab === 'users' && (
          <UsersManagement
            users={adminData.users}
            loading={adminData.usersLoading}
            searchTerm={adminData.searchTerm}
            filterRole={adminData.filterRole}
            filterStatus={adminData.filterStatus}
            currentPage={adminData.currentPage}
            totalPages={adminData.totalPages}
            totalItems={adminData.totalItems}
            onSearchChange={adminData.setSearchTerm}
            onFilterRoleChange={adminData.setFilterRole}
            onFilterStatusChange={adminData.setFilterStatus}
            onPageChange={adminData.setCurrentPage}
            onUserAction={handleUserAction}
            onViewUser={handleViewUser}
            loadUsers={adminData.loadUsers}
          />
        )}
        
        {activeTab === 'verifications' && (
          <VerificationsManagement
            verifications={adminData.verifications}
            loading={adminData.verificationsLoading}
            filterStatus={adminData.filterStatus}
            currentPage={adminData.currentPage}
            totalPages={adminData.totalPages}
            totalItems={adminData.totalItems}
            onFilterStatusChange={adminData.setFilterStatus}
            onPageChange={adminData.setCurrentPage}
            onViewVerification={handleViewVerification}
            onQuickAction={handleVerificationAction}
            loadVerifications={adminData.loadVerifications}
          />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsManagement 
            onNavigate={setActiveTab}
          />
        )}
        
        {activeTab === 'sessions' && (
          <SessionsManagement
            sessions={adminData.sessions}
            loading={adminData.sessionsLoading}
            filterStatus={adminData.filterStatus}
            currentPage={adminData.currentPage}
            totalPages={adminData.totalPages}
            totalItems={adminData.totalItems}
            onFilterStatusChange={adminData.setFilterStatus}
            onPageChange={adminData.setCurrentPage}
            onViewSession={(sessionId) => console.log('View session:', sessionId)}
            loadSessions={adminData.loadSessions}
          />
        )}
        
        {activeTab === 'analytics' && (
          <Analytics 
            stats={stats} 
            loading={loading} 
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Modals */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setSelectedUserId(null);
        }}
      />

      <VerificationDetailsModal
        verification={selectedVerification}
        isOpen={verificationModalOpen}
        onClose={() => {
          setVerificationModalOpen(false);
          setSelectedVerification(null);
        }}
        onAction={handleVerificationAction}
      />

      {/* Loading overlay for mobile when switching tabs */}
      {(loading || adminData.refreshing) && (
        <div className="sm:hidden fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading data...' : 'Refreshing...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}