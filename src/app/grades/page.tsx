'use client'

import { useState, useEffect } from 'react'
import { GradeForm } from '@/components/grades/grade-form'
import { GradesList } from '@/components/grades/grades-list'
import { ReportCards } from '@/components/grades/report-cards'
import { AssessmentForm } from '@/components/grades/assessment-form'
import { AssessmentsList } from '@/components/grades/assessments-list'
import { BookOpen, FileCheck, Trophy, Plus } from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
}

interface Grade {
  id: string
  student: Student
  assignment: {
    id: string
    title: string
    type: string
    subject: {
      name: string
    }
  }
  score?: number
  percentage?: number
  letterGrade?: string
  points?: number
  maxPoints?: number
  gradedDate: string
  notes?: string
}

interface Assessment {
  id: string
  student: Student
  type: string
  title: string
  testDate: string
  score?: number
  maxScore?: number
  percentile?: number
  grade: string
  testingYear: string
  notes?: string
}

export default function GradesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'grades' | 'assessments' | 'reports'>('grades')
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)
        
        // Load students
        const studentsResponse = await fetch('/api/students')
        if (!studentsResponse.ok) throw new Error('Failed to load students')
        const studentsData = await studentsResponse.json()
        setStudents(studentsData)

        // Load grades
        const gradesResponse = await fetch('/api/grades')
        if (gradesResponse.ok) {
          const gradesData = await gradesResponse.json()
          setGrades(gradesData)
        }

        // Load assessments
        const assessmentsResponse = await fetch('/api/assessments')
        if (assessmentsResponse.ok) {
          const assessmentsData = await assessmentsResponse.json()
          setAssessments(assessmentsData)
        }

        // Set default selected student
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].id)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data. Please try refreshing the page.')
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  const handleAddGrade = async (gradeData: any) => {
    try {
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData),
      })

      if (!response.ok) throw new Error('Failed to add grade')

      const newGrade = await response.json()
      setGrades(prev => [newGrade, ...prev])
      setShowGradeForm(false)
    } catch (error) {
      console.error('Error adding grade:', error)
      throw error
    }
  }

  const handleAddAssessment = async (assessmentData: any) => {
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
      })

      if (!response.ok) throw new Error('Failed to add assessment')

      const newAssessment = await response.json()
      setAssessments(prev => [newAssessment, ...prev])
      setShowAssessmentForm(false)
    } catch (error) {
      console.error('Error adding assessment:', error)
      throw error
    }
  }

  const handleUpdateGrade = async (gradeId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/grades/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) throw new Error('Failed to update grade')

      const updatedGrade = await response.json()
      setGrades(prev => prev.map(grade => 
        grade.id === gradeId ? updatedGrade : grade
      ))
    } catch (error) {
      console.error('Error updating grade:', error)
      throw error
    }
  }

  const handleDeleteGrade = async (gradeId: string) => {
    try {
      const response = await fetch(`/api/grades/${gradeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete grade')

      setGrades(prev => prev.filter(grade => grade.id !== gradeId))
    } catch (error) {
      console.error('Error deleting grade:', error)
      throw error
    }
  }

  const filteredGrades = selectedStudent 
    ? grades.filter(grade => grade.student.id === selectedStudent)
    : grades

  const filteredAssessments = selectedStudent
    ? assessments.filter(assessment => assessment.student.id === selectedStudent)
    : assessments

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Grades & Testing
        </h1>
        <p className="text-gray-600 mt-2">
          Manage student grades, test scores, and generate report cards
        </p>
      </div>

      {/* Student Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label htmlFor="student-select" className="text-sm font-medium text-gray-700">
              Select Student:
            </label>
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.grade} Grade)
                </option>
              ))}
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'grades'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Grades
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'assessments'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileCheck className="h-4 w-4 inline mr-2" />
              Tests
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="h-4 w-4 inline mr-2" />
              Report Cards
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Assignment Grades</h2>
              <button
                onClick={() => setShowGradeForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Grade</span>
              </button>
            </div>
            
            {showGradeForm && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <GradeForm
                  students={students}
                  selectedStudent={selectedStudent}
                  onAddGrade={handleAddGrade}
                  onCancel={() => setShowGradeForm(false)}
                />
              </div>
            )}

            <GradesList
              grades={filteredGrades}
              onUpdateGrade={handleUpdateGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Scores & Assessments</h2>
              <button
                onClick={() => setShowAssessmentForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Test Score</span>
              </button>
            </div>
            
            {showAssessmentForm && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <AssessmentForm
                  students={students}
                  selectedStudent={selectedStudent}
                  onAddAssessment={handleAddAssessment}
                  onCancel={() => setShowAssessmentForm(false)}
                />
              </div>
            )}

            <AssessmentsList assessments={filteredAssessments} />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <ReportCards 
            students={students}
            selectedStudent={selectedStudent}
            grades={filteredGrades}
            assessments={filteredAssessments}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}
    </div>
  )
}
