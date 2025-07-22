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
  Database,
  User
} from 'lucide-react';

interface UserListItem {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'mentor' | 'student';
  isActive: boolean;
  isVerified: boolean;
  isTestGiven?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  // Student-specific fields
  gender?: string;
  ageRange?: string;
  studyLevel?: string;
  bio?: string;
  phone?: string;
  location?: string;
  goals?: string[];
  stats?: any;
}

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
  const [showFilters, setShowFilters] = useState(false);
  
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

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `users_export.${format}`;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">User Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage user accounts, permissions, and activity
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden sm:flex sm:space-x-2">
          <select 
            value={filterRole} 
            onChange={(e) => onFilterRoleChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[120px]"
          >
            <option value="all">All Roles</option>
            <option value="mentor">Mentors</option>
            <option value="student">Students</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            value={filterRole} 
            onChange={(e) => onFilterRoleChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Roles</option>
            <option value="mentor">Mentors</option>
            <option value="student">Students</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-xl sm:text-2xl font-bold text-primary">{totalItems}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'mentor').length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Mentors</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'student').length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Students</div>
        </div>
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'student' && u.isTestGiven).length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Tests Completed</div>
        </div>
      </div>
      
      {/* Users Display */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading users...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Verified</th>
                    <th className="text-left p-4 font-medium">Test Status</th>
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
                              {user.firstName?.[0] ?? ''}{user.lastName?.[0] ?? ''}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.role === 'student' && (
                              <div className="flex items-center space-x-2 mt-1">
                                {user.gender && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {user.gender}
                                  </span>
                                )}
                                {user.ageRange && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {user.ageRange}
                                  </span>
                                )}
                                {user.studyLevel && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    {user.studyLevel}
                                  </span>
                                )}
                              </div>
                            )}
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
                        {user.role === 'student' ? (
                          <div className="flex items-center space-x-2">
                            {user.isTestGiven ? (
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                Not Taken
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
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
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden divide-y divide-border">
              {users.map((user) => (
                <div key={user._id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.role === 'student' && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {user.gender && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {user.gender}
                              </span>
                            )}
                            {user.ageRange && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {user.ageRange}
                              </span>
                            )}
                            {user.studyLevel && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                {user.studyLevel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
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
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Role</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'mentor' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Status</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Verified</span>
                      <div className="mt-1 flex items-center">
                        {user.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">
                        {user.role === 'student' ? 'Test Status' : 'Joined'}
                      </span>
                      <div className="mt-1 text-xs">
                        {user.role === 'student' ? (
                          user.isTestGiven ? (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Not Taken
                            </span>
                          )
                        ) : (
                          new Date(user.createdAt).toLocaleDateString()
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {user.role === 'student' && user.bio && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs text-muted-foreground">Bio:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{user.bio}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {users.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p>No users found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 20, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Export Users</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-muted-foreground text-sm">
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
                  className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">CSV Format</div>
                    <div className="text-sm text-muted-foreground">Comma-separated values, good for Excel</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExportUsers('excel')}
                  disabled={exporting}
                  className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Database className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Excel Format</div>
                    <div className="text-sm text-muted-foreground">Spreadsheet format (.xls)</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExportUsers('json')}
                  disabled={exporting}
                  className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">JSON Format</div>
                    <div className="text-sm text-muted-foreground">Machine-readable format</div>
                  </div>
                </button>
              </div>
              
              {exporting && (
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
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