// app/api/admin/auth/me/route.ts
import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user!.userId) },
      { 
        projection: { 
          passwordHash: 0, 
          otpCode: 0, 
          passwordResetOTP: 0,
          passwordResetToken: 0,
          emailVerificationToken: 0
        } 
      }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify the user is still an admin and active
    if (user.role !== 'admin' || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        }
      }
    });

  } catch (error) {
    console.error('Get admin user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

