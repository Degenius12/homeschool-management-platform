'use client'

import { useState } from 'react'
import { User, Calendar, GraduationCap, Edit, Trash2, MoreVertical } from 'lucide-react'

export function StudentList() {
  const [notification, setNotification] = useState('')

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  // Sample students - replace with real data from API
  const [students, setStudents] = useState([
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      dateOfBirth: '2014-05-15',
      grade: '5th',
      enrollmentDate: '2024-08-01',
    },
    {
      id: '2',
      firstName: 'Liam',
      lastName: 'Johnson',
      dateOfBirth: '2016-09-22',
      grade: '3rd',
      enrollmentDate: '2024-08-01',
    }
  ])

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleEdit = (studentId: string) => {
    showNotification('Edit functionality coming soon!')
    console.log('Edit student:', studentId)
  }

  const handleDelete = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from your students list?`)) {
      setStudents(prev => prev.filter(student => student.id !== studentId))
      showNotification(`${studentName} removed successfully`)
    }
  }

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2">
            {notification}
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Added</h3>
          <p className="text-gray-600">Add your first student using the form above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>

                  {/* Student Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.grade} Grade</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Age {calculateAge(student.dateOfBirth)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(student.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit student"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Student Details */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Birth Date:</span>
                    <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Grade Level:</span>
                    <p className="font-medium">{student.grade} Grade</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <p className="font-medium">{calculateAge(student.dateOfBirth)} years old</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}