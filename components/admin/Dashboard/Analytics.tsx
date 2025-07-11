// components/admin/Dashboard/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
} from 'lucide-react';
import StatCard from '../Common/StatCard';
import { DashboardStats } from '@/types/admin';

interface AnalyticsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function Analytics({ stats, loading }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('line');

  // Mock analytics data - in real app, this would come from your analytics API
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [
      { month: 'Jan', users: 450, mentors: 45, students: 405 },
      { month: 'Feb', users: 520, mentors: 52, students: 468 },
      { month: 'Mar', users: 680, mentors: 68, students: 612 },
      { month: 'Apr', users: 820, mentors: 82, students: 738 },
      { month: 'May', users: 950, mentors: 95, students: 855 },
      { month: 'Jun', users: 1120, mentors: 112, students: 1008 },
    ],
    sessionStats: [
      { day: 'Mon', completed: 45, cancelled: 5, noShow: 2 },
      { day: 'Tue', completed: 52, cancelled: 3, noShow: 1 },
      { day: 'Wed', completed: 48, cancelled: 4, noShow: 3 },
      { day: 'Thu', completed: 60, cancelled: 6, noShow: 2 },
      { day: 'Fri', completed: 55, cancelled: 2, noShow: 1 },
      { day: 'Sat', completed: 35, cancelled: 1, noShow: 0 },
      { day: 'Sun', completed: 25, cancelled: 2, noShow: 1 },
    ],
    revenueData: [
      { month: 'Jan', revenue: 15420, sessions: 230 },
      { month: 'Feb', revenue: 18650, sessions: 285 },
      { month: 'Mar', revenue: 22340, sessions: 342 },
      { month: 'Apr', revenue: 26780, sessions: 410 },
      { month: 'May', revenue: 31250, sessions: 478 },
      { month: 'Jun', revenue: 35680, sessions: 542 },
    ],
    topMentors: [
      { name: 'Sarah Wilson', sessions: 45, rating: 4.9, earnings: 2250 },
      { name: 'Mike Johnson', sessions: 42, rating: 4.8, earnings: 2100 },
      { name: 'Emily Chen', sessions: 38, rating: 4.9, earnings: 1900 },
      { name: 'David Brown', sessions: 35, rating: 4.7, earnings: 1750 },
      { name: 'Lisa Davis', sessions: 32, rating: 4.8, earnings: 1600 },
    ],
    popularSubjects: [
      { subject: 'Programming', sessions: 125, percentage: 28 },
      { subject: 'Mathematics', sessions: 98, percentage: 22 },
      { subject: 'Science', sessions: 87, percentage: 19 },
      { subject: 'Languages', sessions: 76, percentage: 17 },
      { subject: 'Business', sessions: 64, percentage: 14 },
    ]
  });

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-baskervville">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Platform performance metrics and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0'}
          icon={DollarSign}
          trend="+15.3% vs last month"
          color="text-emerald-600"
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend="+8.2% vs last month"
          color="text-blue-600"
          loading={loading}
        />
        <StatCard
          title="Session Rate"
          value={stats ? `${stats.completionRate}%` : '0%'}
          icon={Activity}
          trend="+2.1% vs last month"
          color="text-green-600"
          loading={loading}
        />
        <StatCard
          title="Growth Rate"
          value={stats ? `${stats.monthlyGrowth}%` : '0%'}
          icon={TrendingUp}
          trend="Monthly growth"
          color="text-purple-600"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-baskervville">User Growth</h3>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization would go here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Showing user growth over the last 6 months
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.totalMentors || 0}</div>
              <div className="text-sm text-muted-foreground">Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.totalStudents || 0}</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-baskervville">Revenue Trends</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Revenue chart would go here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly revenue and session trends
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                ${stats?.totalRevenue.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.completedSessions || 0}</div>
              <div className="text-sm text-muted-foreground">Completed Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Mentors */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">Top Performing Mentors</h3>
          
          <div className="space-y-3">
            {analyticsData.topMentors.map((mentor, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{mentor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {mentor.sessions} sessions • ⭐ {mentor.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-emerald-600">
                    ${mentor.earnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Subjects */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">Popular Subjects</h3>
          
          <div className="space-y-3">
            {analyticsData.popularSubjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.sessions} sessions ({subject.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Performance */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 font-baskervville">Weekly Session Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium">Day</th>
                <th className="text-left p-2 font-medium">Completed</th>
                <th className="text-left p-2 font-medium">Cancelled</th>
                <th className="text-left p-2 font-medium">No Show</th>
                <th className="text-left p-2 font-medium">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.sessionStats.map((day, index) => {
                const total = day.completed + day.cancelled + day.noShow;
                const successRate = total > 0 ? Math.round((day.completed / total) * 100) : 0;
                
                return (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="p-2 font-medium">{day.day}</td>
                    <td className="p-2">
                      <span className="text-green-600 font-medium">{day.completed}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-red-600 font-medium">{day.cancelled}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-gray-600 font-medium">{day.noShow}</span>
                    </td>
                    <td className="p-2">
                      <span className={`font-medium ${successRate >= 85 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold mb-3">Platform Health</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">System Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">API Response Time</span>
              <span className="text-sm font-medium text-green-600">142ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="text-sm font-medium text-green-600">0.01%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold mb-3">User Engagement</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Daily Active Users</span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round((stats?.totalUsers || 0) * 0.35).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Session Completion</span>
              <span className="text-sm font-medium text-green-600">{stats?.completionRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">User Retention</span>
              <span className="text-sm font-medium text-purple-600">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold mb-3">Financial Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Monthly Revenue</span>
              <span className="text-sm font-medium text-emerald-600">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Session Value</span>
              <span className="text-sm font-medium text-emerald-600">$65</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue Growth</span>
              <span className="text-sm font-medium text-green-600">+{stats?.monthlyGrowth || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}