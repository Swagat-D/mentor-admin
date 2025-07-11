import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const mentorProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  location: z.string().min(1, 'Location is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startYear: z.number(),
    endYear: z.number().optional(),
  })).optional(),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
  })).optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional(),
  }).optional(),
})

export const sessionSchema = z.object({
  mentorId: z.string(),
  subject: z.string().min(1, 'Subject is required'),
  scheduledAt: z.string(),
  duration: z.number().min(30).max(180),
  type: z.enum(['video', 'audio', 'chat']),
  notes: z.string().optional(),
})