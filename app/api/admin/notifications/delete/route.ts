import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const deleteNotificationsSchema = z.object({
  notificationIds: z.array(z.string())
});

export const DELETE = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { notificationIds } = deleteNotificationsSchema.parse(body);

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const result = await notificationsCollection.deleteMany({
      _id: { $in: notificationIds.map(id => new ObjectId(id)) },
      userId: new ObjectId(req.user!.userId)
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      data: { deletedCount: result.deletedCount }
    });

  } catch (error: any) {
    console.error('Delete notifications error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.errors.map((e: any) => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});