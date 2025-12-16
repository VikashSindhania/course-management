import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Lesson from '@/lib/models/Lesson'
import Course from '@/lib/models/Course'
import { getCurrentUser } from '@/lib/auth'
import { lessonSchema } from '@/lib/validations'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('courseId')

    const query: any = {}
    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      query.courseId = new mongoose.Types.ObjectId(courseId)
    }

    const lessons = await Lesson.find(query)
      .populate('courseId', 'title')
      .sort({ order: 1 })
      .lean()

    const lessonsData = lessons.map((lesson: any) => {
      const course = lesson.courseId as any

      return {
        ...lesson,
        id: lesson._id.toString(),
        courseId: course._id?.toString() || course.toString(),
        course: {
          id: course._id?.toString() || course.toString(),
          title: course.title || '',
        },
      }
    })

    return NextResponse.json({ lessons: lessonsData }, { status: 200 })
  } catch (error) {
    console.error('Get lessons error:', error)
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

    const body = await request.json()
    const validatedData = lessonSchema.parse(body)

    if (!mongoose.Types.ObjectId.isValid(validatedData.courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    // Verify course ownership
    const course = await Course.findById(validatedData.courseId)

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.authorId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only add lessons to your own courses' },
        { status: 403 }
      )
    }

    const lesson = await Lesson.create({
      ...validatedData,
      courseId: new mongoose.Types.ObjectId(validatedData.courseId),
      videoUrl: validatedData.videoUrl || undefined,
    })

    await lesson.populate('courseId', 'title')

    const lessonObj = lesson.toObject() as any
    const courseForLesson = lessonObj.courseId as any

    return NextResponse.json(
      {
        lesson: {
          ...lessonObj,
          id: lessonObj._id.toString(),
          courseId: courseForLesson._id?.toString() || courseForLesson.toString(),
          course: {
            id: courseForLesson._id?.toString() || courseForLesson.toString(),
            title: courseForLesson.title || '',
          },
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

    console.error('Create lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
