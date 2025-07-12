const { MongoClient, ObjectId } = require('mongodb');
const { writeFile, mkdir } = require('fs/promises');
const { join } = require('path');
require('dotenv').config({ path: '.env.local' });

async function createTestFiles() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentormatch';
  const dbName = process.env.MONGODB_DB_NAME || 'mentormatch';
  
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Create test directories
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'document');
    await mkdir(uploadDir, { recursive: true });
    
    // Create a test file
    const testContent = 'This is a test document for mentor verification.\n\nCreated for testing file download functionality.';
    const fileName = 'test-document.txt';
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, testContent);
    console.log('✅ Test file created:', filePath);
    
    // Find a test verification or create one
    const verificationsCollection = db.collection('mentorVerifications');
    const usersCollection = db.collection('users');
    
    // Find an admin user first
    const adminUser = await usersCollection.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    // Create or update a test verification
    const testUserId = new ObjectId();
    const testVerification = {
      _id: new ObjectId(),
      userId: testUserId,
      status: 'pending',
      documents: [
        {
          id: 'test-doc-1',
          type: 'identity_proof',
          fileName: fileName,
          fileUrl: `/uploads/document/${fileName}`,
          status: 'pending',
          uploadedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(),
      submittedAt: new Date()
    };
    
    await verificationsCollection.insertOne(testVerification);
    console.log('✅ Test verification created with document');
    
    // Create test user
    const testUser = {
      _id: testUserId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'mentor',
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(testUser);
    console.log('✅ Test user created');
    
    console.log('\n📋 Test Data Summary:');
    console.log('- Verification ID:', testVerification._id.toString());
    console.log('- File URL:', `/uploads/document/${fileName}`);
    console.log('- Download URL:', `/api/admin/files/download/document/${fileName}`);
    
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

createTestFiles();