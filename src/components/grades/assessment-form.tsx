'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
}

interface AssessmentFormProps {
  students: Student[]
  selectedStudent?: string
  onAddAssessment: (assessmentData: any) => Promise<void>
  onCancel: () => void
}

export function AssessmentForm({ students, selectedStudent, onAddAssessment, onCancel }: AssessmentFormProps) {
  const [formData, setFormData] = useState({
    studentId: selectedStudent || '',
    title: '',
    type: 'STANDARDIZED_TEST',
    testDate: new Date().toISOString().split('T')[0],
    score: '',
    maxScore: '',
    grade: '',
    testingYear: '',
    percentile: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assessmentTypes = [
    'STANDARDIZED_TEST',
    'DIAGNOSTIC',
    'PORTFOLIO_REVIEW',
    'ACHIEVEMENT_TEST',
    'TENNESSEE_REQUIRED',
    'OTHER'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.studentId || !formData.title || !formData.testingYear) {
        throw new Error('Student, title, and testing year are required')
      }

      const assessmentData = {
        studentId: formData.studentId,
        title: formData.title,
        type: formData.type,
        testDate: formData.testDate,
        score: formData.score ? parseFloat(formData.score) : null,
        maxScore: formData.maxScore ? parseFloat(formData.maxScore) : null,
        grade: formData.grade || '',
        testingYear: formData.testingYear,
        percentile: formData.percentile ? parseFloat(formData.percentile) : null,
        notes: formData.notes || ''
      }

      await onAddAssessment(assessmentData)

      // Reset form
      setFormData({
        studentId: selectedStudent || '',
        title: '',
        type: 'STANDARDIZED_TEST',
        testDate: new Date().toISOString().split('T')[0],
        score: '',
        maxScore: '',
        grade: '',
        testingYear: '',
        percentile: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error adding assessment:', error)
      setError(error instanceof Error ? error.message : 'Failed to add assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Add New Assessment</h3>
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

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., SAT Math Section"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Assessment Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Assessment Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {assessmentTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Test Date */}
        <div>
          <label htmlFor="testDate" className="block text-sm font-medium text-gray-700 mb-1">
            Test Date
          </label>
          <input
            type="date"
            id="testDate"
            name="testDate"
            value={formData.testDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Score */}
        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
            Score
          </label>
          <input
            type="number"
            id="score"
            name="score"
            value={formData.score}
            onChange={handleInputChange}
            min="0"
            step="1"
            placeholder="85"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max Score */}
        <div>
          <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-1">
            Max Score
          </label>
          <input
            type="number"
            id="maxScore"
            name="maxScore"
            value={formData.maxScore}
            onChange={handleInputChange}
            min="0"
            step="1"
            placeholder="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Grade Level */}
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            placeholder="e.g., 10th Grade"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Testing Year */}
        <div>
          <label htmlFor="testingYear" className="block text-sm font-medium text-gray-700 mb-1">
            Testing Year *
          </label>
          <input
            type="text"
            id="testingYear"
            name="testingYear"
            value={formData.testingYear}
            onChange={handleInputChange}
            required
            placeholder="e.g., 2024-2025"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Percentile */}
        <div>
          <label htmlFor="percentile" className="block text-sm font-medium text-gray-700 mb-1">
            Percentile
          </label>
          <input
            type="number"
            id="percentile"
            name="percentile"
            value={formData.percentile}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            placeholder="90.5"
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
            placeholder="Additional notes about this assessment..."
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
          {isSubmitting ? 'Adding...' : 'Add Assessment'}
        </button>
      </div>
    </form>
  )
}
