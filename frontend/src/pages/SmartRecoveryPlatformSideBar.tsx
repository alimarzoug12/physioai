import React from 'react';

//page 14 src/pages/SmartRecoveryPlatformSideBar.tsx
class SmartRecoveryPlatformSideBar extends React.Component {
  render() {
    return (
      <div className="w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-600 text-white p-4 flex flex-col">
        {/* n1: physio ai */}
        <div className="flex items-center mb-8">
          <div className="bg-blue-200 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">💙</div>
          <div>
            <h1 className="font-bold text-lg">PhysioAI</h1>
            <p className="text-sm opacity-80">Smart Recovery Platform</p>
          </div>
        </div>
        <div className="flex items-center mb-8">
          <img src="placeholder-patient.jpg" alt="Sarah Johnson" className="w-10 h-10 rounded-full mr-3" />
          <div className="flex-1">
            <p className="font-semibold">Sarah Johnson</p>
            <p className="text-sm opacity-80">Patient ID: PT-2024-001</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm">Online</p>
            <button className="text-white ml-2">⚙️</button>
          </div>
        </div>

        {/* n2: today's overview */}
        <div className="bg-blue-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold uppercase opacity-80 mb-2">Today's Overview</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs opacity-80">Exercises</p>
            </div>
            <div>
              <p className="text-2xl font-bold">45m</p>
              <p className="text-xs opacity-80">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold">3/10</p>
              <p className="text-xs opacity-80">Pain Level</p>
            </div>
          </div>
        </div>
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">Patient Dashboard</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex justify-between items-center bg-blue-700 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 w-8 h-8 rounded-md flex items-center justify-center">
                <span className="text-white">🏠</span>
              </div>
              <div>
                <p className="font-semibold">Dashboard Overview</p>
                <p className="text-xs opacity-80">Health summary & insights</p>
                <p className="text-xs text-green-300">75% complete</p>
              </div>
            </div>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">3</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-blue-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🏋️</span>
            </div>
            <div>
              <p className="font-semibold">My Exercises</p>
              <p className="text-xs opacity-80">Daily routines & workouts</p>
              <p className="text-xs text-orange-300">5-day streak</p>
            </div>
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">Due</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📈</span>
            </div>
            <div>
              <p className="font-semibold">Progress Tracking</p>
              <p className="text-xs opacity-80">Recovery metrics & analytics</p>
              <p className="text-xs text-green-300">↑ 15% improvement</p>
            </div>
            <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">78%</span>
            <button className="text-white">&gt;</button>
          </li>
        </ul>

        {/* n3: ai assistant */}
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">AI-Powered Features</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-teal-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🤖</span>
            </div>
            <div>
              <p className="font-semibold">AI Assistant</p>
              <p className="text-xs opacity-80">Smart guidance & support</p>
              <p className="text-xs text-green-300">Available 24/7</p>
            </div>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">AI</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🧠</span>
            </div>
            <div>
              <p className="font-semibold">Smart Insights</p>
              <p className="text-xs opacity-80">AI-driven health analysis</p>
              <p className="text-xs text-purple-300">3 new insights</p>
            </div>
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">Smart</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-blue-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📊</span>
            </div>
            <div>
              <p className="font-semibold">Predictive Analytics</p>
              <p className="text-xs opacity-80">Recovery forecasting</p>
              <p className="text-xs text-blue-300">2 weeks ahead</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-green-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🌿</span>
            </div>
            <div>
              <p className="font-semibold">Wellness Coach</p>
              <p className="text-xs opacity-80">Personalized recommendations</p>
              <p className="text-xs text-green-300">Daily tips ready</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
        </ul>

        {/* n4: vital signs */}
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">Health Records & Data</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-pink-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">❤️</span>
            </div>
            <div>
              <p className="font-semibold">Vital Signs</p>
              <p className="text-xs opacity-80">Health metrics & monitoring</p>
              <div className="flex gap-2 text-xs">
                <span className="text-green-300">HR: 72</span>
                <span className="text-blue-300">BP: Normal</span>
              </div>
            </div>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-green-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📋</span>
            </div>
            <div>
              <p className="font-semibold">Test Results</p>
              <p className="text-xs opacity-80">Lab reports & diagnostics</p>
              <p className="text-xs text-green-300">5 reports available</p>
            </div>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">PDF</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-yellow-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📝</span>
            </div>
            <div>
              <p className="font-semibold">Medical History</p>
              <p className="text-xs opacity-80">Complete health records</p>
              <p className="text-xs text-green-300">Secure & encrypted</p>
            </div>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Updated</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">💊</span>
            </div>
            <div>
              <p className="font-semibold">Medications</p>
              <p className="text-xs opacity-80">Current prescriptions & dosages</p>
              <p className="text-xs text-blue-300">3 reminders set</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
        </ul>

        {/* n5: emergency contact */}
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">Tools & Resources</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📞</span>
            </div>
            <div>
              <p className="font-semibold">Emergency Contact</p>
              <p className="text-xs opacity-80">24/7 support hotline</p>
              <p className="text-xs text-red-300">Always available</p>
            </div>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">SOS</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-green-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📱</span>
            </div>
            <div>
              <p className="font-semibold">Exercise App</p>
              <p className="text-xs opacity-80">Guided workout sessions</p>
              <div className="text-yellow-300 text-xs">★★★★★ 4.9/5</div>
            </div>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Premium</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📖</span>
            </div>
            <div>
              <p className="font-semibold">Education Hub</p>
              <p className="text-xs opacity-80">Learning materials & guides</p>
              <p className="text-xs text-purple-300">12 courses available</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-green-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">👥</span>
            </div>
            <div>
              <p className="font-semibold">Support Groups</p>
              <p className="text-xs opacity-80">Community & peer support</p>
              <p className="text-xs text-pink-300">248 active members</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-5 h-5 bg-purple-300 rounded-full"></div>
              <div className="w-5 h-5 bg-blue-300 rounded-full"></div>
              <span className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">+</span>
            </div>
            <button className="text-white">&gt;</button>
          </li>
        </ul>

        {/* n6: wellness */}
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">Communication Hub</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-teal-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">💬</span>
            </div>
            <div>
              <p className="font-semibold">Messages</p>
              <p className="text-xs opacity-80">Chat with your therapist</p>
              <p className="text-xs text-green-300">Dr. Chen is online</p>
            </div>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">New</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-orange-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🎥</span>
            </div>
            <div>
              <p className="font-semibold">Telehealth</p>
              <p className="text-xs opacity-80">Virtual consultations</p>
              <p className="text-xs text-green-300">HD quality available</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
        </ul>
        <h3 className="text-sm font-bold uppercase opacity-80 mb-4">Wellness</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-orange-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">📅</span>
            </div>
            <div>
              <p className="font-semibold">Wellness Planner</p>
              <p className="text-xs opacity-80">Daily health scheduling</p>
              <p className="text-xs text-green-300">5/7 goals completed</p>
            </div>
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">71%</span>
            <button className="text-white">&gt;</button>
          </li>
        </ul>

        {/* n7: account & settings */}
        <h3 className="text-sm font-bold uppercase opacity-80 mt-auto mb-4">Account & Settings</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-gray-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">👤</span>
            </div>
            <div>
              <p className="font-semibold">Profile Settings</p>
              <p className="text-xs opacity-80">Personal information & preferences</p>
              <p className="text-xs text-green-300">Profile 95% complete</p>
            </div>
            <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">95%</span>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🔔</span>
            </div>
            <div>
              <p className="font-semibold">Notifications</p>
              <p className="text-xs opacity-80">Alerts & reminder preferences</p>
              <p className="text-xs text-green-300">Push notifications on</p>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
            </div>
            <button className="text-white">&gt;</button>
          </li>
          <li className="flex items-center gap-3 bg-blue-700 rounded-lg p-3">
            <div className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white">🛡️</span>
            </div>
            <div>
              <p className="font-semibold">Privacy & Security</p>
              <p className="text-xs opacity-80">Data protection settings</p>
              <p className="text-xs text-green-300">2FA enabled</p>
            </div>
            <button className="text-white">&gt;</button>
          </li>
        </ul>
        <button className="bg-purple-700 text-white py-3 rounded-xl mt-4 flex items-center justify-center">
          <span className="mr-2">➡️</span> Sign Out
        </button>
        <p className="text-center text-xs opacity-80 mt-4">Privacy Policy • Terms of Service • v2.4.0</p>
      </div>
    );
  }
}

export default SmartRecoveryPlatformSideBar;