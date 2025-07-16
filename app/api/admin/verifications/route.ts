// app/api/admin/verifications/route.ts - Fixed with All Applications Support
import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const mentorVerificationsCollection = db.collection('mentorVerifications');

    // Build match condition based on status
    let matchCondition: any = {};
    
    if (status !== 'all') {
      matchCondition.status = status;
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchCondition },
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
          'user.passwordResetOTP': 0,
          'user.adminOTP': 0,
          'user.adminOTPExpires': 0
        }
      },
      { $sort: { createdAt: -1 } }, // Sort by creation date, newest first
      { $skip: skip },
      { $limit: limit }
    ];

    // Count pipeline for pagination
    const countPipeline = [
      { $match: matchCondition },
      { $count: "total" }
    ];

    const [verifications, countResult] = await Promise.all([
      mentorVerificationsCollection.aggregate(pipeline).toArray(),
      mentorVerificationsCollection.aggregate(countPipeline).toArray()
    ]);

    const total = countResult[0]?.total || 0;

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