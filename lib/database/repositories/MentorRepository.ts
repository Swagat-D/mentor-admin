import { connectToDatabase } from '../connection';
import { ObjectId } from 'mongodb';

export interface MentorProfile {
  _id?: ObjectId;
  userId: ObjectId;
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  location: string;
  timezone: string;
  languages: string[];
  expertise: string[];
  subjects?: Array<{
    name: string;
    level: string;
    experience: string;
  }>;
  teachingStyles?: string[];
  specializations?: string[];
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }>;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  weeklySchedule?: any;
  pricing?: {
    hourlyRate: number;
    currency: string;
    trialSessionEnabled?: boolean;
    trialSessionRate?: number;
    groupSessionEnabled?: boolean;
    groupSessionRate?: number;
    packageDiscounts?: boolean;
  };
  preferences?: any;
  achievements?: string;
  isProfileComplete: boolean;
  applicationSubmitted: boolean;
  isVerified?: boolean;
  verifiedAt?: Date;
  profileStep?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class MentorProfileRepository {
  private async getCollection() {
    const { db } = await connectToDatabase();
    return db.collection('mentorProfiles');
  }

  async findByUserId(userId: string): Promise<MentorProfile | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ userId: new ObjectId(userId) }) as MentorProfile | null;
  }

  async findById(id: string): Promise<MentorProfile | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) }) as MentorProfile | null;
  }

  async create(profileData: Omit<MentorProfile, '_id'>): Promise<MentorProfile> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(profileData);
    return { ...profileData, _id: result.insertedId } as MentorProfile;
  }

  async update(id: ObjectId, updates: Partial<MentorProfile>): Promise<MentorProfile | null> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return await collection.findOne({ _id: id }) as MentorProfile | null;
  }

  async searchMentors(filters: {
    expertise?: string[];
    location?: string;
    languages?: string[];
    rating?: number;
    priceRange?: { min: number; max: number };
  }): Promise<any[]> {
    const { db } = await connectToDatabase();
    const mentorProfilesCollection = db.collection('mentorProfiles');
    const usersCollection = db.collection('users');

    const matchStage: any = {
      isProfileComplete: true,
      applicationSubmitted: true,
      isVerified: true
    };

    if (filters.expertise?.length) {
      matchStage.expertise = { $in: filters.expertise };
    }

    if (filters.location) {
      matchStage.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.languages?.length) {
      matchStage.languages = { $in: filters.languages };
    }

    if (filters.priceRange) {
      matchStage['pricing.hourlyRate'] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max
      };
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
          displayName: 1,
          bio: 1,
          location: 1,
          expertise: 1,
          languages: 1,
          'pricing.hourlyRate': 1,
          profilePicture: 1,
          rating: { $ifNull: ['$rating', 4.8] },
          totalSessions: { $ifNull: ['$totalSessions', 0] },
          createdAt: 1
        }
      },
      { $sort: { rating: -1, totalSessions: -1 } },
      { $limit: 50 }
    ];

    return await mentorProfilesCollection.aggregate(pipeline).toArray();
  }
}