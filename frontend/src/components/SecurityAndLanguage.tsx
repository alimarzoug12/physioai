// src/components/SecurityAndLanguage.tsx
import React from 'react';
import { FaCheck, FaEyeSlash, FaLock, FaTruckMedical, FaUserShield } from 'react-icons/fa6';
import { IoChevronDownOutline } from 'react-icons/io5';
import { MdOutlineLanguage } from "react-icons/md";

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
class SecurityAndLanguage extends React.Component {
  state = {
    selectedLanguage: 'English',
    showLanguageDropdown: false,
  };

  handleLanguageSelect = (lang: 'English' | 'Arabic') => {
    this.setState({ selectedLanguage: lang });
    // Sauvegarde réelle (localStorage, context, i18n, etc.)
    console.log('Langue sélectionnée :', lang);
    // Exemple : localStorage.setItem('preferredLanguage', lang);
  };

  render() {
    const { selectedLanguage } = this.state;

    return (
      <div className="bg-gray-50 flex flex-col items-center">
        <div className="w-full bg-white">
          {/* Section 1: Your data is protected */}
          <div className="p-8 md:p-5 border-b border-gray-100">
            <h2 className="text-2xl md:text-xl font-semibold text-gray-900 mb-8 text-left">
              Your data is protected
            </h2>

            <div className="grid grid-cols-3 gap-6 text-center">
              {/* 256-bit SSL */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-500 text-4xl"><IconWrapper icon={FaLock} className="text-2xl" /></span>
                </div>
                <p className="text-sm md:text-base font-medium text-gray-700">
                  256-bit SSL
                </p>
              </div>

              {/* HIPAA Compliant */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-4xl"><IconWrapper icon={FaUserShield} className="text-3xl" /></span>
                </div>
                <p className="text-sm md:text-base font-medium text-gray-700">
                  HIPAA Compliant
                </p>
              </div>

              {/* Private Data */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-500 text-4xl"><IconWrapper icon={FaEyeSlash} className="text-3xl" /></span>
                </div>
                <p className="text-sm md:text-base font-medium text-gray-700">
                  Private Data
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Medical Emergency */}
          <div className="bg-red-50 p-6 border-b border-red-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center">
                  <span className="text-red-500 text-4xl"><IconWrapper icon={FaTruckMedical} className="text-4xl" /></span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800">
                    Medical Emergency?
                  </h3>
                  <p className="font-medium text-red-500 text-sm md:text-base">
                    For urgent care, call emergency services immediately
                  </p>
                </div>
              </div>

              <button className="bg-red-500 text-white font-semibold text-lg px-5 py-1 rounded-xl hover:bg-red-600 transition whitespace-nowrap">
                Call 999
              </button>
            </div>
          </div>

          {/* Section 3: Language Selector */}
        {/* ==================== LANGUAGE SELECTOR ==================== */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl text-gray-600">
              <IconWrapper icon={MdOutlineLanguage} />
            </span>
            <div className="flex items-center justify-between">
            {/* Left side: Title + Subtitle */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Language</h3>
              <p className="text-base text-gray-600">Choose your preferred language</p>
            </div>

            <button
              onClick={() => this.setState({ showLanguageDropdown: !this.state.showLanguageDropdown })}
              className="absolute right-6 flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow transition-all min-w-[167px]"
            >
              <div className="flex items-center gap-3">
                <span className={`fi text-lg ${this.state.selectedLanguage === 'English' ? 'fi-us' : 'fi-sa'}`} />
                <span className="font-normal text-xl text-gray-700">
                  {this.state.selectedLanguage === 'English' ? 'English' : 'العربية'}
                </span>
              </div>
              <span className="text-gray-400 text-2xl">
                <IconWrapper icon={IoChevronDownOutline} />
              </span>
            </button>
          </div>
          </div>

          {/* Dropdown Button + Menu */}
          <div className="relative">
            

            {/* Dropdown */}
            {this.state.showLanguageDropdown && (
              <div className="absolute w-full bg-white">

                {/* English */}
                <div
                  onClick={() => this.setState({ 
                    selectedLanguage: 'English', 
                    showLanguageDropdown: false 
                  })}
                  className={`flex items-center justify-between px-5 py-5 cursor-pointer hover:bg-gray-50 rounded-xl mb-3 ${
                    this.state.selectedLanguage === 'English' ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="fi fi-us text-2xl" />
                    <span className="font-normal text-xl text-gray-700">English</span>
                  </div>
                  {this.state.selectedLanguage === 'English' && (
                    <span className="text-blue-600 text-2xl"><IconWrapper icon={FaCheck} /></span>
                  )}
                </div>

                {/* Arabic */}
                <div
                  onClick={() => this.setState({ 
                    selectedLanguage: 'Arabic', 
                    showLanguageDropdown: false 
                  })}
                  className={`flex items-center justify-between px-5 py-5 cursor-pointer hover:bg-gray-50 rounded-xl mb-3 ${
                    this.state.selectedLanguage === 'Arabic' ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="fi fi-sa text-2xl" />
                    <span className="font-medium text-xl text-gray-600">العربية</span>
                  </div>
                  {this.state.selectedLanguage === 'Arabic' && (
                    <span className="text-blue-600 text-2xl"><IconWrapper icon={FaCheck} /></span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>        
      </div>
    );
  }
}

export default SecurityAndLanguage;