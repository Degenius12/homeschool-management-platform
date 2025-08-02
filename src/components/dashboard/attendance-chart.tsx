'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react'

// Mock data - replace with actual data fetching
const mockAttendanceData = [
  { week: 'Week 1', planned: 5, completed: 5, hours: 20, target: 5 },
  { week: 'Week 2', planned: 5, completed: 4, hours: 16, target: 5 },
  { week: 'Week 3', planned: 5, completed: 5, hours: 20, target: 5 },
  { week: 'Week 4', planned: 5, completed: 3, hours: 12, target: 5 },
  { week: 'Week 5', planned: 5, completed: 5, hours: 20, target: 5 },
  { week: 'Week 6', planned: 5, completed: 4, hours: 16, target: 5 },
  { week: 'Week 7', planned: 5, completed: 5, hours: 20, target: 5 },
  { week: 'Week 8', planned: 5, completed: 5, hours: 20, target: 5 },
  { week: 'Week 9', planned: 5, completed: 2, hours: 8, target: 5 },
  { week: 'Week 10', planned: 5, completed: 4, hours: 16, target: 5 }
]

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="space-y-1 mt-2">
          <p className="text-sm">
            <span className="text-blue-600">●</span> Planned: {data.planned} days
          </p>
          <p className="text-sm">
            <span className="text-green-600">●</span> Completed: {data.completed} days
          </p>
          <p className="text-sm">
            <span className="text-purple-600">●</span> Hours: {data.hours}
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function AttendanceChart() {
  const totalPlanned = mockAttendanceData.reduce((sum, week) => sum + week.planned, 0)
  const totalCompleted = mockAttendanceData.reduce((sum, week) => sum + week.completed, 0)
  const totalHours = mockAttendanceData.reduce((sum, week) => sum + week.hours, 0)
  const attendanceRate = Math.round((totalCompleted / totalPlanned) * 100)
  
  // Tennessee compliance calculations
  const daysRemaining = 180 - totalCompleted
  const weeksLeftInYear = 36 - mockAttendanceData.length
  const averageNeeded = weeksLeftInYear > 0 ? Math.ceil(daysRemaining / weeksLeftInYear * 5) : 0
  
  // Compliance status
  const isOnTrack = attendanceRate >= 85
  const needsAttention = attendanceRate < 85 && attendanceRate >= 75
  const atRisk = attendanceRate < 75

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <p className="text-sm text-gray-600 mt-1">Tennessee 180-day compliance tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            {atRisk && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Compliance Alert */}
        {atRisk && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm font-medium text-red-800">
                Attendance Below Target - Need {averageNeeded} days/week to stay compliant
              </p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalCompleted}</p>
            <p className="text-xs text-blue-700">Days Completed</p>
            <p className="text-xs text-gray-500">{daysRemaining} remaining</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            isOnTrack ? 'bg-green-50' : needsAttention ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <p className={`text-2xl font-bold ${
              isOnTrack ? 'text-green-600' : needsAttention ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {attendanceRate}%
            </p>
            <p className={`text-xs ${
              isOnTrack ? 'text-green-700' : needsAttention ? 'text-yellow-700' : 'text-red-700'
            }`}>
              Attendance Rate
            </p>
            <p className="text-xs text-gray-500">
              {isOnTrack ? 'On Track' : needsAttention ? 'Needs Attention' : 'At Risk'}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{totalHours}</p>
            <p className="text-xs text-purple-700">Total Hours</p>
            <p className="text-xs text-gray-500">{Math.round(totalHours/totalCompleted * 10)/10} avg/day</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{averageNeeded}</p>
            <p className="text-xs text-gray-700">Days/Week Needed</p>
            <p className="text-xs text-gray-500">To stay compliant</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockAttendanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 6]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="planned" 
                fill="#e5e7eb" 
                name="Planned"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="completed" 
                fill="#3b82f6" 
                name="Completed"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Planned Days</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Completed Days</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
              Mark Today Present
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
              Add Hours
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200">
              View Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}