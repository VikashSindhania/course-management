import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Enrollment from '@/lib/models/Enrollment'
import Course from '@/lib/models/Course'
import Lesson from '@/lib/models/Lesson'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    // Check if course exists
    const course = await Course.findById(courseId)

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(user.id),
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    const enrollment = await Enrollment.create({
      userId: new mongoose.Types.ObjectId(user.id),
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    await enrollment.populate('courseId')

    return NextResponse.json(
      {
        enrollment: {
          ...enrollment.toObject(),
          id: enrollment._id.toString(),
          userId: enrollment.userId.toString(),
          courseId: enrollment.courseId._id.toString(),
          course: {
            ...enrollment.courseId.toObject(),
            id: enrollment.courseId._id.toString(),
          },
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    console.error('Enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enrollments = await Enrollment.find({
      userId: new mongoose.Types.ObjectId(user.id),
    })
      .populate({
        path: 'courseId',
        populate: {
          path: 'authorId',
          select: 'name',
        },
      })
      .sort({ enrolledAt: -1 })
      .lean()

    const enrollmentsData = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const lessonsCount = await Lesson.countDocuments({
          courseId: enrollment.courseId._id,
        })

        return {
          ...enrollment,
          id: enrollment._id.toString(),
          userId: enrollment.userId.toString(),
          courseId: enrollment.courseId._id.toString(),
          course: {
            ...enrollment.courseId,
            id: enrollment.courseId._id.toString(),
            authorId: enrollment.courseId.authorId._id.toString(),
            author: {
              id: enrollment.courseId.authorId._id.toString(),
              name: enrollment.courseId.authorId.name,
            },
            _count: {
              lessons: lessonsCount,
            },
          },
        }
      })
    )

    return NextResponse.json({ enrollments: enrollmentsData }, { status: 200 })
  } catch (error) {
    console.error('Get enrollments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
