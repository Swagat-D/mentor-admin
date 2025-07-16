import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { db } = await connectToDatabase();
    
    // Get all collections
    const usersCollection = db.collection('users');
    const mentorProfilesCollection = db.collection('mentorProfiles');
    const sessionsCollection = db.collection('sessions');
    const verificationsCollection = db.collection('mentorVerifications');

    // Parallel queries for better performance
    const [
      totalUsers,
      totalMentors,
      totalStudents,
      activeSessions,
      pendingVerifications,
      completedSessions,
      totalRevenue,
      verifiedMentors
    ] = await Promise.all([
      usersCollection.countDocuments({ isActive: true }),
      usersCollection.countDocuments({ role: 'mentor', isActive: true }),
      usersCollection.countDocuments({ role: 'mentee', isActive: true }), // Changed to mentee
      sessionsCollection.countDocuments({ 
        status: 'scheduled', 
        scheduledAt: { $gte: new Date() } 
      }),
      verificationsCollection.countDocuments({ status: 'pending' }),
      sessionsCollection.countDocuments({ status: 'completed' }),
      sessionsCollection.aggregate([
        { $match: { status: 'completed', 'payment.status': 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]).toArray(),
      mentorProfilesCollection.countDocuments({ isVerified: true })
    ]);

    // Calculate monthly growth (mock calculation for now)
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const [currentMonthUsers, lastMonthUsers] = await Promise.all([
      usersCollection.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      }),
      usersCollection.countDocuments({
        createdAt: {
          $gte: new Date(lastMonthYear, lastMonth, 1),
          $lt: new Date(lastMonthYear, lastMonth + 1, 1)
        }
      })
    ]);

    const monthlyGrowth = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;

    // Calculate completion rate
    const totalSessions = await sessionsCollection.countDocuments();
    const completionRate = totalSessions > 0 
      ? (completedSessions / totalSessions) * 100 
      : 0;

    const revenue = totalRevenue[0]?.total || 0;

    const stats = {
      totalUsers,
      totalMentors,
      totalStudents,
      activeSessions,
      pendingVerifications,
      totalRevenue: revenue / 100, // Convert from cents to dollars
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      completedSessions
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});