const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function setupAdmin() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentormatch';
  const dbName = process.env.MONGODB_DB_NAME || 'mentormatch';
  
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@mentormatch.com';
    const adminPassword = 'Admin123!'; // Change this!
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = {
      email: adminEmail,
      passwordHash,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  IMPORTANT: Change password after first login!');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

setupAdmin();
