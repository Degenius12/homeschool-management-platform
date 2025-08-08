'use client'

interface Student {
  id: string
  firstName: string
  lastName: string
  grade: string
}

interface Grade {
  id: string
  assignment: {
    title: string
    subject: {
      name: string
    }
  }
  percentage?: number
  letterGrade?: string
}

interface Assessment {
  id: string
  title: string
  score?: number
  maxScore?: number
  percentile?: number
}

interface ReportCardsProps {
  students: Student[]
  selectedStudent: string
  grades: Grade[]
  assessments: Assessment[]
}

export function ReportCards({ students, selectedStudent, grades, assessments }: ReportCardsProps) {
  const student = students.find(s => s.id === selectedStudent)

  return (
    <div className="space-y-6">
      {student ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {student.firstName} {student.lastName}&apos;s Report Card
          </h2>
          <p className="text-gray-600 mt-1 mb-4">{student.grade} Grade</p>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Grades</h3>
            <ul className="space-y-2">
              {grades.map((grade) => (
                <li key={grade.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {grade.assignment.title} ({grade.assignment.subject.name})
                      </p>
                      <p className="text-sm text-gray-600">
                        {grade.percentage ? `${grade.percentage}%` : 'Ungraded'} - {grade.letterGrade || 'N/A'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Assessments</h3>
            <ul className="space-y-2">
              {assessments.map((assessment) => (
                <li key={assessment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assessment.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {assessment.score ? `${assessment.score}/${assessment.maxScore}` : 'Unscored'} - {assessment.percentile || 'N/A'} Percentile
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a student to view their report card.</p>
      )}
    </div>
  )
}

