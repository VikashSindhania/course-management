import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'
import Lesson from '@/lib/models/Lesson'
import Enrollment from '@/lib/models/Enrollment'
import { getCurrentUser } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const course = await Course.findById(id)
      .populate('authorId', 'name email')
      .lean()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lessons = await Lesson.find({ courseId: new mongoose.Types.ObjectId(id) })
      .sort({ order: 1 })
      .lean()

    const enrollmentsCount = await Enrollment.countDocuments({
      courseId: new mongoose.Types.ObjectId(id),
    })

    // Type assertion for populated authorId
    const courseWithAuthor = course as any
    const author = courseWithAuthor.authorId as any

    const courseData = {
      ...courseWithAuthor,
      id: courseWithAuthor._id.toString(),
      author: {
        id: author._id?.toString() || author.toString(),
        name: author.name || '',
        email: author.email || '',
      },
      authorId: author._id?.toString() || author.toString(),
      lessons: lessons.map((lesson: any) => ({
        ...lesson,
        id: lesson._id.toString(),
        courseId: lesson.courseId.toString(),
      })),
      _count: {
        enrollments: enrollmentsCount,
      },
    }

    return NextResponse.json({ course: courseData }, { status: 200 })
  } catch (error) {
    console.error('Get course error:', error)
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
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const course = await Course.findById(id)

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.authorId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only edit your own courses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = courseSchema.parse(body)

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        imageUrl: validatedData.imageUrl || undefined,
      },
      { new: true }
    ).populate('authorId', 'name email')

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const updatedCourseObj = updatedCourse.toObject() as any
    const updatedAuthor = updatedCourseObj.authorId as any

    return NextResponse.json(
      {
        course: {
          ...updatedCourseObj,
          id: updatedCourseObj._id.toString(),
          author: {
            id: updatedAuthor._id?.toString() || updatedAuthor.toString(),
            name: updatedAuthor.name || '',
            email: updatedAuthor.email || '',
          },
          authorId: updatedAuthor._id?.toString() || updatedAuthor.toString(),
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

    console.error('Update course error:', error)
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
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const course = await Course.findById(id)

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.authorId.toString() !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You can only delete your own courses' },
        { status: 403 }
      )
    }

    await Course.findByIdAndDelete(id)
    await Lesson.deleteMany({ courseId: new mongoose.Types.ObjectId(id) })

    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
