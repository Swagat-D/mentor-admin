// app/admin/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/app/page' // Import the main dashboard component

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me')
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <AdminDashboard />
}

// lib/utils/bcrypt.ts
import bcrypt from 'bcryptjs'

export class BcryptUtil {
  static async hash(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
    return bcrypt.hash(password, saltRounds)
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

// lib/auth/jwt.ts
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export class JWTUtil {
  private static getSecrets() {
    const accessSecret = process.env.JWT_ACCESS_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets not configured')
    }

    return { accessSecret, refreshSecret }
  }

  static generateTokens(payload: TokenPayload) {
    const { accessSecret, refreshSecret } = this.getSecrets()

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  static verifyAccessToken(token: string): TokenPayload {
    const { accessSecret } = this.getSecrets()
    return jwt.verify(token, accessSecret) as TokenPayload
  }

  static verifyRefreshToken(token: string): TokenPayload {
    const { refreshSecret } = this.getSecrets()
    return jwt.verify(token, refreshSecret) as TokenPayload
  }
}