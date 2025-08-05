import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const schoolYears = await prisma.schoolYear.findMany({
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            attendanceRecords: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(schoolYears)
  } catch (error) {
    console.error('Error fetching school years:', error)
    return NextResponse.json(
      { error: 'Failed to fetch school years' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { year, startDate, endDate, daysRequired = 180 } = body

    // For now, use the default family from seed data
    // In a full app, you'd get this from user authentication
    const defaultFamily = await prisma.family.findFirst()
    
    if (!defaultFamily) {
      return NextResponse.json(
        { error: 'No family found. Please run database seed first.' },
        { status: 400 }
      )
    }

    // Check if school year already exists
    const existingSchoolYear = await prisma.schoolYear.findUnique({
      where: {
        familyId_year: {
          familyId: defaultFamily.id,
          year
        }
      }
    })

    if (existingSchoolYear) {
      return NextResponse.json(
        { error: 'School year already exists for this family' },
        { status: 400 }
      )
    }

    const schoolYear = await prisma.schoolYear.create({
      data: {
        familyId: defaultFamily.id,
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        daysRequired
      },
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(schoolYear)
  } catch (error) {
    console.error('Error creating school year:', error)
    return NextResponse.json(
      { error: 'Failed to create school year' },
      { status: 500 }
    )
  }
}
