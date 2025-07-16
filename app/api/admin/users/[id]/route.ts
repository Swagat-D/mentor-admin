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
      { projection: { passwordHash: 0, password: 0, otpCode: 0, passwordResetOTP: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Transform user data to match frontend expectations
    let transformedUser;

    if (user.role === 'mentee') {
      // For students (mentees) - use name field and split it
      transformedUser = {
        _id: user._id,
        firstName: user.name ? user.name.split(' ')[0] : 'Unknown',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
        email: user.email,
        role: 'student', // Map mentee to student for frontend
        isActive: user.isActive,
        isVerified: user.isEmailVerified || false,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        // Additional student fields
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        ageRange: user.ageRange,
        studyLevel: user.studyLevel,
        bio: user.bio,
        location: user.location,
        timezone: user.timezone,
        goals: user.goals,
        isOnboarded: user.isOnboarded,
        onboardingStatus: user.onboardingStatus,
        stats: user.stats
      };
    } else {
      // For mentors and admins - use existing structure
      transformedUser = {
        _id: user._id,
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || '',
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified || false,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        // Additional fields if they exist
        theme: user.theme
      };
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
    } else if (user.role === 'mentee') {
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
        user: transformedUser,
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

    // Get the current user to check their role
    const currentUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data based on user type
    const updateData: any = {
      updatedAt: new Date()
    };

    // Handle role updates with proper mapping
    if (validatedData.role) {
      const roleMapping: { [key: string]: string } = {
        'student': 'mentee',
        'mentor': 'mentor',
        'admin': 'admin'
      };
      updateData.role = roleMapping[validatedData.role] || validatedData.role;
    }

    // Handle isActive updates
    if (typeof validatedData.isActive === 'boolean') {
      updateData.isActive = validatedData.isActive;
    }

    // Handle name updates differently based on user type
    if (validatedData.firstName || validatedData.lastName) {
      if (currentUser.role === 'mentee') {
        // For students, update the name field
        const firstName = validatedData.firstName || (currentUser.name ? currentUser.name.split(' ')[0] : '');
        const lastName = validatedData.lastName || (currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : '');
        updateData.name = `${firstName} ${lastName}`.trim();
      } else {
        // For mentors and admins, update firstName and lastName fields
        if (validatedData.firstName) updateData.firstName = validatedData.firstName;
        if (validatedData.lastName) updateData.lastName = validatedData.lastName;
      }
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
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