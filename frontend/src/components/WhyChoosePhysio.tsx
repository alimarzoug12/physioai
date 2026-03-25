// src/components/WhyChoosePhysio.tsx
import React from 'react';
import { FaBrain } from 'react-icons/fa';
import { FaMobileScreenButton } from "react-icons/fa6";
import { GoClockFill } from 'react-icons/go';

// Reuse the same IconWrapper component
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class WhyChoosePhysio extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
        {/* Conteneur principal centré */}
        <div className="w-full ">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 text-center mb-10">
            Why Choose Physio AI?
          </h1>

          {/* Les 3 blocs features */}
          <div className="space-y-6">
            {/* Bloc 1: AI-Powered Matching */}
            <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
                  <IconWrapper icon={FaBrain} className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    AI-Powered Matching
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced algorithms match you with the perfect physiotherapist based on your specific needs and location.
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc 2: 24/7 Availability */}
            <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-yellow-600 rounded-full flex items-center justify-center text-white text-3xl">
                  <IconWrapper icon={GoClockFill} className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    24/7 Availability
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Book appointments anytime, get AI assistance round the clock, and access emergency guidance when needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Bloc 3: Seamless Experience */}
            <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                  <IconWrapper icon={FaMobileScreenButton} className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Seamless Experience
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    From symptom description to recovery tracking, everything is designed for your convenience and comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhyChoosePhysio;