'use client'

interface Grade {
  id: string
  student: {
    id: string
    firstName: string
    lastName: string
    grade: string
  }
  assignment: {
    id: string
    title: string
    type: string
    subject: {
      name: string
    }
  }
  score?: number
  percentage?: number
  letterGrade?: string
  points?: number
  maxPoints?: number
  gradedDate: string
  notes?: string
}

interface GradesListProps {
  grades: Grade[]
  onUpdateGrade: (gradeId: string, updatedData: any) => Promise<void>
  onDeleteGrade: (gradeId: string) => Promise<void>
}

export function GradesList({ grades, onUpdateGrade, onDeleteGrade }: GradesListProps) {
  return (
    <div className="space-y-4">
      {grades.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No grades available for display. Add a new grade to get started.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {grades.map((grade) => (
            <li key={grade.id} className="py-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium text-gray-900">
                    {grade.assignment.title} (
                    {grade.assignment.subject.name}) - {grade.letterGrade || 'Ungraded'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {grade.student.firstName} {grade.student.lastName} - {new Date(grade.gradedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={async () => await onDeleteGrade(grade.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 rounded-lg p-2 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

