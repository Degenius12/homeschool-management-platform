'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Save, CheckCircle, AlertCircle } from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
}

interface AttendanceRecord {
  studentId: string
  date: string
  status: 'present' | 'absent' | 'partial' | 'excused'
  hours: number
  notes: string
}

export function AttendanceForm() {
  const [students, setStudents] = useState<Student[]>([])
  const [todayDate, setTodayDate] = useState<string>('')
  
  // Set date on client side only to avoid SSR mismatch
  useEffect(() => {
    // Force local timezone calculation by using date parts directly
    const now = new Date()
    
    // Method 1: Direct local date parts
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') 
    const day = String(now.getDate()).padStart(2, '0')
    const method1 = `${year}-${month}-${day}`
    
    // Method 2: Using toLocaleDateString and parsing
    const localDateParts = now.toLocaleDateString('en-CA') // YYYY-MM-DD format
    
    // Method 3: Adjust for timezone offset
    const offsetMs = now.getTimezoneOffset() * 60000
    const localTime = new Date(now.getTime() - offsetMs)
    const method3 = localTime.toISOString().split('T')[0]
    
    // Use method 2 (toLocaleDateString) as it should be most reliable
    const dateString = localDateParts
    setTodayDate(dateString)
  }, [])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState('')
  const [alreadyMarked, setAlreadyMarked] = useState(false)
  const [currentSchoolYearId, setCurrentSchoolYearId] = useState<string | null>(null)

  // Load students from API
  useEffect(() => {
    const loadStudents = async () => {
      if (!todayDate) return // Wait for todayDate to be set
      
      try {
        console.log('Fetching students from API...')
        const response = await fetch('/api/students')
        if (response.ok) {
          const studentsData = await response.json()
          console.log('Students fetched:', studentsData.length, studentsData)
          setStudents(studentsData)
          
          // Initialize attendance records for today
          const initialRecords: Record<string, AttendanceRecord> = {}
          studentsData.forEach((student: Student) => {
            initialRecords[student.id] = {
              studentId: student.id,
              date: todayDate,
              status: 'present',
              hours: 4,
              notes: ''
            }
          })
          setAttendanceRecords(initialRecords)

          // Check if attendance already exists for today from the API
          const attendanceResponse = await fetch(`/api/attendance?date=${todayDate}`)
          if (attendanceResponse.ok) {
            const existingAttendance = await attendanceResponse.json()
            if (existingAttendance.length > 0) {
              setAlreadyMarked(true)
              // Load existing attendance for today
              const existingRecords: Record<string, AttendanceRecord> = {}
              existingAttendance.forEach((record: any) => {
                existingRecords[record.studentId] = {
                  studentId: record.studentId,
                  date: record.date,
                  status: record.status.toLowerCase(), // Convert back to lowercase for UI
                  hours: record.hours,
                  notes: record.notes || ''
                }
              })
              setAttendanceRecords(prev => ({ ...prev, ...existingRecords }))
            }
          }
        } else {
          console.error('Failed to fetch students')
        }
      } catch (error) {
        console.error('Error loading students:', error)
      }
    }

    loadStudents()
  }, [todayDate])

  // Fetch current school year
  useEffect(() => {
    const fetchCurrentSchoolYear = async () => {
      try {
        const response = await fetch('/api/school-years/current')
        if (response.ok) {
          const schoolYear = await response.json()
          setCurrentSchoolYearId(schoolYear.id)
        } else {
          console.error('Failed to fetch current school year')
        }
      } catch (error) {
        console.error('Error fetching current school year:', error)
      }
    }

    fetchCurrentSchoolYear()
  }, [])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 4000)
  }

  const updateAttendance = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate that we have a school year ID
    if (!currentSchoolYearId) {
      showNotification('Error: School year not found. Please try refreshing the page.')
      setIsSubmitting(false)
      return
    }

    try {
      // Send today's attendance records to the server
      const todayRecords = Object.values(attendanceRecords)

      for (const record of todayRecords) {
        const response = await fetch('/api/attendance', {
          method: alreadyMarked ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...record,
            schoolYearId: currentSchoolYearId,
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`)
        }
      }

      setAlreadyMarked(true)
      showNotification(`Attendance ${alreadyMarked ? 'updated' : 'marked'} successfully for ${new Date(todayDate).toLocaleDateString()}!`)
      
    } catch (error) {
      console.error('Error saving attendance:', error)
      showNotification('Error saving attendance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTotalHours = () => {
    return Object.values(attendanceRecords).reduce((total, record) => {
      return record.status === 'present' || record.status === 'partial' ? total + record.hours : total
    }, 0)
  }

  const statusColors = {
    present: 'bg-green-100 text-green-800 border-green-200',
    absent: 'bg-red-100 text-red-800 border-red-200',
    partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    excused: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
        <p className="text-gray-600 mb-4">Add students first to track attendance.</p>
        <button 
          onClick={() => window.location.href = '/students'}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Students
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2">
            {notification}
          </div>
        </div>
      )}

      {/* Already marked notice */}
      {alreadyMarked && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm font-medium text-green-800">
              Attendance already marked for {new Date(todayDate).toLocaleDateString()}. You can update it below.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Summary */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              {todayDate ? (() => {
                // Parse date string manually to avoid timezone issues
                const [year, month, day] = todayDate.split('-').map(Number)
                const localDate = new Date(year, month - 1, day) // month is 0-indexed
                const displayDate = localDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
                return displayDate
              })() : 'Loading...'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Total Hours: {getTotalHours()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{students.length} Students</span>
            </div>
          </div>
        </div>

        {/* Student Attendance Records */}
        <div className="space-y-4">
          {students.map((student) => {
            const record = attendanceRecords[student.id]
            if (!record) return null

            return (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{student.grade} Grade</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={record.status}
                      onChange={(e) => updateAttendance(student.id, 'status', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[record.status]}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="partial">Partial Day</option>
                      <option value="excused">Excused</option>
                    </select>
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={record.hours}
                      onChange={(e) => updateAttendance(student.id, 'hours', parseFloat(e.target.value) || 0)}
                      disabled={record.status === 'absent'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={record.notes}
                      onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                      placeholder="Activities, lessons, notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Saving...' : alreadyMarked ? 'Update Attendance' : 'Mark Attendance'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}