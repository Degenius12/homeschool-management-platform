'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, BookOpen, Clock, FileText, Users, TrendingUp, Target, BarChart3, Calendar, Award } from 'lucide-react'

interface Subject {
  id: string
  name: string
  description?: string
  grade: string
  curriculum: string
  schoolYear: {
    id: string
    year: string
  }
  _count: {
    lessons: number
    assignments: number
  }
}

interface Lesson {
  id: string
  title: string
  description?: string
  lessonNumber?: number
  estimatedHours: number
  subjectId: string
  _count: {
    assignments: number
  }
}

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: string
  maxPoints: number
  type: 'homework' | 'quiz' | 'test' | 'project'
  status: 'draft' | 'assigned' | 'completed'
  lesson?: {
    id: string
    title: string
    lessonNumber?: number
  }
  grades: {
    id: string
    percentage?: number
    letterGrade?: string
    student: {
      id: string
      firstName: string
      lastName: string
    }
  }[]
}

interface StudentPerformance {
  studentId: string
  firstName: string
  lastName: string
  grade: string
  averageGrade: number
  completedAssignments: number
  totalAssignments: number
  recentGrades: {
    id: string
    percentage?: number
    letterGrade?: string
    assignment: {
      title: string
      type: string
    }
    gradedDate: string
  }[]
}

export default function SubjectDetailPage() {
  const params = useParams()
  const subjectId = params.id as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'lessons' | 'assignments' | 'performance' | 'progress'>('lessons')
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessonNumber: '',
    estimatedHours: '1.0'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subject details
        const subjectResponse = await fetch(`/api/subjects/${subjectId}`)
        if (subjectResponse.ok) {
          setSubject(await subjectResponse.json())
        }

        // Fetch lessons for this subject
        const lessonsResponse = await fetch(`/api/lessons?subjectId=${subjectId}`)
        if (lessonsResponse.ok) {
          setLessons(await lessonsResponse.json())
        }

        // Fetch assignments for this subject
        const assignmentsResponse = await fetch(`/api/assignments?subjectId=${subjectId}`)
        if (assignmentsResponse.ok) {
          setAssignments(await assignmentsResponse.json())
        }

        // Fetch student performance data
        const performanceResponse = await fetch(`/api/subjects/${subjectId}/performance`)
        if (performanceResponse.ok) {
          setStudentPerformance(await performanceResponse.json())
        }
      } catch (error) {
        console.error('Failed to fetch subject data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [subjectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          subjectId
        })
      })

      if (response.ok) {
        const newLesson = await response.json()
        setLessons(prev => [...prev, newLesson])
        setFormData({
          title: '',
          description: '',
          lessonNumber: '',
          estimatedHours: '1.0'
        })
        setShowLessonForm(false)
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subject Not Found</h3>
            <p className="text-gray-500 mb-4">The requested subject could not be found.</p>
            <Link 
              href="/curriculum"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Curriculum
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/curriculum"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Curriculum
        </Link>
      </div>

      {/* Subject Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl shadow-lg border p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">{subject.name}</h1>
        <div className="flex items-center gap-4 text-green-100">
          <span className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {subject.grade}
          </span>
          <span className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {subject.curriculum === 'TGTB' ? 'The Good and the Beautiful' : subject.curriculum}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {subject.schoolYear.year}
          </span>
        </div>
        {subject.description && (
          <p className="text-green-100 mt-3">{subject.description}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{subject._count.assignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Est. Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {lessons.reduce((total, lesson) => total + lesson.estimatedHours, 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'lessons', label: 'Lessons', icon: BookOpen },
              { key: 'assignments', label: 'Assignments', icon: FileText },
              { key: 'performance', label: 'Performance', icon: TrendingUp },
              { key: 'progress', label: 'Progress', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Lessons ({lessons.length})</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage lessons for this subject</p>
                </div>
                <button
                  onClick={() => setShowLessonForm(!showLessonForm)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </button>
              </div>

              {/* Add Lesson Form */}
          {showLessonForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Lesson</h3>
              <form onSubmit={handleSubmitLesson} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Introduction to Fractions"
                    />
                  </div>
                  <div>
                    <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Number
                    </label>
                    <input
                      type="number"
                      id="lessonNumber"
                      name="lessonNumber"
                      value={formData.lessonNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of this lesson"
                  />
                </div>
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowLessonForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Lesson
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lessons List */}
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No lessons found. Add lessons to start planning your curriculum.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {lesson.lessonNumber && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Lesson {lesson.lessonNumber}
                          </span>
                        )}
                        <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                      </div>
                      {lesson.description && (
                        <p className="text-gray-600 mb-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {lesson.estimatedHours} hours
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {lesson._count.assignments} assignments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Assignment management coming soon...</p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Student performance tracking coming soon...</p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Curriculum progress tracking coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
