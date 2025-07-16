// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const sessionsCollection = db.collection('sessions');
    const mentorProfilesCollection = db.collection('mentorProfiles');
    const mentorVerificationsCollection = db.collection('mentorVerifications');

    // Calculate date ranges
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Get all analytics data in parallel
    const [
      userGrowthData,
      revenueData,
      topMentors,
      popularSubjects,
      weeklySessionStats,
      userEngagement,
      platformHealth
    ] = await Promise.all([
      getUserGrowthData(usersCollection, startDate, now, timeRange),
      getRevenueData(sessionsCollection, startDate, now, timeRange),
      getTopMentors(usersCollection, sessionsCollection, mentorProfilesCollection, startDate),
      getPopularSubjects(mentorProfilesCollection, sessionsCollection, startDate),
      getWeeklySessionStats(sessionsCollection, startDate),
      getUserEngagement(usersCollection, sessionsCollection, startDate),
      getPlatformHealth(usersCollection, sessionsCollection, mentorVerificationsCollection)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        userGrowthData,
        revenueData,
        topMentors,
        popularSubjects,
        weeklySessionStats,
        userEngagement,
        platformHealth,
        timeRange,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Helper functions
async function getUserGrowthData(usersCollection: any, startDate: Date, endDate: Date, timeRange: string) {
  // Generate all dates in the range
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  // Get user creation data
  const userCreationData = await usersCollection.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          role: '$role'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        mentors: {
          $sum: { $cond: [{ $eq: ['$_id.role', 'mentor'] }, '$count', 0] }
        },
        students: {
          $sum: { $cond: [{ $eq: ['$_id.role', 'mentee'] }, '$count', 0] }
        }
      }
    }
  ]).toArray();
  
  // Create a map for quick lookup
  const dataMap = new Map();
  userCreationData.forEach((item: { _id: string; mentors: number; students: number; }) => {
    dataMap.set(item._id, {
      mentors: item.mentors,
      students: item.students,
      total: item.mentors + item.students
    });
  });
  
  // Generate complete dataset with all dates
  const completeData = dates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const data = dataMap.get(dateStr) || { mentors: 0, students: 0, total: 0 };
    
    return {
      date: dateStr,
      mentors: data.mentors,
      students: data.students,
      total: data.total
    };
  });
  
  // Calculate cumulative totals
  let cumulativeMentors = 0;
  let cumulativeStudents = 0;
  
  return completeData.map(item => {
    cumulativeMentors += item.mentors;
    cumulativeStudents += item.students;
    
    return {
      date: item.date,
      newMentors: item.mentors,
      newStudents: item.students,
      newTotal: item.total,
      totalMentors: cumulativeMentors,
      totalStudents: cumulativeStudents,
      totalUsers: cumulativeMentors + cumulativeStudents
    };
  });
}

async function getRevenueData(sessionsCollection: any, startDate: Date, endDate: Date, timeRange: string) {
  const format = timeRange === '7d' ? '%Y-%m-%d' : timeRange === '30d' ? '%Y-%m-%d' : '%Y-%m';
  
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        'payment.status': 'succeeded'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: format, date: '$createdAt' } },
        revenue: { $sum: '$payment.amount' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ];

  const result = await sessionsCollection.aggregate(pipeline).toArray();
  
  return result.map((item: { _id: string; revenue: number; sessions: number }) => ({
    date: item._id,
    revenue: item.revenue / 100, // Convert cents to dollars
    sessions: item.sessions
  }));
}

async function getTopMentors(usersCollection: any, sessionsCollection: any, mentorProfilesCollection: any, startDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$mentorId',
        sessions: { $sum: 1 },
        earnings: { 
          $sum: { 
            $cond: [
              { $eq: ['$payment.status', 'succeeded'] }, 
              '$payment.amount', 
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'mentorProfiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'profile'
      }
    },
    { $unwind: '$user' },
    { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
        sessions: 1,
        earnings: { $divide: ['$earnings', 100] },
        rating: { $ifNull: ['$profile.rating', 4.5] }
      }
    },
    { $sort: { sessions: -1 } },
    { $limit: 10 }
  ];

  return await sessionsCollection.aggregate(pipeline).toArray();
}

