// app/admin/dashboard/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminApi } from '@/lib/admin/adminApi';
import { useAdminData } from '@/hooks/useAdminData';
import AdminNavigation from '@/components/admin/Navigation/AdminNavigation';
import Overview from '@/components/admin/Dashboard/Overview';
import UsersManagement from '@/components/admin/Dashboard/UsersManagement';
import VerificationsManagement from '@/components/admin/Dashboard/VerificationsManagement';
import SessionsManagement from '@/components/admin/Dashboard/SessionsManagement';
import UserDetailsModal from '@/components/admin/Modals/UserDetailsModal';
import VerificationDetailsModal from '@/components/admin/Modals/VerificationDetailsModal';
import { VerificationItem } from '@/types/admin';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationItem | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  // Use admin data hook
  const adminData = useAdminData();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AdminApi.logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    adminData.setCurrentPage(1); // Reset to first page when changing tabs
    
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
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleVerificationAction = async (verificationId: string, action: string, data?: any) => {
    try {
      await adminData.processVerification(verificationId, action, data);
    } catch (error) {
      console.error('Failed to process verification:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        pendingVerifications={adminData.stats?.pendingVerifications || 0}
        refreshing={adminData.refreshing}
        onRefresh={adminData.refreshAll}
        onLogout={handleLogout}
      />
      
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <Overview
            stats={adminData.stats}
            loading={adminData.statsLoading}
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
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p>Advanced analytics and reporting features coming soon...</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">System Settings</h3>
            <p>Administrative settings and configuration options coming soon...</p>
          </div>
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
    </div>
  );
}