'use client'

import { useState, useEffect } from 'react'
import { StudentForm } from '@/components/students/student-form'
import { StudentList } from '@/components/students/student-list'

// Define the Student type
interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  enrollmentDate: string
}

export default function StudentsPage() {
  // Shared state for all students
  const [students, setStudents] = useState<Student[]>([])

  // Load students from localStorage when component mounts
  useEffect(() => {
    const loadStudents = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedStudents = localStorage.getItem('homeschool-students')
          if (savedStudents) {
            const parsedStudents = JSON.parse(savedStudents)
            setStudents(parsedStudents)
          } else {
            // If no saved students, start with sample data
            const defaultStudents = [
              {
                id: '1',
                firstName: 'Emma',
                lastName: 'Johnson',
                dateOfBirth: '2014-05-15',
                grade: '5th',
                enrollmentDate: '2024-08-01',
              },
              {
                id: '2',
                firstName: 'Liam',
                lastName: 'Johnson',
                dateOfBirth: '2016-09-22',
                grade: '3rd',
                enrollmentDate: '2024-08-01',
              }
            ]
            setStudents(defaultStudents)
            saveStudentsToStorage(defaultStudents)
          }
        }
      } catch (error) {
        console.error('Error loading students:', error)
      }
    }

    loadStudents()
  }, [])

  // Save students to localStorage and notify other components
  const saveStudentsToStorage = (updatedStudents: Student[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('homeschool-students', JSON.stringify(updatedStudents))
        // Dispatch custom event to notify Dashboard
        window.dispatchEvent(new CustomEvent('students-updated'))
      }
    } catch (error) {
      console.error('Error saving students:', error)
    }
  }

  // Function to add a new student
  const addStudent = (studentData: Omit<Student, 'id' | 'enrollmentDate'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(), // Simple ID generation
      enrollmentDate: new Date().toISOString().split('T')[0], // Today's date
    }
    
    const updatedStudents = [...students, newStudent]
    setStudents(updatedStudents)
    saveStudentsToStorage(updatedStudents)
  }

  // Function to remove a student
  const removeStudent = (studentId: string) => {
    const updatedStudents = students.filter(student => student.id !== studentId)
    setStudents(updatedStudents)
    saveStudentsToStorage(updatedStudents)
  }

  // Function to update a student
  const updateStudent = (studentId: string, updatedData: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === studentId 
        ? { ...student, ...updatedData }
        : student
    )
    setStudents(updatedStudents)
    saveStudentsToStorage(updatedStudents)
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