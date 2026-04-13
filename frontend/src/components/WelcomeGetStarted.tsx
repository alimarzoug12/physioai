import React from 'react';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRobot, FaCalendarCheck } from 'react-icons/fa';
import { PiMapPinFill } from 'react-icons/pi';
import { HiArrowLeft } from 'react-icons/hi';
import { FaCircleQuestion } from 'react-icons/fa6';
import { FiCheck } from 'react-icons/fi';
import SignUpForm from './SignUpForm';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

interface Props {
  activeTab: 'signup' | 'login';
  setActiveTab: (tab: 'signup' | 'login') => void;
  onSignupDataChange?: (data: any) => void;
  onLoginDataChange?: (data: any) => void;
}

class WelcomeGetStarted extends React.Component<Props> {


  render() {
    return (
      <div className="flex flex-col">

        {/* Header */}
        <header className="bg-white w-full flex justify-between items-center p-4 md:p-6">
          <button type="button" className="text-gray-700 text-3xl hover:text-gray-900">
            <IconWrapper icon={HiArrowLeft} />
          </button>

          <h1 className="text-4xl md:text-3xl font-semibold text-cyan-500 mb-3">
            Welcome to Physio AI
          </h1>
          <button type="button" className="flex items-center justify-center text-gray-700 hover:bg-blue-200 text-3xl font-bold">
            <IconWrapper icon={FaCircleQuestion} />
          </button>
        </header>

        {/* Content */}
        <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center pt-6 border-t border-gray-200">

          {/* Icon */}
          <div className="relative mb-12">
            <div className="w-26 h-26 md:w-36 md:h-36 bg-gradient-to-br from-blue-500 to-green-400 rounded-3xl flex items-center justify-center shadow-[0_0_28px_rgba(0,0,0,0.1)] shadow-blue-300 animate-nudge" >
              <IconWrapper icon={FaUserDoctor} className="text-white text-5xl" />
            </div>

            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-2xl">
                <IconWrapper icon={FiCheck} />
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Get Started with Physio AI
          </h2>

          <p className="text-gray-600 text-base md:text-lg mb-12">
            Connect with licensed physiotherapists using AI-powered analysis
          </p>

          {/* Features */}
          <div className="flex justify-center gap-10 md:gap-16 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <IconWrapper icon={FaRobot} className="text-blue-500 text-3xl" />
              </div>
              <span className="text-sm text-gray-600">AI</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <IconWrapper icon={PiMapPinFill} className="text-teal-500 text-3xl" />
              </div>
              <span className="text-sm text-gray-600">Location</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <IconWrapper icon={FaCalendarCheck} className="text-purple-500 text-2xl" />
              </div>
              <span className="text-sm text-gray-600">Booking</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full bg-gray-100 border rounded-3xl flex flex-col sm:flex-row gap-4">

            {/* SIGN UP */}
            <button
              type="button"
              onClick={() => this.props.setActiveTab('signup')}
              className={`flex-1 mt-1.5 mb-1.5 ml-1.5 font-semibold text-xl py-5 px-8 rounded-2xl
    ${this.props.activeTab === 'signup'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                  : 'bg-gray-100 text-gray-600'}
  `}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => this.props.setActiveTab('login')}
              className={`flex-1 mt-1.5 mb-1.5 mr-1.5 font-semibold text-xl py-5 px-8 rounded-2xl
    ${this.props.activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                  : 'bg-gray-100 text-gray-600'}
  `}
            >
              Log In
            </button>

          </div>

          {/* Form */}
          <SignUpForm
            activeTab={this.props.activeTab}
            onSignupDataChange={this.props.onSignupDataChange}
            onLoginDataChange={this.props.onLoginDataChange}
          />

        </div>
      </div>
    );
  }
}

export default WelcomeGetStarted;