// app/api/notifications/route.ts - User Notifications API
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread') === 'true';
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    // Build query
    const query: any = { userId: new ObjectId(req.user!.userId) };
    if (unreadOnly) {
      query.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      notificationsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      notificationsCollection.countDocuments(query),
      notificationsCollection.countDocuments({ 
        userId: new ObjectId(req.user!.userId), 
        read: false 
      })
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
        },
        unreadCount
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

// Mark notification as read
export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { notificationId, markAllAsRead } = body;

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    if (markAllAsRead) {
      // Mark all notifications as read for the user
      await notificationsCollection.updateMany(
        { userId: new ObjectId(req.user!.userId), read: false },
        { $set: { read: true, readAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } else if (notificationId) {
      // Mark specific notification as read
      const result = await notificationsCollection.updateOne(
        { 
          _id: new ObjectId(notificationId),
          userId: new ObjectId(req.user!.userId) 
        },
        { $set: { read: true, readAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Notification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});