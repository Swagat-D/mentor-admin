// components/admin/Dashboard/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  Activity,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import StatCard from '../Common/StatCard';
import { DashboardStats } from '@/types/admin';

interface AnalyticsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

interface AnalyticsData {
  userGrowthData: any[];
  revenueData: any[];
  topMentors: any[];
  popularSubjects: any[];
  weeklySessionStats: any[];
  userEngagement: any;
  platformHealth: any;
  timeRange: string;
  generatedAt: string;
}

export default function Analytics({ stats, loading }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleExportData = () => {
    if (!analyticsData) return;
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    children, 
    defaultExpanded = false 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode; 
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-muted/50 transition-colors sm:cursor-default"
        >
          <h3 className="text-base sm:text-lg font-semibold font-baskervville text-left">{title}</h3>
          <div className="sm:hidden">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>
        
        <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 sm:pt-0">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">Analytics Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Platform performance metrics and insights
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-input text-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={loadAnalytics}
              disabled={analyticsLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExportData}
              disabled={!analyticsData}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="sm:hidden grid grid-cols-1 gap-3 p-4 bg-card rounded-lg border border-border">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={loadAnalytics}
              disabled={analyticsLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm disabled:opacity-50 flex-1"
            >
              <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExportData}
              disabled={!analyticsData}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm disabled:opacity-50 flex-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {/* Key Metrics */}
<CollapsibleSection id="overview" title="Key Metrics" defaultExpanded>
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
    <StatCard
      title="Total Revenue"
      value={analyticsData?.revenueData 
        ? `$${analyticsData.revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}` 
        : (stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0')
      }
      icon={DollarSign}
      trend="+15.3% vs last month"
      color="text-emerald-600"
      loading={analyticsLoading || loading}
    />
    <StatCard
      title="Active Users"
      value={analyticsData?.userEngagement?.totalUsers || stats?.totalUsers || 0}
      icon={Users}
      trend={analyticsData?.userEngagement?.monthlyActiveUsers 
        ? `${analyticsData.userEngagement.monthlyActiveUsers} monthly active` 
        : "+8.2% vs last month"
      }
      color="text-blue-600"
      loading={analyticsLoading || loading}
    />
    <StatCard
      title="Session Rate"
      value={analyticsData?.userEngagement?.completionRate 
        ? `${analyticsData.userEngagement.completionRate}%` 
        : (stats ? `${stats.completionRate}%` : '0%')
      }
      icon={Activity}
      trend="+2.1% vs last month"
      color="text-green-600"
      loading={analyticsLoading || loading}
    />
    <StatCard
      title="Growth Rate"
      value={stats ? `${stats.monthlyGrowth}%` : '0%'}
      icon={TrendingUp}
      trend="Monthly growth"
      color="text-purple-600"
      loading={analyticsLoading || loading}
    />
  </div>
</CollapsibleSection>

      {/* User Growth Chart */}
<CollapsibleSection id="user-growth" title="User Growth">
  {analyticsLoading ? (
    <div className="h-48 sm:h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ) : analyticsData?.userGrowthData?.length ? (
    <div className="space-y-4">
      {/* Clean Line Chart */}
      <div className="h-48 sm:h-64 bg-white rounded-lg p-4 relative overflow-hidden border border-border/20">
        <div className="h-full w-full relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            {(() => {
              const maxValue = Math.max(...analyticsData.userGrowthData.map(d => d.totalUsers), 5);
              const steps = 5;
              return Array.from({ length: steps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <span className="w-8 text-right pr-2 font-medium">
                    {Math.round((maxValue * (steps - 1 - i)) / (steps - 1))}
                  </span>
                  <div className="w-2 h-px bg-border"></div>
                </div>
              ));
            })()}
          </div>
          
          {/* Chart area */}
          <div className="ml-12 h-full relative">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 800 200" 
              className="overflow-visible"
            >
              {/* Clean grid lines */}
              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={40 * i}
                  x2="800"
                  y2={40 * i}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border opacity-30"
                />
              ))}
              
              {/* Vertical grid lines */}
              {analyticsData.userGrowthData
                .filter((_, index) => index % Math.ceil(analyticsData.userGrowthData.length / 6) === 0)
                .map((_, index) => {
                  const x = (index * Math.ceil(analyticsData.userGrowthData.length / 6)) * (800 / (analyticsData.userGrowthData.length - 1 || 1));
                  return (
                    <line
                      key={index}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="200"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-border opacity-20"
                    />
                  );
                })}
              
              {/* Data lines */}
              {(() => {
                const maxValue = Math.max(...analyticsData.userGrowthData.map(d => d.totalUsers), 5);
                const dataPoints = analyticsData.userGrowthData;
                const stepX = 800 / (dataPoints.length - 1 || 1);
                
                // Total users line (main line)
                const totalUsersPath = dataPoints.map((point, index) => {
                  const x = index * stepX;
                  const y = 200 - (point.totalUsers / maxValue) * 200;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                // Mentors line
                const mentorsPath = dataPoints.map((point, index) => {
                  const x = index * stepX;
                  const y = 200 - (point.totalMentors / maxValue) * 200;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                // Students line
                const studentsPath = dataPoints.map((point, index) => {
                  const x = index * stepX;
                  const y = 200 - (point.totalStudents / maxValue) * 200;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                return (
                  <>
                    {/* Total users line - main prominent line */}
                    <path
                      d={totalUsersPath}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Mentors line - thinner, dashed */}
                    <path
                      d={mentorsPath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                    
                    {/* Students line - thinner, dashed */}
                    <path
                      d={studentsPath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                    
                    {/* Data points - only show when there are actual users */}
                    {dataPoints.map((point, index) => {
                      const x = index * stepX;
                      const yTotal = 200 - (point.totalUsers / maxValue) * 200;
                      const yMentors = 200 - (point.totalMentors / maxValue) * 200;
                      const yStudents = 200 - (point.totalStudents / maxValue) * 200;
                      
                      return (
                        <g key={index}>
                          {/* Total users point - always show if > 0 */}
                          {point.totalUsers > 0 && (
                            <circle
                              cx={x}
                              cy={yTotal}
                              r="5"
                              fill="#6366f1"
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="drop-shadow-sm hover:r-7 transition-all cursor-pointer"
                            >
                              <title>{`${new Date(point.date).toLocaleDateString()}: ${point.totalUsers} total users`}</title>
                            </circle>
                          )}
                          
                          {/* Mentors point - only show if > 0 */}
                          {point.totalMentors > 0 && (
                            <circle
                              cx={x}
                              cy={yMentors}
                              r="3"
                              fill="#3b82f6"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              className="hover:r-4 transition-all cursor-pointer"
                            >
                              <title>{`${new Date(point.date).toLocaleDateString()}: ${point.totalMentors} mentors`}</title>
                            </circle>
                          )}
                          
                          {/* Students point - only show if > 0 */}
                          {point.totalStudents > 0 && (
                            <circle
                              cx={x}
                              cy={yStudents}
                              r="3"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                              className="hover:r-4 transition-all cursor-pointer"
                            >
                              <title>{`${new Date(point.date).toLocaleDateString()}: ${point.totalStudents} students`}</title>
                            </circle>
                          )}
                          
                          {/* Show new user indicators - small dots for new registrations */}
                          {point.newTotal > 0 && (
                            <circle
                              cx={x}
                              cy={yTotal - 15}
                              r="2"
                              fill="#f59e0b"
                              className="animate-pulse"
                            >
                              <title>{`${new Date(point.date).toLocaleDateString()}: +${point.newTotal} new users`}</title>
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          
          {/* Clean X-axis labels */}
          <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-muted-foreground font-medium">
            {analyticsData.userGrowthData
              .filter((_, index) => index % Math.ceil(analyticsData.userGrowthData.length / 6) === 0)
              .map((point, index) => (
                <div key={index} className="text-center">
                  {timeRange === '7d' 
                    ? new Date(point.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
                    : new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Clean Legend */}
      <div className="flex justify-center space-x-8 text-sm bg-muted/20 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-indigo-500 rounded-full"></div>
            <span className="font-medium text-indigo-700">Total Users</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded" style={{ 
              backgroundImage: 'repeating-linear-gradient(to right, #3b82f6 0px, #3b82f6 4px, transparent 4px, transparent 8px)' 
            }}></div>
            <span className="font-medium text-blue-700">Mentors</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500 rounded" style={{ 
              backgroundImage: 'repeating-linear-gradient(to right, #10b981 0px, #10b981 4px, transparent 4px, transparent 8px)' 
            }}></div>
            <span className="font-medium text-green-700">Students</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-amber-700">New Users</span>
          </div>
        </div>
      </div>
      
      {/* Clean Data Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="text-center p-3 bg-white rounded-lg border border-border/20">
          <div className="text-2xl font-bold text-indigo-600">
            {analyticsData.userGrowthData[analyticsData.userGrowthData.length - 1]?.totalUsers || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Current Total</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-border/20">
          <div className="text-2xl font-bold text-green-600">
            {analyticsData.userGrowthData.reduce((sum, item) => sum + item.newTotal, 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">New Users</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-border/20">
          <div className="text-2xl font-bold text-blue-600">
            {analyticsData.userGrowthData[analyticsData.userGrowthData.length - 1]?.totalMentors || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Mentors</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-border/20">
          <div className="text-2xl font-bold text-emerald-600">
            {analyticsData.userGrowthData[analyticsData.userGrowthData.length - 1]?.totalStudents || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Students</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-48 sm:h-64 flex items-center justify-center bg-white rounded-lg border border-border/20">
      <div className="text-center">
        <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm sm:text-base text-muted-foreground">No user growth data available</p>
        <p className="text-xs text-muted-foreground mt-1">Try a different time range</p>
      </div>
    </div>
  )}
  
  {/* Summary Stats */}
  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
    <div className="text-center">
      <div className="text-lg sm:text-2xl font-bold text-indigo-600">
        {analyticsData?.userGrowthData?.[analyticsData.userGrowthData.length - 1]?.totalUsers || 
         analyticsData?.userEngagement?.totalUsers || 
         stats?.totalUsers || 0}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
    </div>
    <div className="text-center">
      <div className="text-lg sm:text-2xl font-bold text-blue-600">
        {analyticsData?.userGrowthData?.[analyticsData.userGrowthData.length - 1]?.totalMentors || 
         stats?.totalMentors || 0}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">Mentors</div>
    </div>
    <div className="text-center">
      <div className="text-lg sm:text-2xl font-bold text-green-600">
        {analyticsData?.userGrowthData?.[analyticsData.userGrowthData.length - 1]?.totalStudents || 
         stats?.totalStudents || 0}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">Students</div>
    </div>
  </div>
</CollapsibleSection>

      {/* Revenue Trends */}
      <CollapsibleSection id="revenue-trends" title="Revenue Trends">
        {analyticsLoading ? (
          <div className="h-48 sm:h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-48 sm:h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Revenue data for {timeRange}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600">
              ${stats?.totalRevenue.toLocaleString() || 0}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats?.completedSessions || 0}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Completed Sessions</div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Top Mentors */}
      <CollapsibleSection id="top-mentors" title="Top Performing Mentors">
        <div className="space-y-2 sm:space-y-3">
          {analyticsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : analyticsData?.topMentors?.length ? (
            analyticsData.topMentors.map((mentor, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-primary">
                      {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base truncate">{mentor.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {mentor.sessions} sessions • ⭐ {mentor.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-medium text-emerald-600 text-sm sm:text-base">
                    ${mentor.earnings.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">earned</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No mentor data available for the selected period</p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Popular Subjects */}
      <CollapsibleSection id="popular-subjects" title="Popular Subjects">
        <div className="space-y-2 sm:space-y-3">
          {analyticsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : analyticsData?.popularSubjects?.length ? (
            analyticsData.popularSubjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">{subject.subject}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
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
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No subject data available for the selected period</p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Session Performance */}
      <CollapsibleSection id="session-performance" title="Weekly Session Performance">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium text-sm">Day</th>
                <th className="text-left p-2 font-medium text-sm">Completed</th>
                <th className="text-left p-2 font-medium text-sm">Cancelled</th>
                <th className="text-left p-2 font-medium text-sm">No Show</th>
                <th className="text-left p-2 font-medium text-sm">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : analyticsData?.weeklySessionStats?.length ? (
                analyticsData.weeklySessionStats.map((day, index) => {
                  const total = day.completed + day.cancelled + day.noShow;
                  const successRate = total > 0 ? Math.round((day.completed / total) * 100) : 0;
                  
                  return (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="p-2 font-medium text-sm">{day.day}</td>
                     <td className="p-2">
                       <span className="text-green-600 font-medium text-sm">{day.completed}</span>
                     </td>
                     <td className="p-2">
                       <span className="text-red-600 font-medium text-sm">{day.cancelled}</span>
                     </td>
                     <td className="p-2">
                       <span className="text-gray-600 font-medium text-sm">{day.noShow}</span>
                     </td>
                     <td className="p-2">
                       <span className={`font-medium text-sm ${successRate >= 85 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                         {successRate}%
                       </span>
                     </td>
                   </tr>
                 );
               })
             ) : (
               <tr>
                 <td colSpan={5} className="text-center py-8 text-muted-foreground">
                   No session data available for the selected period
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
     </CollapsibleSection>

     {/* Platform Health & Metrics */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
       <CollapsibleSection id="platform-health" title="Platform Health">
         <div className="space-y-2 sm:space-y-3">
           {analyticsLoading ? (
             <div className="text-center py-4">
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
             </div>
           ) : analyticsData?.platformHealth ? (
             <>
               <div className="flex justify-between items-center">
                 <span className="text-xs sm:text-sm">System Uptime</span>
                 <span className="text-xs sm:text-sm font-medium text-green-600">
                   {analyticsData.platformHealth.systemUptime}%
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs sm:text-sm">API Response Time</span>
                 <span className="text-xs sm:text-sm font-medium text-green-600">
                   {analyticsData.platformHealth.apiResponseTime}ms
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs sm:text-sm">Error Rate</span>
                 <span className="text-xs sm:text-sm font-medium text-green-600">
                   {analyticsData.platformHealth.errorRate}%
                 </span>
               </div>
             </>
           ) : (
             <div className="text-xs text-muted-foreground">No health data available</div>
           )}
         </div>
       </CollapsibleSection>

       <CollapsibleSection id="user-engagement" title="User Engagement">
  <div className="space-y-2 sm:space-y-3">
    {analyticsLoading ? (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    ) : analyticsData?.userEngagement ? (
      <>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Total Users</span>
          <span className="text-xs sm:text-sm font-medium text-blue-600">
            {analyticsData.userEngagement.totalUsers}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Weekly Active Users</span>
          <span className="text-xs sm:text-sm font-medium text-green-600">
            {analyticsData.userEngagement.dailyActiveUsers}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Monthly Active Users</span>
          <span className="text-xs sm:text-sm font-medium text-purple-600">
            {analyticsData.userEngagement.monthlyActiveUsers}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Session Completion</span>
          <span className="text-xs sm:text-sm font-medium text-green-600">
            {analyticsData.userEngagement.completionRate}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">User Retention</span>
          <span className="text-xs sm:text-sm font-medium text-purple-600">
            {analyticsData.userEngagement.userRetention}%
          </span>
        </div>
      </>
    ) : (
      <div className="text-xs text-muted-foreground">No engagement data available</div>
    )}
  </div>
</CollapsibleSection>

       <CollapsibleSection id="financial-metrics" title="Financial Metrics">
         <div className="space-y-2 sm:space-y-3">
           <div className="flex justify-between items-center">
             <span className="text-xs sm:text-sm">Monthly Revenue</span>
             <span className="text-xs sm:text-sm font-medium text-emerald-600">
               ${(stats?.totalRevenue || 0).toLocaleString()}
             </span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-xs sm:text-sm">Avg. Session Value</span>
             <span className="text-xs sm:text-sm font-medium text-emerald-600">
               ${analyticsData?.revenueData?.length 
                 ? Math.round(analyticsData.revenueData.reduce((sum, item) => sum + item.revenue, 0) / analyticsData.revenueData.reduce((sum, item) => sum + item.sessions, 0))
                 : 0}
             </span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-xs sm:text-sm">Revenue Growth</span>
             <span className="text-xs sm:text-sm font-medium text-green-600">
               +{stats?.monthlyGrowth || 0}%
             </span>
           </div>
         </div>
       </CollapsibleSection>
     </div>

     {/* Data Freshness Indicator */}
     {analyticsData && (
       <div className="text-center text-xs text-muted-foreground mt-4">
         Data last updated: {new Date(analyticsData.generatedAt).toLocaleString()}
       </div>
     )}
   </div>
 );
}