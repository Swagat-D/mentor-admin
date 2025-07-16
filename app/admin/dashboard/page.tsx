'use client'
import React from 'react';
import { AdminAuthProvider } from '@/components/admin/AuthProvider';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminDashboardContent from '@/components/admin/Dashboard/AdminDashboardContent';

export default function AdminDashboardPage() {
  return (
    <AdminAuthProvider>
      <AuthGuard>
        <AdminDashboardContent />
      </AuthGuard>
    </AdminAuthProvider>
  );
}