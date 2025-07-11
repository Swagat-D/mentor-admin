// components/admin/Dashboard/VerificationsManagement.tsx
import React, { useEffect } from 'react';
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
  Globe
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
  
  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

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
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'info_requested':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-baskervville">Mentor Verifications</h2>
          <p className="text-muted-foreground">
            Review and approve mentor applications
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={filterStatus} 
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="info_requested">Info Requested</option>
          </select>
          <div className="text-sm text-muted-foreground">
            {totalItems} applications
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {verifications.filter(v => v.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {verifications.filter(v => v.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {verifications.filter(v => v.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {verifications.filter(v => v.status === 'info_requested').length}
              </div>
              <div className="text-sm text-muted-foreground">Info Requested</div>
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
        <div className="space-y-4">
          {verifications.map((verification) => (
            <div key={verification._id} className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-baskervville">
                      {verification.user.firstName} {verification.user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{verification.user.email}</p>
                    
                    {verification.profile && (
                      <div className="mt-2 space-y-2">
                        {verification.profile.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {verification.profile.location}
                          </div>
                        )}
                        
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
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Globe className="h-3 w-3 mr-1" />
                            {verification.profile.languages.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                    {getStatusIcon(verification.status)}
                    <span>{verification.status.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Documents:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{verification.documents.length} uploaded</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Submitted:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {verification.submittedAt 
                        ? new Date(verification.submittedAt).toLocaleDateString()
                        : 'Draft'
                      }
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {verification.submittedAt && 
                       (Date.now() - new Date(verification.submittedAt).getTime()) > 48 * 60 * 60 * 1000
                        ? 'High' 
                        : 'Normal'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Preview */}
              {verification.profile?.bio && (
                <div className="mb-4 p-3 bg-muted/50 rounded-md">
                  <span className="text-sm text-muted-foreground block mb-1">Bio:</span>
                  <p className="text-sm line-clamp-2">{verification.profile.bio}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => onViewVerification(verification)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  Review Application
                </button>
                
                {verification.status === 'pending' && (
                  <>
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
                  </>
                )}
                
                {verification.status === 'info_requested' && (
                  <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm">
                    Waiting for additional information from applicant
                  </div>
                )}
                
                {verification.status === 'approved' && (
                  <div className="bg-green-50 text-green-800 px-3 py-2 rounded text-sm flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Application approved</span>
                  </div>
                )}
                
                {verification.status === 'rejected' && (
                  <div className="bg-red-50 text-red-800 px-3 py-2 rounded text-sm flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>Application rejected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {verifications.length === 0 && !loading && (
            <div className="bg-card rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No verifications found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'pending' 
                  ? 'No pending verifications at the moment.'
                  : `No ${filterStatus} verifications found.`
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