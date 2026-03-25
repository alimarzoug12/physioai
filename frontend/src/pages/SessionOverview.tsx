import React from 'react';

//page 8 src/pages/SessionOverview.tsx
class SessionOverview extends React.Component {
  render() {
    return (
      <div className="p-4 bg-gray-100 min-h-screen">
        {/* n1: Session Overview */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Session Overview</h2>
            <button className="text-gray-500">⚙️</button>
          </div>
          <p className="text-blue-500 text-sm mb-6">• 12 Sessions Completed</p>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">Your Recovery Journey</h3>
            <p className="text-gray-500">Lower Back Pain Treatment</p>
          </div>
          <div className="flex justify-around mb-4">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">12</div>
              <p className="text-sm text-gray-500">Completed Sessions</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 text-gray-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">3</div>
              <p className="text-sm text-gray-500">Upcoming Sessions</p>
            </div>
          </div>
          <p className="text-gray-700 mb-2">Recovery Progress</p>
          <div className="bg-gray-200 h-2 rounded-full mb-1">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-[85%]"></div>
          </div>
          <p className="text-right text-green-500">85%</p>
          <div className="flex justify-around mt-4 text-sm text-gray-500">
            <div className="text-center">
              <p className="text-yellow-500">★ 4.8</p>
              <p>Avg Rating</p>
            </div>
            <div className="text-center">
              <p>6</p>
              <p>Weeks in Treatment</p>
            </div>
            <div className="text-center">
              <p>2</p>
              <p>Weeks Remaining</p>
            </div>
          </div>
          <div className="flex justify-around mt-6">
            <button className="text-blue-500 text-2xl">📉</button>
            <button className="text-gray-700 text-2xl">🏋️</button>
            <button className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">⏰</button>
          </div>
        </div>

        {/* n2: Upcoming Session */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <p className="text-gray-700 mb-2">Pain Reduced</p>
          <p className="text-green-500">-70%</p>
          <p className="text-gray-700 mb-2">Mobility</p>
          <p className="text-green-500">+60%</p>
          <p className="text-gray-700 mb-2">Avg Session</p>
          <p className="text-gray-700">45 min</p>
          <div className="flex justify-around mt-4 text-gray-500">
            <p>All Sessions</p>
            <p>Completed</p>
            <p>Upcoming</p>
          </div>
          <h3 className="text-lg font-bold mt-6 mb-4">Upcoming Sessions</h3>
          <button className="text-blue-500 text-sm">View Calendar</button>
        </div>

        {/* n3: Next Session */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white p-6 rounded-2xl mb-4">
          <div className="flex items-center mb-2">
            <div className="bg-white text-blue-500 rounded-full p-1 mr-2">📅</div>
            <h4 className="font-bold">Next Session</h4>
          </div>
          <p>Tomorrow at 10:00 AM</p>
          <div className="flex items-center mt-4">
            <img src="placeholder-doctor.jpg" alt="Dr. Sarah" className="w-10 h-10 rounded-full mr-2" />
            <div>
              <p className="font-bold">Dr. Sarah Al-Rashid</p>
              <p>Musculoskeletal Specialist</p>
            </div>
            <p className="ml-auto">45 min</p>
            <p className="ml-2">Home Visit</p>
          </div>
          <p className="mt-4">Session Focus:</p>
          <p>Advanced mobility exercises and posture correction techniques</p>
          <div className="flex mt-4">
            <button className="bg-blue-400 text-white px-4 py-2 rounded-l-full">Reschedule</button>
            <button className="bg-white text-blue-500 px-4 py-2 rounded-r-full">View Details</button>
          </div>
        </div>

        {/* n4: Session #14 */}
        <div className="bg-white p-4 rounded-2xl shadow mb-2">
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-700 rounded-full p-1 mr-2">📅</div>
            <h4 className="font-bold">Session #14</h4>
            <p>Dec 8, 2024 • 2:30 PM</p>
            <p className="ml-auto">Clinic</p>
          </div>
          <div className="flex items-center mt-2">
            <img src="placeholder-doctor2.jpg" alt="Dr. Ahmed" className="w-8 h-8 rounded-full mr-2" />
            <p>Dr. Ahmed Hassan</p>
            <p>Qatar Physiotherapy Center</p>
          </div>
          <div className="flex mt-4">
            <button className="bg-blue-400 text-white px-4 py-2 rounded-l-full">Reschedule</button>
            <button className="bg-white text-blue-500 px-4 py-2 rounded-r-full">View Details</button>
          </div>
        </div>

        {/* n5: Recent Sessions */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <h3 className="text-lg font-bold mb-4">Recent Sessions</h3>
          <button className="text-blue-500 text-sm">View All</button>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-500 rounded-full p-1 mr-2">✓</div>
              <h4 className="font-bold">Session #12</h4>
              <p>Dec 3, 2024 • 45 minutes</p>
              <p className="ml-auto text-green-500">Completed</p>
            </div>
            <div className="flex items-center mt-2">
              <img src="placeholder-doctor.jpg" alt="Dr. Sarah" className="w-8 h-8 rounded-full mr-2" />
              <p>Dr. Sarah Al-Rashid</p>
            </div>
            <p className="text-right">QAR 180</p>
          </div>
        </div>

        {/* n6: Your Feedback */}
        <div className="bg-blue-50 p-4 rounded-2xl mb-2">
          <div className="flex items-center">
            <div className="bg-blue-200 text-blue-500 rounded-full p-1 mr-2">+</div>
            <h4 className="font-bold">Your Feedback</h4>
          </div>
          <p>"Dr. Sarah was amazing! The exercises really helped and I can already feel the difference. Very professional and caring approach."</p>
        </div>

        {/* Integrated Recommendations after Feedback */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <div className="flex items-center mb-4">
            <div className="text-black mr-2 text-xl">💡</div>
            <h3 className="font-bold text-lg">Recommendations</h3>
          </div>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>Continue daily core exercises (10 minutes)</li>
            <li>Apply heat therapy before exercises</li>
            <li>Maintain proper posture while working</li>
          </ul>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full flex-1 flex items-center justify-center">
              <div className="mr-2 text-gray-500">📥</div>
              View Report
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full flex-1">
              Book Again
            </button>
          </div>
        </div>

        {/* n7: Session #11 */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-500 rounded-full p-1 mr-2">✓</div>
            <h4 className="font-bold">Session #11</h4>
            <p>Nov 29, 2024 • 45 minutes</p>
            <p className="ml-auto text-green-500">Completed</p>
          </div>
          <div className="flex items-center mt-2">
            <img src="placeholder-doctor2.jpg" alt="Dr. Ahmed" className="w-8 h-8 rounded-full mr-2" />
            <p>Dr. Ahmed Hassan</p>
            <p className="text-yellow-500">★ 4.8</p>
          </div>
          <p className="text-right">QAR 150</p>
          <p className="text-sm text-gray-500">Clinic Visit</p>
        </div>

        {/* n8: AI Recovery Insights */}
        <div className="bg-purple-50 p-6 rounded-2xl mb-4">
          <div className="flex items-center mb-4">
            <div className="bg-purple-200 text-purple-500 rounded-full p-2 mr-2">🧠</div>
            <h3 className="font-bold">AI Recovery Insights</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">Based on your session data</p>
          <div className="bg-white p-4 rounded-2xl mb-2">
            <div className="flex items-center">
              <div className="text-green-500 mr-2">📉</div>
              <h4 className="font-bold">Progress Trend</h4>
            </div>
            <p>Your pain levels have consistently decreased over the past 4 weeks. You're recovering 15% faster than average patients with similar conditions.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl mb-2">
            <div className="flex items-center">
              <div className="text-blue-500 mr-2">⏺</div>
              <h4 className="font-bold">Next Milestone</h4>
            </div>
            <p>With 3 more sessions, you should achieve full mobility restoration. Consider adding swimming to your routine for enhanced recovery.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="text-black mr-2">⚙️</div>
              <h4 className="font-bold">Achievement Unlocked</h4>
            </div>
            <p>Consistency Champion! You've attended 100% of your scheduled sessions. This dedication is key to your excellent recovery rate.</p>
          </div>
        </div>

        {/* n9: Home Exercise */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Home Exercise Tracking</h3>
            <button className="text-blue-500 text-sm">View Plan</button>
          </div>
          <p className="text-gray-500">Today's Exercises</p>
          <div className="flex justify-between">
            <p className="text-gray-500">3 of 5 completed</p>
            <div className="bg-gray-200 h-2 w-24 rounded-full">
              <div className="bg-blue-500 h-2 w-3/5 rounded-full"></div>
            </div>
            <p className="text-blue-500">60%</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="bg-green-50 p-4 rounded-2xl flex items-center">
              <div className="bg-green-200 text-green-500 rounded-full p-1 mr-2">✓</div>
              <p>Core Strengthening</p>
              <p className="ml-auto text-gray-500">15 minutes • Completed at 8:30 AM</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl flex items-center">
              <div className="bg-green-200 text-green-500 rounded-full p-1 mr-2">✓</div>
              <p>Stretching Routine</p>
              <p className="ml-auto text-gray-500">10 minutes • Completed at 2:15 PM</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl flex items-center">
              <div className="bg-green-200 text-green-500 rounded-full p-1 mr-2">✓</div>
              <p>Walking Exercise</p>
              <p className="ml-auto text-gray-500">20 minutes • Completed at 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* n10: Posture Training */}
        <div className="bg-gray-50 p-4 rounded-2xl mb-2 flex items-center">
          <div className="bg-gray-200 text-gray-500 rounded-full p-1 mr-2">⏰</div>
          <p>Posture Training</p>
          <p className="text-gray-500">5 minutes • Pending</p>
          <button className="ml-auto text-blue-500">Start Now</button>
        </div>

        {/* n11: Pain Level Tracking */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Pain Level Tracking</h3>
            <button className="text-blue-500 text-sm">Add Entry</button>
          </div>
          <p className="text-gray-500 mb-2">Weekly Average</p>
          <div className="bg-gray-200 h-2 rounded-full mb-1">
            <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-green-500">↓ 2.5 points from last week</p>
            <p className="text-green-500">3.0/10</p>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-4 text-center">
            <p className="text-gray-500">Mon</p>
            <p className="text-gray-500">Tue</p>
            <p className="text-gray-500">Wed</p>
            <p className="text-gray-500">Thu</p>
            <p className="text-gray-500">Fri</p>
            <p className="text-gray-500">Sat</p>
            <p className="text-gray-500">Sun</p>
            <div className="bg-green-100 rounded-full p-1">2</div>
            <div className="bg-green-100 rounded-full p-1">3</div>
            <div className="bg-yellow-100 rounded-full p-1">4</div>
            <div className="bg-green-100 rounded-full p-1">2</div>
            <div className="bg-green-100 rounded-full p-1">3</div>
            <div className="bg-green-100 rounded-full p-1">2</div>
            <div className="bg-green-100 rounded-full p-1">1</div>
          </div>
          <p className="text-gray-500 mt-4">Pain Triggers Identified:</p>
          <div className="flex gap-2">
            <span className="bg-red-100 text-red-500 rounded-full px-3 py-1">Long sitting</span>
            <span className="bg-orange-100 text-orange-500 rounded-full px-3 py-1">Cold weather</span>
            <span className="bg-yellow-100 text-yellow-500 rounded-full px-3 py-1">Stress</span>
          </div>
        </div>

        {/* n12: Messages */}
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Messages</h3>
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl mb-4">
            <div className="flex items-center">
              <img src="placeholder-doctor.jpg" alt="Dr. Sarah" className="w-8 h-8 rounded-full mr-2" />
              <p>Dr. Sarah Al-Rashid</p>
              <p className="ml-auto text-gray-500">2 hours ago</p>
              <div className="bg-blue-500 w-2 h-2 rounded-full ml-2"></div>
            </div>
            <p>Great work on your exercises today! I noticed significant improvement in your flexibility. Keep up the excellent progress. See you tomorrow for our session.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex items-center">
              <img src="placeholder-doctor2.jpg" alt="Dr. Ahmed" className="w-8 h-8 rounded-full mr-2" />
              <p>Dr. Ahmed Hassan</p>
              <p className="ml-auto text-gray-500">1 day ago</p>
            </div>
            <p>Don't forget to apply heat therapy before your morning exercises. It will help with muscle relaxation and improve your session effectiveness.</p>
          </div>
        </div>

        {/* n13: Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <button className="bg-blue-500 text-white p-4 rounded-2xl w-full mb-4 flex items-center justify-center">
            <div className="mr-2">📅</div>
            Book Session
          </button>
          <div className="flex gap-4">
            <button className="bg-gray-100 text-gray-700 p-4 rounded-2xl flex-1 flex items-center justify-center">
              <div className="mr-2">📄</div>
              Download Reports
            </button>
            <button className="bg-gray-100 text-gray-700 p-4 rounded-2xl flex-1 flex items-center justify-center">
              <div className="mr-2">★</div>
              Rate Sessions
            </button>
          </div>
          <div className="flex justify-around mt-6 text-gray-500">
            <div className="text-center">
              <p>🏠</p>
              <p>Home</p>
            </div>
            <div className="text-center text-blue-500">
              <p>📅</p>
              <p>Sessions</p>
            </div>
            <div className="text-center">
              <p>🤖</p>
              <p>AI Chat</p>
            </div>
            <div className="text-center">
              <p>💳</p>
              <p>Wallet</p>
            </div>
            <div className="text-center">
              <p>👤</p>
              <p>Profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SessionOverview;