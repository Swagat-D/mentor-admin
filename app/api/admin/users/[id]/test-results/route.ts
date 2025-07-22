// app/api/admin/users/[id]/test-results/route.ts - Fixed for exact database structure
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
    
    console.log('API: Fetching test results for userId:', userId);
    
    const { db } = await connectToDatabase();
    const psychometricTestsCollection = db.collection('psychometrictests');
    const usersCollection = db.collection('users');

    // Verify user exists
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(userId)
    });

    if (!user) {
      console.log('API: User not found');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('API: User found:', user.email, 'Role:', user.role);

    // Get the test results
    const testResult = await psychometricTestsCollection.findOne({
      userId: new ObjectId(userId),
      status: 'completed'
    });

    console.log('API: Test result found:', !!testResult);

    if (!testResult) {
      return NextResponse.json(
        { success: false, message: 'No completed test results found for this student' },
        { status: 404 }
      );
    }

    // Parse the exact data structure from your database
    const transformedResult = {
      _id: testResult._id,
      userId: testResult.userId,
      sections: {
        interests: {
          // Extract RIASEC scores from riasecResult.scores
          realistic: testResult.riasecResult?.scores?.R || 0,
          investigative: testResult.riasecResult?.scores?.I || 0,
          artistic: testResult.riasecResult?.scores?.A || 0,
          social: testResult.riasecResult?.scores?.S || 0,
          enterprising: testResult.riasecResult?.scores?.E || 0,
          conventional: testResult.riasecResult?.scores?.C || 0,
          // Extract Holland Code from interpretation
          hollandCode: extractHollandCode(testResult.riasecResult?.interpretation) || 'N/A'
        },
        personality: {
          // Extract brain profile data from brainProfileResult.scores
          L1: testResult.brainProfileResult?.scores?.L1 || 0,
          L2: testResult.brainProfileResult?.scores?.L2 || 0,
          R1: testResult.brainProfileResult?.scores?.R1 || 0,
          R2: testResult.brainProfileResult?.scores?.R2 || 0,
          dominantQuadrants: calculateDominantQuadrants({
            L1: testResult.brainProfileResult?.scores?.L1 || 0,
            L2: testResult.brainProfileResult?.scores?.L2 || 0,
            R1: testResult.brainProfileResult?.scores?.R1 || 0,
            R2: testResult.brainProfileResult?.scores?.R2 || 0
          }),
          personalityTypes: getPersonalityTypes(calculateDominantQuadrants({
            L1: testResult.brainProfileResult?.scores?.L1 || 0,
            L2: testResult.brainProfileResult?.scores?.L2 || 0,
            R1: testResult.brainProfileResult?.scores?.R1 || 0,
            R2: testResult.brainProfileResult?.scores?.R2 || 0
          }))
        },
        employability: {
          // Extract employability scores from employabilityResult.scores (S, T, E, P, Speaking)
          selfManagement: testResult.employabilityResult?.scores?.S || 0,
          teamWork: testResult.employabilityResult?.scores?.T || 0,
          enterprising: testResult.employabilityResult?.scores?.E || 0,
          problemSolving: testResult.employabilityResult?.scores?.P || 0,
          speakingListening: testResult.employabilityResult?.scores?.Speaking || 0,
          quotient: extractEmployabilityQuotient(testResult.employabilityResult?.interpretation) || 0
        },
        characterStrengths: {
          // Extract character strengths from personalInsightsResult
          top3Strengths: testResult.personalInsightsResult?.characterStrengths || [],
          categories: [], // This might need to be derived from the strengths
          values: testResult.personalInsightsResult?.valuesInLife || [],
          // Include actual user responses
          userResponses: {
            whatYouLike: testResult.personalInsightsResult?.responses?.whatYouLike || '',
            whatYouAreGoodAt: testResult.personalInsightsResult?.responses?.whatYouAreGoodAt || '',
            recentProjects: testResult.personalInsightsResult?.responses?.recentProjects || ''
          }
        }
      },
      completedAt: testResult.completedAt || testResult.createdAt,
      isValid: testResult.status === 'completed',
      
      // Include detailed raw data for complete transparency
      rawData: {
        riasecResult: testResult.riasecResult,
        brainProfileResult: testResult.brainProfileResult,
        employabilityResult: testResult.employabilityResult,
        personalInsightsResult: testResult.personalInsightsResult
      }
    };

    console.log('API: RIASEC scores extracted:', transformedResult.sections.interests);
    console.log('API: Brain profile scores extracted:', transformedResult.sections.personality);
    console.log('API: Employability scores extracted:', transformedResult.sections.employability);
    console.log('API: Personal insights extracted:', transformedResult.sections.characterStrengths);

    return NextResponse.json({
      success: true,
      data: transformedResult
    });

  } catch (error) {
    console.error('Get test results error:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message?: string }).message
      : String(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
});

// Helper function to extract Holland Code from interpretation text
function extractHollandCode(interpretation: string): string | null {
  if (!interpretation) return null;
  
  // Look for pattern like "Your Holland Code is IEC"
  const match = interpretation.match(/Holland Code is ([A-Z]{2,3})/i);
  return match ? match[1] : null;
}

// Helper function to extract Employability Quotient from interpretation text
function extractEmployabilityQuotient(interpretation: string): number | null {
  if (!interpretation) return null;
  
  // Look for pattern like "Your Employability Quotient is 8/10" or "8.0/10"
  const match = interpretation.match(/Employability Quotient is (\d+(?:\.\d+)?)/i);
  return match ? parseFloat(match[1]) : null;
}

// Helper function to calculate dominant quadrants (top 2)
function calculateDominantQuadrants(scores: { L1: number; L2: number; R1: number; R2: number }): string[] {
  const quadrants = [
    { name: 'L1', value: scores.L1 },
    { name: 'L2', value: scores.L2 },
    { name: 'R1', value: scores.R1 },
    { name: 'R2', value: scores.R2 }
  ];
  
  // Sort by value descending and take top 2
  quadrants.sort((a, b) => b.value - a.value);
  return quadrants.slice(0, 2).map(q => q.name);
}

// Helper function to get personality types based on dominant quadrants
function getPersonalityTypes(dominantQuadrants: string[]): string[] {
  const personalityMap: { [key: string]: string } = {
    'L1': 'Analyst and Realist',
    'L2': 'Conservative/Preserver and Organizer', 
    'R1': 'Strategist and Imaginative',
    'R2': 'Socializer and Empathic'
  };
  
  return dominantQuadrants.map(quadrant => personalityMap[quadrant] || quadrant);
}