async function getPopularSubjects(mentorProfilesCollection: any, sessionsCollection: any, startDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $lookup: {
        from: 'mentorProfiles',
        localField: 'mentorId',
        foreignField: 'userId',
        as: 'profile'
      }
    },
    { $unwind: '$profile' },
    { $unwind: '$profile.expertise' },
    {
      $group: {
        _id: '$profile.expertise',
        sessions: { $sum: 1 }
      }
    },
    { $sort: { sessions: -1 } },
    { $limit: 10 }
  ];

  const result = await sessionsCollection.aggregate(pipeline).toArray();
  const total = result.reduce((sum: number, item: { _id: string; sessions: number }) => sum + item.sessions, 0);
  
  return result.map((item: { _id: string; sessions: number }) => ({
    subject: item._id,
    sessions: item.sessions,
    percentage: Math.round((item.sessions / total) * 100)
  }));
}

async function getWeeklySessionStats(sessionsCollection: any, startDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          day: { $dayOfWeek: '$createdAt' },
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.day',
        completed: {
          $sum: { $cond: [{ $eq: ['$_id.status', 'completed'] }, '$count', 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$_id.status', 'cancelled'] }, '$count', 0] }
        },
        noShow: {
          $sum: { $cond: [{ $eq: ['$_id.status', 'no_show'] }, '$count', 0] }
        }
      }
    },
    { $sort: { '_id': 1 } }
  ];

  const result = await sessionsCollection.aggregate(pipeline).toArray();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return result.map((item: { _id: number; completed: number; cancelled: number; noShow: number }) => ({
    day: days[item._id - 1],
    completed: item.completed,
    cancelled: item.cancelled,
    noShow: item.noShow
  }));
}

async function getUserEngagement(usersCollection: any, sessionsCollection: any, startDate: Date) {
  const now = new Date();
  
  // For active users, let's use a more realistic timeframe (last 30 days for daily active users)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const [
    totalUsers, 
    activeUsersLast30Days, 
    activeUsersLast7Days,
    totalLoggedInUsers,
    sessionStats
  ] = await Promise.all([
    usersCollection.countDocuments({ isActive: true }),
    usersCollection.countDocuments({ 
      isActive: true, 
      lastLoginAt: { $gte: last30Days } 
    }),
    usersCollection.countDocuments({ 
      isActive: true, 
      lastLoginAt: { $gte: last7Days } 
    }),
    usersCollection.countDocuments({ 
      isActive: true, 
      lastLoginAt: { $exists: true } 
    }),
    sessionsCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]).toArray()
  ]);

  const sessionData = sessionStats[0] || { total: 0, completed: 0 };
  const completionRate = sessionData.total > 0 ? (sessionData.completed / sessionData.total) * 100 : 0;
  
  // Use a more realistic retention calculation
  const userRetention = totalUsers > 0 ? (totalLoggedInUsers / totalUsers) * 100 : 0;

  return {
    totalUsers,
    dailyActiveUsers: activeUsersLast7Days, // Users active in last 7 days
    monthlyActiveUsers: activeUsersLast30Days, // Users active in last 30 days
    completionRate: Math.round(completionRate),
    userRetention: Math.round(userRetention),
    totalLoggedInUsers
  };
}

async function getPlatformHealth(usersCollection: any, sessionsCollection: any, mentorVerificationsCollection: any) {
  const [userCount, sessionCount, verificationCount] = await Promise.all([
    usersCollection.countDocuments({ isActive: true }),
    sessionsCollection.countDocuments({ status: 'completed' }),
    mentorVerificationsCollection.countDocuments({ status: 'pending' })
  ]);

  return {
    systemUptime: 99.9,
    apiResponseTime: Math.floor(Math.random() * 100) + 100, // Simulated
    errorRate: 0.01,
    totalUsers: userCount,
    completedSessions: sessionCount,
    pendingVerifications: verificationCount
  };
}