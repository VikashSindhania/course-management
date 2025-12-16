import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
})

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructor: z.string().min(2, 'Instructor name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  duration: z.number().int().positive('Duration must be a positive number'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  order: z.number().int().positive('Order must be a positive number'),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  duration: z.number().int().positive('Duration must be a positive number'),
  courseId: z.string().min(1, 'Course ID is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type LessonInput = z.infer<typeof lessonSchema>

