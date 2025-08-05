import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gradeId = params.id

    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
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

    if (!grade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Error fetching grade:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grade' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gradeId = params.id
    const data = await request.json()

    const updatedGrade = await prisma.grade.update({
      where: { id: gradeId },
      data: {
        score: data.score,
        percentage: data.percentage,
        letterGrade: data.letterGrade,
        points: data.points,
        maxPoints: data.maxPoints,
        notes: data.notes,
        gradedDate: data.gradedDate ? new Date(data.gradedDate) : undefined
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

    return NextResponse.json(updatedGrade)
  } catch (error) {
    console.error('Error updating grade:', error)
    return NextResponse.json(
      { error: 'Failed to update grade' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gradeId = params.id

    // Get the grade first to get the assignment ID
    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: { assignment: true }
    })

    if (!grade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      )
    }

    // Delete the grade first, then the assignment
    await prisma.grade.delete({
      where: { id: gradeId }
    })

    // Delete the associated assignment
    await prisma.assignment.delete({
      where: { id: grade.assignmentId }
    })

    return NextResponse.json({ message: 'Grade deleted successfully' })
  } catch (error) {
    console.error('Error deleting grade:', error)
    return NextResponse.json(
      { error: 'Failed to delete grade' },
      { status: 500 }
    )
  }
}
