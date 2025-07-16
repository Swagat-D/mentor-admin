// components/admin/Dashboard/NotificationsManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCircle, 
  X, 
  Trash2, 
  Filter, 
  Search, 
  RefreshCw,
  AlertTriangle,
  Info,
  MessageSquare,
  UserPlus,
  DollarSign,
  Shield,
  Settings,
  Calendar,
  Eye,
  MoreVertical,
  Archive,
  Star,
  Clock
} from 'lucide-react';
import Pagination from '../Common/Pagination';

interface Notification {
  _id: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  readAt?: string;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationsManagementProps {
  onNavigate?: (tab: string) => void;
}

export default function NotificationsManagement({ onNavigate }: NotificationsManagementProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [filterType, filterRead, searchTerm, currentPage]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      
      if (filterType !== 'all') params.append('type', filterType);
      if (filterRead !== 'all') params.append('read', filterRead);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/notifications?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setTotalPages(data.data.pagination.pages);
        setTotalItems(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds })
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) 
            ? { ...notif, read: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markAsUnread = async (notificationIds: string[]) => {
    try {
      await fetch('/api/admin/notifications/mark-unread', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds })
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) 
            ? { ...notif, read: false, readAt: undefined }
            : notif
        )
      );
      
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to mark notifications as unread:', error);
    }
  };

  const deleteNotifications = async (notificationIds: string[]) => {
    if (!confirm(`Delete ${notificationIds.length} notification(s)?`)) return;
    
    try {
      await fetch('/api/admin/notifications/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds })
      });
      
      setNotifications(prev => 
        prev.filter(notif => !notificationIds.includes(notif._id))
      );
      
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PATCH'
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true, readAt: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification_submitted':
      case 'verification_approved':
      case 'verification_rejected':
      case 'verification_info_requested':
        return Shield;
      case 'user_registered':
      case 'user_updated':
        return UserPlus;
      case 'payment_received':
      case 'payment_failed':
      case 'payout_processed':
        return DollarSign;
      case 'session_completed':
      case 'session_cancelled':
        return Calendar;
      case 'system_alert':
      case 'maintenance_scheduled':
        return AlertTriangle;
      case 'admin_message':
        return MessageSquare;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    const baseColors = {
      verification_submitted: 'text-blue-600 bg-blue-100',
      verification_approved: 'text-green-600 bg-green-100',
      verification_rejected: 'text-red-600 bg-red-100',
      verification_info_requested: 'text-orange-600 bg-orange-100',
      user_registered: 'text-purple-600 bg-purple-100',
      payment_received: 'text-green-600 bg-green-100',
      payment_failed: 'text-red-600 bg-red-100',
      system_alert: 'text-red-600 bg-red-100',
      admin_message: 'text-blue-600 bg-blue-100',
      default: 'text-gray-600 bg-gray-100'
    };
    
    const color = baseColors[type as keyof typeof baseColors] || baseColors.default;
    return read ? color.replace('600', '400').replace('100', '50') : color;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead([notification._id]);
    }
    
    // Navigate based on notification type
    if (notification.type.includes('verification') && onNavigate) {
      onNavigate('verifications');
    } else if (notification.type.includes('user') && onNavigate) {
      onNavigate('users');
    } else if (notification.type.includes('payment') && onNavigate) {
      onNavigate('analytics');
    }
  };

  const toggleSelectNotification = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n._id)));
    }
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville flex items-center space-x-2">
            <Bell className="h-6 w-6 sm:h-7 sm:w-7" />
            <span>Notifications</span>
            {getUnreadCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getUnreadCount()}
              </span>
            )}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage platform notifications and alerts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          {getUnreadCount() > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden sm:flex sm:space-x-2">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="verification_submitted">Verifications</option>
            <option value="user_registered">User Activity</option>
            <option value="payment_received">Payments</option>
            <option value="system_alert">System Alerts</option>
            <option value="admin_message">Messages</option>
          </select>
          
          <select 
            value={filterRead} 
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center px-3 py-2 border border-border rounded-md bg-input text-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="sm:hidden grid grid-cols-2 gap-3">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Types</option>
            <option value="verification_submitted">Verifications</option>
            <option value="user_registered">User Activity</option>
            <option value="payment_received">Payments</option>
            <option value="system_alert">System Alerts</option>
            <option value="admin_message">Messages</option>
          </select>
          
          <select 
            value={filterRead} 
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedNotifications.size > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-sm font-medium">
              {selectedNotifications.size} notification(s) selected
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => markAsRead(Array.from(selectedNotifications))}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <Check className="h-3 w-3" />
                <span>Mark Read</span>
              </button>
              <button
                onClick={() => markAsUnread(Array.from(selectedNotifications))}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <BellRing className="h-3 w-3" />
                <span>Mark Unread</span>
              </button>
              <button
                onClick={() => deleteNotifications(Array.from(selectedNotifications))}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-lg sm:text-2xl font-bold text-primary">{totalItems}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-lg sm:text-2xl font-bold text-red-600">{getUnreadCount()}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Unread</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {notifications.filter(n => n.read).length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Read</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-lg sm:text-2xl font-bold text-orange-600">
            {notifications.filter(n => n.type.includes('verification')).length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Verifications</div>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading notifications...</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Select All Header */}
          {notifications.length > 0 && (
            <div className="p-4 border-b border-border bg-muted/30">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.size === notifications.length}
                  onChange={selectAllNotifications}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">
                  {selectedNotifications.size === notifications.length ? 'Deselect All' : 'Select All'}
                </span>
              </label>
            </div>
          )}

          {/* Notifications */}
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isSelected = selectedNotifications.has(notification._id);
              
              return (
                <div 
                  key={notification._id} 
                  className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <label className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectNotification(notification._id)}
                        className="rounded border-border"
                      />
                    </label>
                    
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getNotificationColor(notification.type, notification.read)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm sm:text-base font-medium truncate ${
                              !notification.read ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                            {notification.readAt && (
                              <span className="text-xs text-green-600 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Read {new Date(notification.readAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead([notification._id]);
                              }}
                              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotifications([notification._id]);
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No notifications found</h3>
              <p>
                {filterType === 'all' && filterRead === 'all' && !searchTerm
                  ? 'You have no notifications yet.'
                  : 'No notifications match your current filters.'
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
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}