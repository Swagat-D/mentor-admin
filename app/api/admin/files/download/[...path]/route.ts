// app/api/admin/files/download/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminAuthenticatedRequest } from '@/lib/auth/adminMiddleware';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/database/connection';

export const GET = withAdminAuth(async (req: AdminAuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Extract the file path after /api/admin/files/download/
    const downloadIndex = pathSegments.indexOf('download');
    if (downloadIndex === -1 || downloadIndex === pathSegments.length - 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid file path' },
        { status: 400 }
      );
    }
    
    const filePath = pathSegments.slice(downloadIndex + 1).join('/');
    
    if (!filePath) {
      return NextResponse.json(
        { success: false, message: 'File path is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to download file:', filePath);

    // Security: Validate that the file belongs to a verification document
    const { db } = await connectToDatabase();
    const verificationsCollection = db.collection('mentorVerifications');
    
    // Check if file exists in any verification - more flexible matching
    const verification = await verificationsCollection.findOne({
      $or: [
        { 'documents.fileUrl': { $regex: filePath.replace(/\\/g, '/') } },
        { 'documents.fileUrl': `/${filePath}` },
        { 'documents.fileUrl': `/uploads/${filePath}` }
      ]
    });

    if (!verification) {
      console.log('File not found in verifications, checking direct path...');
      
      // For development/testing, also check if it's a valid upload path
      if (!filePath.includes('uploads/')) {
        return NextResponse.json(
          { success: false, message: 'File not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Try multiple possible file paths
    const possiblePaths = [
      join(process.cwd(), 'public', filePath),
      join(process.cwd(), 'public', 'uploads', filePath),
      join(process.cwd(), 'public', filePath.replace('uploads/', '')),
    ];

    let fullPath = '';
    let fileExists = false;

    for (const path of possiblePaths) {
      try {
        await access(path);
        fullPath = path;
        fileExists = true;
        break;
      } catch {
        continue;
      }
    }

    if (!fileExists) {
      console.log('File not found at any of these paths:', possiblePaths);
      return NextResponse.json(
        { success: false, message: 'File not found on server' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(fullPath);
    
    // Get file info
    const fileName = filePath.split('/').pop() || 'document';
    const mimeType = getMimeType(fileName);

    console.log('File downloaded successfully:', fileName);

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('File download error:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
});

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}