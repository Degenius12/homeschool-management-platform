'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
}

interface GradeFormProps {
  students: Student[]
  selectedStudent?: string
  onAddGrade: (gradeData: any) => Promise<void>
  onCancel: () => void
}

export function GradeForm({ students, selectedStudent, onAddGrade, onCancel }: GradeFormProps) {
  const [formData, setFormData] = useState({
    studentId: selectedStudent || '',
    assignmentTitle: '',
    assignmentType: 'WORKSHEET',
    subject: 'Math',
    points: '',
    maxPoints: '',
    percentage: '',
    letterGrade: '',
    notes: '',
    gradedDate: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignmentTypes = [
    'WORKSHEET',
    'QUIZ',
    'TEST',
    'PROJECT',
    'READING',
    'WRITING',
    'EXPERIMENT',
    'OTHER'
  ]

  const subjects = [
    'Math',
    'English/Language Arts',
    'Science',
    'History',
    'Geography',
    'Art',
    'Music',
    'Physical Education',
    'Foreign Language',
    'Other'
  ]

  const letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-calculate percentage if points are entered
    if (name === 'points' || name === 'maxPoints') {
      const points = name === 'points' ? parseFloat(value) : parseFloat(formData.points)
      const maxPoints = name === 'maxPoints' ? parseFloat(value) : parseFloat(formData.maxPoints)
      
      if (!isNaN(points) && !isNaN(maxPoints) && maxPoints > 0) {
        const percentage = Math.round((points / maxPoints) * 100)
        setFormData(prev => ({ ...prev, percentage: percentage.toString() }))
        
        // Auto-assign letter grade based on percentage
        let letterGrade = 'F'
        if (percentage >= 97) letterGrade = 'A+'
        else if (percentage >= 93) letterGrade = 'A'
        else if (percentage >= 90) letterGrade = 'A-'
        else if (percentage >= 87) letterGrade = 'B+'
        else if (percentage >= 83) letterGrade = 'B'
        else if (percentage >= 80) letterGrade = 'B-'
        else if (percentage >= 77) letterGrade = 'C+'
        else if (percentage >= 73) letterGrade = 'C'
        else if (percentage >= 70) letterGrade = 'C-'
        else if (percentage >= 67) letterGrade = 'D+'
        else if (percentage >= 63) letterGrade = 'D'
        else if (percentage >= 60) letterGrade = 'D-'
        
        setFormData(prev => ({ ...prev, letterGrade }))
      }
    }

    // Auto-calculate percentage if percentage is entered manually
    if (name === 'percentage') {
      const percentage = parseFloat(value)
      if (!isNaN(percentage)) {
        let letterGrade = 'F'
        if (percentage >= 97) letterGrade = 'A+'
        else if (percentage >= 93) letterGrade = 'A'
        else if (percentage >= 90) letterGrade = 'A-'
        else if (percentage >= 87) letterGrade = 'B+'
        else if (percentage >= 83) letterGrade = 'B'
        else if (percentage >= 80) letterGrade = 'B-'
        else if (percentage >= 77) letterGrade = 'C+'
        else if (percentage >= 73) letterGrade = 'C'
        else if (percentage >= 70) letterGrade = 'C-'
        else if (percentage >= 67) letterGrade = 'D+'
        else if (percentage >= 63) letterGrade = 'D'
        else if (percentage >= 60) letterGrade = 'D-'
        
        setFormData(prev => ({ ...prev, letterGrade }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.studentId || !formData.assignmentTitle) {
        throw new Error('Student and assignment title are required')
      }

      const gradeData = {
        studentId: formData.studentId,
        assignmentTitle: formData.assignmentTitle,
        assignmentType: formData.assignmentType,
        subject: formData.subject,
        points: formData.points ? parseFloat(formData.points) : null,
        maxPoints: formData.maxPoints ? parseFloat(formData.maxPoints) : null,
        percentage: formData.percentage ? parseFloat(formData.percentage) : null,
        letterGrade: formData.letterGrade || null,
        notes: formData.notes || null,
        gradedDate: formData.gradedDate
      }

      await onAddGrade(gradeData)
      
      // Reset form
      setFormData({
        studentId: selectedStudent || '',
        assignmentTitle: '',
        assignmentType: 'WORKSHEET',
        subject: 'Math',
        points: '',
        maxPoints: '',
        percentage: '',
        letterGrade: '',
        notes: '',
        gradedDate: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error adding grade:', error)
      setError(error instanceof Error ? error.message : 'Failed to add grade')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Add New Grade</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Selection */}
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student *
          </label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.grade} Grade)
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Title */}
        <div>
          <label htmlFor="assignmentTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Title *
          </label>
          <input
            type="text"
            id="assignmentTitle"
            name="assignmentTitle"
            value={formData.assignmentTitle}
            onChange={handleInputChange}
            required
            placeholder="e.g., Math Quiz Chapter 5"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Assignment Type */}
        <div>
          <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Type
          </label>
          <select
            id="assignmentType"
            name="assignmentType"
            value={formData.assignmentType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {assignmentTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Points Earned */}
        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
            Points Earned
          </label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleInputChange}
            min="0"
            step="0.5"
            placeholder="85"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max Points */}
        <div>
          <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700 mb-1">
            Total Points
          </label>
          <input
            type="number"
            id="maxPoints"
            name="maxPoints"
            value={formData.maxPoints}
            onChange={handleInputChange}
            min="0"
            step="0.5"
            placeholder="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Percentage */}
        <div>
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
            Percentage
          </label>
          <input
            type="number"
            id="percentage"
            name="percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            placeholder="85.0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Letter Grade */}
        <div>
          <label htmlFor="letterGrade" className="block text-sm font-medium text-gray-700 mb-1">
            Letter Grade
          </label>
          <select
            id="letterGrade"
            name="letterGrade"
            value={formData.letterGrade}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Grade</option>
            {letterGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Graded Date */}
        <div className="md:col-span-2">
          <label htmlFor="gradedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date Graded
          </label>
          <input
            type="date"
            id="gradedDate"
            name="gradedDate"
            value={formData.gradedDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Additional notes about this assignment..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Grade'}
        </button>
      </div>
    </form>
  )
}
