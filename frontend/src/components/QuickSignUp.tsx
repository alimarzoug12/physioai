// src/components/QuickSignUp.tsx
import React from 'react';
import { FaApple, FaGoogle, FaPhone } from 'react-icons/fa6';
import { TbMailFilled } from "react-icons/tb";


const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
//page 1.7 src/components/QuickSignUp.tsx
class QuickSignUp extends React.Component {
  render() {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 md:p-10">
        {/* Conteneur principal centré */}
        <div className="w-full flex flex-col items-center text-center">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 mb-3">
            Quick Sign Up Options
          </h1>

          {/* Sous-titre */}
          <p className="text-gray-600 text-lg mb-10">
            Choose your preferred method to get started
          </p>

          {/* Boutons d'inscription */}
          <div className="w-full space-y-4">
            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaGoogle} className="text-red-500 text-2xl" />
              Continue with Google
            </button>

            {/* Apple */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaApple} className="text-black text-2xl" />
              Continue with Apple
            </button>

            {/* Phone */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-4 px-6 text-gray-800 font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaPhone} className="text-green-500 text-2xl" />
              Continue with Phone
            </button>

            {/* Séparateur "or" */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Bouton Email (grand dégradé bleu) */}
            <button className="w-full bg-gradient-to-br from-blue-600 to-blue-100 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-3 text-lg">
              <IconWrapper icon={TbMailFilled} className="text-xl" />
              Sign up with Email
            </button>
          </div>

          {/* Lien "Already have an account?" */}
          <p className="mt-8 text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 font-medium hover:underline">
              Sign In
            </a>
          </p>
        </div>        
      </div>
    );
  }
}

export default QuickSignUp;