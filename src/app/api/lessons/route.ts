import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    const whereClause = subjectId ? { subjectId } : {}

    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            grade: true
          }
        },
        _count: {
          select: {
            assignments: true
          }
        }
      },
      orderBy: [
        { lessonNumber: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, lessonNumber, estimatedHours, subjectId } = body

    // Validate required fields
    if (!title || !subjectId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subjectId' },
        { status: 400 }
      )
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        lessonNumber: lessonNumber ? parseInt(lessonNumber) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 1.0,
        subjectId
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            grade: true
          }
        },
        _count: {
          select: {
            assignments: true
          }
        }
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}
