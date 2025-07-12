import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Eye, 
  Ban, 
  Check, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Calendar,
  Filter,
  Download,
  X,
  FileText,
  Database
} from 'lucide-react';
import Pagination from '../Common/Pagination';
import { UserListItem } from '@/types/admin';

interface UsersManagementProps {
  users: UserListItem[];
  loading: boolean;
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onSearchChange: (term: string) => void;
  onFilterRoleChange: (role: string) => void;
  onFilterStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onUserAction: (userId: string, action: string) => Promise<void>;
  onViewUser: (userId: string) => void;
  loadUsers: () => Promise<void>;
}

export default function UsersManagement({
  users,
  loading,
  searchTerm,
  filterRole,
  filterStatus,
  currentPage,
  totalPages,
  totalItems,
  onSearchChange,
  onFilterRoleChange,
  onFilterStatusChange,
  onPageChange,
  onUserAction,
  onViewUser,
  loadUsers
}: UsersManagementProps) {
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExportUsers = async (format: 'csv' | 'json' | 'excel') => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/users/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `users_export.${format}`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-baskervville">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and activity
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterRole} 
            onChange={(e) => onFilterRoleChange(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="mentor">Mentors</option>
            <option value="student">Students</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary">{totalItems}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'mentor').length}
          </div>
          <div className="text-sm text-muted-foreground">Mentors</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'student').length}
          </div>
          <div className="text-sm text-muted-foreground">Students</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-yellow-600">
            {users.filter(u => !u.isActive).length}
          </div>
          <div className="text-sm text-muted-foreground">Inactive</div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Verified</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-left p-4 font-medium">Last Login</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === 'mentor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {user.isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.lastLoginAt ? (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(user.lastLoginAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => onViewUser(user._id)}
                          className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onUserAction(user._id, user.isActive ? 'deactivate' : 'activate')}
                          className={`p-2 rounded transition-colors ${
                            user.isActive 
                              ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Export Users</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Choose the format for exporting {totalItems} users
                {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                  ? ' (filtered results)' 
                  : ''
                }.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleExportUsers('csv')}
                  disabled={exporting}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">CSV Format</div>
                    <div className="text-sm text-gray-500">Comma-separated values, good for Excel</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExportUsers('excel')}
                  disabled={exporting}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Database className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Excel Format</div>
                    <div className="text-sm text-gray-500">Spreadsheet format (.xls)</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExportUsers('json')}
                  disabled={exporting}
                  className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">JSON Format</div>
                    <div className="text-sm text-gray-500">Machine-readable format</div>
                  </div>
                </button>
              </div>
              
              {exporting && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>Preparing export...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}