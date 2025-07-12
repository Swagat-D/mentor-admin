// scripts/add-admin-otp-fields.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function addAdminOTPFields() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentormatch';
  const dbName = process.env.MONGODB_DB_NAME || 'mentormatch';
  
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Add indexes for OTP fields
    await usersCollection.createIndex({ adminOTP: 1 });
    await usersCollection.createIndex({ adminOTPExpires: 1 });

    console.log('✅ Admin OTP indexes created successfully!');
    console.log('📝 Note: OTP fields will be added automatically when first OTP is generated');

  } catch (error) {
    console.error('❌ Error updating database:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

addAdminOTPFields();