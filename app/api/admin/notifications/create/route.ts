import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const createNotificationSchema = z.object({
  type: z.string(),
  title: z.string(),
  message: z.string(),
  data: z.any().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  targetUserId: z.string().optional(), // For sending to specific users
  isGlobal: z.boolean().optional() // For global notifications
});

export const POST = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { type, title, message, data, priority, targetUserId, isGlobal } = createNotificationSchema.parse(body);

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const notification = {
      type,
      title,
      message,
      data: data || {},
      priority: priority || 'medium',
      read: false,
      createdAt: new Date(),
      createdBy: new ObjectId(req.user!.userId)
    };

    // Add userId if targeting specific user, otherwise it's global
    if (targetUserId) {
      (notification as any).userId = new ObjectId(targetUserId);
    } else if (!isGlobal) {
      // Default to creating notification for the admin who created it
      (notification as any).userId = new ObjectId(req.user!.userId);
    }

    const result = await notificationsCollection.insertOne(notification);

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      data: { notificationId: result.insertedId }
    });

  } catch (error: any) {
    console.error('Create notification error:', error);

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