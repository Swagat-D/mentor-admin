﻿# MentorMatch Admin Dashboard

## Quick Start Guide for Windows

### Prerequisites
- Node.js 18+ (Download from https://nodejs.org/)
- MongoDB 6+ (Download from https://www.mongodb.com/try/download/community)

### Setup Steps

1. **Start MongoDB**
   ```powershell
   # Option 1: If MongoDB is installed as service
   net start mongodb

   # Option 2: Start manually
   mongod
   ```

2. **Install Dependencies** (Already done by setup script)
   ```powershell
   npm install
   ```

3. **Setup Database**
   ```powershell
   npm run setup-db
   ```

4. **Create Admin User**
   ```powershell
   npm run setup-admin
   ```

5. **Start Development Server**
   ```powershell
   npm run dev
   ```

6. **Login to Admin Dashboard**
   - URL: http://localhost:3000/admin/login
   - Email: admin@mentormatch.com
   - Password: Admin123!
   - ⚠️ Change password after first login!

### Project Structure
```
mentormatch-admin/
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin routes
│   ├── api/admin/         # Admin API endpoints
│   └── globals.css        # Global styles
├── components/admin/      # Admin components
├── lib/                   # Utilities and services
│   ├── auth/             # Authentication utilities
│   ├── database/         # Database models and repositories
│   ├── services/         # Business logic services
│   └── utils/            # Helper functions
├── types/                # TypeScript type definitions
└── scripts/              # Setup and utility scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-admin` - Create admin user
- `npm run setup-db` - Setup database indexes

### Environment Variables
Check `.env.local` file and update as needed:
- MongoDB connection string
- JWT secrets (IMPORTANT: Change in production!)
- Email configuration
- Other app settings

### Next Steps
1. Copy component code from the provided artifacts
2. Test admin login functionality
3. Customize as needed for your requirements
4. Deploy to production when ready

### Troubleshooting
- Ensure MongoDB is running before starting the app
- Check environment variables in `.env.local`
- Verify Node.js version: `node --version`
- Check MongoDB connection: Try connecting with MongoDB Compass

### Support
For questions or issues, refer to the project documentation or contact the development team.
#   m e n t o r - a d m i n  
 