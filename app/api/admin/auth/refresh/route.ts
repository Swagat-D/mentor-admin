import { NextRequest, NextResponse } from 'next/server';
import { JWTUtil } from '@/lib/auth/jwt';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('adminRefreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Admin refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = JWTUtil.verifyRefreshToken(refreshToken);
    
    // Verify user is still admin and active
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(payload.userId),
      role: 'admin',
      isActive: true,
      isVerified: true
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Admin user not found or inactive' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = JWTUtil.generateTokens({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Admin token refreshed successfully',
      data: { 
        tokens,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      }
    });

    // Update admin cookies
    response.cookies.set('adminAccessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('adminRefreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Admin token refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}

