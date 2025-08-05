import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
          }
        },
        assignment: {
          include: {
            subject: {
              select: {
                name: true
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
    console.error('Error fetching grades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      studentId,
      assignmentTitle,
      assignmentType,
      subject,
      points,
      maxPoints,
      percentage,
      letterGrade,
      notes,
      gradedDate
    } = data

    // First, create or find the subject
    let subjectRecord = await prisma.subject.findFirst({
      where: {
        name: subject
      }
    })

    if (!subjectRecord) {
      // For now, we'll create a basic subject without school year
      // In a full implementation, you'd want to handle school years properly
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { family: true }
      })

      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        )
      }

      // Try to find or create a school year
      let schoolYear = await prisma.schoolYear.findFirst({
        where: {
          familyId: student.familyId,
          year: '2024-2025' // Default year for now
        }
      })

      if (!schoolYear) {
        schoolYear = await prisma.schoolYear.create({
          data: {
            familyId: student.familyId,
            year: '2024-2025',
            startDate: new Date('2024-08-15'),
            endDate: new Date('2025-05-30'),
            daysRequired: 180
          }
        })
      }

      subjectRecord = await prisma.subject.create({
        data: {
          name: subject,
          description: `${subject} curriculum`,
          grade: student.grade,
          schoolYearId: schoolYear.id
        }
      })
    }

    // Create the assignment
    const assignment = await prisma.assignment.create({
      data: {
        title: assignmentTitle,
        type: assignmentType,
        studentId: studentId,
        subjectId: subjectRecord.id,
        status: 'GRADED'
      }
    })

    // Create the grade
    const grade = await prisma.grade.create({
      data: {
        studentId: studentId,
        assignmentId: assignment.id,
        score: points,
        percentage: percentage,
        letterGrade: letterGrade,
        points: points,
        maxPoints: maxPoints,
        notes: notes,
        gradedDate: new Date(gradedDate)
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
          }
        },
        assignment: {
          include: {
            subject: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(grade, { status: 201 })
  } catch (error) {
    console.error('Error creating grade:', error)
    return NextResponse.json(
      { error: 'Failed to create grade' },
      { status: 500 }
    )
  }
}
