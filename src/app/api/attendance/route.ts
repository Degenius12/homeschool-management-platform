import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')
    const schoolYearId = searchParams.get('schoolYearId')

    // Build query conditions
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (date) {
      where.date = new Date(date)
    }
    
    if (schoolYearId) {
      where.schoolYearId = schoolYearId
    }

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
          }
        },
        schoolYear: {
          select: {
            id: true,
            year: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('=== ATTENDANCE POST REQUEST ===')
    console.log('Full request body:', JSON.stringify(body, null, 2))
    console.log('Student ID:', body.studentId)
    console.log('Date:', body.date)
    console.log('School Year ID:', body.schoolYearId)
    const { studentId, date, status, hours, notes, schoolYearId } = body

    // Validate required fields
    if (!studentId || !date || !schoolYearId) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, date, and schoolYearId are required' },
        { status: 400 }
      )
    }

    // Check if a record already exists for this student and date
    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      }
    })

    if (existingRecord) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this student and date' },
        { status: 400 }
      )
    }

    // Create new attendance record
    const attendanceRecord = await prisma.attendanceRecord.create({
      data: {
        studentId,
        schoolYearId,
        date: new Date(date),
        status: status ? status.toUpperCase() : 'PRESENT',
        hours: hours || 4.0,
        notes: notes || ''
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
        schoolYear: {
          select: {
            id: true,
            year: true
          }
        }
      }
    })

    return NextResponse.json(attendanceRecord)
  } catch (error) {
    console.error('Error creating attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { studentId, date, status, hours, notes } = body

    // Validate required fields
    if (!studentId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId and date are required' },
        { status: 400 }
      )
    }

    // Update existing attendance record
    const attendanceRecord = await prisma.attendanceRecord.update({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      },
      data: {
        status: status ? status.toUpperCase() : 'PRESENT',
        hours: hours || 4.0,
        notes: notes || ''
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
        schoolYear: {
          select: {
            id: true,
            year: true
          }
        }
      }
    })

    return NextResponse.json(attendanceRecord)
  } catch (error) {
    console.error('Error updating attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to update attendance record' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')

    if (!studentId || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters: studentId and date are required' },
        { status: 400 }
      )
    }

    await prisma.attendanceRecord.delete({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      }
    })

    return NextResponse.json({ message: 'Attendance record deleted successfully' })
  } catch (error) {
    console.error('Error deleting attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    )
  }
}
