import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, grade, curriculum, schoolYearId } = body

    // Validate required fields
    if (!name || !grade || !schoolYearId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, grade, schoolYearId' },
        { status: 400 }
      )
    }

    // Verify school year exists
    const schoolYear = await prisma.schoolYear.findUnique({
      where: { id: schoolYearId }
    })

    if (!schoolYear) {
      return NextResponse.json(
        { error: 'School year not found' },
        { status: 404 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        grade,
        curriculum: curriculum || 'TGTB',
        schoolYearId
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

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}
