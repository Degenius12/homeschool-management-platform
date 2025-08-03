'use client'

import { useState } from 'react'
import { User, Calendar, GraduationCap, Save } from 'lucide-react'

interface StudentFormProps {
  onAddStudent: (studentData: {
    firstName: string
    lastName: string
    dateOfBirth: string
    grade: string
  }) => void
}

export function StudentForm({ onAddStudent }: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState('')

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate brief loading time
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Actually add the student using the parent function
      onAddStudent(formData)
      
      showNotification(`${formData.firstName} ${formData.lastName} added successfully!`)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        grade: '',
      })
    } catch (error) {
      showNotification('Error adding student. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const gradeOptions = [
    'Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ]

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in slide-in-from-top-2">
            {notification}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="h-4 w-4 inline mr-2" />
              Grade Level
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select grade level</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade} Grade
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Adding Student...' : 'Add Student'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}