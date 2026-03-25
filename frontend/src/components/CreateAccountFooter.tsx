// src/components/CreateAccountFooter.tsx
import React from 'react';

const CreateAccountFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
      <div className="mx-auto px-4 py-6 space-y-4">
        
        {/* Create Account Button */}
        <button className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-300 text-white font-semibold text-xl shadow-lg active:scale-[0.97] transition-transform">
          Create Account
        </button>

        {/* Continue as Guest */}
        <button className="w-full h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 font-medium text-xl transition-colors">
          Continue as Guest
        </button>

        {/* Log In Link */}
        <div className="text-center pt-2">
          <p className="font-normal text-lg text-gray-500">
            Already have an account?{' '}
            <span className="text-blue-600 font-normal hover:underline cursor-pointer">
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountFooter;