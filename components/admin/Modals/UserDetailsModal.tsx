'use client'
import { useState, useEffect } from 'react'
import { X, User, Mail, Calendar, CheckCircle, XCircle, ClipboardCheck, Bell, Download } from 'lucide-react'
import { AdminApi, PsychometricTestResult } from '@/lib/admin/adminApi'
import TestResultsView from '../Dashboard/TestResultView'

interface UserDetailsModalProps {
  userId: string | null
  isOpen: boolean
  onClose: () => void
}

interface UserDetails {
  user: any
  profile?: any
  stats?: any
  testStatus?: {
    isTestGiven: boolean
    hasResults: boolean
  }
}

export default function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [showTestResults, setShowTestResults] = useState(false)
  const [testResult, setTestResult] = useState<PsychometricTestResult | null>(null)
  const [loadingTestResult, setLoadingTestResult] = useState(false)
  const [sendingReminder, setSendingReminder] = useState(false)

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

  const handleViewTestResults = async () => {
  if (!userDetails?.user?.isTestGiven || !userId) return
  
  setLoadingTestResult(true)
  setShowTestResults(true)
  
  try {
    console.log('Fetching test results for user:', userId) // Debug log
    
    const response = await fetch(`/api/admin/users/${userId}/test-results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for admin auth
    })
    
    console.log('Response status:', response.status) // Debug log
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData)
      throw new Error(errorData.message || 'Failed to fetch test results')
    }
    
    const data = await response.json()
    console.log('Test results data:', data) // Debug log
    
    if (data.success && data.data) {
      setTestResult(data.data)
    } else {
      throw new Error(data.message || 'No test results found')
    }
  } catch (error) {
    console.error('Failed to load test results:', error)
    alert(`Failed to load test results: ${typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)}`)
    setShowTestResults(false)
  } finally {
    setLoadingTestResult(false)
  }
}

  const sendTestReminder = async () => {
    if (!userId) return
    
    setSendingReminder(true)
    try {
      const response = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          message: "Please complete your psychometric test to help us better understand your career preferences and provide personalized mentorship recommendations."
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Test reminder sent successfully!')
      } else {
        alert('Failed to send reminder: ' + data.message)
      }
    } catch (error) {
      console.error('Failed to send reminder:', error)
      alert('Failed to send reminder. Please try again.')
    } finally {
      setSendingReminder(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold font-baskervville gradient-text">User Details</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
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
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <h3 className="font-semibold mb-4 flex items-center text-foreground">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">Name:</span>
                      <p className="font-semibold text-foreground mt-1">{userDetails.user.firstName} {userDetails.user.lastName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Email:</span>
                      <p className="font-semibold text-foreground mt-1 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {userDetails.user.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Role:</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          userDetails.user.role === 'mentor' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {userDetails.user.role}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          userDetails.user.isActive 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {userDetails.user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Verified:</span>
                      <div className="flex items-center mt-1">
                        {userDetails.user.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className="text-foreground font-medium">{userDetails.user.isVerified ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">Joined:</span>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {new Date(userDetails.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Student-specific fields */}
                    {userDetails.user.role === 'student' && (
                      <>
                        {userDetails.user.gender && (
                          <div>
                            <span className="text-muted-foreground font-medium">Gender:</span>
                            <p className="font-semibold text-foreground mt-1">{userDetails.user.gender}</p>
                          </div>
                        )}
                        {userDetails.user.ageRange && (
                          <div>
                            <span className="text-muted-foreground font-medium">Age Range:</span>
                            <p className="font-semibold text-foreground mt-1">{userDetails.user.ageRange}</p>
                          </div>
                        )}
                        {userDetails.user.studyLevel && (
                          <div>
                            <span className="text-muted-foreground font-medium">Study Level:</span>
                            <p className="font-semibold text-foreground mt-1">{userDetails.user.studyLevel}</p>
                          </div>
                        )}
                        {userDetails.user.location && (
                          <div>
                            <span className="text-muted-foreground font-medium">Location:</span>
                            <p className="font-semibold text-foreground mt-1">{userDetails.user.location}</p>
                          </div>
                        )}
                        {userDetails.user.phone && (
                          <div>
                            <span className="text-muted-foreground font-medium">Phone:</span>
                            <p className="font-semibold text-foreground mt-1">{userDetails.user.phone}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Bio for students */}
                  {userDetails.user.role === 'student' && userDetails.user.bio && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-muted-foreground font-medium">Bio:</span>
                      <p className="text-foreground mt-2 text-sm leading-relaxed bg-background p-3 rounded border">{userDetails.user.bio}</p>
                    </div>
                  )}

                  {/* Goals for students */}
                  {userDetails.user.role === 'student' && userDetails.user.goals && userDetails.user.goals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-muted-foreground font-medium">Goals:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userDetails.user.goals.map((goal: string, index: number) => (
                          <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Status for Students */}
                {userDetails.user.role === 'student' && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold mb-4 flex items-center text-foreground">
                      <ClipboardCheck className="h-4 w-4 mr-2 text-primary" />
                      Psychometric Test Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Test Completion:</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          userDetails.user.isTestGiven 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {userDetails.user.isTestGiven ? 'Completed' : 'Not Taken'}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        {userDetails.user.isTestGiven ? (
                          <button
                            onClick={handleViewTestResults}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                          >
                            <ClipboardCheck className="h-4 w-4" />
                            <span>View Test Results</span>
                          </button>
                        ) : (
                          <button
                            onClick={sendTestReminder}
                            disabled={sendingReminder}
                            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {sendingReminder ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Bell className="h-4 w-4" />
                                <span>Send Test Reminder</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {userDetails.stats && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold mb-4 text-foreground">Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-background rounded border">
                        <div className="text-lg font-bold text-primary">{userDetails.stats.totalSessions}</div>
                        <div className="text-muted-foreground text-xs">Total Sessions</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded border">
                        <div className="text-lg font-bold text-green-600">{userDetails.stats.completedSessions}</div>
                        <div className="text-muted-foreground text-xs">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded border">
                        <div className="text-lg font-bold text-amber-600">
                          ${((userDetails.stats.totalEarnings || userDetails.stats.totalSpent || 0) / 100).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {userDetails.user.role === 'mentor' ? 'Total Earnings' : 'Total Spent'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile (for mentors) */}
                {userDetails.profile && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold mb-4 text-foreground">Mentor Profile</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground font-medium">Display Name:</span>
                        <p className="font-semibold text-foreground mt-1">{userDetails.profile.displayName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Location:</span>
                        <p className="font-semibold text-foreground mt-1">{userDetails.profile.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium">Expertise:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {userDetails.profile.expertise?.map((skill: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium border border-primary/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {userDetails.profile.bio && (
                        <div>
                          <span className="text-muted-foreground font-medium">Bio:</span>
                          <p className="mt-2 text-xs leading-relaxed bg-background p-3 rounded border">{userDetails.profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
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
                    className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors bg-background text-foreground">
                    Send Message
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
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold gradient-text">Send Message</h3>
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
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Send message to: {userDetails?.user.firstName} {userDetails?.user.lastName}
                </label>
                <p className="text-sm text-muted-foreground mb-3 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {userDetails?.user.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring resize-none text-foreground"
                  rows={4}
                  placeholder="Type your message here..."
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {messageContent.length}/500 characters
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md border border-border">
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
                  className="border border-border px-4 py-2 rounded text-sm hover:bg-muted transition-colors disabled:opacity-50 bg-background text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results Modal */}
      {showTestResults && (
        <TestResultsView
          testResult={testResult}
          userName={`${userDetails?.user.firstName} ${userDetails?.user.lastName}`}
          userEmail={userDetails?.user.email}
          loading={loadingTestResult}
          onClose={() => {
            setShowTestResults(false)
            setTestResult(null)
          }}
        />
      )}
    </>
  )
}