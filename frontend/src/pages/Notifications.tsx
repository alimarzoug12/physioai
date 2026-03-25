import React from 'react';

// page 10 src/pages/Notifications.jsx
class Notifications extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* n1: Smart Notifications */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Smart Notifications</h2>
            <button className="text-gray-500">⚙️</button>
          </div>
          <p className="text-green-500 text-sm mb-4">• 3 New Updates</p>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Health Journey</h3>
            <p className="text-gray-500">Week 2 of Recovery</p>
          </div>
          <div className="flex justify-around items-center mb-4">
            <div className="text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full mx-auto flex items-center justify-center text-blue-500 mb-1">✓</div>
              <p className="text-sm text-gray-500">Sessions</p>
              <p className="font-bold">4/6</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">📈</span>
              <p className="text-sm text-gray-500">Improvement</p>
              <p className="font-bold text-green-500">+20%</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-10 h-10 rounded-full mx-auto flex items-center justify-center text-orange-500 mb-1">🔥</div>
              <p className="text-sm text-gray-500">Streak</p>
              <p className="font-bold">12 days</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">📅</div>
              <div>
                <p className="font-semibold text-gray-900">Session Reminder</p>
                <p className="text-sm text-gray-600">Your physiotherapy session with Dr. Sarah Ahmed is scheduled for 2:00 PM today at Doha Medical Center.</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">2 hours • •</p>
          </div>
          <div className="flex justify-between mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-xl">View Details</button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl">Reschedule</button>
          </div>
        </div>

        {/* n2: Today's Update */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Updates</h3>
            <button className="text-blue-600 text-sm">Mark All Read</button>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">📅</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Session Reminder</p>
                  <p className="text-sm text-gray-600">Your physiotherapy session with Dr. Sarah Ahmed is scheduled for 2:00 PM today at Doha Medical Center.</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">2 hours •</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-xl">View Details</button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl">Reschedule</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Achievement Unlocked!</p>
                  <p className="text-sm text-gray-600">Congratulations! You've completed 2 weeks of consistent therapy. Your lower back mobility has improved by 20%!</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">1 hour ago</p>
              <p className="text-gray-600 mt-2">Recovery Progress 75%</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white">🏋️</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Daily Exercise Time</p>
                  <p className="text-sm text-gray-600">Time for your prescribed lower back stretches! Complete your 15-minute routine to maintain progress.</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">30 min ago</p>
              <div className="mt-2">
                <p className="text-gray-600">Today's Exercises</p>
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✓</span> Cat-Cow Stretch (2 min)
                </div>
                <div className="flex items-center text-orange-600">
                  <span className="mr-2">•</span> Pelvic Tilts (5 min)
                </div>
                <div className="flex items-center text-orange-600">
                  <span className="mr-2">•</span> Knee-to-Chest (8 min)
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-xl">Start Exercises</button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl">Remind Later</button>
              </div>
            </div>
          </div>
        </div>

        {/* n3: Daily Exercise */}
        <div className="bg-orange-50 rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Daily Exercise Time</h3>
            <p className="text-gray-500 text-sm">30 min ago</p>
          </div>
          <p className="text-gray-700 mb-4">Time for your prescribed lower back stretches! Complete your 15-minute routine to maintain progress.</p>
          <p className="text-gray-600 mb-2">Today's Exercises</p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-green-600">
              <span className="mr-2">✓</span> Cat-Cow Stretch (2 min)
            </div>
            <div className="flex items-center text-orange-600">
              <span className="mr-2">•</span> Pelvic Tilts (5 min)
            </div>
            <div className="flex items-center text-orange-600">
              <span className="mr-2">•</span> Knee-to-Chest (8 min)
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-orange-500 text-white py-3 rounded-xl flex-1">Start Exercises</button>
            <button className="bg-white border border-orange-500 text-orange-500 py-3 rounded-xl flex-1">Remind Later</button>
          </div>
        </div>

        {/* n4: AI Health Tips */}
        <div className="bg-pink-50 rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">AI Health Tips</h3>
            <button className="text-blue-600 text-sm">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="bg-purple-100 w-8 h-8 rounded-full mb-2 flex items-center justify-center text-purple-500">💧</div>
              <p className="font-semibold text-gray-900">Hydration Reminder</p>
              <p className="text-sm text-gray-600">Stay Hydrated for Better Recovery</p>
              <p className="text-sm text-gray-600">Proper hydration helps reduce muscle tension and speeds up healing. Aim for 8-10 glasses today!</p>
              <div className="bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-blue-500 h-2 rounded-full w-[60%]"></div>
              </div>
              <p className="text-sm text-blue-500 mt-1">6/10 glasses</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="bg-purple-100 w-8 h-8 rounded-full mb-2 flex items-center justify-center text-purple-500">🛌</div>
              <p className="font-semibold text-gray-900">Sleep Quality</p>
              <p className="text-sm text-gray-600">Optimize Your Sleep Position</p>
              <p className="text-sm text-gray-600">Sleep on your side with a pillow between your knees to maintain spinal alignment and reduce back pain.</p>
              <button className="text-blue-500 text-sm mt-2">Learn More</button>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="bg-orange-100 w-8 h-8 rounded-full mb-2 flex items-center justify-center text-orange-500">🍎</div>
              <p className="font-semibold text-gray-900">Nutrition</p>
              <p className="text-sm text-gray-600">Anti-Inflammatory Foods</p>
              <p className="text-sm text-gray-600">Include omega-3 rich foods like salmon, walnuts, and leafy greens to reduce inflammation naturally.</p>
              <button className="text-orange-500 text-sm mt-2">View Meal Plan</button>
            </div>
          </div>
        </div>

        {/* n5: This Week's Progress */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">This Week's Progress</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">90%</p>
              <p className="text-sm text-gray-500">Exercise Compliance</p>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="60, 100" />
                </svg>
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">60%</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">Pain Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">2/2</p>
              <p className="text-sm text-gray-500">Sessions Attended</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Exercise Minutes</p>
              <p className="text-xl font-bold">135/150 min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sleep Quality</p>
              <p className="text-yellow-500 text-xl">★★★★☆</p>
            </div>
          </div>
        </div>

        {/* n6: Daily Motivation */}
        <div className="bg-yellow-50 rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Motivation</h3>
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center text-orange-500">“</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Daily Quote</p>
                <p className="text-gray-700">"Every step forward, no matter how small, is progress worth celebrating."</p>
                <p className="text-gray-600">Your consistency is paying off - keep going!</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center text-pink-500">❤️</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Wellness Tip</p>
                <p className="text-gray-700">Remember to listen to your body</p>
                <p className="text-gray-600">Some discomfort during recovery is normal, but sharp pain means it's time to rest.</p>
              </div>
            </div>
          </div>
        </div>

        {/* n7: Upcoming Reminders */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Reminders</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-blue-500 text-xl">📅</div>
                <div>
                  <p className="font-semibold text-gray-900">Next Session</p>
                  <p className="text-sm text-gray-600">Physiotherapy with Dr. Sarah Ahmed</p>
                </div>
              </div>
              <p className="text-gray-500">Tomorrow, 2:00 PM</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-black text-xl">💊</div>
                <div>
                  <p className="font-semibold text-gray-900">Medication</p>
                  <p className="text-sm text-gray-600">Anti-inflammatory medication after meals</p>
                </div>
              </div>
              <p className="text-gray-500">Every 6 hours</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-orange-500 text-xl">🏃</div>
                <div>
                  <p className="font-semibold text-gray-900">Exercise Session</p>
                  <p className="text-sm text-gray-600">15-minute stretching routine</p>
                </div>
              </div>
              <p className="text-gray-500">Daily, 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* n8: Recovery Goals */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recovery Goals</h3>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Return to Normal Activities</p>
              <p className="text-sm text-gray-600 mb-1">Target: 2 weeks remaining</p>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-500 h-2 rounded-full w-[75%]"></div>
              </div>
              <p className="text-right text-purple-500 font-semibold">75%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Pain-Free Movement</p>
              <p className="text-sm text-gray-600 mb-1">Significant improvement this week!</p>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-blue-300 h-2 rounded-full w-[60%]"></div>
              </div>
              <p className="text-right text-blue-500 font-semibold">60%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Strength Building</p>
              <p className="text-sm text-gray-600 mb-1">Focus area for next sessions</p>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-red-500 h-2 rounded-full w-[45%]"></div>
              </div>
              <p className="text-right text-red-500 font-semibold">45%</p>
            </div>
          </div>
        </div>

        {/* n9: Support Community */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Community Support</h3>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="placeholder-user1.jpg" alt="Sarah M." className="w-8 h-8 rounded-full" />
              <img src="placeholder-user2.jpg" alt="User2" className="w-8 h-8 rounded-full -ml-4" />
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">+12</span>
            </div>
            <p className="font-semibold text-gray-900">Recovery Group</p>
            <p className="text-sm text-gray-600">15 members with similar conditions</p>
            <div className="mt-4 bg-white rounded-lg p-3">
              <p className="text-sm text-gray-700">Sarah M.: "Just completed my 4th week! The exercises really do help. Stay consistent everyone! 🎉"</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white w-full py-3 rounded-xl font-medium">Join Discussion</button>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-500 w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-2">+</div>
              <p className="text-sm text-gray-700">Log Symptoms</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-2">📊</div>
              <p className="text-sm text-gray-700">View Progress</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-2">💬</div>
              <p className="text-sm text-gray-700">AI Chat</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-300 w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white mb-2">🤖</div>
              <p className="text-sm text-gray-700">AI Tip</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;