export interface AdminUser {
  id: string
  email: string
  role: 'admin'
  firstName: string
  lastName: string
}

export interface DashboardStats {
  totalUsers: number
  totalMentors: number
  totalStudents: number
  activeSessions: number
  pendingVerifications: number
  totalRevenue: number
  monthlyGrowth: number
  completionRate: number
  completedSessions: number
}

export interface UserListItem {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: 'mentor' | 'student'
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface VerificationItem {
  _id: string
  userId: string
  status: 'pending' | 'approved' | 'rejected' | 'info_requested'
  user: {
    firstName: string
    lastName: string
    email: string
  }
  profile?: {
    displayName: string
    expertise: string[]
    location: string
    bio?: string
    languages?: string[]
  }
  documents: Array<{
    id: string
    type: string
    fileName: string
    fileUrl: string
    status: string
    uploadedAt: string
  }>
  additionalInfo?: {
    linkedinProfile?: string
    personalWebsite?: string
    additionalNotes?: string
    agreeToBackgroundCheck: boolean
    agreeToTerms: boolean
  }
  videoIntroduction?: {
    name: string
    size: number
    type: string
    url: string
  }
  createdAt: string
  submittedAt?: string
}

export interface SessionItem {
  _id: string
  mentorId: string
  studentId: string
  subject: string
  scheduledAt: string
  duration: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  type: 'video' | 'audio' | 'chat'
  notes?: string
  mentor: {
    firstName: string
    lastName: string
    email: string
  }
  student: {
    firstName: string
    lastName: string
    email: string
  }
  payment: {
    amount: number
    currency: string
    status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  }
  createdAt: string
  updatedAt: string
}

