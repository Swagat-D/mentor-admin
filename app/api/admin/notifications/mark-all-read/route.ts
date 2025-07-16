import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

export const PATCH = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const result = await notificationsCollection.updateMany(
      { 
        userId: new ObjectId(req.user!.userId),
        read: false
      },
      { 
        $set: { 
          read: true, 
          readAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});