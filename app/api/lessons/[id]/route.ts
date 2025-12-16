import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Lesson from '@/lib/models/Lesson'
import Course from '@/lib/models/Course'
import { getCurrentUser } from '@/lib/auth'
import { lessonSchema } from '@/lib/validations'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 })
    }

    const lesson = await Lesson.findById(id)
      .populate({
        path: 'courseId',
        populate: {
          path: 'authorId',
          select: 'name email',
        },
      })
      .lean()

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const lessonWithCourse = lesson as any
    const course = lessonWithCourse.courseId as any
    const author = course.authorId as any

    const lessonData = {
      ...lessonWithCourse,
      id: lessonWithCourse._id.toString(),
      courseId: course._id.toString(),
      course: {
        ...course,
        id: course._id.toString(),
        authorId: author._id?.toString() || author.toString(),
        author: {
          id: author._id?.toString() || author.toString(),
          name: author.name || '',
          email: author.email || '',
        },
      },
    }

    return NextResponse.json({ lesson: lessonData }, { status: 200 })
  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 })
    }

    const lesson = await Lesson.findById(id).populate('courseId')

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const course = lesson.courseId as any

    if (course.authorId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only edit lessons in your own courses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = lessonSchema.parse(body)

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        courseId: new mongoose.Types.ObjectId(validatedData.courseId),
        videoUrl: validatedData.videoUrl || undefined,
      },
      { new: true }
    ).populate('courseId', 'title')

    if (!updatedLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        lesson: {
          ...updatedLesson.toObject(),
          id: updatedLesson._id.toString(),
          courseId: updatedLesson.courseId._id.toString(),
          course: {
            id: updatedLesson.courseId._id.toString(),
            title: updatedLesson.courseId.title,
          },
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 })
    }

    const lesson = await Lesson.findById(id).populate('courseId')

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const course = lesson.courseId as any

    if (course.authorId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only delete lessons in your own courses' },
        { status: 403 }
      )
    }

    await Lesson.findByIdAndDelete(id)

    return NextResponse.json(
      { message: 'Lesson deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
