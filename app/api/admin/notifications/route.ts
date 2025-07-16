// app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || '';
    const read = searchParams.get('read') || '';
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    // Build query for admin notifications
    const query: any = {
      // Get notifications for admins or global notifications
      $or: [
        { userId: new ObjectId(req.user!.userId) },
        { userId: { $exists: false } }, // Global notifications
        { type: { $in: ['system_alert', 'platform_update', 'maintenance_scheduled'] } }
      ]
    };

    if (type && type !== 'all') {
      query.type = { $regex: type, $options: 'i' };
    }

    if (read && read !== 'all') {
      query.read = read === 'true';
    }

    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    const [notifications, total] = await Promise.all([
      notificationsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      notificationsCollection.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});
