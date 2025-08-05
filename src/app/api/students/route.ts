import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        family: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, dateOfBirth, grade } = body

    // For now, we'll use the default family from seed data
    // In a full app, you'd get this from user authentication
    const defaultFamily = await prisma.family.findFirst()
    
    if (!defaultFamily) {
      return NextResponse.json(
        { error: 'No family found. Please run database seed first.' },
        { status: 400 }
      )
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        grade,
        familyId: defaultFamily.id
      },
      include: {
        family: true
      }
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
