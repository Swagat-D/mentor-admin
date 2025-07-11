import { NextRequest, NextResponse } from 'next/server';
import { JWTUtil } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest) => {
    try {
      // Try to get token from cookie or Authorization header
      let token = req.cookies.get('accessToken')?.value;
      
      if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Access token required' },
          { status: 401 }
        );
      }

      // Verify token
      const payload = JWTUtil.verifyAccessToken(token);

      // Add user info to request
      req.user = payload;

      return await handler(req);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}