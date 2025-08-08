'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FamilySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [familyInfo, setFamilyInfo] = useState({
    familyName: '',
    primaryEducator: '',
    schoolYear: '2024-2025',
    grade: 'Mixed Ages'
  });

  const handleNext = () => {
    setLoading(true);
    // Save family info to localStorage
    localStorage.setItem('homeschool-family-info', JSON.stringify(familyInfo));
    router.push('/onboarding/students-setup');
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Step 2 of 4</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Tell Us About Your Family
          </h1>
          <p className="text-gray-600 text-center mb-8">
            This helps us personalize your homeschool experience
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
                Family Name
              </label>
              <input
                type="text"
                id="familyName"
                value={familyInfo.familyName}
                onChange={(e) => setFamilyInfo({ ...familyInfo, familyName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="The Smith Family"
              />
            </div>

            <div>
              <label htmlFor="primaryEducator" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Educator Name
              </label>
              <input
                type="text"
                id="primaryEducator"
                value={familyInfo.primaryEducator}
                onChange={(e) => setFamilyInfo({ ...familyInfo, primaryEducator: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mom, Dad, or your name"
              />
            </div>

            <div>
              <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700 mb-2">
                Current School Year
              </label>
              <select
                id="schoolYear"
                value={familyInfo.schoolYear}
                onChange={(e) => setFamilyInfo({ ...familyInfo, schoolYear: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level(s) You&apos;re Teaching
              </label>
              <select
                id="grade"
                value={familyInfo.grade}
                onChange={(e) => setFamilyInfo({ ...familyInfo, grade: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Mixed Ages">Mixed Ages</option>
                <option value="Pre-K">Pre-K</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Elementary (K-5)">Elementary (K-5)</option>
                <option value="Middle School (6-8)">Middle School (6-8)</option>
                <option value="High School (9-12)">High School (9-12)</option>
              </select>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
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
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Encouraging Message */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Every family&apos;s journey is unique and special! ✨
          </p>
        </div>
      </div>
    </div>
  );
}