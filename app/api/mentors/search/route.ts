import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const expertise = searchParams.get('expertise')?.split(',').filter(Boolean);
    const location = searchParams.get('location') || undefined;
    const languages = searchParams.get('languages')?.split(',').filter(Boolean);
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const { db } = await connectToDatabase();
    const mentorProfilesCollection = db.collection('mentorProfiles');

    const matchStage: any = {
      isProfileComplete: true,
      applicationSubmitted: true,
      isVerified: true
    };

    if (expertise?.length) {
      matchStage.expertise = { $in: expertise };
    }

    if (location) {
      matchStage.location = { $regex: location, $options: 'i' };
    }

    if (languages?.length) {
      matchStage.languages = { $in: languages };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      matchStage['pricing.hourlyRate'] = {};
      if (minPrice !== undefined) matchStage['pricing.hourlyRate'].$gte = minPrice;
      if (maxPrice !== undefined) matchStage['pricing.hourlyRate'].$lte = maxPrice;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.isActive': true,
          'user.isVerified': true
        }
      },
      {
        $project: {
          _id: 1,
          displayName: 1,
          bio: 1,
          location: 1,
          expertise: 1,
          languages: 1,
          hourlyRate: '$pricing.hourlyRate',
          profilePicture: 1,
          rating: { $ifNull: ['$rating', 4.8] },
          totalSessions: { $ifNull: ['$totalSessions', 0] },
          createdAt: 1
        }
      },
      { $sort: { rating: -1, totalSessions: -1 } },
      { $limit: limit }
    ];

    const mentors = await mentorProfilesCollection.aggregate(pipeline).toArray();

    return NextResponse.json({
      success: true,
      data: mentors,
      total: mentors.length
    });

  } catch (error) {
    console.error('Search mentors error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}