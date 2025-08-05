'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, User, BarChart3, Clock, BookOpen, Award, TrendingUp, Filter } from 'lucide-react'

interface ReportTemplate {
  id: string
  title: string
  description: string
  type: 'attendance' | 'academic' | 'transcript' | 'compliance'
  icon: React.ComponentType<any>
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  required: boolean
}

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current-year')
  const [isGenerating, setIsGenerating] = useState<string | null>(null)

  const students = [
    { id: '1', name: 'Emma Johnson' },
    { id: '2', name: 'Liam Johnson' },
    { id: '3', name: 'Ian John' }
  ]

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'attendance-summary',
      title: 'Attendance Summary',
      description: 'Daily attendance records and hours completed for Tennessee compliance',
      type: 'attendance',
      icon: Calendar,
      frequency: 'monthly',
      required: true
    },
    {
      id: 'academic-progress',
      title: 'Academic Progress Report',
      description: 'Subject performance, grades, and curriculum completion status',
      type: 'academic',
      icon: TrendingUp,
      frequency: 'quarterly',
      required: false
    },
    {
      id: 'transcript',
      title: 'Official Transcript',
      description: 'Complete academic record with courses, grades, and credits',
      type: 'transcript',
      icon: Award,
      frequency: 'yearly',
      required: true
    },
    {
      id: 'compliance-report',
      title: 'Tennessee Compliance Report',
      description: 'Comprehensive report meeting all state homeschool requirements',
      type: 'compliance',
      icon: FileText,
      frequency: 'yearly',
      required: true
    },
    {
      id: 'curriculum-coverage',
      title: 'Curriculum Coverage',
      description: 'Detailed breakdown of subjects taught and hours completed',
      type: 'academic',
      icon: BookOpen,
      frequency: 'quarterly',
      required: false
    },
    {
      id: 'student-portfolio',
      title: 'Student Portfolio',
      description: 'Collection of work samples and achievements',
      type: 'academic',
      icon: User,
      frequency: 'yearly',
      required: false
    }
  ]

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would trigger the actual report generation
    console.log(`Generating report: ${reportId} for student: ${selectedStudent} period: ${selectedPeriod}`)
    
    setIsGenerating(null)
    
    // Show success notification (you could add a toast notification here)
    alert('Report generated successfully! Check your downloads folder.')
  }

  const getTypeColor = (type: ReportTemplate['type']) => {
    switch (type) {
      case 'attendance': return 'bg-green-100 text-green-800'
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'transcript': return 'bg-purple-100 text-purple-800'
      case 'compliance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyColor = (frequency: ReportTemplate['frequency']) => {
    switch (frequency) {
      case 'daily': return 'bg-orange-100 text-orange-800'
      case 'weekly': return 'bg-yellow-100 text-yellow-800'
      case 'monthly': return 'bg-blue-100 text-blue-800'
      case 'quarterly': return 'bg-indigo-100 text-indigo-800'
      case 'yearly': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg border p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Reports & Documentation</h1>
        <p className="text-purple-100 text-lg">
          Generate compliance reports and track academic progress for Tennessee homeschool requirements
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="all">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="current-year">Current School Year</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Available Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate reports for compliance, progress tracking, and documentation</p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <report.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{report.title}</h3>
                      {report.required && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full mt-1">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getFrequencyColor(report.frequency)}`}>
                      {report.frequency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating === report.id}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isGenerating === report.id ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Previously generated reports and documentation</p>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated Yet</h3>
            <p className="text-gray-500 mb-4">Generated reports will appear here for easy access and re-download</p>
          </div>
        </div>
      </div>
    </div>
  )
}
