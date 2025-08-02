'use client'

import { CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react'

export function ComplianceStatus() {
  const complianceItems = [
    {
      title: "180-Day Attendance",
      status: "on-track",
      progress: 72,
      description: "42 of 180 days completed",
      dueDate: "Ongoing"
    },
    {
      title: "Notice of Intent",
      status: "completed",
      progress: 100,
      description: "Filed for 2024-2025 school year",
      dueDate: "Filed Aug 1, 2024"
    },
    {
      title: "Grade 5 Testing",
      status: "upcoming",
      progress: 0,
      description: "Required for Emma this year",
      dueDate: "Due by May 2025"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'on-track':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'upcoming':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-200'
      case 'on-track':
        return 'bg-blue-100 border-blue-200'
      case 'upcoming':
        return 'bg-yellow-100 border-yellow-200'
      default:
        return 'bg-red-100 border-red-200'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor('on-track')}`}>
      <div className="flex items-center mb-3">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-blue-900">Tennessee Compliance Status</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {complianceItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            {getStatusIcon(item.status)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}