// app/api/admin/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { EmailService } from '@/lib/services/email.service';
import { z } from 'zod';

const sendMessageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z.string().min(1, 'Message content is required').max(500, 'Message too long'),
});

export const POST = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { userId, message } = sendMessageSchema.parse(body);

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection('notifications');

    // Get user details
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get admin details
    const admin = await usersCollection.findOne({
      _id: new ObjectId(req.user!.userId)
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Get user name based on their type
    let userName;
    if (user.role === 'mentee') {
      userName = user.name || 'User';
    } else {
      userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    }

    // Create notification
    const notification = {
      userId: new ObjectId(userId),
      type: 'admin_message',
      title: 'Message from Admin',
      message: message,
      data: {
        adminId: req.user!.userId,
        adminName: `${admin.firstName} ${admin.lastName}`,
        sentAt: new Date()
      },
      read: false,
      createdAt: new Date()
    };

    await notificationsCollection.insertOne(notification);

    // Send email notification
    try {
      await EmailService.sendAdminMessageEmail(
        user.email,
        userName,
        message,
        `${admin.firstName} ${admin.lastName}`
      );
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the whole operation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        sentTo: user.email,
        sentAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Send message error:', error);

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