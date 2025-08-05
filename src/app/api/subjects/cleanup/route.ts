import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Get all subjects
    const subjects = await prisma.subject.findMany()
    
    const gradeMapping: Record<string, string> = {
      '1st': '1st',
      '1st Grade': '1st',
      '2nd': '2nd', 
      '2nd Grade': '2nd',
      '3rd': '3rd',
      '3rd Grade': '3rd',
      '4th': '4th',
      '4th Grade': '4th',
      '5th': '5th',
      '5th Grade': '5th',
      '6th': '6th',
      '6th Grade': '6th',
      '7th': '7th',
      '7th Grade': '7th',
      '8th': '8th',
      '8th Grade': '8th',
      '9th': '9th',
      '9th Grade': '9th',
      '10th': '10th',
      '10th Grade': '10th',
      '11th': '11th',
      '11th Grade': '11th',
      '12th': '12th',
      '12th Grade': '12th'
    }

    const updatePromises = subjects.map(subject => {
      const normalizedGrade = gradeMapping[subject.grade] || subject.grade
      if (normalizedGrade !== subject.grade) {
        console.log(`Updating subject ${subject.name} from "${subject.grade}" to "${normalizedGrade}"`)
        return prisma.subject.update({
          where: { id: subject.id },
          data: { grade: normalizedGrade }
        })
      }
      return Promise.resolve(subject)
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ 
      message: 'Grade formats cleaned up successfully',
      updatedCount: updatePromises.length
    })
  } catch (error) {
    console.error('Error cleaning up grades:', error)
    return NextResponse.json(
      { error: 'Failed to clean up grades' },
      { status: 500 }
    )
  }
}
