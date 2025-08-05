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

    // Fetch all grades for the student with assignment and subject details
    const grades = await prisma.grade.findMany({
      where: {
        studentId: studentId
      },
      include: {
        assignment: {
          include: {
            subject: {
              select: {
                name: true,
                curriculum: true
              }
            }
          }
        }
      },
      orderBy: {
        gradedDate: 'desc'
      }
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Error fetching student grades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student grades' },
      { status: 500 }
    )
  }
}
