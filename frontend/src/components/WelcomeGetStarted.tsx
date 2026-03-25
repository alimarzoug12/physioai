import React from 'react';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRobot, FaCalendarCheck } from 'react-icons/fa';
import { PiMapPinFill } from 'react-icons/pi';
import { HiArrowLeft } from 'react-icons/hi';
import { FaCircleQuestion  } from 'react-icons/fa6';
import { FiCheck  } from 'react-icons/fi';

// IconWrapper component to handle icon type issues
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class WelcomeGetStarted extends React.Component {
  render() {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col">
        {/* Header avec retour + aide */}
        <header className="w-full flex justify-between items-center p-4 md:p-6">
          <button className="text-gray-700 text-2xl hover:text-gray-900 transition">
            <IconWrapper icon={HiArrowLeft} className="text-2xl" />
          </button>
          <button className=" flex items-center justify-center text-gray-700 hover:bg-blue-200 transition text-xl font-bold">
            <IconWrapper icon={FaCircleQuestion } className="text-2xl" />
          </button>
        </header>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-3xl font-semibold text-cyan-500 mb-3">
            Welcome to Physio AI
          </h1>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-red-500 mb-10">
            Weak
          </p>

          {/* Icône centrale avec coche verte */}
          <div className="relative mb-12">
            <div className="w-26 h-26 md:w-36 md:h-36 bg-gradient-to-br from-blue-400 to-green-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <IconWrapper icon={FaUserDoctor} className="text-white text-6xl md:text-5xl" />
            </div>
            {/* Coche verte superposée */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl"><IconWrapper icon={FiCheck} /></span>
            </div>
          </div>

          {/* Texte secondaire */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Get Started with Physio AI
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-12">
            Connect with licensed physiotherapists using AI-powered symptom analysis and smart matching
          </p>

          {/* Petites icônes features */}
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

          {/* Boutons d'action */}
          <div className="w-full bg-gray-100 border rounded-3xl flex flex-col sm:flex-row gap-4">
            {/* Bouton Sign Up */}
            <button className="flex-1 mt-1 mb-1 ml-1 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-xl py-5 px-8 rounded-xl shadow-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300">
              Sign Up
            </button>

            {/* Bouton Log In */}
            <button className="flex-1 bg-gray-100  text-gray-600 font-semibold text-xl py-5 px-8 rounded-2xl hover:bg-blue-50 transition-all duration-300">
              Log In
            </button>
          </div>
        </div>        
      </div>
    );
  }
}

export default WelcomeGetStarted;