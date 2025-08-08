'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  birthDate: string;
  grade: string;
  created: string;
  emergencyContact: string;
  totalPresent?: number;
  totalAbsent?: number;
}

export default function StudentsSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    birthDate: '',
    grade: '',
    emergencyContact: ''
  });

  const addStudent = () => {
    if (!newStudent.name || !newStudent.birthDate || !newStudent.grade) return;
    
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      created: new Date().toISOString(),
      totalPresent: 0,
      totalAbsent: 0
    };
    
    setStudents([...students, student]);
    setNewStudent({ name: '', birthDate: '', grade: '', emergencyContact: '' });
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleNext = () => {
    if (students.length === 0) return;
    
    setLoading(true);
    // Save students to localStorage
    localStorage.setItem('homeschool-students', JSON.stringify(students));
    router.push('/onboarding/complete');
  };

  const handleBack = () => {
    router.push('/onboarding/family-setup');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Step 3 of 4</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Add Your Students
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Tell us about each child you&apos;ll be homeschooling this year
          </p>

          {/* Add Student Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emma Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={newStudent.birthDate}
                  onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level *
                </label>
                <select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Grade</option>
                  <option value="Pre-K">Pre-K</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="1st Grade">1st Grade</option>
                  <option value="2nd Grade">2nd Grade</option>
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="6th Grade">6th Grade</option>
                  <option value="7th Grade">7th Grade</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={newStudent.emergencyContact}
                  onChange={(e) => setNewStudent({ ...newStudent, emergencyContact: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Grandma (555) 123-4567"
                />
              </div>
            </div>

            <button
              onClick={addStudent}
              disabled={!newStudent.name || !newStudent.birthDate || !newStudent.grade}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Add Student
            </button>
          </div>

          {/* Students List */}
          {students.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Students ({students.length})</h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.grade} • Born: {new Date(student.birthDate).toLocaleDateString()}</p>
                      {student.emergencyContact && (
                        <p className="text-sm text-gray-500">Emergency: {student.emergencyContact}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeStudent(student.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
            
            <div className="flex gap-4">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 font-medium py-3 px-6 transition-colors duration-200"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={loading || students.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Loading...' : students.length === 0 ? 'Add a student first' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Encouraging Message */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Each child is a blessing with unique gifts to discover! 🎯
          </p>
        </div>
      </div>
    </div>
  );
}