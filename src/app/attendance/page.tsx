import { Metadata } from 'next'
import { AttendanceForm } from '@/components/attendance/attendance-form'
import { AttendanceCalendar } from '@/components/attendance/attendance-calendar'
import { AttendanceStats } from '@/components/attendance/attendance-stats'

export const metadata: Metadata = {
  title: 'Attendance Tracking | Homeschool Management Platform',
  description: 'Track daily attendance and monitor Tennessee 180-day compliance requirements',
}

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Attendance Tracking
        </h1>
        <p className="text-gray-600 mt-2">
          Track daily attendance and monitor Tennessee 180-day compliance requirements
        </p>
      </div>

      {/* Stats Overview */}
      <AttendanceStats />

      {/* Quick Attendance Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📅 Mark Today's Attendance
        </h2>
        <AttendanceForm />
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Attendance Calendar
        </h2>
        <AttendanceCalendar />
      </div>
    </div>
  )
}