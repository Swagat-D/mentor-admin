import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

export class UploadService {
  private static readonly UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  private static readonly ALLOWED_TYPES = {
    profile: ['image/jpeg', 'image/png', 'image/webp'],
    document: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    video: ['video/mp4', 'video/webm', 'video/quicktime']
  };

  static async uploadFile(
    file: File, 
    userId: string, 
    type: 'profile' | 'document' | 'video' = 'document'
  ): Promise<{
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    path: string;
  }> {
    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Validate file type
    if (!this.ALLOWED_TYPES[type].includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed for ${type} uploads`);
    }

    // Generate unique filename
    const extension = file.name.split('.').pop() || '';
    const filename = `${userId}_${Date.now()}_${randomBytes(8).toString('hex')}.${extension}`;
    
    // Create upload directory structure
    const typeDir = join(this.UPLOAD_DIR, type);
    const userDir = join(typeDir, userId);
    
    try {
      await mkdir(userDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    const filePath = join(userDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${type}/${userId}/${filename}`;

    return {
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      url,
      path: filePath
    };
  }

  static generateSignedUrl(path: string, expiresIn: number = 3600): string {
    // In a real application, you would generate a signed URL for secure access
    // For now, return the direct path
    return path;
  }

  static async deleteFile(path: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.unlink(path);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}