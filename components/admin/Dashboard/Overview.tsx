// components/admin/Dashboard/Overview.tsx
import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  UserCheck,
  BookOpen,
  TrendingUp,
  Shield,
  ChevronRight
} from 'lucide-react';
import StatCard from '../Common/StatCard';
import { DashboardStats } from '@/types/admin';

interface OverviewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: string) => void;
}

export default function Overview({ stats, loading, onNavigate }: OverviewProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend="+12% from last month"
          loading={loading}
        />
        <StatCard
          title="Active Mentors"
          value={stats?.totalMentors || 0}
          icon={UserCheck}
          trend="+8% from last month"
          color="text-green-600"
          loading={loading}
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessions || 0}
          icon={Calendar}
          trend="Live sessions"
          color="text-blue-600"
          loading={loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0'}
          icon={DollarSign}
          trend="+15% from last month"
          color="text-emerald-600"
          loading={loading}
        />
      </div>

      {/* Secondary Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Completion Rate"
          value={stats ? `${stats.completionRate}%` : '0%'}
          icon={CheckCircle}
          color="text-green-600"
          loading={loading}
        />
        <StatCard
          title="Pending Reviews"
          value={stats?.pendingVerifications || 0}
          icon={Clock}
          color="text-yellow-600"
          loading={loading}
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={BookOpen}
          color="text-purple-600"
          loading={loading}
        />
        <StatCard
          title="Monthly Growth"
          value={stats ? `${stats.monthlyGrowth}%` : '0%'}
          icon={TrendingUp}
          color="text-blue-600"
          loading={loading}
        />
      </div>

      {/* Quick Actions and System Health - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('verifications')}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="font-medium block text-sm sm:text-base">Review Verifications</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Pending mentor applications</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                  {stats?.pendingVerifications || 0} pending
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('users')}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="font-medium block text-sm sm:text-base">Manage Users</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">User accounts and permissions</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block flex-shrink-0" />
            </button>
            
            <button
              onClick={() => onNavigate('sessions')}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors flex-shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="font-medium block text-sm sm:text-base">Monitor Sessions</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Active and scheduled sessions</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block flex-shrink-0" />
            </button>
            
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-md transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="font-medium block text-sm sm:text-base">View Analytics</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">Platform performance metrics</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">142ms</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">{stats?.activeSessions || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">0.01%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Mobile Optimized */}
      <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 font-baskervville">Recent Platform Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 hover:bg-muted rounded-md">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">New mentor verification submitted</p>
              <p className="text-xs text-muted-foreground">John Smith • 2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-muted rounded-md">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Session completed successfully</p>
              <p className="text-xs text-muted-foreground">Sarah Wilson → Mike Johnson • 5 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-muted rounded-md">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">New student registered</p>
              <p className="text-xs text-muted-foreground">Emily Chen • 12 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-muted rounded-md">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Mentor profile updated</p>
              <p className="text-xs text-muted-foreground">Lisa Chen • 18 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 hover:bg-muted rounded-md">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Payment processing error resolved</p>
              <p className="text-xs text-muted-foreground">System • 25 minutes ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <button 
            onClick={() => onNavigate('analytics')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all activity →
          </button>
        </div>
      </div>
    </div>
  );
}