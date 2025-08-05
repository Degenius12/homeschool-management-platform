'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, PlusCircle, CheckCircle, FileText, Edit3, Trash2, Filter } from 'lucide-react'

interface Subject {
  id: string
  name: string
  description?: string
  grade: string
  curriculum: string
  schoolYearId: string
}

interface Lesson {
  id: string
  title: string
  description?: string
  lessonNumber?: number
  estimatedHours: number
  subjectId: string
}

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: string
  maxPoints: number
  type: 'homework' | 'quiz' | 'test' | 'project'
  status: 'draft' | 'assigned' | 'completed'
  subjectId: string
  lessonId?: string
}

export default function CurriculumPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const subjectsResponse = await fetch('/api/subjects')
        const lessonsResponse = await fetch('/api/lessons')
        const assignmentsResponse = await fetch('/api/assignments')
        if (subjectsResponse.ok) {
          setSubjects(await subjectsResponse.json())
        }
        if (lessonsResponse.ok) {
          setLessons(await lessonsResponse.json())
        }
        if (assignmentsResponse.ok) {
          setAssignments(await assignmentsResponse.json())
        }
      } catch (error) {
        console.error('Failed to load curriculum data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete "${subjectName}"? This will also delete all associated lessons and assignments.`)) {
      return
    }

    setDeleteLoading(subjectId)
    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSubjects(prev => prev.filter(subject => subject.id !== subjectId))
      } else {
        alert('Failed to delete subject. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      alert('Failed to delete subject. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Get unique grades from subjects
  const availableGrades = Array.from(new Set(subjects.map(subject => subject.grade))).sort()
  
  // Filter subjects by selected grade
  const filteredSubjects = selectedGrade === 'all' 
    ? subjects 
    : subjects.filter(subject => subject.grade === selectedGrade)

  // Group subjects by grade for organized display
  const subjectsByGrade = subjects.reduce((acc, subject) => {
    const grade = subject.grade
    if (!acc[grade]) {
      acc[grade] = []
    }
    acc[grade].push(subject)
    return acc
  }, {} as Record<string, Subject[]>)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl shadow-lg border p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Curriculum Management</h1>
        <p className="text-green-100 text-lg">
          Plan lessons, track progress, and manage educational resources organized by grade level
        </p>
        <p className="text-green-200 text-sm mt-2">
          💡 A setup wizard for student information and preferences can declutter this view.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Subjects ({selectedGrade === 'all' ? subjects.length : filteredSubjects.length})
              {selectedGrade !== 'all' && (
                <span className="text-sm font-normal text-blue-600 ml-2">for {selectedGrade}</span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Select a grade to view specific subjects or see all organized by grade</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Grade Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-w-32"
              >
                <option value="all">📚 All Grades</option>
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>📖 {grade}</option>
                ))}
              </select>
              {selectedGrade !== 'all' && (
                <button
                  onClick={() => setSelectedGrade('all')}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                  title="Clear filter and show all grades"
                >
                  Clear
                </button>
              )}
            </div>
            <Link 
              href="/curriculum/subjects/new" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Subject
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      {subjects.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Yet</h3>
            <p className="text-gray-500 mb-4">Start adding subjects to plan your curriculum by grade level</p>
            <Link 
              href="/curriculum/subjects/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Your First Subject
            </Link>
          </div>
        </div>
      ) : selectedGrade === 'all' ? (
        /* Show organized by grade */
        <div className="space-y-6">
          {Object.entries(subjectsByGrade).sort().map(([grade, gradeSubjects]) => (
            <div key={grade} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">{grade}</h3>
                <p className="text-sm text-gray-600">{gradeSubjects.length} subjects</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {gradeSubjects.map((subject) => (
                    <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              {subject.curriculum === 'TGTB' ? 'TGTB' : subject.curriculum}
                            </span>
                            <span>{subject.grade}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          disabled={deleteLoading === subject.id}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete subject"
                        >
                          {deleteLoading === subject.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {subject.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subject.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/curriculum/subjects/${subject.id}`} 
                          className="inline-flex items-center text-green-700 hover:text-green-900 font-medium text-sm"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Manage Lessons
                        </Link>
                        <span className="text-xs text-gray-500">
                          {lessons.filter(l => l.subjectId === subject.id).length} lessons
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Show filtered by selected grade */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">{selectedGrade}</h3>
            <p className="text-sm text-gray-600">{filteredSubjects.length} subjects</p>
          </div>
          <div className="p-6">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects for {selectedGrade}</h3>
                <p className="text-gray-500 mb-4">Add subjects for this grade level to get started</p>
                <Link 
                  href="/curriculum/subjects/new"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Subject for {selectedGrade}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            {subject.curriculum === 'TGTB' ? 'TGTB' : subject.curriculum}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                        disabled={deleteLoading === subject.id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete subject"
                      >
                        {deleteLoading === subject.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {subject.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subject.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/curriculum/subjects/${subject.id}`} 
                        className="inline-flex items-center text-green-700 hover:text-green-900 font-medium text-sm"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Manage Lessons
                      </Link>
                      <span className="text-xs text-gray-500">
                        {lessons.filter(l => l.subjectId === subject.id).length} lessons
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
