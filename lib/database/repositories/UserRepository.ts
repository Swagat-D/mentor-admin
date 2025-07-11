import { connectToDatabase } from '../connection';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: 'admin' | 'mentor' | 'student';
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isActive: boolean;
  otpCode?: string;
  otpExpires?: Date;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export class UserRepository {
  private async getCollection() {
    const { db } = await connectToDatabase();
    return db.collection('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email: email.toLowerCase() }) as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) }) as User | null;
  }

  async create(userData: Omit<User, '_id'>): Promise<User> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(userData);
    return { ...userData, _id: result.insertedId } as User;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return await this.findById(id);
  }

  async updateLastLogin(id: ObjectId): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );
  }

  async findMany(filter: any = {}, options: any = {}): Promise<User[]> {
    const collection = await this.getCollection();
    const query = collection.find(filter);
    
    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    
    return await query.toArray() as User[];
  }

  async countDocuments(filter: any = {}): Promise<number> {
    const collection = await this.getCollection();
    return await collection.countDocuments(filter);
  }
}