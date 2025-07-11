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