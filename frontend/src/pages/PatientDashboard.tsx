//page 7 src/components/PatientDashboard.tsx
import React from 'react';

//page 7 src/components/PatientDashboard.tsx
const PatientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header avec heure et notifications */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Good Morning, Ahmed</h2>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Ready for your wellness journey
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="text-2xl">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="text-2xl">⚙️</button>
        </div>
      </header>

      {/* n1: Good Morning + Welcome back */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-lg opacity-90">
          Your health journey continues with personalized care
        </p>

        <div className="mt-6 flex flex-wrap gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">2</div>
            <div className="text-sm opacity-80">Sessions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">4.9</div>
            <div className="text-sm opacity-80">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* n2: Ongoing Sessions */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Ongoing Sessions</h3>
          <button className="text-blue-600 hover:underline text-sm">View All</button>
        </div>

        <div className="space-y-6">
          {/* Session active */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Dr. Sarah"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Dr. Sarah Al-Rashid</h4>
                    <p className="text-sm text-gray-600">Musculoskeletal Specialist</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-medium">Lower Back Recovery</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-cyan-500 h-full w-[50%]"></div>
                </div>
                <div className="flex justify-between text-sm mt-1 text-gray-600">
                  <span>Session 3/6</span>
                  <span>Progress: 50%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Next: Tomorrow 2:00 PM</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <span>📹</span> Join Session
                </button>
                <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
                  Chat
                </button>
                <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
                  Reschedule
                </button>
              </div>
            </div>
          </div>

          {/* Session scheduled (exemple) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 opacity-90">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dr. Amina Hassan</h4>
                  <p className="text-sm text-gray-600">Sports Rehabilitation</p>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                Scheduled
              </span>
            </div>

            <p className="text-gray-700 font-medium">Shoulder Mobility - Initial Assessment</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <span>📅 Dec 15, 2024</span>
              <span>•</span>
              <span>10:00 AM</span>
              <span>•</span>
              <span>Home Visit</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200">
                Reschedule
              </button>
              <button className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-100">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* n3: AI Health Tips */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">AI Health Tips</h3>
          <button className="text-blue-600 hover:underline text-sm">Personalize</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-900">Daily Tip</h4>
                <p className="text-gray-700 mt-1">
                  Morning Stretches – Start your day with 5-minute gentle stretches to improve flexibility and reduce morning stiffness.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Learn More</span>
                  <span className="text-sm text-gray-500">~5 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🌙</span>
              <div>
                <h4 className="font-semibold text-gray-900">Recovery</h4>
                <p className="text-gray-700 mt-1">
                  Quality Sleep – 7-9 hours of quality sleep accelerates tissue repair and reduces inflammation.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sleep Tips</span>
                  <span className="text-sm text-gray-500">~8 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* n4: Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-3xl">+</span>
            </div>
            <h4 className="font-semibold text-gray-900">Book Again</h4>
            <p className="text-sm text-gray-600 mt-1">Schedule new session</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 text-3xl">👩‍⚕️</span>
            </div>
            <h4 className="font-semibold text-gray-900">My Therapists</h4>
            <p className="text-sm text-gray-600 mt-1">View your specialists</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-3xl">📜</span>
            </div>
            <h4 className="font-semibold text-gray-900">Health History</h4>
            <p className="text-sm text-gray-600 mt-1">View past sessions</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-md transition">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-amber-600 text-3xl">💳</span>
            </div>
            <h4 className="font-semibold text-gray-900">Wallet</h4>
            <p className="text-sm text-gray-600 mt-1">Manage payments</p>
          </div>
        </div>
      </div>

      {/* n5: Your Progress */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
          <button className="text-blue-600 hover:underline text-sm">View Report</button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Recovery Journey</span>
              <span className="text-green-600 font-bold text-xl">85%</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Lower Back Treatment • Improvement</p>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-cyan-500 h-full w-[85%]"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Pain Level Reduction</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-green-500 h-full w-[90%]"></div>
              </div>
              <p className="text-right text-sm text-green-600 mt-1">90%</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Mobility Improvement</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-[75%]"></div>
              </div>
              <p className="text-right text-sm text-blue-600 mt-1">75%</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Exercise Compliance</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-full w-[95%]"></div>
              </div>
              <p className="text-right text-sm text-purple-600 mt-1">95%</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t pt-6">
            <div>
              <div className="text-3xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">8.2</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Weeks</div>
            </div>
          </div>
        </div>
      </div>

      {/* n6: Recent Activity */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 hover:underline text-sm">View All</button>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Session Completed</h4>
                <p className="text-gray-600">
                  Lower back therapy with Dr. Sarah
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-sm text-gray-600">4.9</span>
                </div>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">2 hours ago</span>
            </div>
          </div>

          {/* Autres activités récentes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">📅</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">New Appointment Booked</h4>
                <p className="text-gray-600">
                  Shoulder therapy with Dr. Amina
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Dec 15, 10:00 AM
                </p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* n7: Upcoming Reminders */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Upcoming Reminders</h3>
          <button className="text-blue-600 hover:underline text-sm">Manage</button>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 text-2xl">🔔</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Session Reminder</h4>
                <p className="text-gray-600">
                  Shoulder therapy tomorrow at 10:00 AM
                </p>
              </div>
              <button className="text-orange-600 text-sm font-medium">Snooze</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-2xl">🏋️</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Exercise Time</h4>
                <p className="text-gray-600">
                  Daily stretching routine in 30 minutes
                </p>
              </div>
              <button className="text-blue-600 text-sm font-medium">Start</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-2xl">💊</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Medication Time</h4>
                <p className="text-gray-600">
                  Take prescribed supplements
                </p>
              </div>
              <button className="text-green-600 text-sm font-medium">Done</button>
            </div>
          </div>
        </div>
      </div>

      {/* n8: Health Insights */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Health Insights</h3>
          <button className="text-blue-600 hover:underline text-sm">View Report</button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-2">❤️</div>
              <div className="text-3xl font-bold text-gray-900">72</div>
              <div className="text-sm text-gray-600">Avg Heart Rate</div>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-2">🚶</div>
              <div className="text-3xl font-bold text-gray-900">8,547</div>
              <div className="text-sm text-gray-600">Daily Steps</div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Weekly Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Exercise Sessions</span>
                <span className="text-green-600 font-medium">5/5 ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Pain Level (Avg)</span>
                <span className="text-green-600 font-medium">2.1/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sleep Quality</span>
                <span className="text-green-600 font-medium">8.3/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation basse fixe */}
      <nav className="bg-white border-t border-gray-200 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
            <span className="text-3xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
            <span className="text-3xl">🗓</span>
            <span className="text-xs mt-1">Sessions</span>
          </button>

          <button className="flex flex-col items-center text-blue-600 relative">
            <span className="text-3xl">🤖</span>
            <span className="text-xs mt-1">AI Chat</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
            <span className="text-3xl">📈</span>
            <span className="text-xs mt-1">Progress</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
            <span className="text-3xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PatientDashboard;