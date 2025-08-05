'use client'

interface Assessment {
  id: string
  student: {
    id: string
    firstName: string
    lastName: string
    grade: string
  }
  type: string
  title: string
  testDate: string
  score?: number
  maxScore?: number
  percentile?: number
  grade: string
  testingYear: string
  notes?: string
}

interface AssessmentsListProps {
  assessments: Assessment[]
}

export function AssessmentsList({ assessments }: AssessmentsListProps) {
  return (
    <div className="space-y-4">
      {assessments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No assessments available for display.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {assessments.map((assessment) => (
            <li key={assessment.id} className="py-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium text-gray-900">
                    {assessment.title} - {assessment.type} - {new Date(assessment.testDate).toLocaleDateString()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {assessment.student.firstName} {assessment.student.lastName} - {assessment.grade}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

