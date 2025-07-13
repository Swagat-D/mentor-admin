// app/api/admin/verifications/[id]/action/route.ts - Enhanced with Notifications
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { EmailService } from '@/lib/services/email.service';

const verificationActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_info']),
  notes: z.string().optional(),
  requestedInfo: z.string().optional(),
});

interface NotificationData {
  userId: ObjectId;
  type: 'verification_approved' | 'verification_rejected' | 'verification_info_requested';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  }

export const POST = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const verificationId = pathSegments[pathSegments.indexOf('verifications') + 1];
    
    const body = await req.json();
    const { action, notes, requestedInfo } = verificationActionSchema.parse(body);

    console.log('Processing verification action:', { verificationId, action, notes, requestedInfo });

    const { db } = await connectToDatabase();
    const mentorVerificationsCollection = db.collection('mentorVerifications');
    const usersCollection = db.collection('users');
    const mentorProfilesCollection = db.collection('mentorProfiles');
    const notificationsCollection = db.collection('notifications');

    // Get verification record
    const verification = await mentorVerificationsCollection.findOne({
      _id: new ObjectId(verificationId)
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'Verification not found' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await usersCollection.findOne({
      _id: verification.userId
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let updateData: any = {
      updatedAt: new Date(),
      reviewedBy: new ObjectId(req.user!.userId),
      reviewedAt: new Date(),
    };

    let notificationData: NotificationData | undefined;

    // Process different actions
    if (action === 'approve') {
      updateData.status = 'approved';
      updateData.notes = notes;

      // Update mentor profile to mark as verified
      await mentorProfilesCollection.updateOne(
        { userId: verification.userId },
        {
          $set: {
            isVerified: true,
            verifiedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      // Create notification
      notificationData = {
        userId: verification.userId,
        type: 'verification_approved',
        title: 'Application Approved! 🎉',
        message: 'Congratulations! Your mentor application has been approved. You can now access your mentor dashboard and start connecting with students.',
        data: {
          verificationId: verification._id,
          action: 'approved',
          notes: notes
        },
        read: false,
        createdAt: new Date()
      };

      // Send approval email
      try {
        console.log('Sending approval email to:', user.email);
        await EmailService.sendMentorApprovalEmail(
          user.email,
          user.firstName
        );
        console.log('Approval email sent successfully');
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the whole operation if email fails
      }

    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejectionReason = notes;

      // Create notification
      notificationData = {
        userId: verification.userId,
        type: 'verification_rejected',
        title: 'Application Update Required',
        message: `Your mentor application needs attention: ${notes || 'Please review the feedback and consider reapplying.'}`,
        data: {
          verificationId: verification._id,
          action: 'rejected',
          notes: notes
        },
        read: false,
        createdAt: new Date()
      };

      // Send rejection email
      try {
        console.log('Sending rejection email to:', user.email);
        await EmailService.sendMentorRejectionEmail(
          user.email,
          user.firstName,
          notes || 'Your application did not meet our requirements.'
        );
        console.log('Rejection email sent successfully');
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }

    } else if (action === 'request_info') {
      updateData.status = 'info_requested';
      updateData.requestedInfo = requestedInfo;
      updateData.notes = notes;

      // Create notification
      notificationData = {
        userId: verification.userId,
        type: 'verification_info_requested',
        title: 'Additional Information Required',
        message: `Please provide additional information for your mentor application: ${requestedInfo || 'Additional documentation needed.'}`,
        data: {
          verificationId: verification._id,
          action: 'request_info',
          requestedInfo: requestedInfo,
          notes: notes
        },
        read: false,
        createdAt: new Date()
      };

      // Send info request email
      try {
        console.log('Sending info request email to:', user.email);
        await EmailService.sendMentorInfoRequestEmail(
          user.email,
          user.firstName,
          requestedInfo || 'Additional information is required for your application.'
        );
        console.log('Info request email sent successfully');
      } catch (emailError) {
        console.error('Failed to send info request email:', emailError);
      }
    }

    // Update verification record
    const result = await mentorVerificationsCollection.updateOne(
      { _id: new ObjectId(verificationId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update verification' },
        { status: 500 }
      );
    }

    // Create notification
    if (notificationData) {
      try {
        await notificationsCollection.insertOne(notificationData);
        console.log('Notification created successfully');
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the operation if notification creation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${action.replace('_', ' ')}d successfully`,
      data: { 
        action, 
        verificationId,
        notificationSent: true 
      }
    });

  } catch (error: any) {
    console.error('Verification action error:', error);

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