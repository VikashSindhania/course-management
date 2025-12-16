import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Course from '@/lib/models/Course'
import Enrollment from '@/lib/models/Enrollment'
import Lesson from '@/lib/models/Lesson'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mongoose from 'mongoose'

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!genAI || !process.env.GEMINI_API_KEY) {
      // Fallback: return courses based on user's enrollment history
      const enrollments = await Enrollment.find({
        userId: new mongoose.Types.ObjectId(user.id),
      })
        .populate('courseId')
        .lean()

      const categories = enrollments.map((e: any) => e.courseId.category)
      const mostCommonCategory =
        categories.length > 0
          ? categories.sort(
              (a, b) =>
                categories.filter((v) => v === a).length -
                categories.filter((v) => v === b).length
            )[categories.length - 1]
          : null

      const enrolledCourseIds = enrollments.map((e: any) => e.courseId._id)

      const query: any = {}
      if (mostCommonCategory) {
        query.category = mostCommonCategory
        query._id = { $nin: enrolledCourseIds }
      } else {
        query._id = { $nin: enrolledCourseIds }
      }

      const courses = await Course.find(query)
        .populate('authorId', 'name')
        .limit(5)
        .lean()

      const recommendations = await Promise.all(
        courses.map(async (course: any) => {
          const lessonsCount = await Lesson.countDocuments({ courseId: course._id })
          const enrollmentsCount = await Enrollment.countDocuments({ courseId: course._id })

          return {
            ...course,
            id: course._id.toString(),
            authorId: course.authorId._id.toString(),
            author: {
              id: course.authorId._id.toString(),
              name: course.authorId.name,
            },
            _count: {
              lessons: lessonsCount,
              enrollments: enrollmentsCount,
            },
          }
        })
      )

      return NextResponse.json({ recommendations }, { status: 200 })
    }

    // Get user's enrollment history
    const enrollments = await Enrollment.find({
      userId: new mongoose.Types.ObjectId(user.id),
    })
      .populate('courseId')
      .lean()

    const userInterests = enrollments
      .map((e: any) => e.courseId.category)
      .join(', ')

    // Get all available courses
    const allCourses = await Course.find()
      .populate('authorId', 'name')
      .lean()

    const coursesWithCounts = await Promise.all(
      allCourses.map(async (course: any) => {
        const lessonsCount = await Lesson.countDocuments({ courseId: course._id })
        const enrollmentsCount = await Enrollment.countDocuments({ courseId: course._id })

        const author = course.authorId as any

        return {
          ...course,
          id: course._id.toString(),
          authorId: author._id?.toString() || author.toString(),
          author: {
            id: author._id?.toString() || author.toString(),
            name: author.name || '',
          },
          _count: {
            lessons: lessonsCount,
            enrollments: enrollmentsCount,
          },
        }
      })
    )

    const courseDescriptions = coursesWithCounts
      .map(
        (c) =>
          `ID: ${c.id}, Title: ${c.title}, Category: ${c.category}, Level: ${c.level}, Description: ${c.description}`
      )
      .join('\n')

    const prompt = `Based on the user's interests in: ${userInterests || 'general learning'}, recommend 5 courses from the following list. Return only the course IDs in a JSON array format like ["id1", "id2", "id3", "id4", "id5"]:

${courseDescriptions}`

    try {
      if (!genAI) {
        throw new Error('Gemini not configured')
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const responseText = response.text() || '[]'

      // Extract JSON array from response (handle markdown code blocks if present)
      let recommendedIds: string[] = []
      try {
        // Remove markdown code blocks if present
        const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        // Try to find JSON array pattern (works across multiple lines)
        const jsonMatch = cleanedText.match(/\[[\s\S]*?\]/)
        if (jsonMatch) {
          recommendedIds = JSON.parse(jsonMatch[0])
        } else {
          recommendedIds = JSON.parse(cleanedText)
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError)
        // Fallback to simple recommendation
        throw new Error('Failed to parse response')
      }

      const recommendations = coursesWithCounts.filter((c) =>
        recommendedIds.includes(c.id)
      )

      return NextResponse.json({ recommendations }, { status: 200 })
    } catch (aiError) {
      console.error('AI recommendation error:', aiError)
      // Fallback to simple recommendation
      const enrolledCourseIds = enrollments.map((e: any) => e.courseId._id)

      const courses = await Course.find({
        _id: { $nin: enrolledCourseIds },
      })
        .populate('authorId', 'name')
        .limit(5)
        .lean()

      const recommendations = await Promise.all(
        courses.map(async (course: any) => {
          const lessonsCount = await Lesson.countDocuments({ courseId: course._id })
          const enrollmentsCount = await Enrollment.countDocuments({ courseId: course._id })

          const author = course.authorId as any

          return {
            ...course,
            id: course._id.toString(),
            authorId: author._id?.toString() || author.toString(),
            author: {
              id: author._id?.toString() || author.toString(),
              name: author.name || '',
            },
            _count: {
              lessons: lessonsCount,
              enrollments: enrollmentsCount,
            },
          }
        })
      )

      return NextResponse.json({ recommendations }, { status: 200 })
    }
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
