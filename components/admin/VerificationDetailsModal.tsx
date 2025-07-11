'use client'
import { useState } from 'react'
import { X, FileText, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react'

interface VerificationDetailsModalProps {
  verification: any
  isOpen: boolean
  onClose: () => void
  onAction: (verificationId: string, action: string, data?: any) => void
}

export default function VerificationDetailsModal({ 
  verification, 
  isOpen, 
  onClose, 
  onAction 
}: VerificationDetailsModalProps) {
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_info' | null>(null)
  const [notes, setNotes] = useState('')
  const [requestedInfo, setRequestedInfo] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !verification) return null

  const handleAction = async () => {
    if (!actionType) return
    
    setLoading(true)
    try {
      await onAction(verification._id, actionType, {
        notes: actionType === 'reject' ? notes : undefined,
        requestedInfo: actionType === 'request_info' ? requestedInfo : undefined
      })
      onClose()
      setActionType(null)
      setNotes('')
      setRequestedInfo('')
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-baskervville">Mentor Verification Review</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Applicant Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{verification.user.firstName} {verification.user.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{verification.user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Applied:</span>
                <p className="font-medium">{new Date(verification.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  verification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  verification.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {verification.status}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          {verification.profile && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Profile Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Display Name:</span>
                  <p className="font-medium">{verification.profile.displayName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{verification.profile.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expertise:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {verification.profile.expertise?.map((skill: string, index: number) => (
                      <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Languages:</span>
                  <p className="font-medium">{verification.profile.languages?.join(', ')}</p>
                </div>
                {verification.profile.bio && (
                  <div>
                    <span className="text-muted-foreground">Bio:</span>
                    <p className="mt-1">{verification.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Submitted Documents
            </h3>
            <div className="space-y-2">
              {verification.documents?.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card rounded border">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">{doc.type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          {verification.additionalInfo && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Additional Information</h3>
              <div className="space-y-2 text-sm">
                {verification.additionalInfo.linkedinProfile && (
                  <div>
                    <span className="text-muted-foreground">LinkedIn:</span>
                    <a href={verification.additionalInfo.linkedinProfile} className="text-primary ml-2 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {verification.additionalInfo.personalWebsite && (
                  <div>
                    <span className="text-muted-foreground">Website:</span>
                    <a href={verification.additionalInfo.personalWebsite} className="text-primary ml-2 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {verification.additionalInfo.additionalNotes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1">{verification.additionalInfo.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Section */}
          {verification.status === 'pending' && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Review Action</h3>
              
              {!actionType ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActionType('approve')}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => setActionType('reject')}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => setActionType('request_info')}
                    className="border border-border px-6 py-2 rounded hover:bg-muted transition-colors flex items-center"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Request More Info
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {actionType === 'reject' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        placeholder="Please provide a reason for rejection..."
                        required
                      />
                    </div>
                  )}

                  {actionType === 'request_info' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Requested Information</label>
                      <textarea
                        value={requestedInfo}
                        onChange={(e) => setRequestedInfo(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        placeholder="Specify what additional information is needed..."
                        required
                      />
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAction}
                      disabled={loading || (actionType === 'reject' && !notes) || (actionType === 'request_info' && !requestedInfo)}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : `Confirm ${actionType.replace('_', ' ')}`}
                    </button>
                    <button
                      onClick={() => {
                        setActionType(null)
                        setNotes('')
                        setRequestedInfo('')
                      }}
                      className="border border-border px-6 py-2 rounded hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

