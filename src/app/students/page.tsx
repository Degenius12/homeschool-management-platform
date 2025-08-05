'use client'

import { useState, useEffect } from 'react'
import { StudentForm } from '@/components/students/student-form'
import { StudentList } from '@/components/students/student-list'

// Define the Student type to match database structure
interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  createdAt: string
  updatedAt: string
  family?: {
    id: string
    name: string
  }
}

export default function StudentsPage() {
  // Shared state for all students
  const [students, setStudents] = useState<Student[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load students from database when component mounts
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setError(null)
        const response = await fetch('/api/students')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const studentsData = await response.json()
        
        // Transform the data to match our interface
        const transformedStudents = studentsData.map((student: any) => ({
          ...student,
          dateOfBirth: student.dateOfBirth.split('T')[0] // Convert to YYYY-MM-DD format
        }))
        
        setStudents(transformedStudents)
        console.log('Loaded students from database:', transformedStudents)
      } catch (error) {
        console.error('Error loading students:', error)
        setError('Failed to load students. Please try refreshing the page.')
      } finally {
        setIsLoaded(true)
      }
    }

    loadStudents()
  }, [])

  // Function to add a new student
  const addStudent = async (studentData: {
    firstName: string
    lastName: string
    dateOfBirth: string
    grade: string
  }) => {
    try {
      setError(null)
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newStudent = await response.json()
      
      // Transform the data to match our interface
      const transformedStudent = {
        ...newStudent,
        dateOfBirth: newStudent.dateOfBirth.split('T')[0]
      }
      
      setStudents(prev => [transformedStudent, ...prev])
      console.log('Added new student:', transformedStudent)
      
      // Dispatch custom event to notify Dashboard
      window.dispatchEvent(new CustomEvent('students-updated'))
    } catch (error) {
      console.error('Error adding student:', error)
      setError('Failed to add student. Please try again.')
      throw error // Re-throw so the form can handle it
    }
  }

  // Function to remove a student
  const removeStudent = async (studentId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setStudents(prev => prev.filter(student => student.id !== studentId))
      console.log('Removed student with ID:', studentId)
      
      // Dispatch custom event to notify Dashboard
      window.dispatchEvent(new CustomEvent('students-updated'))
    } catch (error) {
      console.error('Error removing student:', error)
      setError('Failed to remove student. Please try again.')
    }
  }

  // Function to update a student
  const updateStudent = async (studentId: string, updatedData: {
    firstName: string
    lastName: string
    dateOfBirth: string
    grade: string
  }) => {
    try {
      setError(null)
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedStudent = await response.json()
      
      // Transform the data to match our interface
      const transformedStudent = {
        ...updatedStudent,
        dateOfBirth: updatedStudent.dateOfBirth.split('T')[0]
      }
      
      setStudents(prev => prev.map(student => 
        student.id === studentId ? transformedStudent : student
      ))
      console.log('Updated student:', transformedStudent)
      
      // Dispatch custom event to notify Dashboard
      window.dispatchEvent(new CustomEvent('students-updated'))
    } catch (error) {
      console.error('Error updating student:', error)
      setError('Failed to update student. Please try again.')
    }
  }

  // Don't render until data is loaded
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
          Manage Students
        </h1>
        <p className="text-gray-600 mt-2">
          Add and manage student profiles for your homeschool family
        </p>
      </div>

      {/* Add New Student Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Student
        </h2>
        <StudentForm onAddStudent={addStudent} />
      </div>

      {/* Current Students */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Current Students ({students.length})
        </h2>
        <StudentList 
          students={students}
          onRemoveStudent={removeStudent}
          onUpdateStudent={updateStudent}
        />
      </div>
    </div>
  )
}