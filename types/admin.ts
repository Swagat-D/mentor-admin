// types/admin.ts - Updated with Student Fields and Test Types
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
  isTestGiven?: boolean 
  createdAt: string
  lastLoginAt?: string
  // Student-specific fields
  gender?: string
  ageRange?: string
  studyLevel?: string
  bio?: string
  phone?: string
  location?: string
  goals?: string[]
  stats?: any
  // Mentor-specific fields
  theme?: string
}

export interface PsychometricTestResult {
  _id: string
  userId: string
  sections: {
    interests: {
      realistic: number
      investigative: number
      artistic: number
      social: number
      enterprising: number
      conventional: number
      hollandCode: string
    }
    personality: {
      L1: number
      L2: number
      R1: number
      R2: number
      dominantQuadrants: string[]
      personalityTypes: string[]
    }
    employability: {
      selfManagement: number
      teamWork: number
      enterprising: number
      problemSolving: number
      speakingListening: number
      quotient: number
    }
    characterStrengths: {
      top3Strengths: string[]
      categories: string[]
      values: string[]
    }
  }
  completedAt: string
  isValid: boolean
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

export interface UserDetailedInfo extends UserListItem {
  // Additional profile information
  profile?: any
  stats?: {
    totalSessions?: number
    completedSessions?: number
    totalEarnings?: number // For mentors
    totalSpent?: number // For students
  }
  testStatus?: {
    isTestGiven: boolean
    hasResults: boolean
  }
}

// Notification types
export interface AdminNotification {
  _id: string
  type: string
  title: string
  message: string
  data?: any
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  createdAt: string
  createdBy?: string
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
  verification_notifications: number
  user_notifications: number
  payment_notifications: number
  system_notifications: number
}