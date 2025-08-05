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

    // Fetch all assessments for the student
    const assessments = await prisma.assessment.findMany({
      where: {
        studentId: studentId
      },
      orderBy: {
        testDate: 'desc'
      }
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching student assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student assessments' },
      { status: 500 }
    )
  }
}
