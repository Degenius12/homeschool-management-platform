'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    router.push('/onboarding/family-setup');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Step 1 of 4</p>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Welcome to Your Homeschool Journey
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
          Supporting faith-based family education with simple tools for attendance, 
          progress tracking, and Tennessee compliance.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg min-h-[56px] transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Loading...' : 'Get Started'}
          </button>
          
          <button
            onClick={handleSkip}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg min-h-[56px] transition-colors duration-200"
          >
            Skip for Now
          </button>
        </div>

        {/* Encouraging Message */}
        <p className="text-sm text-gray-500 mt-8">
          You&apos;re taking an amazing step in your family&apos;s educational journey! 🌟
        </p>
      </div>
    </div>
  );
}