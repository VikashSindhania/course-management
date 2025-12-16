'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  duration: number
  imageUrl?: string
  author: {
    id: string
    name: string
  }
  lessons: Lesson[]
  _count: {
    enrollments: number
  }
}

interface Lesson {
  id: string
  title: string
  content: string
  order: number
  duration: number
  videoUrl?: string
}

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [user, setUser] = useState<any>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      const [courseRes, userRes, enrollmentsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch('/api/auth/me'),
        fetch('/api/enrollments'),
      ])

      if (courseRes.ok) {
        const courseData = await courseRes.json()
        setCourse(courseData.course)
      }

      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData.user)
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json()
        const isEnrolled = enrollmentsData.enrollments.some(
          (e: any) => e.courseId === courseId
        )
        setEnrolled(isEnrolled)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      if (response.ok) {
        setEnrolled(true)
        alert('Successfully enrolled in course!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to enroll')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  const canEdit = user && (user.role === 'ADMIN' || course?.author.id === user.id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/courses" className="text-blue-600 hover:underline">
            ← Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
              </div>
              {canEdit && (
                <Link
                  href={`/courses/${courseId}/edit`}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit Course
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {course.level}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {course.duration} hours
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                {course._count.enrollments} students
              </span>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p className="text-gray-700">
                <strong>Author:</strong> {course.author.name}
              </p>
            </div>

            {user && !enrolled && (
              <button
                onClick={handleEnroll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
              >
                Enroll in Course
              </button>
            )}

            {enrolled && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                You are enrolled in this course!
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">Lessons ({course.lessons.length})</h2>
              {course.lessons.length === 0 ? (
                <p className="text-gray-600">No lessons available yet.</p>
              ) : (
                <div className="space-y-4">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            Lesson {lesson.order}: {lesson.title}
                          </h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">
                            {lesson.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{lesson.duration} minutes</span>
                            {lesson.videoUrl && (
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Watch Video
                              </a>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                          <Link
                            href={`/courses/${courseId}/lessons/${lesson.id}/edit`}
                            className="ml-4 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {canEdit && (
                <Link
                  href={`/courses/${courseId}/lessons/new`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Lesson
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

