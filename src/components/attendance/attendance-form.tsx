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
  const [todayDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState('')
  const [alreadyMarked, setAlreadyMarked] = useState(false)

  // Load students from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedStudents = localStorage.getItem('homeschool-students')
        if (savedStudents) {
          const parsedStudents = JSON.parse(savedStudents)
          setStudents(parsedStudents)
          
          // Initialize attendance records for today
          const initialRecords: Record<string, AttendanceRecord> = {}
          parsedStudents.forEach((student: Student) => {
            initialRecords[student.id] = {
              studentId: student.id,
              date: todayDate,
              status: 'present',
              hours: 4,
              notes: ''
            }
          })
          setAttendanceRecords(initialRecords)

          // Check if attendance already marked for today
          const savedAttendance = localStorage.getItem('homeschool-attendance')
          if (savedAttendance) {
            const parsedAttendance = JSON.parse(savedAttendance)
            const todayAttendance = parsedAttendance.filter((record: AttendanceRecord) => 
              record.date === todayDate
            )
            if (todayAttendance.length > 0) {
              setAlreadyMarked(true)
              // Load existing attendance for today
              const existingRecords: Record<string, AttendanceRecord> = {}
              todayAttendance.forEach((record: AttendanceRecord) => {
                existingRecords[record.studentId] = record
              })
              setAttendanceRecords(existingRecords)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }, [todayDate])

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

    try {
      // Save attendance records to localStorage
      const savedAttendance = localStorage.getItem('homeschool-attendance')
      let allAttendance: AttendanceRecord[] = savedAttendance ? JSON.parse(savedAttendance) : []
      
      // Remove any existing records for today (in case of update)
      allAttendance = allAttendance.filter(record => record.date !== todayDate)
      
      // Add today's records
      const todayRecords = Object.values(attendanceRecords)
      allAttendance.push(...todayRecords)
      
      localStorage.setItem('homeschool-attendance', JSON.stringify(allAttendance))
      
      // Notify other components
      window.dispatchEvent(new CustomEvent('attendance-updated'))
      
      setAlreadyMarked(true)
      showNotification(`Attendance marked successfully for ${new Date(todayDate).toLocaleDateString()}!`)
      
    } catch (error) {
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
              {new Date(todayDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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