const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create sample students
  const emma = await prisma.student.upsert({
    where: { id: 'student-1' },
    update: {},
    create: {
      id: 'student-1',
      name: 'Emma Johnson',
      grade: 3,
      dateOfBirth: new Date('2016-05-15'),
      enrollmentDate: new Date('2024-08-01'),
    },
  })

  const liam = await prisma.student.upsert({
    where: { id: 'student-2' },
    update: {},
    create: {
      id: 'student-2',
      name: 'Liam Johnson',
      grade: 1,
      dateOfBirth: new Date('2018-09-22'),
      enrollmentDate: new Date('2024-08-01'),
    },
  })

  // Create sample subjects
  const subjects = ['Math', 'Reading', 'Science', 'History', 'Art']
  
  for (const subjectName of subjects) {
    await prisma.subject.upsert({
      where: { name: subjectName },
      update: {},
      create: {
        name: subjectName,
        description: `${subjectName} curriculum following TGTB standards`,
      },
    })
  }

  // Create some attendance records for the past few days
  const today = new Date()
  for (let i = 0; i < 10; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: emma.id,
          date: date,
        },
      },
      update: {},
      create: {
        studentId: emma.id,
        date: date,
        present: Math.random() > 0.1, // 90% attendance
        hoursCompleted: 4,
        notes: `Day ${i + 1} - Great progress in all subjects`,
      },
    })

    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: liam.id,
          date: date,
        },
      },
      update: {},
      create: {
        studentId: liam.id,
        date: date,
        present: Math.random() > 0.05, // 95% attendance
        hoursCompleted: 3,
        notes: `Day ${i + 1} - Enjoying reading and math activities`,
      },
    })
  }

  console.log('✅ Sample data created successfully!')
  console.log('👥 Students: Emma Johnson (Grade 3), Liam Johnson (Grade 1)')
  console.log('📚 Subjects: Math, Reading, Science, History, Art')
  console.log('📅 Attendance: Last 10 school days with realistic data')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })