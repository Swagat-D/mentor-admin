// app/api/mentor/verification/update/route.ts - Handle Info Requested Updates
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { EmailService } from '@/lib/services/email.service';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { additionalInfo, updatedDocuments } = body;

    if (req.user!.role !== 'mentor') {
      return NextResponse.json(
        { success: false, message: 'Only mentors can update verification info' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const mentorVerificationsCollection = db.collection('mentorVerifications');
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection('notifications');

    // Find the verification record
    const verification = await mentorVerificationsCollection.findOne({
      userId: new ObjectId(req.user!.userId),
      status: 'info_requested'
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'No pending info request found for your account' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.user!.userId)
    });

    // Update verification with new info
    const updateData: any = {
      status: 'pending', // Reset to pending for re-review
      updatedAt: new Date(),
      additionalInfoProvided: additionalInfo,
      infoProvidedAt: new Date()
    };

    // Add updated documents if provided
    if (updatedDocuments && updatedDocuments.length > 0) {
      updateData.documents = [
        ...verification.documents,
        ...updatedDocuments.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(),
          status: 'pending'
        }))
      ];
    }

    // Clear the info request fields
    updateData.$unset = {
      requestedInfo: 1
    };

    await mentorVerificationsCollection.updateOne(
      { _id: verification._id },
      { $set: updateData, $unset: updateData.$unset }
    );

    // Create notification for admin
    await notificationsCollection.insertOne({
      userId: new ObjectId('admin'), // You might want to get actual admin user IDs
      type: 'verification_info_provided',
      title: 'Mentor Provided Additional Information',
      message: `${user?.firstName} ${user?.lastName} has provided additional information for their mentor application.`,
      data: {
        verificationId: verification._id,
        mentorId: req.user!.userId,
        mentorName: `${user?.firstName} ${user?.lastName}`
      },
      read: false,
      createdAt: new Date()
    });

    // Send email to admin (optional)
    try {
      // You might want to send an email to admin about the update
      console.log('Additional information provided by mentor:', user?.email);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Additional information submitted successfully. Your application is now under review again.',
      data: {
        status: 'pending',
        submittedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Update verification info error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Get current verification status and any info requests
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (req.user!.role !== 'mentor') {
      return NextResponse.json(
        { success: false, message: 'Only mentors can access verification info' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const mentorVerificationsCollection = db.collection('mentorVerifications');

    const verification = await mentorVerificationsCollection.findOne({
      userId: new ObjectId(req.user!.userId)
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'No verification record found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: verification.status,
        requestedInfo: verification.requestedInfo,
        notes: verification.notes,
        rejectionReason: verification.rejectionReason,
        submittedAt: verification.submittedAt,
        reviewedAt: verification.reviewedAt,
        documents: verification.documents
      }
    });

  } catch (error) {
    console.error('Get verification info error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});