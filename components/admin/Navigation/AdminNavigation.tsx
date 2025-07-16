'use client'
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Calendar, 
  Activity, 
  Settings,
  RefreshCw,
  Bell,
  LogOut,
  Menu,
  X,
  Badge
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingVerifications: number;
  unreadNotifications: number;
  refreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function AdminNavigation({ 
  activeTab, 
  setActiveTab, 
  pendingVerifications, 
  unreadNotifications,
  refreshing, 
  onRefresh,
  onLogout 
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'verifications', label: 'Verifications', icon: Shield },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    {id: 'notifications', label: 'Notifications', icon: Bell, Badge: unreadNotifications > 0 ? unreadNotifications : undefined},
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-10">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text font-baskervville">
              MentorMatch Admin
            </h1>
            <div className="flex space-x-6">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {id === 'verifications' && pendingVerifications > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {pendingVerifications}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {pendingVerifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingVerifications}
                </div>
              )}
            </div>
            
            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
              {pendingVerifications} Pending
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
            
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold gradient-text font-baskervville">
            MentorMatch Admin
          </h1>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                  {id === 'verifications' && pendingVerifications > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {pendingVerifications}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    A
                  </div>
                  <span className="text-sm font-medium">Admin</span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tablet Horizontal Scrolling Navigation */}
      <div className="hidden md:block lg:hidden">
        <div className="px-4 pb-2">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {id === 'verifications' && pendingVerifications > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {pendingVerifications}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}