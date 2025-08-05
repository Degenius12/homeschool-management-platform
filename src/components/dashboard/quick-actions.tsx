'use client'

import { 
  Plus, 
  Calendar, 
  FileText, 
  Users, 
  BarChart3, 
  Settings 
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const [notifications, setNotifications] = useState<string[]>([])
  const router = useRouter()

  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
  }

  const handleAction = (actionTitle: string) => {
    switch (actionTitle) {
      case 'Manage Students':
        router.push('/students')
        break
      case 'Mark Attendance':
        router.push('/attendance')
        break
      case 'Add Lesson':
        router.push('/curriculum')
        break
      case 'Generate Report':
        router.push('/reports')
        break
      case 'Settings':
        router.push('/settings')
        break
      default:
        showNotification(`${actionTitle} clicked! Feature coming soon...`)
    }
    console.log(`Action triggered: ${actionTitle}`)
  }

  const actions = [
    {
      title: "Mark Attendance",
      description: "Record today's school day",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
      priority: "high"
    },
    {
      title: "Manage Students",
      description: "View & edit profiles",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
      priority: "high"
    },
    {
      title: "Add Lesson",
      description: "Plan activities",
      icon: Plus,
      color: "bg-indigo-500 hover:bg-indigo-600",
      priority: "medium"
    },
    {
      title: "Generate Report",
      description: "Create transcript",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      priority: "low"
    }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm relative">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-xl font-bold text-gray-900">Daily Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Quick access to your most common tasks</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.title)}
              className={`${action.color} text-white p-5 rounded-xl text-left transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="h-7 w-7 mb-3" />
              <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed">{action.description}</p>
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button 
            onClick={() => handleAction('Settings')}
            className="w-full flex items-center justify-center space-x-2 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">More Options</span>
          </button>
        </div>
      </div>
    </div>
  )
}