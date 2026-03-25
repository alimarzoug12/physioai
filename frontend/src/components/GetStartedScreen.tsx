// src/components/GetStartedScreen.tsx
import React from 'react';
import { HiArrowRight } from "react-icons/hi";


type IconComponent = React.ComponentType<{ className?: string }>;
const BackArrow = HiArrowRight  as IconComponent;
//page 1.6 src/components/GetStartedScreen.tsx
class GetStartedScreen extends React.Component {
  render() {
    return (
      <div className="pt-6 bg-gradient-to-br from-blue-600 to-blue-300 flex flex-col items-center justify-center p-6 text-white">
        {/* Conteneur central */}
        <div className="w-full flex flex-col items-center text-center">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-2xl font-semibold mb-3 leading-tight">
            Ready to Feel Better?
          </h1>

          {/* Sous-titre */}
          <p className="text-lg md:text-xxl opacity-90 mb-7">
            Start your journey to recovery with AI-powered physiotherapy matching
          </p>

          {/* Gros bouton principal */}
          <button className="w-full bg-white text-blue-600 font-bold text-xl py-5 px-8 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 mb-5 flex items-center justify-center gap-3">
            Get Started Now
            <BackArrow className="text-2xl" />
          </button>

          {/* Liste des avantages avec coches */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-center md:text-left opacity-90">
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-1xl">✓</span>
              <span className="text-xxl">Free to start</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-1xl">✓</span>
              <span className="text-xxl">No hidden fees</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-1xl">✓</span>
              <span className="text-xxl">Cancel anytime</span>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default GetStartedScreen;