// app/api/admin/users/[id]/test-results/route.ts - Fixed for actual database structure
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/').slice(-2, -1)[0];
    
    const { db } = await connectToDatabase();
    const psychometricTestsCollection = db.collection('psychometricTests');
    const usersCollection = db.collection('users');

    // Verify user exists and is a student
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(userId),
      role: 'mentee' // Ensure it's a student
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Get the test results using the actual database structure
    const testResult = await psychometricTestsCollection.findOne({
      userId: new ObjectId(userId),
      status: 'completed'
    });

    if (!testResult) {
      return NextResponse.json(
        { success: false, message: 'No test results found for this student' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected structure based on actual database format
    const transformedResult = {
      _id: testResult._id,
      userId: testResult.userId,
      sections: {
        interests: {
          realistic: testResult.riasecResult?.scores?.R || 0,
          investigative: testResult.riasecResult?.scores?.I || 0,
          artistic: testResult.riasecResult?.scores?.A || 0,
          social: testResult.riasecResult?.scores?.S || 0,
          enterprising: testResult.riasecResult?.scores?.E || 0,
          conventional: testResult.riasecResult?.scores?.C || 0,
          hollandCode: testResult.riasecResult?.hollandCode || 'N/A'
        },
        personality: {
          L1: testResult.brainProfileResult?.quadrantScores?.L1 || 0,
          L2: testResult.brainProfileResult?.quadrantScores?.L2 || 0,
          R1: testResult.brainProfileResult?.quadrantScores?.R1 || 0,
          R2: testResult.brainProfileResult?.quadrantScores?.R2 || 0,
          dominantQuadrants: testResult.brainProfileResult?.dominantQuadrants || [],
          personalityTypes: testResult.brainProfileResult?.personalityTypes || []
        },
        employability: {
          selfManagement: testResult.employabilityResult?.scores?.selfManagement || 0,
          teamWork: testResult.employabilityResult?.scores?.teamWork || 0,
          enterprising: testResult.employabilityResult?.scores?.enterprising || 0,
          problemSolving: testResult.employabilityResult?.scores?.problemSolving || 0,
          speakingListening: testResult.employabilityResult?.scores?.speakingListening || 0,
          quotient: testResult.employabilityResult?.overallScore || 0
        },
        characterStrengths: {
          top3Strengths: testResult.personalInsightsResult?.topStrengths || [],
          categories: testResult.personalInsightsResult?.strengthCategories || [],
          values: testResult.personalInsightsResult?.coreValues || []
        }
      },
      completedAt: testResult.completedAt || testResult.createdAt,
      isValid: testResult.status === 'completed'
    };

    return NextResponse.json({
      success: true,
      data: transformedResult
    });

  } catch (error) {
    console.error('Get test results error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});