'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react'

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

interface AttendanceStats {
  totalDays: number
  totalHours: number
  daysRemaining: number
  averageHours: number
  attendanceRate: number
  complianceStatus: 'on-track' | 'needs-attention' | 'at-risk'
  studentsCount: number
}

export function AttendanceStats() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 0,
    totalHours: 0,
    daysRemaining: 180,
    averageHours: 0,
    attendanceRate: 0,
    complianceStatus: 'on-track',
    studentsCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStats()
    
    // Listen for attendance updates
    const handleAttendanceUpdate = () => {
      calculateStats()
    }
    
    window.addEventListener('attendance-updated', handleAttendanceUpdate)
    return () => window.removeEventListener('attendance-updated', handleAttendanceUpdate)
  }, [])

  const calculateStats = () => {
    try {
      if (typeof window === 'undefined') return

      // Get students and attendance data
      const studentsData = localStorage.getItem('homeschool-students')
      const attendanceData = localStorage.getItem('homeschool-attendance')
      
      const students: Student[] = studentsData ? JSON.parse(studentsData) : []
      const attendance: AttendanceRecord[] = attendanceData ? JSON.parse(attendanceData) : []

      if (students.length === 0) {
        setLoading(false)
        return
      }

      // Calculate school year dates (August 1 to July 31)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const schoolYearStart = new Date(currentDate.getMonth() >= 7 ? currentYear : currentYear - 1, 7, 1) // Aug 1
      const schoolYearEnd = new Date(currentDate.getMonth() >= 7 ? currentYear + 1 : currentYear, 6, 31) // July 31

      // Filter attendance for current school year
      const schoolYearAttendance = attendance.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate >= schoolYearStart && recordDate <= schoolYearEnd
      })

      // Calculate stats
      const uniqueDates = new Set(schoolYearAttendance.map(record => record.date))
      const totalDays = uniqueDates.size
      
      const totalHours = schoolYearAttendance.reduce((sum, record) => {
        return sum + (record.status === 'present' || record.status === 'partial' ? record.hours : 0)
      }, 0)

      const averageHours = totalDays > 0 ? totalHours / totalDays : 0

      // Present days (including partial days)
      const presentDays = schoolYearAttendance.filter(record => 
        record.status === 'present' || record.status === 'partial'
      ).length / students.length // Divide by number of students to get actual days

      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

      // Tennessee compliance (180 days required)
      const daysRemaining = Math.max(0, 180 - presentDays)
      
      // Calculate weeks remaining in school year
      const weeksRemaining = Math.max(0, Math.ceil((schoolYearEnd.getTime() - currentDate.getTime()) / (7 * 24 * 60 * 60 * 1000)))
      const daysPerWeekNeeded = weeksRemaining > 0 ? daysRemaining / weeksRemaining : 0

      // Determine compliance status
      let complianceStatus: 'on-track' | 'needs-attention' | 'at-risk' = 'on-track'
      if (daysPerWeekNeeded > 5) {
        complianceStatus = 'at-risk'
      } else if (daysPerWeekNeeded > 4) {
        complianceStatus = 'needs-attention'
      }

      // If we're past the school year and haven't met requirements
      if (currentDate > schoolYearEnd && presentDays < 180) {
        complianceStatus = 'at-risk'
      }

      setStats({
        totalDays: Math.round(presentDays),
        totalHours: Math.round(totalHours * 10) / 10,
        daysRemaining,
        averageHours: Math.round(averageHours * 10) / 10,
        attendanceRate: Math.round(attendanceRate),
        complianceStatus,
        studentsCount: students.length
      })

    } catch (error) {
      console.error('Error calculating attendance stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'needs-attention':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'at-risk':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-5 w-5" />
      case 'needs-attention':
        return <AlertTriangle className="h-5 w-5" />
      case 'at-risk':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getStatusMessage = () => {
    switch (stats.complianceStatus) {
      case 'on-track':
        return 'You are on track to meet Tennessee\'s 180-day requirement!'
      case 'needs-attention':
        return 'Attendance needs attention to stay compliant with Tennessee requirements.'
      case 'at-risk':
        return 'At risk of not meeting Tennessee\'s 180-day requirement. Consider increasing school days.'
      default:
        return 'Monitoring Tennessee compliance status...'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tennessee Compliance Alert */}
      <div className={`p-4 rounded-lg border ${getStatusColor(stats.complianceStatus)}`}>
        <div className="flex items-center">
          {getStatusIcon(stats.complianceStatus)}
          <div className="ml-3">
            <h3 className="font-medium">Tennessee Compliance Status</h3>
            <p className="text-sm mt-1">{getStatusMessage()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Days Completed */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
              <p className="text-sm text-gray-600">Days Completed</p>
              <p className="text-xs text-gray-500">{stats.daysRemaining} remaining</p>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-xs text-gray-500">{stats.averageHours} avg/day</p>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-xs text-gray-500">All students</p>
            </div>
          </div>
        </div>

        {/* Progress to Goal */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round((stats.totalDays / 180) * 100)}%</p>
              <p className="text-sm text-gray-600">To Goal</p>
              <p className="text-xs text-gray-500">180 days required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">Progress to 180 Days</h3>
          <span className="text-sm text-gray-600">{stats.totalDays} / 180 days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              stats.complianceStatus === 'on-track' ? 'bg-green-500' : 
              stats.complianceStatus === 'needs-attention' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, (stats.totalDays / 180) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 days</span>
          <span>90 days (halfway)</span>
          <span>180 days (goal)</span>
        </div>
      </div>
    </div>
  )
}