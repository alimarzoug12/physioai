import React from 'react';

//page 12 src/pages/ProviderDashboard.tsx
class ProviderDashboard extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* n1: Provider Dashboard */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <button className="text-gray-500 text-xl">&lt;</button>
            <h2 className="text-xl font-bold text-gray-900">Provider Dashboard</h2>
            <button className="text-gray-500">🔔</button>
          </div>
          <p className="text-green-500 text-sm mb-4">• Active Practice</p>
          <div className="flex items-center mb-4">
            <img src="placeholder-doctor.jpg" alt="Dr. Sarah Al-Mahmoud" className="w-12 h-12 rounded-full mr-3" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Dr. Sarah Al-Mahmoud</p>
              <p className="text-sm text-gray-600">Licensed Physiotherapist</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★ 4.9</span>
                <span className="text-blue-500">📅 8 years exp.</span>
              </div>
            </div>
            <button className="text-gray-500">✏️</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Today's Sessions</p>
              <p className="text-sm text-green-500">↑ +12% vs yesterday</p>
            </div>
            <div className="text-center bg-blue-100 rounded-xl p-4">
              <p className="text-3xl font-bold text-gray-900">QAR 3,240</p>
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <p className="text-sm text-green-500">↑ +8% vs yesterday</p>
            </div>
          </div>
        </div>

        {/* n2: Performance Overview */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
            <div className="flex gap-2">
              <button className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">Week</button>
              <button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">Month</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="relative w-20 h-10 mx-auto">
                <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[80%] rounded-full"></div>
                </div>
                <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold">4.9</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">0 - 5</p>
              <p className="text-sm text-gray-500">Patient Rating</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-10 mx-auto">
                <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[90%] rounded-full"></div>
                </div>
                <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold">90</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">0 100</p>
              <p className="text-sm text-gray-500">Session Completion</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-10 mx-auto">
                <div className="bg-gray-200 w-full h-4 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[70%] rounded-full"></div>
                </div>
                <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold">7</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">0 10</p>
              <p className="text-sm text-gray-500">Response Time</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <svg className="w-full h-24">
              <polyline points="0,60 30,50 60,55 90,45 120,40 150,50 180,55" fill="none" stroke="blue" strokeWidth="2" />
              <rect x="0" y="0" width="180" height="80" fill="url(#grad)" opacity="0.2" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="blue" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <p>QAR 4000</p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <p>QAR 2000</p>
              <p>Mon</p>
              <p>Tue</p>
              <p>Wed</p>
              <p>Thu</p>
              <p>Fri</p>
              <p>Sat</p>
              <p>Sun</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">QAR 0</p>
          </div>
        </div>

        {/* n3: Today's Appointments */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Appointments</h3>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <img src="placeholder-patient1.jpg" alt="Ahmed Hassan" className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Ahmed Hassan</p>
                <p className="text-sm text-gray-600">Lower back pain treatment</p>
                <p className="text-sm text-blue-500">10:30 AM • Home Visit</p>
              </div>
              <button className="bg-green-100 text-green-600 px-3 py-1 rounded-full mr-2">Start</button>
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Call</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <img src="placeholder-patient2.jpg" alt="Fatima Al-Zahra" className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Fatima Al-Zahra</p>
                <p className="text-sm text-gray-600">Knee rehabilitation session</p>
                <p className="text-sm text-blue-500">12:00 PM • Clinic</p>
              </div>
              <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full mr-2">Pending</button>
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Chat</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <img src="placeholder-patient3.jpg" alt="Omar Khalil" className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Omar Khalil</p>
                <p className="text-sm text-gray-600">Sports injury recovery</p>
                <p className="text-sm text-blue-500">2:30 PM • Home Visit</p>
              </div>
              <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full mr-2">Scheduled</button>
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Route</button>
            </div>
          </div>
        </div>

        {/* n4: Recent Messages */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <img src="placeholder-patient4.jpg" alt="Khalid Mansour" className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Khalid Mansour</p>
                  <p className="text-sm text-gray-600">Doctor, I'm feeling much better after yesterday's session. Should I continue with the exercises you recommended?</p>
                </div>
                <p className="text-gray-500 text-sm">5 min ago</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Follow-up</span>
                <button className="ml-auto text-blue-600">Reply</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <img src="placeholder-patient5.jpg" alt="Layla Ahmed" className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Layla Ahmed</p>
                  <p className="text-sm text-gray-600">Thank you for the session today! I have a question about the home exercises you showed me.</p>
                </div>
                <p className="text-gray-500 text-sm">15 min ago</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Exercise Query •</span>
                <button className="ml-auto text-blue-600">Reply</button>
              </div>
            </div>
          </div>
        </div>

        {/* n5: Weekly */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Weekly Earnings</h3>
            <button className="text-blue-600 text-sm">This Week ▾</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-900">QAR 18,450</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-sm text-green-500">↑ +15%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500">Sessions Completed</p>
              <p className="text-sm text-green-500">↑ +8%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
            <p className="flex-1 text-gray-900">Home Visits</p>
            <p className="text-gray-900">QAR 12,300</p>
            <p className="text-gray-500">67%</p>
          </div>
          <p className="text-gray-900">Clinic Sessions QAR 6,150 33%</p>
        </div>

        {/* n6: Availability Settings */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Availability Settings</h3>
            <button className="text-blue-600 text-sm">Edit Schedule</button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">📅</div>
              <div>
                <p className="font-semibold text-gray-900">Today's Status</p>
                <p className="text-sm text-gray-600">Available until 6:00 PM</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <span className="text-blue-500 block mb-2">🏠</span>
              <p className="font-semibold text-gray-900">Home Visits</p>
              <p className="text-sm text-gray-600">6 slots available today</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <span className="text-black block mb-2">🏢</span>
              <p className="font-semibold text-gray-900">Clinic Sessions</p>
              <p className="text-sm text-gray-600">4 slots available today</p>
            </div>
          </div>
        </div>

        {/* n7: Recent Reviews */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Reviews</h3>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <img src="placeholder-patient6.jpg" alt="Hassan Al-Rashid" className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Hassan Al-Rashid</p>
                  <p className="text-sm text-gray-600">Excellent service! Dr. Sarah was very professional and the treatment was exactly what I needed. My back pain is almost gone.</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">2 hours ago</p>
                <div className="text-yellow-500">★★★★★</div>
                <button className="text-blue-600">Thank Patient</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <img src="placeholder-patient7.jpg" alt="Noor Abdallah" className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Noor Abdallah</p>
                  <p className="text-sm text-gray-600">Great experience with the home visit service. Very convenient and Dr. Sarah explained everything clearly.</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">1 day ago</p>
                <div className="text-yellow-500">★★★★☆</div>
                <button className="text-blue-600">Respond</button>
              </div>
            </div>
          </div>
        </div>

        {/* n8: Practice Analytics */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Practice Analytics</h3>
            <div className="flex gap-2">
              <button className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">This Month</button>
              <button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">Last Month</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">342</p>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-sm text-green-500">↑ +23</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">96%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-sm text-green-500">↑ +2%</p>
            </div>
          </div>
          <p className="text-gray-900 mb-1">Patient Satisfaction 94%</p>
          <div className="bg-gray-200 h-2 rounded-full mb-4">
            <div className="bg-blue-500 h-2 rounded-full w-[94%]"></div>
          </div>
          <p className="text-gray-900 mb-1">Booking Completion 87%</p>
          <div className="bg-gray-200 h-2 rounded-full mb-4">
            <div className="bg-gray-400 h-2 rounded-full w-[87%]"></div>
          </div>
          <p className="text-gray-900 mb-1">Response Time</p>
          <div className="bg-gray-200 h-2 rounded-full">
            <div className="bg-blue-300 h-2 rounded-full w-[50%]"></div>
          </div>
          <p className="text-right text-gray-500">2.3 min avg</p>
        </div>

        {/* n9: Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">📅+</span>
              <p className="font-semibold text-gray-900">Add Availability</p>
              <p className="text-sm text-gray-600">Set new time slots</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">📊</span>
              <p className="font-semibold text-gray-900">View Reports</p>
              <p className="text-sm text-gray-600">Detailed analytics</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">👥</span>
              <p className="font-semibold text-gray-900">Patient List</p>
              <p className="text-sm text-gray-600">Manage patients</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">⚙️</span>
              <p className="font-semibold text-gray-900">Settings</p>
              <p className="text-sm text-gray-600">Profile & preferences</p>
            </div>
          </div>
          <nav className="flex justify-around text-gray-500 text-sm">
            <div className="text-center">
              <span className="text-2xl block">🏠</span>
              <p>Dashboard</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block">🗓️</span>
              <p>Schedule</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block">💬</span>
              <p>Messages</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block">📈</span>
              <p>Analytics</p>
            </div>
            <div className="text-center">
              <span className="text-2xl block">👤</span>
              <p>Profile</p>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default ProviderDashboard;