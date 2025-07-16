'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
}