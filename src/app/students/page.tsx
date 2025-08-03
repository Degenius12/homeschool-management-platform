import { Metadata } from 'next'
import { StudentForm } from '@/components/students/student-form'
import { StudentList } from '@/components/students/student-list'

export const metadata: Metadata = {
  title: 'Manage Students | Homeschool Management Platform',
  description: 'Add and manage student profiles for your homeschool family',
}

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Students
        </h1>
        <p className="text-gray-600 mt-2">
          Add and manage student profiles for your homeschool family
        </p>
      </div>

      {/* Add New Student Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Student
        </h2>
        <StudentForm />
      </div>

      {/* Current Students */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Current Students
        </h2>
        <StudentList />
      </div>
    </div>
  )
}