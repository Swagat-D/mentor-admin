// app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { BcryptUtil } from '@/lib/utils/bcrypt';
import { JWTUtil } from '@/lib/auth/jwt';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = adminLoginSchema.parse(body);

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find admin user
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      role: 'admin',
      isActive: true,
      isVerified: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials or insufficient permissions' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await BcryptUtil.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokens = JWTUtil.generateTokens({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        tokens
      }
    });

    // Set HTTP-only cookies
    response.cookies.set('adminAccessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('adminRefreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Admin login error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.errors.map((e: any) => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/admin/stats/route.ts
