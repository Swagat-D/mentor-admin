// app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { BcryptUtil } from '@/lib/utils/bcrypt';
import { JWTUtil } from '@/lib/auth/jwt';
import { EmailService } from '@/lib/services/email.service';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const adminOTPVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step } = body;

    if (step === 'verify-otp') {
      return await verifyOTP(req, body);
    } else {
      return await initiateLogin(req, body);
    }

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

async function initiateLogin(req: NextRequest, body: any) {
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

  // Generate OTP
  const otp = Math.random().toString().slice(2, 8).padStart(6, '0');
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to database
  await usersCollection.updateOne(
    { _id: user._id },
    { 
      $set: { 
        adminOTP: otp,
        adminOTPExpires: otpExpires,
        updatedAt: new Date()
      } 
    }
  );

  // Send OTP email
  try {
    await EmailService.sendAdminOTPEmail(user.email, otp, user.firstName);
  } catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP email. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'OTP sent to your email',
    data: {
      step: 'otp-verification',
      email: email
    }
  });
}

async function verifyOTP(req: NextRequest, body: any) {
  const { email, otp } = adminOTPVerifySchema.parse(body);

  const { db } = await connectToDatabase();
  const usersCollection = db.collection('users');

  // Find admin user with valid OTP
  const user = await usersCollection.findOne({
    email: email.toLowerCase(),
    role: 'admin',
    isActive: true,
    isVerified: true,
    adminOTP: otp,
    adminOTPExpires: { $gt: new Date() }
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired OTP' },
      { status: 401 }
    );
  }

  // Clear OTP
  await usersCollection.updateOne(
    { _id: user._id },
    { 
      $unset: { 
        adminOTP: 1,
        adminOTPExpires: 1
      },
      $set: {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    }
  );

  // Generate tokens
  const tokens = JWTUtil.generateTokens({
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
  });

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
}