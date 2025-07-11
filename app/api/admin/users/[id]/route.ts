// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['student', 'mentor', 'admin']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop()!;
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const mentorProfilesCollection = db.collection('mentorProfiles');
    const sessionsCollection = db.collection('sessions');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordHash: 0, otpCode: 0, passwordResetOTP: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get additional data based on role
    let additionalData = {};
    
    if (user.role === 'mentor') {
      const [profile, sessionStats] = await Promise.all([
        mentorProfilesCollection.findOne({ userId: new ObjectId(userId) }),
        sessionsCollection.aggregate([
          { $match: { mentorId: new ObjectId(userId) } },
          {
            $group: {
              _id: null,
              totalSessions: { $sum: 1 },
              completedSessions: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              },
              totalEarnings: {
                $sum: {
                  $cond: [
                    { $eq: ['$payment.status', 'succeeded'] },
                    '$payment.amount',
                    0
                  ]
                }
              }
            }
          }
        ]).toArray()
      ]);
      
      additionalData = {
        profile,
        stats: sessionStats[0] || {
          totalSessions: 0,
          completedSessions: 0,
          totalEarnings: 0
        }
      };
    } else if (user.role === 'student') {
      const sessionStats = await sessionsCollection.aggregate([
        { $match: { studentId: new ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            completedSessions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalSpent: {
              $sum: {
                $cond: [
                  { $eq: ['$payment.status', 'succeeded'] },
                  '$payment.amount',
                  0
                ]
              }
            }
          }
        }
      ]).toArray();
      
      additionalData = {
        stats: sessionStats[0] || {
          totalSessions: 0,
          completedSessions: 0,
          totalSpent: 0
        }
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        ...additionalData
      }
    });

  } catch (error) {
    console.error('Get user details error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PATCH = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop()!;
    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error: any) {
    console.error('Update user error:', error);

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

