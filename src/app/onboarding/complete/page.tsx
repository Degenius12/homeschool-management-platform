'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    // Mark onboarding as completed
    localStorage.setItem('homeschool-onboarding-completed', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Step 4 of 4 - Complete!</p>
        </div>

        {/* Celebration Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-6xl mb-6">🎉</div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            You&apos;re All Set!
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            Your homeschool management platform is ready to support your family&apos;s 
            educational journey with faith-based learning and Tennessee compliance tracking.
          </p>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s available now:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Daily Attendance</h4>
                  <p className="text-sm text-gray-600">Track your 180-day requirement</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Student Progress</h4>
                  <p className="text-sm text-gray-600">Monitor learning milestones</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Compliance Reports</h4>
                  <p className="text-sm text-gray-600">Stay Tennessee compliant</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Curriculum Planning</h4>
                  <p className="text-sm text-gray-600">Organize lessons and subjects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg text-lg min-h-[56px] transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Loading...' : 'Start Your Homeschool Journey'}
          </button>
        </div>

        {/* Encouraging Final Message */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
          <p className="text-gray-700 font-medium mb-2">
            &ldquo;Train up a child in the way he should go, and when he is old he will not depart from it.&rdquo;
          </p>
          <p className="text-sm text-gray-600">
            - Proverbs 22:6
          </p>
        </div>
      </div>
    </div>
  );
}