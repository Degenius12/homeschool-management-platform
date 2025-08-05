'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, User, Clock } from 'lucide-react'

interface AttendanceRecord {
  studentId: string
  date: string
  status: 'present' | 'absent' | 'partial' | 'excused'
  hours: number
  notes: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
}

interface DayData {
  date: string
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  attendance: AttendanceRecord[]
  totalHours: number
  attendanceStatus: 'present' | 'absent' | 'partial' | 'mixed' | 'none'
}

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [todayString, setTodayString] = useState('')
  
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
    setTodayString(dateString)
  }, [])

  useEffect(() => {
    loadData()
    
    // Listen for attendance updates
    const handleAttendanceUpdate = () => {
      loadData()
    }
    
    window.addEventListener('attendance-updated', handleAttendanceUpdate)
    return () => window.removeEventListener('attendance-updated', handleAttendanceUpdate)
  }, [])

  const loadData = async () => {
    try {
      // Fetch students from API
      const studentsResponse = await fetch('/api/students')
      if (studentsResponse.ok) {
        const studentsArray = await studentsResponse.json()
        setStudents(studentsArray)
      }

      // Fetch attendance data from API
      const attendanceResponse = await fetch('/api/attendance')
      if (attendanceResponse.ok) {
        const attendanceArray = await attendanceResponse.json()
        setAttendanceData(attendanceArray)
      }
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  }

  const generateCalendarDays = (): DayData[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of month and how many days in month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Get first day of week (0 = Sunday)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: DayData[] = []

    // Generate 42 days (6 weeks) for calendar grid
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      const dayAttendance = attendanceData.filter(record => record.date === dateString)
      
      // Calculate attendance status for this day
      let attendanceStatus: 'present' | 'absent' | 'partial' | 'mixed' | 'none' = 'none'
      let totalHours = 0
      
      if (dayAttendance.length > 0) {
        const statuses = dayAttendance.map(r => r.status)
        totalHours = dayAttendance.reduce((sum, r) => sum + (r.status !== 'absent' ? r.hours : 0), 0)
        
        if (statuses.every(s => s === 'present')) {
          attendanceStatus = 'present'
        } else if (statuses.every(s => s === 'absent')) {
          attendanceStatus = 'absent'
        } else if (statuses.some(s => s === 'partial')) {
          attendanceStatus = 'partial'
        } else {
          attendanceStatus = 'mixed'
        }
      }

      days.push({
        date: dateString,
        dayOfMonth: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateString === todayString,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        attendance: dayAttendance,
        totalHours,
        attendanceStatus
      })
    }
    
    return days
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500 text-white'
      case 'absent':
        return 'bg-red-500 text-white'
      case 'partial':
        return 'bg-yellow-500 text-white'
      case 'mixed':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Present'
      case 'absent':
        return 'Absent'
      case 'partial':
        return 'Partial'
      case 'mixed':
        return 'Mixed'
      default:
        return 'No Data'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
    setSelectedDay(null)
  }

  const days = generateCalendarDays()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Partial</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Mixed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>No Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    aspect-square p-2 border-b border-r border-gray-100 text-sm transition-colors relative
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.isToday ? 'bg-blue-50 font-bold' : ''}
                    ${day.isWeekend && day.isCurrentMonth ? 'bg-gray-50' : ''}
                    ${selectedDay?.date === day.date ? 'ring-2 ring-blue-500' : ''}
                    hover:bg-gray-50
                  `}
                >
                  <div className="h-full flex flex-col justify-between">
                    <span className={day.isToday ? 'text-blue-600' : ''}>{day.dayOfMonth}</span>
                    
                    {day.attendanceStatus !== 'none' && (
                      <div className="flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(day.attendanceStatus).split(' ')[0]}`}></div>
                      </div>
                    )}
                    
                    {day.totalHours > 0 && (
                      <div className="text-xs text-gray-500">
                        {day.totalHours}h
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {selectedDay ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">
{selectedDay.date === todayString ? "Today's Date: " : "Selected Date: "}{(() => {
                    // Parse date string manually to avoid timezone issues
                    const [year, month, day] = selectedDay.date.split('-').map(Number)
                    const localDate = new Date(year, month - 1, day) // month is 0-indexed
                    return localDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })
                  })()}
                </h3>
              </div>

              {selectedDay.attendance.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedDay.attendanceStatus)}`}>
                      {getStatusText(selectedDay.attendanceStatus)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium">{selectedDay.totalHours}</span>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Student Details:</h4>
                    <div className="space-y-2">
                      {selectedDay.attendance.map((record, index) => {
                        const student = students.find(s => s.id === record.studentId)
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span>{student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                              {record.hours > 0 && (
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{record.hours}h</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {selectedDay.attendance.some(r => r.notes) && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Notes:</h4>
                      <div className="space-y-1">
                        {selectedDay.attendance.filter(r => r.notes).map((record, index) => {
                          const student = students.find(s => s.id === record.studentId)
                          return (
                            <div key={index} className="text-sm text-gray-600">
                              <span className="font-medium">{student?.firstName}:</span> {record.notes}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No attendance recorded for this day</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Day</h3>
              <p className="text-gray-600">Click on any day in the calendar to view attendance details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}