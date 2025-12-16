import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'
import Lesson from '@/lib/models/Lesson'
import Enrollment from '@/lib/models/Enrollment'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')

    const query: any = {}
    if (category) query.category = category
    if (level) query.level = level
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const courses = await Course.find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    // Get counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course: any) => {
        const lessonsCount = await Lesson.countDocuments({ courseId: course._id })
        const enrollmentsCount = await Enrollment.countDocuments({ courseId: course._id })
        
        return {
          ...course,
          id: course._id.toString(),
          author: {
            id: course.authorId._id.toString(),
            name: course.authorId.name,
            email: course.authorId.email,
          },
          authorId: course.authorId._id.toString(),
          _count: {
            lessons: lessonsCount,
            enrollments: enrollmentsCount,
          },
        }
      })
    )

    return NextResponse.json({ courses: coursesWithCounts }, { status: 200 })
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only instructors and admins can create courses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = courseSchema.parse(body)

    const course = await Course.create({
      ...validatedData,
      authorId: new mongoose.Types.ObjectId(user.id),
      imageUrl: validatedData.imageUrl || undefined,
    })

    await course.populate('authorId', 'name email')

    return NextResponse.json(
      {
        course: {
          ...course.toObject(),
          id: course._id.toString(),
          author: {
            id: course.authorId._id.toString(),
            name: course.authorId.name,
            email: course.authorId.email,
          },
          authorId: course.authorId._id.toString(),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

