const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentormatch';
  const dbName = process.env.MONGODB_DB_NAME || 'mentormatch';
  
  console.log('🔗 Setting up database indexes...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Create indexes for users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });

    // Create indexes for mentor profiles
    await db.collection('mentorProfiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('mentorProfiles').createIndex({ expertise: 1 });
    await db.collection('mentorProfiles').createIndex({ isProfileComplete: 1 });

    // Create indexes for sessions
    await db.collection('sessions').createIndex({ mentorId: 1 });
    await db.collection('sessions').createIndex({ studentId: 1 });
    await db.collection('sessions').createIndex({ scheduledAt: -1 });
    await db.collection('sessions').createIndex({ status: 1 });

    // Create indexes for verifications
    await db.collection('mentorVerifications').createIndex({ userId: 1 }, { unique: true });
    await db.collection('mentorVerifications').createIndex({ status: 1 });
    await db.collection('mentorVerifications').createIndex({ createdAt: -1 });

    console.log('✅ Database indexes created successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    await client.close();
  }
}

setupDatabase();
