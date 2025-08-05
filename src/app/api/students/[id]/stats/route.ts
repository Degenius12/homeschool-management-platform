import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get current school year
    const currentSchoolYear = await prisma.schoolYear.findFirst({
      orderBy: { startDate: 'desc' }
    })

    if (!currentSchoolYear) {
      return NextResponse.json({
        totalAttendanceDays: 0,
        averageGrade: 0,
        completedAssignments: 0,
        totalAssignments: 0,
        attendancePercentage: 0,
        currentStreak: 0
      })
    }

    // Calculate attendance statistics
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        studentId: studentId,
        schoolYearId: currentSchoolYear.id
      },
      orderBy: { date: 'desc' }
    })

    const totalAttendanceDays = attendanceRecords.filter(record => 
      record.status === 'PRESENT' || record.status === 'PARTIAL'
    ).length

    const attendancePercentage = attendanceRecords.length > 0 
      ? (totalAttendanceDays / attendanceRecords.length) * 100 
      : 0

    // Calculate current attendance streak
    let currentStreak = 0
    for (const record of attendanceRecords) {
      if (record.status === 'PRESENT') {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate grade statistics
    const grades = await prisma.grade.findMany({
      where: {
        studentId: studentId
      },
      include: {
        assignment: true
      }
    })

    const validGrades = grades.filter(grade => grade.percentage !== null)
    const averageGrade = validGrades.length > 0
      ? validGrades.reduce((sum, grade) => sum + (grade.percentage || 0), 0) / validGrades.length
      : 0

    // Calculate assignment statistics
    const assignments = await prisma.assignment.findMany({
      where: {
        studentId: studentId
      }
    })

    const completedAssignments = assignments.filter(assignment => 
      assignment.status === 'COMPLETED' || assignment.status === 'GRADED'
    ).length

    const totalAssignments = assignments.length

    const stats = {
      totalAttendanceDays,
      averageGrade: Math.round(averageGrade * 10) / 10, // Round to 1 decimal place
      completedAssignments,
      totalAssignments,
      attendancePercentage: Math.round(attendancePercentage * 10) / 10,
      currentStreak
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error calculating student stats:', error)
    return NextResponse.json(
      { error: 'Failed to calculate student statistics' },
      { status: 500 }
    )
  }
}
