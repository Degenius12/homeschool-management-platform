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
        showNotification('Add Lesson feature coming soon...')
        break
      case 'Generate Report':
        showNotification('Generate Report feature coming soon...')
        break
      case 'Settings':
        showNotification('Settings feature coming soon...')
        break
      default:
        showNotification(`${actionTitle} clicked! Feature coming soon...`)
    }
    console.log(`Action triggered: ${actionTitle}`)
  }

  const actions = [
    {
      title: "Add Lesson",
      description: "Plan today's activities",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Mark Attendance",
      description: "Record school day",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Generate Report",
      description: "Create transcript",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Manage Students",
      description: "Edit profiles",
      icon: Users,
      color: "bg-orange-500 hover:bg-orange-600"
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

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.title)}
              className={`${action.color} text-white p-4 rounded-lg text-left transition-colors cursor-pointer`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <h4 className="font-medium text-sm">{action.title}</h4>
              <p className="text-xs opacity-90">{action.description}</p>
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