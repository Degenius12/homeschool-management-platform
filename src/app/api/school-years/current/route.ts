import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const currentDate = new Date()
    
    // Try to find a school year that includes the current date
    const currentSchoolYear = await prisma.schoolYear.findFirst({
      where: {
        startDate: {
          lte: currentDate
        },
        endDate: {
          gte: currentDate
        }
      },
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
      }
    })

    if (currentSchoolYear) {
      return NextResponse.json(currentSchoolYear)
    }

    // If no current school year found, get the most recent one
    const mostRecentSchoolYear = await prisma.schoolYear.findFirst({
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

    if (mostRecentSchoolYear) {
      return NextResponse.json(mostRecentSchoolYear)
    }

    // If no school years exist, create a default one for the current academic year
    const defaultFamily = await prisma.family.findFirst()
    
    if (!defaultFamily) {
      return NextResponse.json(
        { error: 'No family or school year found. Please run database seed first.' },
        { status: 404 }
      )
    }

    // Determine current academic year
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
    
    // If it's July or later, we're in the new academic year
    const academicYear = currentMonth >= 7 ? currentYear : currentYear - 1
    const academicYearString = `${academicYear}-${academicYear + 1}`
    
    // Create default school year (August to May)
    const startDate = new Date(academicYear, 7, 15) // August 15th
    const endDate = new Date(academicYear + 1, 4, 31) // May 31st

    const newSchoolYear = await prisma.schoolYear.create({
      data: {
        familyId: defaultFamily.id,
        year: academicYearString,
        startDate,
        endDate,
        daysRequired: 180
      },
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
      }
    })

    return NextResponse.json(newSchoolYear)
  } catch (error) {
    console.error('Error fetching current school year:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current school year' },
      { status: 500 }
    )
  }
}
