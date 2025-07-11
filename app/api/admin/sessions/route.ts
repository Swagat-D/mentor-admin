// app/api/admin/sessions/route.ts
import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const sessionsCollection = db.collection('sessions');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'mentorId',
          foreignField: '_id',
          as: 'mentor'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$mentor' },
      { $unwind: '$student' },
      {
        $project: {
          'mentor.passwordHash': 0,
          'mentor.otpCode': 0,
          'student.passwordHash': 0,
          'student.otpCode': 0
        }
      },
      { $sort: { scheduledAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const [sessions, total] = await Promise.all([
      sessionsCollection.aggregate(pipeline).toArray(),
      sessionsCollection.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

