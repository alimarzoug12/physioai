// src/components/PrivacyMatters.tsx
import React from 'react';
import { IoShieldHalfOutline } from "react-icons/io5";
import { FaUserShield } from "react-icons/fa";

//page 1.5 src/components/PrivacyMatters.tsx
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class PrivacyMatters extends React.Component {
  render() {
    return (
      <div className="bg-gray-50 py-10 px-4 md:px-8 flex flex-col items-center">
        {/* Titre principal */}
        <h1 className="text-3xl md:text-2xl font-semibold text-gray-900 mb-12 text-center">
          Your Privacy Matters
        </h1>

        {/* Conteneur des deux blocs */}
        <div className="w-full space-y-6">
          {/* Bloc 1 : Medical Data Protection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <IconWrapper icon={IoShieldHalfOutline} className="text-green-600 text-3xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Medical Data Protection
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  All your health information is encrypted and stored securely according to international healthcare privacy standards.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-2 text-gray-500 px-4 py-1.5 text-sm font-medium">
                    <span className="text-green-500">✓</span> HIPAA Compliant
                  </span>
                  <span className="inline-flex items-center gap-2 text-gray-500 px-4 py-1.5 text-sm font-medium">
                    <span className="text-green-500">✓</span> End-to-End Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc 2 : Identity Verification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <IconWrapper icon={FaUserShield} className="text-blue-600 text-3xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Identity Verification
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  All physiotherapists are verified professionals with valid licenses and certifications in Qatar and GCC countries.
                </p>
              </div>
            </div>
          </div>
        </div>        
      </div>
    );
  }
}

export default PrivacyMatters;