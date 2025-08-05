'use client'

import { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Award,
  Clock,
  Target,
  FileText,
  Edit,
  Plus,
  CheckCircle,
  MessageSquare,
  StickyNote,
  AlertCircle,
  Tag
} from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  createdAt: string
  updatedAt: string
}

interface AttendanceRecord {
  id: string
  date: string
  status: string
  hours: number
  notes?: string
}

interface Grade {
  id: string
  assignment: {
    id: string
    title: string
    subject: {
      name: string
    }
  }
  percentage?: number
  letterGrade?: string
  points?: number
  maxPoints?: number
  gradedDate: string
  notes?: string
}

interface Assessment {
  id: string
  type: string
  title: string
  testDate: string
  score?: number
  maxScore?: number
  percentile?: number
  grade: string
  testingYear: string
  notes?: string
}

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  category: 'academic' | 'attendance' | 'behavior'
  deadline?: string
  completed: boolean
}

interface ParentNote {
  id: string
  title: string
  content: string
  category: 'progress' | 'behavior' | 'communication' | 'general'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  tags?: string[]
}

interface StudentDetails extends Student {
  attendanceRecords: AttendanceRecord[]
  grades: Grade[]
  assessments: Assessment[]
  goals?: Goal[]
  stats: {
    totalAttendanceDays: number
    averageGrade: number
    completedAssignments: number
    totalAssignments: number
    attendancePercentage: number
    currentStreak: number
  }
}

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'grades' | 'assessments' | 'progress' | 'goals' | 'notes' | 'subjects'>('overview')
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Maintain 90% Average',
      description: 'Keep overall grade average above 90%',
      target: 90,
      current: student?.stats?.averageGrade || 0,
      unit: '%',
      category: 'academic',
      deadline: '2025-05-30',
      completed: false
    },
    {
      id: '2', 
      title: 'Perfect Attendance Week',
      description: 'Attend all school days for a full week',
      target: 5,
      current: student?.stats?.currentStreak || 0,
      unit: 'days',
      category: 'attendance',
      completed: false
    }
  ])

  const [notes, setNotes] = useState<ParentNote[]>([
    {
      id: '1',
      title: 'Math Progress Discussion',
      content: 'Emma is showing excellent improvement in fractions. Consider introducing more complex problems.',
      category: 'progress',
      priority: 'medium',
      createdAt: '2025-08-04T10:30:00Z',
      tags: ['math', 'fractions']
    },
    {
      id: '2', 
      title: 'Reading Comprehension Focus',
      content: 'Need to work on reading between the lines. Emma tends to focus on literal meaning.',
      category: 'progress',
      priority: 'high',
      createdAt: '2025-08-03T14:15:00Z',
      tags: ['reading', 'comprehension']
    },
    {
      id: '3',
      title: 'Great Attitude Today',
      content: 'Emma was very focused and asked great questions during science lesson.',
      category: 'behavior',
      priority: 'low',
      createdAt: '2025-08-05T09:00:00Z',
      tags: ['science', 'engagement']
    }
  ])

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return
    
    const note: ParentNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category as 'progress' | 'behavior' | 'communication' | 'general',
      priority: newNote.priority as 'low' | 'medium' | 'high',
      createdAt: new Date().toISOString(),
      tags: []
    }
    
    setNotes(prev => [note, ...prev])
    setNewNote({ title: '', content: '', category: 'general', priority: 'medium' })
    setShowAddNote(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'progress': return 'text-blue-600 bg-blue-100'
      case 'behavior': return 'text-purple-600 bg-purple-100'
      case 'communication': return 'text-indigo-600 bg-indigo-100'
      case 'general': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general', priority: 'medium' })
  const [showAddNote, setShowAddNote] = useState(false)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch student basic info
        const studentResponse = await fetch(`/api/students/${studentId}`)
        if (!studentResponse.ok) {
          throw new Error('Failed to fetch student')
        }
        const studentData = await studentResponse.json()

        // Fetch detailed data
        const [attendanceResponse, gradesResponse, assessmentsResponse, statsResponse] = await Promise.all([
          fetch(`/api/students/${studentId}/attendance`),
          fetch(`/api/students/${studentId}/grades`),
          fetch(`/api/students/${studentId}/assessments`),
          fetch(`/api/students/${studentId}/stats`)
        ])

        const attendanceRecords = attendanceResponse.ok ? await attendanceResponse.json() : []
        const grades = gradesResponse.ok ? await gradesResponse.json() : []
        const assessments = assessmentsResponse.ok ? await assessmentsResponse.json() : []
        const stats = statsResponse.ok ? await statsResponse.json() : {
          totalAttendanceDays: 0,
          averageGrade: 0,
          completedAssignments: 0,
          totalAssignments: 0,
          attendancePercentage: 0,
          currentStreak: 0
        }

        setStudent({
          ...studentData,
          attendanceRecords,
          grades,
          assessments,
          stats
        })
      } catch (error) {
        console.error('Failed to fetch student details:', error)
        setError('Failed to load student profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      fetchStudentDetails()
    }
  }, [studentId])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRecentAttendance = () => {
    if (!student?.attendanceRecords) return []
    return student.attendanceRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }

  const getRecentGrades = () => {
    if (!student?.grades) return []
    return student.grades
      .sort((a, b) => new Date(b.gradedDate).getTime() - new Date(a.gradedDate).getTime())
      .slice(0, 10)
  }

  // Chart data preparation
  const gradeProgressData = useMemo(() => {
    if (!student?.grades) return []
    return student.grades
      .sort((a, b) => new Date(a.gradedDate).getTime() - new Date(b.gradedDate).getTime())
      .map((grade, index) => ({
        assignment: grade.assignment.title.substring(0, 15) + '...',
        percentage: grade.percentage || 0,
        subject: grade.assignment.subject.name,
        date: formatDate(grade.gradedDate)
      }))
  }, [student?.grades])

  const subjectPerformanceData = useMemo(() => {
    if (!student?.grades) return []
    const subjectAverages = student.grades.reduce((acc, grade) => {
      const subject = grade.assignment.subject.name
      if (!acc[subject]) {
        acc[subject] = { total: 0, count: 0 }
      }
      acc[subject].total += grade.percentage || 0
      acc[subject].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number }>)

    return Object.entries(subjectAverages).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
      fullMark: 100
    }))
  }, [student?.grades])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Student Not Found</h3>
            <p className="text-gray-500 mb-4">{error || 'The requested student profile could not be found.'}</p>
            <Link 
              href="/students"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/students"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Link>
      </div>

      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg border p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
              <span className="text-white font-bold text-2xl">
                {student.firstName.charAt(0).toUpperCase()}{student.lastName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex items-center gap-4 text-blue-100">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {student.grade}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Age {calculateAge(student.dateOfBirth)}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Born {formatDate(student.dateOfBirth)}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/students/${studentId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Days</p>
              <p className="text-2xl font-bold text-gray-900">{student.stats.totalAttendanceDays}</p>
              <p className="text-xs text-gray-500">{student.stats.attendancePercentage.toFixed(1)}% rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {student.stats.averageGrade > 0 ? `${student.stats.averageGrade.toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Overall performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {student.stats.completedAssignments}/{student.stats.totalAssignments}
              </p>
              <p className="text-xs text-gray-500">
                {student.stats.totalAssignments > 0 
                  ? `${((student.stats.completedAssignments / student.stats.totalAssignments) * 100).toFixed(1)}% complete`
                  : 'No assignments yet'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{student.stats.currentStreak}</p>
              <p className="text-xs text-gray-500">consecutive days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Charts Section */}
      {gradeProgressData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Progress Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradeProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignment" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Grade']}
                  labelFormatter={(label) => `Assignment: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Performance Radar Chart */}
          {subjectPerformanceData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={subjectPerformanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Average Grade"
                    dataKey="average"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Average Grade']} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Goals Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Educational Goals</h3>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </button>
        </div>
        
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No goals set yet. Add some educational goals to track progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100)
              const isCompleted = goal.current >= goal.target
              
              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          goal.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                          goal.category === 'attendance' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-700">
                          Progress: <strong>{goal.current}</strong> / {goal.target} {goal.unit}
                        </span>
                        {goal.deadline && (
                          <span className="text-gray-500">
                            Due: {formatDate(goal.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">0%</span>
                    <span className="text-xs font-medium text-gray-700">{progress.toFixed(1)}%</span>
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', icon: User },
              { key: 'attendance', label: 'Attendance', icon: Calendar },
              { key: 'grades', label: 'Grades', icon: TrendingUp },
              { key: 'assessments', label: 'Assessments', icon: Award },
              { key: 'progress', label: 'Progress', icon: TrendingUp },
              { key: 'goals', label: 'Goals', icon: Target },
              { key: 'notes', label: 'Notes', icon: StickyNote },
              { key: 'subjects', label: 'Subjects', icon: BookOpen }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {getRecentAttendance().slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        record.status === 'PRESENT' ? 'bg-green-500' : 
                        record.status === 'ABSENT' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        {record.status === 'PRESENT' ? 'Present' : 
                         record.status === 'ABSENT' ? 'Absent' : 'Partial'} on {formatDate(record.date)}
                        {record.hours && record.hours !== 4 && ` (${record.hours} hours)`}
                      </span>
                      <span className="text-gray-400 ml-auto text-xs">
                        {formatDate(record.date)}
                      </span>
                    </div>
                  ))}
                  {getRecentGrades().slice(0, 3).map((grade) => (
                    <div key={grade.id} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">
                        Graded {grade.assignment.title} - {grade.letterGrade || `${grade.percentage?.toFixed(1)}%`}
                      </span>
                      <span className="text-gray-400 ml-auto text-xs">
                        {formatDate(grade.gradedDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                <span className="text-sm text-gray-500">
                  {student.attendanceRecords.length} total records
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getRecentAttendance().map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                            record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.hours}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
                <span className="text-sm text-gray-500">
                  {student.grades.length} total grades
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getRecentGrades().map((grade) => (
                      <tr key={grade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {grade.assignment.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {grade.assignment.subject.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {grade.letterGrade && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                                grade.letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                                grade.letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                                grade.letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                grade.letterGrade === 'D' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {grade.letterGrade}
                              </span>
                            )}
                            <span className="text-sm text-gray-900">
                              {grade.percentage?.toFixed(1)}%
                            </span>
                            {grade.points && grade.maxPoints && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({grade.points}/{grade.maxPoints})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(grade.gradedDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Assessments & Tests</h3>
                <span className="text-sm text-gray-500">
                  {student.assessments.length} total assessments
                </span>
              </div>
              
              {student.assessments.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No assessments recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assessment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {student.assessments.map((assessment) => (
                        <tr key={assessment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assessment.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assessment.type.replace('_', ' ').toLowerCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assessment.score && assessment.maxScore 
                              ? `${assessment.score}/${assessment.maxScore}`
                              : 'N/A'
                            }
                            {assessment.percentile && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({assessment.percentile}th percentile)
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(assessment.testDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Parent Notes & Communication</h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </button>
              </div>

              {/* Add Note Modal/Form */}
              {showAddNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={newNote.title}
                          onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Note title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          value={newNote.content}
                          onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Note content..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newNote.category}
                            onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="general">General</option>
                            <option value="progress">Progress</option>
                            <option value="behavior">Behavior</option>
                            <option value="communication">Communication</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={newNote.priority}
                            onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => {
                            setShowAddNote(false)
                            setNewNote({ title: '', content: '', category: 'general', priority: 'medium' })
                          }}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addNote}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes List */}
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notes yet. Add some notes to track observations and communication.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(note.category)}`}>
                              {note.category}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(note.priority)}`}>
                              {note.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{note.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(note.createdAt)}
                            </span>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                {note.tags.map((tag, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
                <span className="text-sm text-gray-500">
                  {subjectPerformanceData.length} subjects enrolled
                </span>
              </div>

              {subjectPerformanceData.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No subject data available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectPerformanceData.map((subject) => {
                    const subjectGrades = student?.grades.filter(g => g.assignment.subject.name === subject.subject) || []
                    const recentGrades = subjectGrades.slice(-3)
                    
                    return (
                      <Link
                        key={subject.subject}
                        href={`/curriculum/subjects/${subject.subject.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                          <span className={`px-2 py-1 text-sm font-medium rounded ${
                            subject.average >= 90 ? 'bg-green-100 text-green-800' :
                            subject.average >= 80 ? 'bg-blue-100 text-blue-800' :
                            subject.average >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subject.average}%
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Performance</span>
                              <span>{subject.average}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  subject.average >= 90 ? 'bg-green-500' :
                                  subject.average >= 80 ? 'bg-blue-500' :
                                  subject.average >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(subject.average, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Recent Grades:</p>
                            <div className="flex gap-2">
                              {recentGrades.length > 0 ? (
                                recentGrades.map((grade, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                    {grade.percentage?.toFixed(0)}%
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500">No recent grades</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{subjectGrades.length} assignments</span>
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              View Details
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
