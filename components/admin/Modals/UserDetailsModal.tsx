'use client'
import { useState, useEffect } from 'react'
import { X, User, Mail, Calendar, CheckCircle, XCircle, Settings } from 'lucide-react'

interface UserDetailsModalProps {
  userId: string | null
  isOpen: boolean
  onClose: () => void
}

interface UserDetails {
  user: any
  profile?: any
  stats?: any
}

export default function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const sendMessage = async () => {
    if (!messageContent.trim() || !userId) return
    
    setSendingMessage(true)
    try {
      const response = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          message: messageContent.trim()
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMessageContent('')
        setShowMessageModal(false)
        alert('Message sent successfully!')
      } else {
        alert('Failed to send message: ' + data.message)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserDetails()
    }
  }, [userId, isOpen])

  const fetchUserDetails = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()
      if (data.success) {
        setUserDetails(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (isActive: boolean) => {
    if (!userId) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      const data = await response.json()
      if (data.success) {
        setUserDetails(prev => prev ? {
          ...prev,
          user: { ...prev.user, isActive }
        } : null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-baskervville">User Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading user details...</p>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{userDetails.user.firstName} {userDetails.user.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{userDetails.user.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      userDetails.user.role === 'mentor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {userDetails.user.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      userDetails.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userDetails.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verified:</span>
                    <div className="flex items-center">
                      {userDetails.user.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="ml-1">{userDetails.user.isVerified ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <p className="font-medium">
                      {new Date(userDetails.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {userDetails.stats && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Sessions:</span>
                      <p className="font-medium">{userDetails.stats.totalSessions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <p className="font-medium">{userDetails.stats.completedSessions}</p>
                    </div>
                    {userDetails.user.role === 'mentor' ? (
                      <div>
                        <span className="text-muted-foreground">Total Earnings:</span>
                        <p className="font-medium">${(userDetails.stats.totalEarnings / 100).toLocaleString()}</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-muted-foreground">Total Spent:</span>
                        <p className="font-medium">${(userDetails.stats.totalSpent / 100).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Profile (for mentors) */}
              {userDetails.profile && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Mentor Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Display Name:</span>
                      <p className="font-medium">{userDetails.profile.displayName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{userDetails.profile.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expertise:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userDetails.profile.expertise?.map((skill: string, index: number) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {userDetails.profile.bio && (
                      <div>
                        <span className="text-muted-foreground">Bio:</span>
                        <p className="mt-1 text-xs">{userDetails.profile.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-border">
                <button
                  onClick={() => updateUserStatus(!userDetails.user.isActive)}
                  disabled={updating}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                    userDetails.user.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {updating ? 'Updating...' : (userDetails.user.isActive ? 'Deactivate' : 'Activate')}
                </button>
                <button 
                  onClick={() => setShowMessageModal(true)}
                  className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors">
                  Send Message
                </button>
                <button className="text-primary hover:text-primary/80 text-sm">
                  View Full Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load user details</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Send Message</h3>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setMessageContent('')
                }}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Send message to: {userDetails?.user.firstName} {userDetails?.user.lastName}
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Email: {userDetails?.user.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={4}
                  placeholder="Type your message here..."
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {messageContent.length}/500 characters
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">
                  This message will be sent via email and added to the user's notifications.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={sendMessage}
                  disabled={sendingMessage || !messageContent.trim()}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 flex-1"
                >
                  {sendingMessage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowMessageModal(false)
                    setMessageContent('')
                  }}
                  disabled={sendingMessage}
                  className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}