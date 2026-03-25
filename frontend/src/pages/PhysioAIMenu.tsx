import React from 'react';

//page 14 src/pages/PhysioAIMenu.tsx
class PhysioAIMenu extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-white">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          <button className="text-blue-500 text-2xl">≡</button>
          <div className="flex items-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">💙</div>
            <span className="font-bold text-lg text-blue-900">PhysioAI</span>
          </div>
          <div className="flex items-center">
            <button className="relative mr-4 text-gray-600 text-xl">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">1</span>
            </button>
            <img src="placeholder-profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-b-3xl">
          <h1 className="text-2xl font-bold mb-1">Welcome back, Sarah!</h1>
          <p className="text-sm">Ready for your recovery journey today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 p-4 -mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-xl shadow-md text-left">
            <span className="text-blue-300 text-xl block mb-1">✓</span>
            <p className="text-sm opacity-80">Next Session</p>
            <p className="text-xl font-bold">Today, 2:30 PM</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white p-4 rounded-xl shadow-md text-left">
            <span className="text-yellow-300 text-xl block mb-1">🏆</span>
            <p className="text-sm opacity-80">Weekly Goal</p>
            <p className="text-xl font-bold">85% Complete</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <span className="bg-blue-100 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🏋️</span>
            <p className="font-semibold text-gray-900">Start Exercise</p>
            <p className="text-sm text-gray-600">Begin your daily routine</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <span className="bg-green-100 text-green-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">📈</span>
            <p className="font-semibold text-gray-900">View Progress</p>
            <p className="text-sm text-gray-600">Track your improvements</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <span className="bg-purple-100 text-purple-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🤖</span>
            <p className="font-semibold text-gray-900">AI Assistant</p>
            <p className="text-sm text-gray-600">Get personalized help</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <span className="bg-orange-100 text-orange-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🎥</span>
            <p className="font-semibold text-gray-900">Telehealth</p>
            <p className="text-sm text-gray-600">Connect with therapist</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysioAIMenu;