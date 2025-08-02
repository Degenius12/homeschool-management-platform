'use client'

import { Calendar, AlertCircle, CheckCircle, Plus } from 'lucide-react'

export function UpcomingTasks() {
  const tasks = [
    {
      title: "Math Quiz - Emma",
      dueDate: "Today",
      priority: "high",
      subject: "Mathematics",
      type: "assessment"
    },
    {
      title: "Science Experiment - Liam",
      dueDate: "Tomorrow",
      priority: "medium", 
      subject: "Science",
      type: "activity"
    },
    {
      title: "History Project Due",
      dueDate: "Friday",
      priority: "medium",
      subject: "History",
      type: "project"
    },
    {
      title: "Weekly Attendance Report",
      dueDate: "Sunday",
      priority: "low",
      subject: "Admin",
      type: "compliance"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
            <p className="text-sm text-gray-600 mt-1">Next assignments and deadlines</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500">{task.subject} • {task.type}</p>
              </div>
              <div className="text-xs text-gray-400">
                {task.dueDate}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 py-2">
          View All Tasks →
        </button>
      </div>
    </div>
  )
}