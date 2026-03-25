import React from 'react';

//page 13 src/pages/SmartTherapyAssistantSidebar.tsx
class SmartTherapyAssistantSidebar extends React.Component {
  render() {
    return (
      <div className="w-72 h-screen bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-900 text-white flex flex-col overflow-y-auto">
        
        {/* n1: physio ai */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h1 className="font-bold text-xl">Physio AI</h1>
                <p className="text-sm opacity-80">Smart Therapy Assistant</p>
              </div>
            </div>
            <button className="text-white/70 hover:text-white">×</button>
          </div>

          <div className="mt-6 bg-white/10 rounded-xl p-3 flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" 
              alt="Dr. Sarah Mitchell" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">Dr. Sarah Mitchell</p>
              <p className="text-xs opacity-80">Licensed Physiotherapist</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* n2: voice command */}
        <div className="p-4 border-b border-white/10">
          <div className="bg-purple-600/40 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <span className="text-xl">🎤</span>
              </div>
              <div>
                <p className="font-semibold">Voice Commands</p>
                <p className="text-xs opacity-70">Beta</p>
              </div>
            </div>
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Beta</span>
          </div>
        </div>

        {/* n3: pain assessment */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold uppercase opacity-80 mb-3">PAIN ASSESSMENT</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">🩺</span>
              <span>Pain Assessment</span>
            </li>
          </ul>

          <h3 className="text-sm font-bold uppercase opacity-80 mt-6 mb-3">TREATMENT</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-90">🏃‍♂️</span>
                <span>Exercise Library</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">2.4k</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">▶️</span>
              <span>Video Exercises</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📋</span>
              <span>Treatment Protocols</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">⏱️</span>
              <span>Session Timer</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">❤️</span>
              <span>Recovery Plans</span>
            </li>
          </ul>

          <h3 className="text-sm font-bold uppercase opacity-80 mt-6 mb-3">ANALYTICS</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📊</span>
              <span>Performance Metrics</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📈</span>
              <span>Progress Reports</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📉</span>
              <span>Outcome Analysis</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📜</span>
              <span>Treatment History</span>
            </li>
          </ul>
        </div>

        {/* n4: communication */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold uppercase opacity-80 mb-3">COMMUNICATION</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-90">💬</span>
                <span>Messages</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">7</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">🎥</span>
              <span>Video Calls</span>
            </li>
            <li className="flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-90">🔔</span>
                <span>Notifications</span>
              </div>
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">15</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">🔗</span>
              <span>Referrals</span>
            </li>
          </ul>

          <h3 className="text-sm font-bold uppercase opacity-80 mt-6 mb-3">RESOURCES</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">📚</span>
              <span>Knowledge Base</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">🎓</span>
              <span>Training Materials</span>
            </li>
            <li className="flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-90">🔬</span>
                <span>Research Papers</span>
              </div>
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Updated</span>
            </li>
            <li className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="text-xl opacity-90">👥</span>
              <span>Community</span>
            </li>
          </ul>
        </div>

        {/* n5: quick actions */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold uppercase opacity-80 mb-3">QUICK ACTIONS</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition">
              <span className="text-2xl block mb-1">+</span>
              <span className="text-sm">New Patient</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition">
              <span className="text-2xl block mb-1">📅</span>
              <span className="text-sm">Schedule</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition">
              <span className="text-2xl block mb-1">📱</span>
              <span className="text-sm">Scan QR</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition">
              <span className="text-2xl block mb-1">🛠️</span>
              <span className="text-sm">Support</span>
            </button>
          </div>
        </div>

        {/* n6: storage used */}
        <div className="mt-auto p-4">
          <div className="bg-purple-800/40 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Storage Used</p>
              <p className="text-xs opacity-80">2.4GB / 5GB</p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
              <div className="bg-white h-1.5 rounded-full w-[48%]"></div>
            </div>
            <div className="flex justify-between text-xs opacity-80">
              <button className="hover:text-white">?</button>
              <button className="hover:text-white">⚙️</button>
              <button className="hover:text-white">→</button>
            </div>
            <p className="text-xs text-center mt-2 opacity-70">v2.1.4 • AI Enhanced</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SmartTherapyAssistantSidebar;