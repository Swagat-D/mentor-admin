export interface User {
  _id: string
  email: string
  role: 'admin' | 'mentor' | 'student'
  firstName: string
  lastName: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    user: User
    tokens: AuthTokens
    redirectTo?: string
  }
  errors?: string[]
}
