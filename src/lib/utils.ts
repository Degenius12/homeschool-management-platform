import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function calculateSchoolDaysRemaining(
  startDate: Date,
  currentDate: Date = new Date(),
  totalDays: number = 180
): number {
  const daysPassed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  return Math.max(0, totalDays - daysPassed)
}

export function calculateAttendancePercentage(
  completedDays: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0
  return Math.round((completedDays / totalDays) * 100)
}

// Tennessee compliance utilities
export function calculateComplianceStatus(
  completedDays: number,
  totalDaysRequired: number = 180
) {
  const percentage = calculateAttendancePercentage(completedDays, totalDaysRequired)
  
  if (percentage >= 95) return 'ON_TRACK'
  if (percentage >= 85) return 'NEEDS_ATTENTION'
  if (percentage >= 75) return 'AT_RISK'
  return 'NON_COMPLIANT'
}

export function getTestingGradesForYear(currentGrade: string): boolean {
  const testingGrades = ['5', '7', '9']
  return testingGrades.includes(currentGrade)
}