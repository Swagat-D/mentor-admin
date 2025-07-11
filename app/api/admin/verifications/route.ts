// app/api/admin/verifications/route.ts
import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const mentorVerificationsCollection = db.collection('mentorVerifications');
    const usersCollection = db.collection('users');
    const mentorProfilesCollection = db.collection('mentorProfiles');

    // Build aggregation pipeline
    const pipeline = [
      { $match: { status } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'mentorProfiles',
          localField: 'userId',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      { $unwind: '$user' },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'user.passwordHash': 0,
          'user.otpCode': 0,
          'user.passwordResetOTP': 0
        }
      },
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const [verifications, total] = await Promise.all([
      mentorVerificationsCollection.aggregate(pipeline).toArray(),
      mentorVerificationsCollection.countDocuments({ status })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        verifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get verifications error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});