import { NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { connectToDatabase } from '@/lib/database/connection';
import { ObjectId } from 'mongodb';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const [stats] = await notificationsCollection.aggregate([
      {
        $match: {
          $or: [
            { userId: new ObjectId(req.user!.userId) },
            { userId: { $exists: false } },
            { type: { $in: ['system_alert', 'platform_update', 'maintenance_scheduled'] } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
          read: { $sum: { $cond: [{ $eq: ['$read', true] }, 1, 0] } },
          verification_notifications: {
            $sum: { 
              $cond: [
                { $regexMatch: { input: '$type', regex: 'verification' } }, 
                1, 
                0
              ] 
            }
          },
          user_notifications: {
            $sum: { 
              $cond: [
                { $regexMatch: { input: '$type', regex: 'user' } }, 
                1, 
                0
              ] 
            }
          },
          payment_notifications: {
            $sum: { 
              $cond: [
                { $regexMatch: { input: '$type', regex: 'payment' } }, 
                1, 
                0
              ] 
            }
          },
          system_notifications: {
            $sum: { 
              $cond: [
                { $regexMatch: { input: '$type', regex: 'system' } }, 
                1, 
                0
              ] 
            }
          }
        }
      }
    ]).toArray();

    return NextResponse.json({
      success: true,
      data: stats || {
        total: 0,
        unread: 0,
        read: 0,
        verification_notifications: 0,
        user_notifications: 0,
        payment_notifications: 0,
        system_notifications: 0
      }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});