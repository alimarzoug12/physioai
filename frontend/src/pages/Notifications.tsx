import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from 'react-icons/io';
import { FaArrowLeft, FaCalendarCheck, FaChartLine, FaFire, FaDumbbell, FaLightbulb, FaBed, FaQuoteLeft, FaHeart, FaPills, FaCalendarPlus, FaPlus, FaComments, FaRobot, FaStar, FaCircleCheck, FaClock, FaShare } from 'react-icons/fa6';
import { FaAppleAlt, FaCalendarAlt } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { BiSolidAward } from "react-icons/bi";

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
//Page 10 src/pages/Notifications.tsx
interface NotificationsProps {
  navigate?: (path: string) => void;
}
class Notifications extends React.Component<NotificationsProps> {
  render() {
    return (
      <div className="pb-24 relative">
        {/* ── FLOATING AI ROBOT BUTTON ── */}
        <button
          onClick={() => this.props.navigate?.('/ai-assistant')}
          className="fixed bottom-8 right-6 z-50 w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.85) 0%, rgba(219,234,254,0.75) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            animation: 'floatUpDown 2s ease-in-out infinite',
          }}
        >
          <IconWrapper icon={FaRobot} className="text-white text-4xl drop-shadow" />
        </button>

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="text-gray-600 text-2xl">
            <span className=""><IconWrapper icon={FaArrowLeft} /></span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">Smart Notifications</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-1">
              <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
              3 New Updates
            </p>
          </div>
          <button onClick={() => this.props.navigate?.('/settings')} className="text-gray-600 text-3xl">
            <span className=""><IconWrapper icon={IoMdSettings} /></span>
          </button>
        </header>

