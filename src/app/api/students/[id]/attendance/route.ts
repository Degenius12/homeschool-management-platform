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

    // Fetch all attendance records for the student
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        studentId: studentId
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error('Error fetching student attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}
