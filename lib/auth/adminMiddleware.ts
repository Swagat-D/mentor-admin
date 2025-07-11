import { NextRequest, NextResponse } from 'next/server';
import { JWTUtil } from './jwt';

export interface AdminAuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function withAdminAuth(
  handler: (req: AdminAuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: AdminAuthenticatedRequest) => {
    try {
      // Try to get token from cookie or Authorization header
      let token = req.cookies.get('adminAccessToken')?.value;
      
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
      
      // Check if user is admin
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        );
      }

      // Add user info to request
      req.user = payload;

      return await handler(req);

    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}

