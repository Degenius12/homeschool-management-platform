import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCurriculum() {
  console.log('Seeding curriculum data...')

  // Get the current school year
  const currentSchoolYear = await prisma.schoolYear.findFirst({
    orderBy: { startDate: 'desc' }
  })

  if (!currentSchoolYear) {
    console.log('No school year found. Please create a school year first.')
    return
  }

  console.log(`Using school year: ${currentSchoolYear.year}`)

  // Create sample subjects
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'Mathematics',
        description: 'The Good and the Beautiful Math curriculum focusing on foundational concepts',
        grade: '3rd Grade',
        curriculum: 'TGTB',
        schoolYearId: currentSchoolYear.id
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Language Arts',
        description: 'Reading, writing, and grammar using The Good and the Beautiful curriculum',
        grade: '3rd Grade', 
        curriculum: 'TGTB',
        schoolYearId: currentSchoolYear.id
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Science',
        description: 'Nature study and basic scientific concepts',
        grade: '3rd Grade',
        curriculum: 'TGTB',
        schoolYearId: currentSchoolYear.id
      }
    }),
    prisma.subject.create({
      data: {
        name: 'History',
        description: 'American history and world cultures',
        grade: '5th Grade',
        curriculum: 'TGTB',
        schoolYearId: currentSchoolYear.id
      }
    })
  ])

  console.log(`Created ${subjects.length} subjects`)

  // Create sample lessons for Mathematics
  const mathSubject = subjects[0]
  const mathLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Addition with Regrouping',
        description: 'Learn to add multi-digit numbers with regrouping',
        lessonNumber: 1,
        estimatedHours: 1.5,
        subjectId: mathSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Subtraction with Borrowing',
        description: 'Master subtraction of multi-digit numbers',
        lessonNumber: 2,
        estimatedHours: 1.5,
        subjectId: mathSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Introduction to Multiplication',
        description: 'Basic multiplication concepts and tables',
        lessonNumber: 3,
        estimatedHours: 2.0,
        subjectId: mathSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Division Basics',
        description: 'Understanding division as the inverse of multiplication',
        lessonNumber: 4,
        estimatedHours: 2.0,
        subjectId: mathSubject.id
      }
    })
  ])

  // Create sample lessons for Language Arts
  const laSubject = subjects[1]
  const laLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Reading Comprehension Strategies',
        description: 'Techniques for understanding and analyzing text',
        lessonNumber: 1,
        estimatedHours: 1.0,
        subjectId: laSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Creative Writing',
        description: 'Exploring imagination through storytelling',
        lessonNumber: 2,
        estimatedHours: 1.5,
        subjectId: laSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Grammar Fundamentals',
        description: 'Parts of speech and sentence structure',
        lessonNumber: 3,
        estimatedHours: 1.0,
        subjectId: laSubject.id
      }
    })
  ])

  // Create sample lessons for Science
  const scienceSubject = subjects[2]
  const scienceLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Plant Life Cycles',
        description: 'Understanding how plants grow and reproduce',
        lessonNumber: 1,
        estimatedHours: 1.5,
        subjectId: scienceSubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Weather Patterns',
        description: 'Exploring different types of weather and climate',
        lessonNumber: 2,
        estimatedHours: 1.0,
        subjectId: scienceSubject.id
      }
    })
  ])

  // Create sample lessons for History
  const historySubject = subjects[3]
  const historyLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Early American Colonies',
        description: 'Life in the thirteen original colonies',
        lessonNumber: 1,
        estimatedHours: 2.0,
        subjectId: historySubject.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'The Revolutionary War',
        description: 'Causes and events of the American Revolution',
        lessonNumber: 2,
        estimatedHours: 2.5,
        subjectId: historySubject.id
      }
    })
  ])

  const totalLessons = mathLessons.length + laLessons.length + scienceLessons.length + historyLessons.length
  console.log(`Created ${totalLessons} lessons`)

  console.log('Curriculum seeding completed!')
}

seedCurriculum()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
