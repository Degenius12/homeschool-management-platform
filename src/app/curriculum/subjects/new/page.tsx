'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

interface SchoolYear {
  id: string
  year: string
  startDate: string
  endDate: string
}

export default function NewSubjectPage() {
  const router = useRouter()
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grade: '',
    curriculum: 'TGTB',
    schoolYearId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const response = await fetch('/api/school-years')
        if (response.ok) {
          const years = await response.json()
          setSchoolYears(years)
          if (years.length > 0) {
            setFormData(prev => ({ ...prev, schoolYearId: years[0].id }))
          }
        }
      } catch (error) {
        console.error('Failed to fetch school years:', error)
      }
    }
    fetchSchoolYears()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/curriculum')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create subject')
      }
    } catch (error) {
      console.error('Error creating subject:', error)
      setError('Failed to create subject')
    } finally {
      setIsLoading(false)
    }
  }

  const gradeOptions = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ]

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/curriculum"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Curriculum
        </Link>
      </div>

      {/* Form Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl shadow-lg border p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Add New Subject</h1>
        <p className="text-green-100 text-lg">
          Create a new subject for your curriculum planning
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Mathematics, Language Arts, Science"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief description of this subject"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Grade</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="curriculum" className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum
              </label>
              <select
                id="curriculum"
                name="curriculum"
                value={formData.curriculum}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="TGTB">The Good and the Beautiful</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="schoolYearId" className="block text-sm font-medium text-gray-700 mb-2">
              School Year *
            </label>
            <select
              id="schoolYearId"
              name="schoolYearId"
              value={formData.schoolYearId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select School Year</option>
              {schoolYears.map(year => (
                <option key={year.id} value={year.id}>{year.year}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/curriculum"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
