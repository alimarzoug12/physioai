import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartRecoveryPlatformSideBarWithRouter from './SmartRecoveryPlatformSideBar';
import { IoReorderThree } from 'react-icons/io5';
import { MdNotifications } from 'react-icons/md';
import {
  FaHeartPulse,
  FaTrophy,
  FaDumbbell,
  FaRobot,
  FaVideo,
} from 'react-icons/fa6';
import {
  FaUserCircle,
} from 'react-icons/fa';
import { FaCalendarCheck, FaChartLine } from 'react-icons/fa6';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface PatientHomeProps {
  navigate?: (path: string) => void;
}
interface PatientHomeState {
  sidebarOpen: boolean;
}
// page 17 src/pages/PatientHome.tsx
class PatientHome extends React.Component<PatientHomeProps, PatientHomeState> {
  state: PatientHomeState = {
    sidebarOpen: false,
  };
  render() {
    const { sidebarOpen } = this.state;
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        {sidebarOpen && (
          <>
            {/* black/50 backdrop — click anywhere to close */}
            <div className="fixed inset-0 z-40 bg-black/50"
              onClick={() => this.setState({ sidebarOpen: false })} />
            {/* sidebar slides in from left, scrollable */}
            <div className="fixed top-0 left-0 h-full z-50 overflow-y-auto shadow-2xl">
              <SmartRecoveryPlatformSideBarWithRouter onClose={() => this.setState({ sidebarOpen: false })}  />
            </div>
          </>
        )}

        {/* ── Top Navigation ── */}
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <button className="text-gray-500 hover:text-gray-700 transition-colors text-4xl"
          onClick={() => this.setState({ sidebarOpen: true })}>
            <IconWrapper icon={IoReorderThree} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow text-2xl">
              <IconWrapper icon={FaHeartPulse} />
            </div>
            <span className="font-bold text-3xl text-gray-800">PhysioAI</span>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => this.props.navigate?.('/notifications')} className="relative text-gray-400 hover:text-gray-600 transition-colors text-4xl">
              <IconWrapper icon={MdNotifications} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-lg font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="u1" className="w-14 h-14 rounded-full border-2 border-white object-cover" />
          </div>
        </header>

        <div className="p-6 pt-8 space-y-6">

          {/* ── Welcome Banner ── */}
          <div
            className="relative rounded-3xl p-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3b5ce4 0%, #7c3aed 50%, #9b27d4 100%)',
            }}
          >
            {/* Profile circle top-right */}
            <div className="text-white/70 absolute top-5 right-5 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <IconWrapper icon={FaUserCircle} className='text-3xl' />
            </div>

            <h1 className="text-4xl font-bold text-white mb-1">Welcome back, Sarah!</h1>
            <p className="text-2xl text-white/75 mb-5">Ready for your recovery journey today?</p>

            {/* Inner info cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Next Session */}
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3 mb-1 text-cyan-300">
                  <IconWrapper icon={FaCalendarCheck} className='text-2xl' />
                  <span className="text-xl text-white/70 font-medium">Next Session</span>
                </div>
                <p className="text-white font-bold text-2xl">Today, 2:30 PM</p>
              </div>

              {/* Weekly Goal */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3 mb-1 text-yellow-300">
                  <IconWrapper icon={FaTrophy} className='text-2xl' />
                  <span className="text-xl text-white/70 font-medium">Weekly Goal</span>
                </div>
                <p className="text-white font-bold text-2xl">85% Complete</p>
              </div>
            </div>
          </div>

          {/* ── Action Cards Grid ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Start Exercise */}
            <button className="bg-white rounded-3xl p-5 text-left shadow-sm hover:shadow-md transition-shadow active:scale-95 border border-gray-200">
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <IconWrapper icon={FaDumbbell} className='text-4xl' />
              </div>
              <p className="font-semibold text-gray-800 text-2xl">Start Exercise</p>
              <p className="text-xl text-gray-500 mt-0.5">Begin your daily routine</p>
            </button>

            {/* View Progress */}
            <button onClick={() => this.props.navigate?.('/sessions')} className="bg-white rounded-3xl p-5 text-left shadow-sm hover:shadow-md transition-shadow active:scale-95 border border-gray-200">
              <div className="w-16 h-16 rounded-xl bg-green-100 text-green-500 flex items-center justify-center mb-4">
                <IconWrapper icon={FaChartLine} className='text-4xl' />
              </div>
              <p className="font-semibold text-gray-800 text-2xl">View Progress</p>
              <p className="text-xl text-gray-500 mt-0.5">Track your improvements</p>
            </button>

            {/* AI Assistant */}
            <button onClick={() => this.props.navigate?.('/ai-assistant')} className="bg-white rounded-3xl p-5 text-left shadow-sm hover:shadow-md transition-shadow active:scale-95 border border-gray-200">
              <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center mb-4">
                <IconWrapper icon={FaRobot} className='text-4xl' />
              </div>
              <p className="font-semibold text-gray-800 text-2xl">AI Assistant</p>
              <p className="text-xl text-gray-500 mt-0.5">Get personalized help</p>
            </button>

            {/* Telehealth */}
            <button className="bg-white rounded-3xl p-5 text-left shadow-sm hover:shadow-md transition-shadow active:scale-95 border border-gray-200">
              <div className="w-16 h-16 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <IconWrapper icon={FaVideo} className='text-4xl' />
              </div>
              <p className="font-semibold text-gray-800 text-2xl">Telehealth</p>
              <p className="text-xl text-gray-500 mt-0.5">Connect with therapist</p>
            </button>

          </div>
        </div>
      </div>
    );
  }
}


function PatientHomeWithRouter() {
  const navigate = useNavigate();
  return <PatientHome navigate={navigate} />;
}

export default PatientHomeWithRouter;