import React from 'react';

//page 15 src/pages/PhysiotherapistDashboardHeader.tsx
class PhysiotherapistDashboardHeader extends React.Component {
  render() {
    return (
      <div className="bg-white">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          <button className="text-blue-500 text-2xl">≡</button>
          <div className="flex items-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">💙</div>
            <span className="font-bold text-lg text-blue-900">PhysioAI</span>
            <span className="text-sm text-gray-500 ml-1">Physiotherapist Portal</span>
          </div>
          <div className="flex items-center">
            <button className="relative mr-4 text-gray-600 text-xl">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">5</span>
            </button>
            <img src="placeholder-profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-b-3xl">
          <h1 className="text-2xl font-bold mb-1">Welcome, Dr. Johnson!</h1>
          <p className="text-sm">Your practice dashboard is ready. You have 8 appointments today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 p-4 -mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-xl shadow-md text-center">
            <span className="text-blue-300 text-xl block mb-1">👥</span>
            <p className="text-sm opacity-80">Active Patients</p>
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm text-green-200">+3 this week</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white p-4 rounded-xl shadow-md text-center">
            <span className="text-green-300 text-xl block mb-1">📅</span>
            <p className="text-sm opacity-80">Today</p>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm opacity-80">appointments</p>
          </div>
          <div className="bg-gradient-to-r from-pink-600 to-purple-400 text-white p-4 rounded-xl shadow-md text-center">
            <span className="text-yellow-300 text-xl block mb-1">📈</span>
            <p className="text-sm opacity-80">Success Rate</p>
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm opacity-80">this month</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysiotherapistDashboardHeader;