'use client'

import { User, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Define types for the student data
interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  createdAt: string
  updatedAt: string
}

interface StudentWithProgress extends Student {
  name: string
  avatar: string
  progress: {
    math: number
    reading: number
    science: number
    history: number
  }
  recentActivity: string
  timeAgo: string
}

export function StudentOverview() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [students, setStudents] = useState<StudentWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Fetch students from API and enhance with progress data
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students')
        if (response.ok) {
          const data: Student[] = await response.json()
          
          // Transform API data to include progress information
          const studentsWithProgress: StudentWithProgress[] = data.map(student => ({
            ...student,
            name: `${student.firstName} ${student.lastName}`,
            avatar: student.firstName.charAt(0).toUpperCase(),
            progress: {
              math: Math.floor(Math.random() * 40) + 60, // Mock progress 60-100%
              reading: Math.floor(Math.random() * 40) + 60,
              science: Math.floor(Math.random() * 40) + 60,
              history: Math.floor(Math.random() * 40) + 60
            },
            recentActivity: `Completed lesson in ${student.grade}`,
            timeAgo: '2 hours ago'
          }))
          
          setStudents(studentsWithProgress)
        } else {
          // Fallback to sample data if API fails
          setStudents([
            {
              id: '1',
              firstName: 'Emma',
              lastName: 'Sample',
              dateOfBirth: '2012-03-15',
              grade: '5th Grade',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              name: 'Emma Sample',
              avatar: 'E',
              progress: { math: 78, reading: 92, science: 65, history: 84 },
              recentActivity: 'Completed Math Lesson 42',
              timeAgo: '2 hours ago'
            },
            {
              id: '2',
              firstName: 'Liam',
              lastName: 'Sample',
              dateOfBirth: '2014-07-22',
              grade: '3rd Grade',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              name: 'Liam Sample',
              avatar: 'L',
              progress: { math: 88, reading: 76, science: 82, history: 79 },
              recentActivity: 'Started Science Chapter 8',
              timeAgo: '5 hours ago'
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch students', error)
        // Use sample data as fallback
        setStudents([
          {
            id: '1',
            firstName: 'Emma',
            lastName: 'Sample',
            dateOfBirth: '2012-03-15',
            grade: '5th Grade',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: 'Emma Sample',
            avatar: 'E',
            progress: { math: 78, reading: 92, science: 65, history: 84 },
            recentActivity: 'Completed Math Lesson 42',
            timeAgo: '2 hours ago'
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000)
  }

  const handleStudentClick = (studentName: string) => {
    showNotification(`${studentName}'s profile clicked! Detailed view coming soon...`)
    console.log(`Student profile opened: ${studentName}`)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm relative">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h3 className="text-xl font-bold text-gray-900">Your Students</h3>
        <p className="text-sm text-gray-600 mt-1">Individual progress and recent activity ({students.length} students)</p>
      </div>
      <div className="p-6">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No students found. Add students to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student, index) => (
              <Link 
                key={student.id} 
                href={`/students/${student.id}`}
                className="block border border-gray-200 rounded-xl p-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-white font-bold text-lg">{student.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{student.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{student.grade}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">View Details</div>
                    <div className="text-blue-600">→</div>
                  </div>
                </div>
              
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Object.entries(student.progress).map(([subject, progress]) => (
                    <div key={subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-700">{subject}</span>
                        <span className="text-gray-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all progress-bar"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{student.recentActivity} • {student.timeAgo}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
