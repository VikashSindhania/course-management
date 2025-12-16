'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  _count: {
    lessons: number
    enrollments: number
  }
}

interface Enrollment {
  id: string
  progress: number
  completed: boolean
  course: Course & {
    author: {
      name: string
    }
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, enrollmentsRes, recommendationsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/enrollments'),
        fetch('/api/ai/recommendations'),
      ])

      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData.user)
      } else {
        router.push('/login')
        return
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json()
        setEnrollments(enrollmentsData.enrollments)
      }

      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json()
        setRecommendations(recommendationsData.recommendations || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome back, {user?.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Enrolled Courses
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {enrollments.length}
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Completed
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {enrollments.filter((e) => e.completed).length}
            </p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {enrollments.filter((e) => !e.completed).length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            {enrollments.length === 0 ? (
              <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {enrollment.course.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Progress: {enrollment.progress}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        href={`/courses/${enrollment.course.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-600">No recommendations available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {course.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{course.category}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>{course.duration} hours</span>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Course
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

