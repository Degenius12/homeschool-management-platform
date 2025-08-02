import { AttendanceChart } from '@/components/dashboard/attendance-chart'
import { ComplianceStatus } from '@/components/dashboard/compliance-status'
import { StudentOverview } from '@/components/dashboard/student-overview'
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Your Homeschool Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Track your family's progress with The Good and the Beautiful curriculum 
          while staying Tennessee compliant.
        </p>
      </div>

      {/* Compliance Alert */}
      <ComplianceStatus />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceChart />
          <StudentOverview />
        </div>

        {/* Right Column - Quick Actions & Tasks */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingTasks />
        </div>
      </div>

      {/* Bottom Section - Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Math lesson completed for Emma</span>
            <span className="text-gray-400 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Reading assignment added for Liam</span>
            <span className="text-gray-400 ml-auto">5 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Attendance recorded for this week</span>
            <span className="text-gray-400 ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}