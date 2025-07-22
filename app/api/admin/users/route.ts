// app/api/admin/users/route.ts - Fixed with correct test status detection
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const psychometricTestsCollection = db.collection('psychometricTests');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      // Map frontend role names to database role names
      const roleMapping: { [key: string]: string } = {
        'student': 'mentee',
        'mentor': 'mentor',
        'admin': 'admin'
      };
      query.role = roleMapping[role] || role;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      usersCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({ password: 0, otpCode: 0, passwordResetOTP: 0 })
        .toArray(),
      usersCollection.countDocuments(query)
    ]);

    // Get test status for all students in one query
    const studentUserIds = users
      .filter(user => user.role === 'mentee')
      .map(user => user._id);

    const completedTests = await psychometricTestsCollection
      .find({
        userId: { $in: studentUserIds },
        status: 'completed'
      })
      .project({ userId: 1 })
      .toArray();

    const testCompletedUserIds = new Set(
      completedTests.map(test => test.userId.toString())
    );

    // Transform the data to match frontend expectations
    const transformedUsers = users.map(user => {
      // Handle different user structures
      let firstName, lastName, isVerified, isTestGiven = false;
      
      if (user.role === 'mentee') {
        // For students (mentees) - use name field and split it
        const nameParts = user.name ? user.name.split(' ') : ['Unknown'];
        firstName = nameParts[0] || 'Unknown';
        lastName = nameParts.slice(1).join(' ') || '';
        isVerified = user.isEmailVerified || false;
        
        // Check both user field and psychometricTests collection
        isTestGiven = user.isTestGiven === true || testCompletedUserIds.has(user._id.toString());
      } else {
        // For mentors and admins - use existing firstName/lastName fields
        firstName = user.firstName || 'Unknown';
        lastName = user.lastName || '';
        isVerified = user.isVerified || false;
        isTestGiven = false; // Not applicable to mentors/admins
      }

      return {
        _id: user._id,
        firstName,
        lastName,
        email: user.email,
        role: user.role === 'mentee' ? 'student' : user.role, // Map mentee to student for frontend
        isActive: user.isActive,
        isVerified,
        isTestGiven,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        // Additional fields (mainly for students)
        ...(user.role === 'mentee' && {
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
          stats: user.stats,
          provider: user.provider
        }),
        // Additional fields for mentors/admins
        ...(user.role !== 'mentee' && {
          theme: user.theme
        })
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});