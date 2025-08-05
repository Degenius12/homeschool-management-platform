import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
          }
        }
      },
      orderBy: {
        testDate: 'desc'
      }
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      studentId,
      title,
      type,
      testDate,
      score,
      maxScore,
      grade,
      testingYear,
      percentile,
      notes
    } = data

    const assessment = await prisma.assessment.create({
      data: {
        studentId,
        title,
        type,
        testDate: new Date(testDate),
        score,
        maxScore,
        grade,
        testingYear,
        percentile,
        notes
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
          }
        }
      }
    })

    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}