        {/* Health Journey Card */}
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 px-6 py-8 ">
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-8 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-start mb-4">
              <div className='space-y-1'>
                <h3 className="text-2xl font-bold text-gray-900">Your Health Journey</h3>
                <p className="text-gray-500 text-xl">Week 2 of Recovery</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(130deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3.5"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4F7EF7"
                    strokeWidth="3.5"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-blue-500">75%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-14 h-14 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-xl mb-2">
                  <span className=""><IconWrapper icon={FaCalendarCheck} /></span>
                </div>
                <p className="text-gray-500 text-lg">Sessions</p>
                <p className="font-bold text-xl text-gray-900">4/6</p>
              </div>
              <div>
                <div className="w-14 h-14 bg-white rounded-full mx-auto flex items-center justify-center text-gray-900 text-xl mb-2">
                  <span className=""><IconWrapper icon={FaChartLine} /></span>
                </div>
                <p className="text-gray-500 text-lg">Improvement</p>
                <p className="font-bold text-xl text-gray-900">+20%</p>
              </div>
              <div>
                <div className="w-14 h-14 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-orange-600 text-xl mb-2">
                  <span className=""><IconWrapper icon={FaFire} /></span>
                </div>
                <p className="text-gray-500 text-lg">Streak</p>
                <p className="font-bold text-xl text-gray-900">12 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Updates */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-3xl font-bold text-gray-900">Today's Updates</h3>
            <button className="text-blue-600 text-xl">Mark All Read</button>
          </div>

          <div className="space-y-5">
            {/* Session Reminder */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  <span className=""><IconWrapper icon={FaCalendarAlt} /></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 text-xl">Session Reminder</p>
                    <div className="flex items-center gap-2 text-gray-400 text-lg">
                      <span>2 hours</span>
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xl mt-1">Your physiotherapy session with Dr. Sarah Ahmed is scheduled for 2:00 PM today at Doha Medical Center.</p>
                  <div className="flex gap-3 mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-lg font-medium">View Details</button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-lg font-medium">Reschedule</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Achievement Unlocked */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                  <span className=""><IconWrapper icon={BiSolidAward} /></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 text-xl">Achievement Unlocked!</p>
                    <p className="text-gray-400 text-lg">1 hour ago</p>
                  </div>
                  <p className="text-gray-500 text-xl mt-1">🎉 Congratulations! You've completed 2 weeks of consistent therapy. Your lower back mobility has improved by 20%!</p>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-gray-600 text-lg font-medium">Recovery Progress</p>
                      <p className="text-gray-900 font-bold text-xl">75%</p>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full w-[75%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Exercise Time */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  <span className=""><IconWrapper icon={FaDumbbell} /></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 text-xl">Daily Exercise Time</p>
                    <p className="text-gray-400 text-lg">30 min ago</p>
                  </div>
                  <p className="text-gray-500 text-xl mt-1">Time for your prescribed lower back stretches! Complete your 15-minute routine to maintain progress.</p>
                  <div className="bg-orange-50 rounded-xl p-4 mb-4 mt-5">
                    <p className="text-orange-500 font-semibold text-lg mb-2">Today's Exercises</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-lg text-gray-700">
                        <span className="text-green-500"><IconWrapper icon={FaCircleCheck} /></span>
                        Cat-Cow Stretch (2 min)
                      </div>
                      <div className="flex items-center gap-2 text-lg text-gray-700">
                        <span className="text-orange-400"><IconWrapper icon={FaClock} /></span>
                        Pelvic Tilts (5 min)
                      </div>
                      <div className="flex items-center gap-2 text-lg text-gray-700">
                        <span className="text-orange-400"><IconWrapper icon={FaClock} /></span>
                        Knee-to-Chest (8 min)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-lg font-medium">Start Exercises</button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-lg font-medium">Remind Later</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Tips */}
        <div className="p-6 bg-purple-50">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-3xl font-bold text-gray-900">AI Health Tips</h3>
            <button className="text-purple-500 text-xl">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-5">

            {/* Hydration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  <span className=""><IconWrapper icon={FaLightbulb} /></span>
                </div>
                <p className="text-gray-500 text-lg">Hydration Reminder</p>
              </div>
              <p className="font-bold text-gray-900 text-xl mb-2">Stay Hydrated for Better Recovery</p>
              <p className="text-gray-500 text-lg mb-4">Proper hydration helps reduce muscle tension and speeds up healing. Aim for 8-10 glasses today!</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-blue-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-[60%]"></div>
                </div>
                <p className="text-blue-500 text-lg whitespace-nowrap">6/10 glasses</p>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  <span className=""><IconWrapper icon={FaBed} /></span>
                </div>
                <p className="text-gray-500 text-lg">Sleep Quality</p>
              </div>
              <p className="font-bold text-gray-900 text-xl mb-2">Optimize Your Sleep Position</p>
              <p className="text-gray-500 text-lg mb-4">Sleep on your side with a pillow between your knees to maintain spinal alignment and reduce back pain.</p>
              <button className="text-gray-700 text-lg font-medium">Learn More</button>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  <span className=""><IconWrapper icon={FaAppleAlt} /></span>
                </div>
                <p className="text-gray-500 text-lg">Nutrition</p>
              </div>
              <p className="font-bold text-gray-900 text-xl mb-2">Anti-Inflammatory Foods</p>
              <p className="text-gray-500 text-lg mb-4">Include omega-3 rich foods like salmon, walnuts, and leafy greens to reduce inflammation naturally.</p>
              <button className="text-orange-600 text-lg font-medium">View Meal Plan</button>
            </div>

          </div>
        </div>

        {/* This Week's Progress */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">This Week's Progress</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">90%</p>
                <p className="text-gray-500 text-lg mt-1">Exercise Compliance</p>
              </div>
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(130deg)' }}>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F7EF7"
                      strokeWidth="3.5"
                      strokeDasharray="60, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-blue-500">60%</p>
                </div>
                <p className="text-gray-500 text-lg mt-1">Pain Reduction</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xl">
                <span className="text-gray-600">Sessions Attended</span>
                <span className="font-bold text-gray-900">2/2</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="text-gray-600">Exercise Minutes</span>
                <span className="font-bold text-gray-900">135/150 min</span>
              </div>
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-600">Sleep Quality</span>
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-xl" />)}
                  <IconWrapper icon={FaStar} className="text-gray-300 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Motivation */}
        <div className="p-6 bg-yellow-50">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">Daily Motivation</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                  <span className=""><IconWrapper icon={FaQuoteLeft} /></span>
                </div>
                <p className="text-gray-500 text-lg">Daily Quote</p>
              </div>
              <p className="text-gray-900 text-xl font-medium mb-1">"Every step forward, no matter how small, is progress worth celebrating."</p>
              <p className="text-gray-500 text-lg">Your consistency is paying off - keep going!</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                  <span className=""><IconWrapper icon={FaHeart} /></span>
                </div>
                <p className="text-gray-500 text-lg">Wellness Tip</p>
              </div>
              <p className="text-gray-900 text-xl font-medium mb-1">Remember to listen to your body</p>
              <p className="text-gray-500 text-lg">Some discomfort during recovery is normal, but sharp pain means it's time to rest.</p>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">Upcoming Reminders</h3>
          <div className="space-y-4">
            {[
              { icon: FaCalendarCheck, color: 'text-blue-500', label: 'Next Session', sub: 'Physiotherapy with Dr. Sarah Ahmed', time: 'Tomorrow, 2:00 PM' },
              { icon: FaPills, color: 'text-gray-700', label: 'Medication', sub: 'Anti-inflammatory medication after meals', time: 'Every 6 hours' },
              { icon: FaDumbbell, color: 'text-orange-500', label: 'Exercise Session', sub: '15-minute stretching routine', time: 'Daily, 7:00 PM' },
            ].map(({ icon, color, label, sub, time }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`text-2xl ${color}`}><IconWrapper icon={icon} /></span>
                  <div className="flex-1 flex justify-between items-center">
                    <p className="font-semibold text-gray-900 text-xl">{label}</p>
                    <p className="text-gray-400 text-lg">{time}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-lg">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Goals */}
        <div className="p-6 bg-blue-50">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">Recovery Goals</h3>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            {[
              { label: 'Return to Normal Activities', sub: 'Target: 2 weeks remaining', color: 'bg-gradient-to-r from-purple-500 to-purple-600', textColor: 'text-purple-500', pct: '75%', w: 'w-[75%]' },
              { label: 'Pain-Free Movement', sub: 'Significant improvement this week!', color: 'bg-gradient-to-r from-blue-500 to-blue-600', textColor: 'text-blue-600', pct: '60%', w: 'w-[60%]' },
              { label: 'Strength Building', sub: 'Focus area for next sessions', color: 'bg-gradient-to-r from-orange-400 to-red-500', textColor: 'text-orange-500', pct: '45%', w: 'w-[45%]' },
            ].map(({ label, sub, color, textColor, pct, w }) => (
              <div key={label}>
                <div className="flex justify-between mb-3">
                  <p className="font-medium text-gray-900 text-xl">{label}</p>
                  <p className={`font-semibold text-xl ${textColor}`}>{pct}</p>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                  <div className={`${color} h-full rounded-full ${w}`}></div>
                </div>
                <p className="text-gray-500 text-lg">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Support */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">Community Support</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="u1" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="u2" className="w-12 h-12 rounded-full border-2 border-white object-cover -ml-3" />
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="u3" className="w-12 h-12 rounded-full border-2 border-white object-cover -ml-3" />
                <span className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 text-lg font-medium flex items-center justify-center -ml-3 border-2 border-white">+12</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-xl">Recovery Group</p>
                <p className="text-gray-500 text-lg">15 members with similar conditions</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-lg"><span className="font-bold">Sarah M.:</span> "Just completed my 4th week! The exercises really do help. Stay consistent everyone! 💪"</p>
              <p className="text-gray-400 text-lg mt-1">2 hours ago</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl text-xl font-semibold">Join Discussion</button>
              <button className="w-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 text-xl">
                <span className=""><IconWrapper icon={FaShare} /></span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaPlus, bg: 'bg-gradient-to-br from-blue-500 to-blue-600', label: 'Log Symptoms', path: null },
              { icon: GiProgression, bg: 'bg-gray-100', label: 'View Progress', textColor: 'text-gray-600', path: '/sessions' },
              { icon: FaCalendarPlus, bg: 'bg-gradient-to-br from-orange-500 to-orange-600', label: 'Book Session', path: '/book' },
              { icon: FaComments, bg: 'bg-gradient-to-br from-purple-500 to-purple-600', label: 'AI Chat', path: '/ai-assistant' },
            ].map(({ icon, bg, label, textColor, path }) => (
              <button
                key={label}
                onClick={() => path && this.props.navigate?.(path)}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-3"
              >
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-2xl ${textColor ?? 'text-white'}`}>
                  <span className=""><IconWrapper icon={icon} /></span>
                </div>
                <p className="text-gray-700 text-xl font-medium">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        {/* <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaChartLine, label: 'Home', active: false },
              { icon: FaCalendarCheck, label: 'Sessions', active: false },
              { icon: FaRobot, label: 'AI Chat', active: false, center: true },
              { icon: FaChartLine, label: 'Progress', active: false },
              { icon: FaHeart, label: 'Profile', active: true },
            ].map(({ icon, label, active, center }) => (
              <button key={label} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-500' : 'text-gray-400'}`}>
                {center ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl -mt-4 shadow-md">
                    <span className=""><IconWrapper icon={icon} /></span>
                  </div>
                ) : (
                  <span className="text-xl"><IconWrapper icon={icon} /></span>
                )}
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </nav> */}

      </div>
    );
  }
}

function NotificationsWithRouter() {
  const navigate = useNavigate();
  return <Notifications navigate={navigate} />;
}

export default NotificationsWithRouter;