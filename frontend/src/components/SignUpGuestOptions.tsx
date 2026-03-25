// src/components/SignUpGuestOptions.tsx
import React from 'react';

class SignUpGuestOptions extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          {/* Titre (optionnel - pas visible sur ta capture mais logique) */}
          <h1 className="text-3xl font-bold text-gray-900 mb-12">
            Get Started with Physio AI
          </h1>

          {/* Bouton Create Account (dégradé bleu-vert) */}
          <button className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white font-bold text-xl py-5 px-8 rounded-full shadow-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transition-all duration-300 mb-6">
            Create Account
          </button>

          {/* Bouton Continue as Guest (fond blanc + bordure) */}
          <button className="w-full bg-white border-2 border-gray-300 text-gray-800 font-bold text-xl py-5 px-8 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 mb-10">
            Continue as Guest
          </button>

          {/* Lien "Already have an account?" */}
          <p className="text-gray-600 text-base">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default SignUpGuestOptions;