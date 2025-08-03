const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a sample family
  const family = await prisma.family.upsert({
    where: { id: 'family-1' },
    update: {},
    create: {
      id: 'family-1',
      name: 'Johnson Family',
      state: 'TN',
    },
  })

  console.log('✅ Created family:', family.name)

  // Create school year
  const schoolYear = await prisma.schoolYear.upsert({
    where: { 
      familyId_year: {
        familyId: family.id,
        year: '2024-2025'
      }
    },
    update: {},
    create: {
      familyId: family.id,
      year: '2024-2025',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2025-05-30'),
      daysRequired: 180,
    },
  })

  console.log('✅ Created school year:', schoolYear.year)

  // Create sample students
  const emma = await prisma.student.upsert({
    where: { id: 'student-1' },
    update: {},
    create: {
      id: 'student-1',
      firstName: 'Emma',
      lastName: 'Johnson',
      grade: '5th',
      dateOfBirth: new Date('2014-05-15'),
      familyId: family.id,
    },
  })

  const liam = await prisma.student.upsert({
    where: { id: 'student-2' },
    update: {},
    create: {
      id: 'student-2',
      firstName: 'Liam',
      lastName: 'Johnson',
      grade: '3rd',
      dateOfBirth: new Date('2016-09-22'),
      familyId: family.id,
    },
  })

  console.log('✅ Created students:', emma.firstName, 'and', liam.firstName)

  // Create sample subjects
  const subjects = [
    { name: 'Math', grade: '5th' },
    { name: 'Reading', grade: '5th' }, 
    { name: 'Science', grade: '5th' },
    { name: 'History', grade: '5th' },
    { name: 'Math', grade: '3rd' },
    { name: 'Reading', grade: '3rd' },
    { name: 'Science', grade: '3rd' },
    { name: 'History', grade: '3rd' },
  ]
  
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { 
        id: `${subject.name.toLowerCase()}-${subject.grade.toLowerCase()}-${schoolYear.id}`
      },
      update: {},
      create: {
        id: `${subject.name.toLowerCase()}-${subject.grade.toLowerCase()}-${schoolYear.id}`,
        name: subject.name,
        description: `${subject.name} curriculum for ${subject.grade} grade following TGTB standards`,
        curriculum: 'TGTB',
        grade: subject.grade,
        schoolYearId: schoolYear.id,
      },
    })
  }

  console.log('✅ Created subjects for both grades')

  // Create attendance records for the past few school days
  const today = new Date()
  let attendanceCount = 0
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    // Emma's attendance
    await prisma.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: emma.id,
          date: date,
        },
      },
      update: {},
      create: {
        studentId: emma.id,
        schoolYearId: schoolYear.id,
        date: date,
        status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT', // 90% attendance
        hours: 4.0,
        notes: `Day ${i + 1} - Great progress in all subjects`,
      },
    })

    // Liam's attendance
    await prisma.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: liam.id,
          date: date,
        },
      },
      update: {},
      create: {
        studentId: liam.id,
        schoolYearId: schoolYear.id,
        date: date,
        status: Math.random() > 0.05 ? 'PRESENT' : 'ABSENT', // 95% attendance
        hours: 3.5,
        notes: `Day ${i + 1} - Enjoying reading and math activities`,
      },
    })
    
    attendanceCount += 2
  }

  console.log(`✅ Created ${attendanceCount} attendance records`)

  // Create compliance record
  await prisma.complianceRecord.upsert({
    where: {
      familyId_schoolYear: {
        familyId: family.id,
        schoolYear: schoolYear.year,
      },
    },
    update: {},
    create: {
      familyId: family.id,
      schoolYear: schoolYear.year,
      noticeOfIntentFiled: true,
      noticeOfIntentDate: new Date('2024-08-01'),
      totalDaysCompleted: 45,
      daysRequired: 180,
      complianceStatus: 'ON_TRACK',
      testingRequired: true,
      testingCompleted: false,
      recordsLocation: 'Home office filing cabinet',
      portfolioCompleted: false,
    },
  })

  console.log('✅ Created Tennessee compliance record')
  console.log('')
  console.log('🎉 Sample data created successfully!')
  console.log('👥 Family: Johnson Family (Tennessee)')
  console.log('📚 Students: Emma (5th grade), Liam (3rd grade)')
  console.log('📖 Subjects: Math, Reading, Science, History for both grades')
  console.log('📅 Attendance: Last 10+ school days with realistic data')
  console.log('⚖️  Compliance: Tennessee homeschool requirements tracking')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })