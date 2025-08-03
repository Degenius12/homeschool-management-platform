'use client'

import { User, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'

export function StudentOverview() {
  const [notifications, setNotifications] = useState<string[]>([])

  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
  }

  const handleStudentClick = (studentName: string) => {
    showNotification(`${studentName}'s profile clicked! Detailed view coming soon...`)
    console.log(`Student profile opened: ${studentName}`)
  }

  const students = [
    {
      name: "Emma",
      grade: "5th Grade",
      avatar: "E",
      progress: {
        math: 78,
        reading: 92,
        science: 65,
        history: 84
      },
      recentActivity: "Completed Math Lesson 42",
      timeAgo: "2 hours ago"
    },
    {
      name: "Liam",
      grade: "3rd Grade", 
      avatar: "L",
      progress: {
        math: 88,
        reading: 76,
        science: 82,
        history: 79
      },
      recentActivity: "Started Science Chapter 8",
      timeAgo: "5 hours ago"
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
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
        <p className="text-sm text-gray-600 mt-1">Individual progress across TGTB subjects</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {students.map((student, index) => (
            <div 
              key={index} 
              onClick={() => handleStudentClick(student.name)}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium">{student.avatar}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-600">{student.grade}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(student.progress).map(([subject, progress]) => (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700">{subject}</span>
                      <span className="text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{student.recentActivity} • {student.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}