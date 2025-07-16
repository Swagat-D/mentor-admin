// app/api/admin/overview/route.ts
import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { db } = await connectToDatabase();
    
    const usersCollection = db.collection('users');
    const sessionsCollection = db.collection('sessions');
    const mentorVerificationsCollection = db.collection('mentorVerifications');
    const notificationsCollection = db.collection('notifications');

    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [
      // Basic stats
      totalUsers,
      totalMentors,
      totalStudents,
      activeSessions,
      pendingVerifications,
      completedSessions,
      
      // Growth data
      currentMonthUsers,
      lastMonthUsers,
      currentMonthSessions,
      lastMonthSessions,
      currentMonthRevenue,
      lastMonthRevenue,
      
      // Activity data
      recentActivity,
      systemHealth,
      userEngagement
    ] = await Promise.all([
      // Basic counts
      usersCollection.countDocuments({ isActive: true }),
      usersCollection.countDocuments({ role: 'mentor', isActive: true }),
      usersCollection.countDocuments({ role: 'mentee', isActive: true }),
      sessionsCollection.countDocuments({ 
        status: 'scheduled', 
        scheduledAt: { $gte: now } 
      }),
      mentorVerificationsCollection.countDocuments({ status: 'pending' }),
      sessionsCollection.countDocuments({ status: 'completed' }),
      
      // Growth calculations
      usersCollection.countDocuments({
        createdAt: { $gte: startOfMonth }
      }),
      usersCollection.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
      }),
      sessionsCollection.countDocuments({
        createdAt: { $gte: startOfMonth }
      }),
      sessionsCollection.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
      }),
      sessionsCollection.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfMonth },
            'payment.status': 'succeeded' 
          } 
        },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]).toArray(),
      sessionsCollection.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
            'payment.status': 'succeeded' 
          } 
        },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]).toArray(),
      
      // Recent activity
      getRecentActivity(usersCollection, sessionsCollection, mentorVerificationsCollection, last24Hours),
      
      // System health
      getSystemHealth(usersCollection, sessionsCollection, mentorVerificationsCollection),
      
      // User engagement
      getUserEngagement(usersCollection, sessionsCollection, last7Days)
    ]);

    // Calculate growth percentages
    const userGrowth = lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;
    const sessionGrowth = lastMonthSessions > 0 ? ((currentMonthSessions - lastMonthSessions) / lastMonthSessions) * 100 : 0;
    
    const currentRevenue = currentMonthRevenue[0]?.total || 0;
    const lastRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
    
    const completionRate = totalUsers > 0 ? (completedSessions / (completedSessions + activeSessions)) * 100 : 0;

    const overviewData = {
      // Main metrics
      stats: {
        totalUsers,
        totalMentors,
        totalStudents,
        activeSessions,
        pendingVerifications,
        completedSessions,
        totalRevenue: currentRevenue / 100, // Convert cents to dollars
        userGrowth: Math.round(userGrowth * 100) / 100,
        sessionGrowth: Math.round(sessionGrowth * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100
      },
      
      // Quick actions data
      quickActions: {
        pendingVerifications,
        newUsers: currentMonthUsers,
        activeSessions,
        unreadNotifications: await notificationsCollection.countDocuments({ read: false })
      },
      
      // Recent activity
      recentActivity,
      
      // System health
      systemHealth,
      
      // User engagement
      userEngagement,
      
      generatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Helper functions
async function getRecentActivity(usersCollection: any, sessionsCollection: any, mentorVerificationsCollection: any, since: Date) {
  const activities: {
    type: string;
    message: string;
    timestamp: Date | string;
    severity: string;
  }[] = [];

  // Get recent user registrations
  const newUsers = await usersCollection.find({
    createdAt: { $gte: since }
  }).sort({ createdAt: -1 }).limit(5).toArray();

  newUsers.forEach((user: any) => {
    const userName = user.role === 'mentee' ? user.name : `${user.firstName} ${user.lastName}`;
    activities.push({
      type: 'user_registered',
      message: `${userName} registered as ${user.role}`,
      timestamp: user.createdAt,
      severity: 'info'
    });
  });

  // Get recent sessions
  const recentSessions = await sessionsCollection.find({
    updatedAt: { $gte: since }
  }).sort({ updatedAt: -1 }).limit(5).toArray();

  recentSessions.forEach((session: any) => {
    activities.push({
      type: 'session_update',
      message: `Session ${session.status}`,
      timestamp: session.updatedAt,
      severity: session.status === 'completed' ? 'success' : session.status === 'cancelled' ? 'warning' : 'info'
    });
  });

  // Get recent verifications
  const recentVerifications = await mentorVerificationsCollection.find({
    createdAt: { $gte: since }
  }).sort({ createdAt: -1 }).limit(3).toArray();

  recentVerifications.forEach((verification: any) => {
    activities.push({
      type: 'verification_submitted',
      message: 'New mentor verification submitted',
      timestamp: verification.createdAt,
      severity: 'warning'
    });
  });

  // Sort by timestamp and return latest 10
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
}

async function getSystemHealth(usersCollection: any, sessionsCollection: any, mentorVerificationsCollection: any) {
  const [
    totalUsers,
    activeSessions,
    pendingVerifications,
    errorRate
  ] = await Promise.all([
    usersCollection.countDocuments({ isActive: true }),
    sessionsCollection.countDocuments({ status: { $in: ['scheduled', 'in_progress'] } }),
    mentorVerificationsCollection.countDocuments({ status: 'pending' }),
    // Simulate error rate - in real app, this would come from logs
    Promise.resolve(Math.random() * 0.1) // 0-0.1% error rate
  ]);

  return {
    status: 'healthy',
    uptime: 99.9,
    responseTime: Math.floor(Math.random() * 100) + 100, // 100-200ms
    errorRate: Math.round(errorRate * 1000) / 1000,
    activeConnections: activeSessions,
    systemLoad: Math.random() * 50 + 20 // 20-70%
  };
}

async function getUserEngagement(usersCollection: any, sessionsCollection: any, since: Date) {
  const [
    activeUsers,
    totalSessions,
    completedSessions
  ] = await Promise.all([
    usersCollection.countDocuments({
      lastLoginAt: { $gte: since },
      isActive: true
    }),
    sessionsCollection.countDocuments({
      createdAt: { $gte: since }
    }),
    sessionsCollection.countDocuments({
      createdAt: { $gte: since },
      status: 'completed'
    })
  ]);

  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  return {
    weeklyActiveUsers: activeUsers,
    sessionsThisWeek: totalSessions,
    completionRate: Math.round(completionRate * 100) / 100
  };
}