// app/api/admin/verifications/[id]/route.ts
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

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const POST = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const verificationId = url.pathname.split('/').slice(-2, -1)[0];
    const body = await req.json();
    const { action, notes, requestedInfo } = verificationActionSchema.parse(body);

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
        await EmailService.sendMentorApprovalEmail(
          user.email,
          user.firstName
        );
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
      }

    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejectionReason = notes;

      // Send rejection email
      try {
        await EmailService.sendMentorRejectionEmail(
          user.email,
          user.firstName,
          notes || 'Your application did not meet our requirements.'
        );
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }

    } else if (action === 'request_info') {
      updateData.status = 'info_requested';
      updateData.requestedInfo = requestedInfo;
      updateData.notes = notes;

      // Send info request email
      try {
        await EmailService.sendMentorInfoRequestEmail(
          user.email,
          user.firstName,
          requestedInfo || 'Additional information is required for your application.'
        );
      } catch (emailError) {
        console.error('Failed to send info request email:', emailError);
      }
    }

    // Update verification record
    await mentorVerificationsCollection.updateOne(
      { _id: new ObjectId(verificationId) },
      { $set: updateData }
    );

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
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

