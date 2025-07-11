'use client'
import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Shield, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalMentors: number
  totalStudents: number
  activeSessions: number
  pendingVerifications: number
  totalRevenue: number
  monthlyGrowth: number
  completionRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMentors: 0,
    totalStudents: 0,
    activeSessions: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    completionRate: 0
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, color = "text-[var(--legal-brown)]" }: {
    title: string
    value: string | number
    icon: any
    trend?: string
    color?: string
  }) => (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} font-montserrat`}>{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  )

  const Navigation = () => (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold gradient-text font-baskervville">
            MentorMatch Admin
          </h1>
          <div className="flex space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'mentors', label: 'Mentors', icon: UserCheck },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'verifications', label: 'Verifications', icon: Shield },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
            {stats.pendingVerifications} Pending
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            A
          </div>
        </div>
      </div>
    </nav>
  )

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="+12% from last month"
        />
        <StatCard
          title="Active Mentors"
          value={stats.totalMentors.toLocaleString()}
          icon={UserCheck}
          trend="+8% from last month"
          color="text-green-600"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions.toLocaleString()}
          icon={Calendar}
          trend="Live sessions"
          color="text-blue-600"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+15% from last month"
          color="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { action: 'New mentor verification', user: 'John Smith', time: '2 minutes ago', type: 'verification' },
              { action: 'Session completed', user: 'Sarah Wilson', time: '5 minutes ago', type: 'session' },
              { action: 'New student registered', user: 'Mike Johnson', time: '12 minutes ago', type: 'registration' },
              { action: 'Mentor profile updated', user: 'Lisa Chen', time: '18 minutes ago', type: 'profile' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-muted rounded-md">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'verification' ? 'bg-yellow-500' :
                  activity.type === 'session' ? 'bg-green-500' :
                  activity.type === 'registration' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4 font-baskervville">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">142ms</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">2,847</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">0.01%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-baskervville">User Management</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring">
            <option>All Roles</option>
            <option>Students</option>
            <option>Mentors</option>
          </select>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Smith', email: 'john@example.com', role: 'Mentor', status: 'Active', joined: '2024-01-15' },
              { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Student', status: 'Active', joined: '2024-01-20' },
              { name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', status: 'Pending', joined: '2024-01-22' }
            ].map((user, index) => (
              <tr key={index} className="border-t border-border hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.joined}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary/80 text-sm">View</button>
                    <button className="text-muted-foreground hover:text-foreground text-sm">Edit</button>
                    <button className="text-destructive hover:text-destructive/80 text-sm">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const VerificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-baskervville">Mentor Verifications</h2>
        <div className="text-sm text-muted-foreground">
          {stats.pendingVerifications} pending reviews
        </div>
      </div>

      <div className="grid gap-6">
        {[
          {
            name: 'Dr. Emily Chen',
            email: 'emily.chen@example.com',
            expertise: ['Mathematics', 'Physics'],
            documents: ['ID Verified', 'Education Certificate', 'Professional License'],
            submittedAt: '2024-01-22',
            status: 'pending'
          },
          {
            name: 'Prof. Michael Brown',
            email: 'michael.brown@example.com',
            expertise: ['Computer Science', 'Software Engineering'],
            documents: ['ID Verified', 'Education Certificate', 'Work Experience'],
            submittedAt: '2024-01-21',
            status: 'pending'
          }
        ].map((verification, index) => (
          <div key={index} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold font-baskervville">{verification.name}</h3>
                <p className="text-sm text-muted-foreground">{verification.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {verification.expertise.map((skill, idx) => (
                    <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                Pending Review
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Submitted Documents</h4>
                <ul className="space-y-1">
                  {verification.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Application Details</h4>
                <p className="text-sm text-muted-foreground">
                  Submitted: {verification.submittedAt}
                </p>
                <p className="text-sm text-muted-foreground">
                  Review deadline: 48 hours
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-border">
              <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                Approve
              </button>
              <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded text-sm hover:bg-destructive/90 transition-colors">
                Reject
              </button>
              <button className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors">
                Request More Info
              </button>
              <button className="text-primary hover:text-primary/80 text-sm">
                View Full Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'verifications' && <VerificationsTab />}
        {activeTab === 'mentors' && <div className="text-center py-12 text-muted-foreground">Mentors tab content coming soon...</div>}
        {activeTab === 'sessions' && <div className="text-center py-12 text-muted-foreground">Sessions tab content coming soon...</div>}
        {activeTab === 'settings' && <div className="text-center py-12 text-muted-foreground">Settings tab content coming soon...</div>}
      </main>
    </div>
  )
}