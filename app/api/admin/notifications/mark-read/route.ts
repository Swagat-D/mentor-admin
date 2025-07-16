import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const markReadSchema = z.object({
  notificationIds: z.array(z.string())
});

export const PATCH = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { notificationIds } = markReadSchema.parse(body);

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const result = await notificationsCollection.updateMany(
      { 
        _id: { $in: notificationIds.map(id => new ObjectId(id)) },
        userId: new ObjectId(req.user!.userId)
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

  } catch (error: any) {
    console.error('Mark notifications read error:', error);

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