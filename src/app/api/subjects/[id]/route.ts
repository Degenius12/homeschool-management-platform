import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subjectId = params.id

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId
      },
      include: {
        schoolYear: {
          select: {
            id: true,
            year: true
          }
        },
        _count: {
          select: {
            lessons: true,
            assignments: true
          }
        }
      }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subjectId = params.id
    const body = await request.json()
    const { name, description, grade, curriculum } = body

    // Validate required fields
    if (!name || !grade) {
      return NextResponse.json(
        { error: 'Missing required fields: name, grade' },
        { status: 400 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: {
        id: subjectId
      },
      data: {
        name,
        description,
        grade,
        curriculum: curriculum || 'TGTB'
      },
      include: {
        schoolYear: {
          select: {
            id: true,
            year: true
          }
        },
        _count: {
          select: {
            lessons: true,
            assignments: true
          }
        }
      }
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subjectId = params.id

    await prisma.subject.delete({
      where: {
        id: subjectId
      }
    })

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
}
