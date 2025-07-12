// components/admin/Dashboard/SessionsManagement.tsx - Enhanced Responsive Version
import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  Filter,
  Search,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';
import Pagination from '../Common/Pagination';
import { SessionItem } from '@/types/admin';

interface SessionsManagementProps {
  sessions: SessionItem[];
  loading: boolean;
  filterStatus: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onFilterStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onViewSession: (sessionId: string) => void;
  loadSessions: () => Promise<void>;
}

export default function SessionsManagement({
  sessions,
  loading,
  filterStatus,
  currentPage,
  totalPages,
  totalItems,
  onFilterStatusChange,
  onPageChange,
  onViewSession,
  loadSessions
}: SessionsManagementProps) {
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'in_progress':
        return <Play className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'no_show':
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const isUpcoming = (scheduledAt: string) => {
    return new Date(scheduledAt) > new Date();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">Session Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor and manage all mentoring sessions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-input text-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>

          {/* Desktop Filter */}
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="hidden sm:block px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[160px]"
          >
            <option value="all">All Sessions</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>

          <div className="text-xs sm:text-sm text-muted-foreground">
            {totalItems} sessions
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="sm:hidden">
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Sessions</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      )}

      {/* Stats Cards - Enhanced responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {sessions.filter(s => s.status === 'scheduled').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Scheduled</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {sessions.filter(s => s.status === 'in_progress').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {sessions.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {sessions.filter(s => s.status === 'cancelled').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-600">
                ${sessions
                  .filter(s => s.payment.status === 'succeeded')
                  .reduce((sum, s) => sum + (s.payment.amount / 100), 0)
                  .toLocaleString()
                }
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Display */}
      {loading ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading sessions...</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">Session</th>
                  <th className="text-left p-4 font-medium">Participants</th>
                  <th className="text-left p-4 font-medium">Scheduled</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{session.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {session._id.slice(-8)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <User className="h-3 w-3 mr-1 text-blue-500" />
                          <span className="font-medium">
                            {session.mentor.firstName} {session.mentor.lastName}
                          </span>
                          <span className="text-muted-foreground ml-1">(Mentor)</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-3 w-3 mr-1 text-green-500" />
                          <span className="font-medium">
                            {session.student.firstName} {session.student.lastName}
                          </span>
                          <span className="text-muted-foreground ml-1">(Student)</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(session.scheduledAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {isUpcoming(session.scheduledAt) && session.status === 'scheduled' && (
                          <div className="text-xs text-blue-600 mt-1">
                            Upcoming
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-sm font-medium">
                        {formatDuration(session.duration)}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span>{session.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          ${(session.payment.amount / 100).toFixed(2)}
                        </div>
                        <div className={`text-xs ${getPaymentStatusColor(session.payment.status)}`}>
                          {session.payment.status.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <button
                        onClick={() => onViewSession(session._id)}
                        className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden divide-y divide-border">
            {sessions.map((session) => (
              <div key={session._id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm sm:text-base truncate">
                        {session.subject}
                      </h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)} ml-2 flex-shrink-0`}>
                        {getStatusIcon(session.status)}
                        <span className="hidden sm:inline">{session.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      ID: {session._id.slice(-8)}
                    </div>
                    
                    {/* Participants */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        <User className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {session.mentor.firstName} {session.mentor.lastName}
                        </span>
                        <span className="text-muted-foreground ml-1">(Mentor)</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <Users className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {session.student.firstName} {session.student.lastName}
                        </span>
                        <span className="text-muted-foreground ml-1">(Student)</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onViewSession(session._id)}
                    className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors ml-2 flex-shrink-0"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Session Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Scheduled</span>
                    <div className="mt-1">
                      <div className="font-medium">
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(session.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {isUpcoming(session.scheduledAt) && session.status === 'scheduled' && (
                        <div className="text-blue-600 mt-1">
                          Upcoming
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <div className="mt-1 font-medium">
                      {formatDuration(session.duration)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Payment</span>
                    <div className="mt-1">
                      <div className="font-medium">
                        ${(session.payment.amount / 100).toFixed(2)}
                      </div>
                      <div className={`${getPaymentStatusColor(session.payment.status)}`}>
                        {session.payment.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sessions.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No sessions found</h3>
              <p>
                {filterStatus === 'all' 
                  ? 'No sessions have been scheduled yet.'
                  : `No ${filterStatus} sessions found.`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={20}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}