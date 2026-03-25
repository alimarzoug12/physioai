// src/components/SupportHelpSection.tsx
import React from 'react';
import { FaHeadset, FaQuestionCircle } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
class SupportHelpSection extends React.Component {
  render() {
    return (
      <div className=" bg-gray-50 flex flex-col items-center py-10 px-4 md:px-8">
        <div className="w-full ">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-xl font-semibold text-gray-900 mb-8 text-left">
            Need Help?
          </h1>

          {/* Deux cartes principales : Live Chat + FAQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Live Chat */}
            <div className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  <span className="text-blue-600 text-2xl"><IconWrapper icon={FaHeadset } /></span>
                </div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Live Chat
                  <p className="font-normal text-gray-500 text-lg">
                24/7 Support
              </p>
                </h2>
              </div>
              
            </div>

            {/* FAQ */}
            <div className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className=" flex items-center justify-center">
                  <span className="text-green-500 text-2xl"><IconWrapper icon={FaQuestionCircle } /></span>
                </div>
                <h2 className="text-xl font-semibold text-gray-700">
                  FAQ
                  <p className="font-normal text-gray-500 text-lg">
                Quick Answers
              </p>
                </h2>
              </div>
              
            </div>
          </div>

          {/* Section Contact Support */}
          <div className="bg-white border border-gray-200 rounded-xl p-2 md:p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center">
                <span className="text-green-600 text-2xl"><IconWrapper icon={FaPhone } /></span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Support
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span className="font-medium text-gray-600">+974 4000 1234</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <span className="font-medium text-gray-600">support@physio-ai.qa</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">🕒</span>
                <span className="font-medium text-gray-600">
                  Sunday - Thursday: 8AM - 8PM
                </span>
              </div>
            </div>            
          </div>
        </div>
      </div>
    );
  }
}

export default SupportHelpSection;