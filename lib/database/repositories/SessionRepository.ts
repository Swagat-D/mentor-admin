import { connectToDatabase } from '../connection';
import { ObjectId } from 'mongodb';

export interface Session {
  _id?: ObjectId;
  mentorId: ObjectId;
  studentId: ObjectId;
  subject: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type: 'video' | 'audio' | 'chat';
  notes?: string;
  payment: {
    amount: number;
    currency: string;
    stripePaymentIntentId?: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  };
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class SessionRepository {
  private async getCollection() {
    const { db } = await connectToDatabase();
    return db.collection('sessions');
  }

  async findById(id: string): Promise<Session | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) }) as Session | null;
  }

  async create(sessionData: Omit<Session, '_id'>): Promise<Session> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(sessionData);
    return { ...sessionData, _id: result.insertedId } as Session;
  }

  async findByMentorId(mentorId: string, options: {
    status?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{ items: Session[]; total: number }> {
    const collection = await this.getCollection();
    
    const filter: any = { mentorId: new ObjectId(mentorId) };
    if (options.status) {
      filter.status = options.status;
    }

    const [items, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ scheduledAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 10)
        .toArray() as Promise<Session[]>,
      collection.countDocuments(filter)
    ]);

    return { items, total };
  }

  async findByStudentId(studentId: string, options: {
    status?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{ items: Session[]; total: number }> {
    const collection = await this.getCollection();
    
    const filter: any = { studentId: new ObjectId(studentId) };
    if (options.status) {
      filter.status = options.status;
    }

    const [items, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ scheduledAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 10)
        .toArray() as Promise<Session[]>,
      collection.countDocuments(filter)
    ]);

    return { items, total };
  }

  async updateSessionStatus(
    id: string, 
    status: string, 
    additionalData: any = {}
  ): Promise<Session | null> {
    const collection = await this.getCollection();
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          ...additionalData,
          updatedAt: new Date() 
        } 
      }
    );

    return await this.findById(id);
  }

  async findUpcoming(limit: number = 10): Promise<Session[]> {
    const collection = await this.getCollection();
    return await collection
      .find({
        status: 'scheduled',
        scheduledAt: { $gte: new Date() }
      })
      .sort({ scheduledAt: 1 })
      .limit(limit)
      .toArray() as Session[];
  }
}