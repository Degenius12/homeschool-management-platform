export interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
  dateOfBirth: Date
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: Date
  status: 'PRESENT' | 'ABSENT' | 'PARTIAL' | 'EXCUSED'
  hours: number
  notes?: string
}

export interface ComplianceStatus {
  totalDaysCompleted: number
  daysRequired: number
  attendancePercentage: number
  status: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'AT_RISK' | 'NON_COMPLIANT'
  noticeOfIntentFiled: boolean
  testingRequired: boolean
  testingCompleted: boolean
}

export interface TGTBLesson {
  id: string
  title: string
  lessonNumber: number
  subject: string
  estimatedHours: number
  description?: string
}

export interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'GRADED'
  type: 'WORKSHEET' | 'PROJECT' | 'QUIZ' | 'TEST' | 'READING' | 'WRITING'
}

export interface DashboardStats {
  totalStudents: number
  attendanceRate: number
  completedAssignments: number
  upcomingDeadlines: number
  complianceStatus: ComplianceStatus
}

// Tennessee-specific types
export interface TNComplianceRequirements {
  daysRequired: number
  hoursPerDay: number
  testingGrades: string[]
  noticeOfIntentDeadline: Date
  recordRetentionYears: number
}