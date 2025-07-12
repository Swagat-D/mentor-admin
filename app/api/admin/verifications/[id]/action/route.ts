// app/api/admin/verifications/[id]/action/route.ts
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

    return NextResponse.json({
      success: true,
      message: `Verification ${action}d successfully`,
      data: { action, verificationId }
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
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
});