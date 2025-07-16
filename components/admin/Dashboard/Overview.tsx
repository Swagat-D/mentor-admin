import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Activity,
  AlertTriangle,
  RefreshCw,
  Bell,
  UserPlus,
  Eye,
  Server,
  Wifi,
  Cpu,
  HardDrive
} from 'lucide-react';
import StatCard from '../Common/StatCard';
import { DashboardStats } from '@/types/admin';

interface OverviewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: string) => void;
}

interface OverviewData {
  stats: {
    totalUsers: number;
    totalMentors: number;
    totalStudents: number;
    activeSessions: number;
    pendingVerifications: number;
    completedSessions: number;
    totalRevenue: number;
    userGrowth: number;
    sessionGrowth: number;
    revenueGrowth: number;
    completionRate: number;
  };
  quickActions: {
    pendingVerifications: number;
    newUsers: number;
    activeSessions: number;
    unreadNotifications: number;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
    severity: 'info' | 'success' | 'warning' | 'error';
  }>;
  systemHealth: {
    status: string;
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
    systemLoad: number;
  };
  userEngagement: {
    weeklyActiveUsers: number;
    sessionsThisWeek: number;
    completionRate: number;
  };
  generatedAt: string;
}

export default function Overview({ stats, loading, onNavigate }: OverviewProps) {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setOverviewLoading(true);
    try {
      const response = await fetch('/api/admin/overview');
      const data = await response.json();
      if (data.success) {
        setOverviewData(data.data);
      }
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOverviewData();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  };

  const formatTrend = (value: number, type: 'percentage' | 'number' = 'percentage') => {
    const isPositive = value >= 0;
    const prefix = isPositive ? '+' : '';
    const suffix = type === 'percentage' ? '%' : '';
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <span className={`text-xs ${color} font-medium`}>
        {prefix}{value.toFixed(1)}{suffix} vs last month
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">Dashboard Overview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time platform metrics and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing || overviewLoading}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          {overviewData && (
            <span className="text-xs text-muted-foreground">
              Updated: {new Date(overviewData.generatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={overviewData?.stats.totalUsers || stats?.totalUsers || 0}
          icon={Users}
          trend={overviewData ? formatTrend(overviewData.stats.userGrowth) : "+12% from last month"}
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Active Mentors"
          value={overviewData?.stats.totalMentors || stats?.totalMentors || 0}
          icon={UserCheck}
          trend={"+8% from last month"}
          color="text-green-600"
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Active Sessions"
          value={overviewData?.stats.activeSessions || stats?.activeSessions || 0}
          icon={Calendar}
          trend="Live sessions"
          color="text-blue-600"
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Monthly Revenue"
          value={overviewData ? `$${overviewData.stats.totalRevenue.toLocaleString()}` : (stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0')}
          icon={DollarSign}
          trend={overviewData ? formatTrend(overviewData.stats.revenueGrowth) : "+15% from last month"}
          color="text-emerald-600"
          loading={overviewLoading || loading}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Completion Rate"
          value={overviewData ? `${overviewData.stats.completionRate}%` : (stats ? `${stats.completionRate}%` : '0%')}
          icon={CheckCircle}
          color="text-green-600"
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Pending Reviews"
          value={overviewData?.stats.pendingVerifications || stats?.pendingVerifications || 0}
          icon={Clock}
          color="text-yellow-600"
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Total Students"
          value={overviewData?.stats.totalStudents || stats?.totalStudents || 0}
          icon={BookOpen}
          color="text-purple-600"
          loading={overviewLoading || loading}
        />
        <StatCard
          title="Session Growth"
          value={overviewData ? `${overviewData.stats.sessionGrowth.toFixed(1)}%` : '0%'}
          icon={TrendingUp}
          color="text-blue-600"
          loading={overviewLoading || loading}
        />
      </div>

      {/* Quick Actions and System Health Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-baskervville">Quick Actions</h3>
            {(overviewData?.quickActions?.unreadNotifications ?? 0) > 0 && (
              <div className="flex items-center space-x-1 text-xs text-amber-600">
                <Bell className="h-3 w-3" />
                <span>{overviewData?.quickActions?.unreadNotifications ?? 0} alerts</span>
              </div>
            )}
          </div>
          
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
                  {overviewData?.quickActions.pendingVerifications || 0} pending
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
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {overviewData?.quickActions.newUsers || 0} new
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
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
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {overviewData?.quickActions.activeSessions || 0} active
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-baskervville">System Health</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">
                {overviewData?.systemHealth.status || 'Healthy'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {overviewData?.systemHealth.uptime || 99.9}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">API Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {overviewData?.systemHealth.responseTime || 142}ms
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Active Connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {overviewData?.systemHealth.activeConnections || 0}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Error Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {overviewData?.systemHealth.errorRate || 0.01}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">System Load</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${overviewData?.systemHealth.systemLoad || 35}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {Math.round(overviewData?.systemHealth.systemLoad || 35)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Engagement and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* User Engagement */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">User Engagement</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {overviewData?.userEngagement.weeklyActiveUsers || 0}
              </div>
              <div className="text-xs text-muted-foreground">Weekly Active</div>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {overviewData?.userEngagement.sessionsThisWeek || 0}
              </div>
              <div className="text-xs text-muted-foreground">Sessions This Week</div>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {overviewData?.userEngagement.completionRate || 0}%
              </div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">Recent Activity</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {overviewLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
             </div>
           ) : overviewData?.recentActivity?.length ? (
             overviewData.recentActivity.map((activity, index) => (
               <div key={index} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-md transition-colors">
                 <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getSeverityBg(activity.severity)}`}>
                   <div className={`w-full h-full rounded-full ${getSeverityColor(activity.severity)}`}></div>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium line-clamp-2">{activity.message}</p>
                   <p className="text-xs text-muted-foreground mt-1">
                     {new Date(activity.timestamp).toLocaleString()}
                   </p>
                 </div>
               </div>
             ))
           ) : (
             <div className="text-center py-4 text-muted-foreground">
               <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
               <p className="text-sm">No recent activity</p>
             </div>
           )}
         </div>
         
         {(overviewData?.recentActivity?.length ?? 0) > 0 && (
           <div className="mt-4 pt-4 border-t border-border">
             <button 
               onClick={() => onNavigate('analytics')}
               className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1"
             >
               <span>View all activity</span>
               <ChevronRight className="h-3 w-3" />
             </button>
           </div>
         )}
       </div>
     </div>

     {/* Performance Metrics */}
     <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
       <h3 className="text-lg font-semibold mb-4 font-baskervville">Performance Metrics</h3>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <span className="text-sm text-muted-foreground">User Satisfaction</span>
             <span className="text-sm font-medium">4.8/5</span>
           </div>
           <div className="w-full bg-muted rounded-full h-2">
             <div className="bg-green-500 h-2 rounded-full w-[96%] transition-all duration-300"></div>
           </div>
         </div>
         
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <span className="text-sm text-muted-foreground">Platform Usage</span>
             <span className="text-sm font-medium">
               {overviewData?.userEngagement.weeklyActiveUsers || 0} users
             </span>
           </div>
           <div className="w-full bg-muted rounded-full h-2">
             <div 
               className="bg-blue-500 h-2 rounded-full transition-all duration-300"
               style={{ 
                 width: `${Math.min((overviewData?.userEngagement.weeklyActiveUsers || 0) / (overviewData?.stats.totalUsers || 1) * 100, 100)}%` 
               }}
             ></div>
           </div>
         </div>
         
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <span className="text-sm text-muted-foreground">Revenue Growth</span>
             <span className="text-sm font-medium">
               {overviewData?.stats.revenueGrowth ? 
                 `${overviewData.stats.revenueGrowth > 0 ? '+' : ''}${overviewData.stats.revenueGrowth.toFixed(1)}%` : 
                 '0%'
               }
             </span>
           </div>
           <div className="w-full bg-muted rounded-full h-2">
             <div 
               className={`h-2 rounded-full transition-all duration-300 ${
                 (overviewData?.stats.revenueGrowth || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
               }`}
               style={{ 
                 width: `${Math.min(Math.abs(overviewData?.stats.revenueGrowth || 0) * 2, 100)}%` 
               }}
             ></div>
           </div>
         </div>
         
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <span className="text-sm text-muted-foreground">System Health</span>
             <span className="text-sm font-medium text-green-600">Excellent</span>
           </div>
           <div className="w-full bg-muted rounded-full h-2">
             <div className="bg-green-500 h-2 rounded-full w-[98%] transition-all duration-300"></div>
           </div>
         </div>
       </div>
     </div>

     {/* Quick Stats Summary */}
     <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 sm:p-6 border border-primary/20">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
         <div>
           <h3 className="text-lg font-semibold font-baskervville">Platform Summary</h3>
           <p className="text-sm text-muted-foreground">Current status and key highlights</p>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
           <div className="text-center">
             <div className="text-xl sm:text-2xl font-bold text-primary">
               {overviewData?.stats.totalUsers || 0}
             </div>
             <div className="text-xs text-muted-foreground">Total Users</div>
           </div>
           
           <div className="text-center">
             <div className="text-xl sm:text-2xl font-bold text-green-600">
               {overviewData?.stats.completionRate || 0}%
             </div>
             <div className="text-xs text-muted-foreground">Success Rate</div>
           </div>
           
           <div className="text-center">
             <div className="text-xl sm:text-2xl font-bold text-blue-600">
               {overviewData?.stats.activeSessions || 0}
             </div>
             <div className="text-xs text-muted-foreground">Active Now</div>
           </div>
           
           <div className="text-center">
             <div className="text-xl sm:text-2xl font-bold text-emerald-600">
               ${overviewData?.stats.totalRevenue.toLocaleString() || 0}
             </div>
             <div className="text-xs text-muted-foreground">Monthly Revenue</div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}