// components/admin/Modals/VerificationDetailsModal.tsx
'use client'
import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  User,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  ExternalLink,
  Calendar,
  Send
} from 'lucide-react';
import { VerificationItem } from '@/types/admin';

interface VerificationDetailsModalProps {
  verification: VerificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (verificationId: string, action: string, data?: any) => Promise<void>;
}

export default function VerificationDetailsModal({
  verification,
  isOpen,
  onClose,
  onAction
}: VerificationDetailsModalProps) {
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_info' | null>(null);
  const [notes, setNotes] = useState('');
  const [requestedInfo, setRequestedInfo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !verification) return null;

  const handleAction = async () => {
    if (!actionType) return;

    setLoading(true);
    try {
      const actionData: any = {};

      if (actionType === 'reject' && notes) {
        actionData.notes = notes;
      }

      if (actionType === 'request_info' && requestedInfo) {
        actionData.requestedInfo = requestedInfo;
      }

      await onAction(verification._id, actionType, actionData);
      onClose();
      setActionType(null);
      setNotes('');
      setRequestedInfo('');
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAction = () => {
    setActionType(null);
    setNotes('');
    setRequestedInfo('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold font-baskervville">Mentor Verification Review</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Information */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Applicant Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <p className="font-medium text-lg">
                    {verification.user.firstName} {verification.user.lastName}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{verification.user.email}</p>
                  </div>
                </div>

                {verification.profile?.location && (
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{verification.profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Application Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      verification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      verification.status === 'approved' ? 'bg-green-100 text-green-800' :
                      verification.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {verification.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Submitted</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {verification.submittedAt
                        ? new Date(verification.submittedAt).toLocaleDateString()
                        : 'Draft'
                      }
                    </p>
                  </div>
                </div>

                {verification.profile?.languages && verification.profile.languages.length > 0 && (
                  <div>
                    <label className="text-sm text-muted-foreground">Languages</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{verification.profile.languages.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          {verification.profile && (
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Display Name</label>
                  <p className="font-medium">{verification.profile.displayName}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Expertise Areas</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {verification.profile.expertise.map((skill, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {verification.profile.bio && (
                  <div>
                    <label className="text-sm text-muted-foreground">Professional Bio</label>
                    <div className="mt-2 p-4 bg-background rounded-md border">
                      <p className="text-sm leading-relaxed">{verification.profile.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {verification.additionalInfo && (
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                {verification.additionalInfo.linkedinProfile && (
                  <div>
                    <label className="text-sm text-muted-foreground">LinkedIn Profile</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <a
                        href={verification.additionalInfo.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {verification.additionalInfo.personalWebsite && (
                  <div>
                    <label className="text-sm text-muted-foreground">Personal Website</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={verification.additionalInfo.personalWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {verification.additionalInfo.additionalNotes && (
                  <div>
                    <label className="text-sm text-muted-foreground">Additional Notes</label>
                    <div className="mt-2 p-4 bg-background rounded-md border">
                      <p className="text-sm">{verification.additionalInfo.additionalNotes}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Background Check Agreement</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {verification.additionalInfo.agreeToBackgroundCheck ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-medium ${
                        verification.additionalInfo.agreeToBackgroundCheck ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verification.additionalInfo.agreeToBackgroundCheck ? 'Agreed' : 'Not Agreed'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Terms & Conditions</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {verification.additionalInfo.agreeToTerms ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-medium ${
                        verification.additionalInfo.agreeToTerms ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verification.additionalInfo.agreeToTerms ? 'Agreed' : 'Not Agreed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Submitted Documents ({verification.documents.length})
            </h3>

            {verification.documents.length > 0 ? (
              <div className="space-y-3">
                {verification.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.replace('_', ' ').toUpperCase()} •
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                      <button className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No documents uploaded</p>
              </div>
            )}
          </div>

          {/* Action Section */}
          {verification.status === 'pending' && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Review Actions</h3>

              {!actionType ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActionType('approve')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Approve Application</span>
                  </button>

                  <button
                    onClick={() => setActionType('reject')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    onClick={() => setActionType('request_info')}
                    className="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Request More Information</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      {actionType === 'approve' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {actionType === 'reject' && <XCircle className="h-4 w-4 text-red-600" />}
                      {actionType === 'request_info' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      <span>
                        {actionType === 'approve' && 'Approve Application'}
                        {actionType === 'reject' && 'Reject Application'}
                        {actionType === 'request_info' && 'Request Additional Information'}
                      </span>
                    </h4>
                  </div>

                  {actionType === 'reject' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rejection Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={4}
                        placeholder="Please provide a clear reason for rejection that will help the applicant understand the decision..."
                        required
                      />
                    </div>
                  )}

                  {actionType === 'request_info' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Information Required <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={requestedInfo}
                        onChange={(e) => setRequestedInfo(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={4}
                        placeholder="Specify what additional information or documentation is needed..."
                        required
                      />
                    </div>
                  )}

                  {actionType === 'approve' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Confirming approval:</strong> This will grant the applicant mentor status,
                        send them a welcome email, and activate their profile on the platform.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAction}
                      disabled={loading || (actionType === 'reject' && !notes.trim()) || (actionType === 'request_info' && !requestedInfo.trim())}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                        actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        actionType === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>
                            {actionType === 'approve' && 'Confirm Approval'}
                            {actionType === 'reject' && 'Confirm Rejection'}
                            {actionType === 'request_info' && 'Send Request'}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetAction}
                      disabled={loading}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {verification.status !== 'pending' && (
            <div className="border-t border-border pt-6">
              <div className={`p-4 rounded-lg ${
                verification.status === 'approved' ? 'bg-green-50 border border-green-200' :
                verification.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {verification.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {verification.status === 'rejected' && <XCircle className="h-5 w-5 text-red-600" />}
                  {verification.status === 'info_requested' && <AlertTriangle className="h-5 w-5 text-blue-600" />}
                  <span className={`font-medium ${
                    verification.status === 'approved' ? 'text-green-800' :
                    verification.status === 'rejected' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    Application {verification.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
