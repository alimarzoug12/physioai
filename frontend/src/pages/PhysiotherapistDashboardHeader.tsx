import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartPulse, FaUsers, FaCalendarCheck, FaChartLine, FaUserDoctor } from 'react-icons/fa6';
import { IoReorderThree } from 'react-icons/io5';
import { MdNotifications } from 'react-icons/md';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
// page 15 src/pages/PhysiotherapistDashboardHeader.tsx
interface PhysiotherapistDashboardHeaderProps {
  navigate?: (path: string) => void;
}
class PhysiotherapistDashboardHeader extends React.Component<PhysiotherapistDashboardHeaderProps> {
  render() {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-6 bg-white shadow-sm">
          <button onClick={() => this.props.navigate?.('/smart-therapy-assistant-sidebar')} className="text-gray-500 hover:text-gray-700 transition-colors text-5xl">
            <IconWrapper icon={IoReorderThree} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-14 h-14 rounded-xl flex items-center justify-center shadow text-3xl">
              <IconWrapper icon={FaHeartPulse} />
            </div>

            {/* Texte en colonne */}
            <div className="flex flex-col items-center">
              <span className="font-bold text-3xl text-gray-800 leading-none mb-2">PhysioAI</span>
              <p className="text-lg text-gray-500 mt-0.5">Physiotherapist Portal</p>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors text-4xl">
              <IconWrapper icon={MdNotifications} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-lg font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="u1" className="w-14 h-14 rounded-full border-2 border-white object-cover" />
          </div>
        </header>

        {/* Welcome Banner with Stats Cards overlapping */}
        <div
          className="relative mx-6 my-8 rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 45%, #be123c 100%)',
          }}
        >
          {/* Doctor icon top-right */}
          <div className="absolute top-6 right-6">
            <div className="w-20 h-20 rounded-full bg-white/20 text-white/90 flex items-center justify-center text-4xl">
              <IconWrapper icon={FaUserDoctor} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-1">Welcome, Dr. Johnson!</h1>
          <p className="text-xl text-white/80">
            Your practice dashboard is ready. You have 8 appointments today.
          </p>

          {/* Stats Cards — NOW INSIDE the banner */}
          <div className="grid grid-cols-3 gap-5 mt-8">
            {/* Active Patients */}
            <div
              className="rounded-2xl p-4 text-white text-center shadow-lg bg-white/10"

            >
              <div className="text-cyan-300 flex items-center justify-center gap-3 mb-1">
                <IconWrapper icon={FaUsers} className='text-3xl' />
                <span className="text-2xl font-semibold text-white">Active Patients</span>
              </div>
              <p className="text-4xl font-bold leading-tight">24</p>
              <p className="text-xl text-white/70 mt-0.5">+3 this week</p>
            </div>

            {/* Today */}
            <div
              className="rounded-2xl p-4 text-white text-center shadow-lg bg-white/10"
            >
              <div className="flex items-center justify-center gap-3 mb-1 text-green-300">
                <IconWrapper icon={FaCalendarCheck} className='text-3xl' />
                <span className="text-2xl font-semibold text-white">Today</span>
              </div>
              <p className="text-4xl font-bold leading-tight">8</p>
              <p className="text-xl text-white/70 mt-0.5">appointments</p>
            </div>

            {/* Success Rate */}
            <div
              className="rounded-2xl p-4 text-white text-center shadow-lg bg-white/10"
            >
              <div className="flex items-center justify-center gap-3 mb-1 text-yellow-300">
                <IconWrapper icon={FaChartLine} className='text-3xl' />
                <span className="text-2xl font-semibold text-white">Success Rate</span>
              </div>
              <p className="text-4xl font-bold leading-tight">95%</p>
              <p className="text-xl text-white/70 mt-0.5">this month</p>
            </div>
          </div>
        </div>

        {/* Spacer so content below cards isn't hidden */}
        {/* <div className="mt-24" /> */}
      </div>
    );
  }
}

function PhysiotherapistDashboardHeaderWithRouter() {
  const navigate = useNavigate();
  return <PhysiotherapistDashboardHeader navigate={navigate} />;
}

export default PhysiotherapistDashboardHeaderWithRouter;