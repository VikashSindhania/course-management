import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Enrollment from '@/lib/models/Enrollment'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)
    const { courseId } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await Enrollment.deleteMany({
      userId: new mongoose.Types.ObjectId(user.id),
      courseId: new mongoose.Types.ObjectId(courseId),
    })

    return NextResponse.json(
      { message: 'Unenrolled successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unenroll error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

