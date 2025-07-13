// components/admin/Dashboard/VerificationsManagement.tsx - Fixed with All Applications Default
import React, { useEffect, useState } from 'react';
import { 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MapPin,
  Calendar,
  Star,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Pagination from '../Common/Pagination';
import { VerificationItem } from '@/types/admin';

interface VerificationsManagementProps {
  verifications: VerificationItem[];
  loading: boolean;
  filterStatus: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onFilterStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onViewVerification: (verification: VerificationItem) => void;
  onQuickAction: (verificationId: string, action: string, data?: any) => Promise<void>;
  loadVerifications: () => Promise<void>;
}

export default function VerificationsManagement({
  verifications,
  loading,
  filterStatus,
  currentPage,
  totalPages,
  totalItems,
  onFilterStatusChange,
  onPageChange,
  onViewVerification,
  onQuickAction,
  loadVerifications
}: VerificationsManagementProps) {
  
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [allVerifications, setAllVerifications] = useState<VerificationItem[]>([]);

  // Set default filter to 'all' if not set
  useEffect(() => {
    if (!filterStatus || filterStatus === '') {
      onFilterStatusChange('all');
    }
  }, []);

  useEffect(() => {
    loadVerifications();
  }, [filterStatus, currentPage]);

  // Store all verifications for counting
  useEffect(() => {
    if (filterStatus === 'all') {
      setAllVerifications(verifications);
    }
  }, [verifications, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'info_requested':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'approved':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'info_requested':
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const toggleCardExpansion = (verificationId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(verificationId)) {
      newExpanded.delete(verificationId);
    } else {
      newExpanded.add(verificationId);
    }
    setExpandedCards(newExpanded);
  };

  // Calculate status counts from current data based on filter
  const getStatusCounts = () => {
    if (filterStatus === 'all') {
      // When showing all, count from the current verifications
      return {
        total: verifications.length,
        pending: verifications.filter(v => v.status === 'pending').length,
        approved: verifications.filter(v => v.status === 'approved').length,
        rejected: verifications.filter(v => v.status === 'rejected').length,
        info_requested: verifications.filter(v => v.status === 'info_requested').length
      };
    } else {
      // When filtered, show the count for that specific status
      return {
        total: totalItems,
        pending: filterStatus === 'pending' ? totalItems : 0,
        approved: filterStatus === 'approved' ? totalItems : 0,
        rejected: filterStatus === 'rejected' ? totalItems : 0,
        info_requested: filterStatus === 'info_requested' ? totalItems : 0
      };
    }
  };

  const statusCounts = getStatusCounts();

  // Filter verifications based on current filter
  const getFilteredVerifications = () => {
    if (filterStatus === 'all') {
      return verifications;
    }
    return verifications.filter(v => v.status === filterStatus);
  };

  const filteredVerifications = getFilteredVerifications();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">Mentor Verifications</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Review and approve mentor applications
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {filterStatus === 'all' ? `${statusCounts.total} total applications` : `${totalItems} ${filterStatus.replace('_', ' ')} applications`}
          </div>
        </div>
      </div>

      {/* Filter Dropdown - Always visible, no toggle button */}
      <div className="w-full">
        <select 
          value={filterStatus} 
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm min-w-[160px]"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="info_requested">Info Requested</option>
        </select>
      </div>

      {/* Status Summary - Enhanced responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-gray-600">
                {statusCounts.total}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                {statusCounts.pending}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {statusCounts.approved}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {statusCounts.rejected}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-3 sm:p-4 rounded-lg border border-border col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {statusCounts.info_requested}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Info Requested</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      {loading ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading verifications...</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredVerifications.map((verification) => {
            const isExpanded = expandedCards.has(verification._id);
            
            return (
              <div key={verification._id} className="bg-card rounded-lg border border-border hover:shadow-md transition-all duration-200">
                {/* Main Card Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold font-baskervville truncate">
                          {verification.user.firstName} {verification.user.lastName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {verification.user.email}
                        </p>
                        
                        {/* Mobile: Show basic info */}
                        <div className="mt-2 space-y-1">
                          {verification.profile?.location && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{verification.profile.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>
                              {verification.submittedAt 
                                ? new Date(verification.submittedAt).toLocaleDateString()
                                : 'Draft'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-2">
                      <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                        {getStatusIcon(verification.status)}
                        <span className="hidden sm:inline">{verification.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                      
                      {/* Mobile expand/collapse button */}
                      <button
                        onClick={() => toggleCardExpansion(verification._id)}
                        className="sm:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Desktop: Always visible info */}
                  {verification.profile && (
                    <div className="hidden sm:block mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        {verification.profile.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{verification.profile.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>
                            {verification.submittedAt 
                              ? new Date(verification.submittedAt).toLocaleDateString()
                              : 'Draft'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{verification.documents.length} documents</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {verification.profile.expertise.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {verification.profile.expertise.length > 6 && (
                          <span className="bg-muted px-2 py-1 rounded text-xs">
                            +{verification.profile.expertise.length - 6} more
                          </span>
                        )}
                      </div>
                      
                      {verification.profile.languages && verification.profile.languages.length > 0 && (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{verification.profile.languages.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mobile: Expandable content */}
                  {isExpanded && verification.profile && (
                    <div className="sm:hidden mt-3 pt-3 border-t border-border">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {verification.profile.expertise.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {verification.profile.expertise.length > 4 && (
                            <span className="bg-muted px-2 py-1 rounded text-xs">
                              +{verification.profile.expertise.length - 4} more
                            </span>
                          )}
                        </div>
                        
                        {verification.profile.languages && verification.profile.languages.length > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{verification.profile.languages.join(', ')}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{verification.documents.length} documents uploaded</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bio Preview - Desktop always show, mobile show when expanded */}
                  {verification.profile?.bio && (
                    <div className={`mb-4 p-3 bg-muted/50 rounded-md ${
                      typeof window !== 'undefined' && window.innerWidth >= 640 ? 'block' : (isExpanded ? 'block' : 'hidden')
                    }`}>
                      <span className="text-xs sm:text-sm text-muted-foreground block mb-1">Bio:</span>
                      <p className="text-xs sm:text-sm line-clamp-2">{verification.profile.bio}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                    <button
                      onClick={() => onViewVerification(verification)}
                      className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-primary/90 transition-colors flex-1 sm:flex-none"
                    >
                      Review Application
                    </button>
                    
                    {/* Show action buttons based on status */}
                    {verification.status === 'pending' && (
                      <>
                        {/* Desktop: Show all buttons */}
                        <div className="hidden sm:flex sm:space-x-3">
                          <button
                            onClick={() => onQuickAction(verification._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Quick Approve</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'reject', { 
                              notes: 'Application needs further review' 
                            })}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Quick Reject</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'request_info', {
                              requestedInfo: 'Please provide additional documentation'
                            })}
                            className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center space-x-1"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span>Request Info</span>
                          </button>
                        </div>

                        {/* Mobile: Compact buttons */}
                        <div className="sm:hidden flex space-x-2 w-full">
                          <button
                            onClick={() => onQuickAction(verification._id, 'approve')}
                            className="bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 flex-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'reject', { 
                              notes: 'Application needs further review' 
                            })}
                            className="bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 flex-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'request_info', {
                              requestedInfo: 'Please provide additional documentation'
                            })}
                            className="border border-border px-3 py-2 rounded text-xs hover:bg-muted transition-colors flex items-center justify-center space-x-1 flex-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>Info</span>
                          </button>
                        </div>
                      </>
                    )}

                    {verification.status === 'info_requested' && (
                      <>
                        {/* Desktop: Show approve/reject buttons for info requested */}
                        <div className="hidden sm:flex sm:space-x-3">
                          <button
                            onClick={() => onQuickAction(verification._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve Now</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'reject', { 
                              notes: 'Application rejected after info request' 
                            })}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          
                          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded text-sm flex items-center space-x-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Waiting for info</span>
                          </div>
                        </div>

                        {/* Mobile: Compact buttons for info requested */}
                        <div className="sm:hidden flex space-x-2 w-full">
                          <button
                            onClick={() => onQuickAction(verification._id, 'approve')}
                            className="bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 flex-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => onQuickAction(verification._id, 'reject', { 
                              notes: 'Application rejected after info request' 
                            })}
                            className="bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 flex-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </>
                    )}
                    
                    {verification.status === 'approved' && (
                      <div className="bg-green-50 text-green-800 px-3 py-2 rounded text-xs sm:text-sm flex items-center justify-center space-x-1 flex-1 sm:flex-none">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Application approved</span>
                      </div>
                    )}
                    
                    {verification.status === 'rejected' && (
                      <div className="bg-red-50 text-red-800 px-3 py-2 rounded text-xs sm:text-sm flex items-center justify-center space-x-1 flex-1 sm:flex-none">
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Application rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredVerifications.length === 0 && !loading && (
            <div className="bg-card rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No verifications found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all' 
                  ? 'No applications found.'
                  : filterStatus === 'pending' 
                  ? 'No pending verifications at the moment.'
                  : `No ${filterStatus.replace('_', ' ')} verifications found.`
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