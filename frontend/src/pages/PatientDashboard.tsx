import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaStar, FaHeartPulse, FaDumbbell, FaChartLine, FaTrophy, FaVideo, FaMessage, FaCalendar, FaClock, FaLocationDot, FaLightbulb, FaMoon, FaUserDoctor, FaPlus, FaWallet, FaRobot, FaCalendarPlus, FaCheck, FaPersonWalking, FaPhone, FaBed, FaGlassWater, FaComments, FaPills } from 'react-icons/fa6';
import { IoIosWater, IoMdNotifications, IoMdSettings } from 'react-icons/io';
import { BsChatFill } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
//Page 7 src/pages/PatientDashboard.tsx
interface PatientDashboardProps {
  navigate?: (path: string) => void;
}

//Page 7 src/pages/PatientDashboard.tsx
class PatientDashboard extends React.Component<PatientDashboardProps> {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Ahmed"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Good Morning, Ahmed</h2>
              <p className="text-xl text-gray-500 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                Ready for your wellness journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">

            {/* Notifications icon */}
            <button
              className="relative"
              onClick={() => this.props.navigate?.('/notifications')}
            >
              <span className="text-3xl text-gray-600"><IconWrapper icon={IoMdNotifications} /></span>
              <span className="absolute -top-4 -right-4 bg-red-500 text-white border-2 border-white text-lg rounded-full w-7 h-7 flex items-center justify-center">3</span>
            </button>

            {/* Settings icon */}
            <button
              className="text-3xl text-gray-600"
              onClick={() => this.props.navigate?.('/settings')}
            >
              <IconWrapper icon={IoMdSettings} />
            </button>

          </div>
        </header>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-100 text-white p-6 pb-16 relative overflow-hidden">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-3xl"><IconWrapper icon={FaHeartPulse} /></span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Welcome back! 👋</h1>
          <p className="text-white/80 text-xl mb-4">Your health journey continues with personalized care</p>
          <div className="flex items-center gap-6 text-xl">
            <div className="flex items-center gap-2">
              <span className="text-white"><IconWrapper icon={FaCalendarCheck} /></span>
              <span className="font-medium">2 Sessions Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300"><IconWrapper icon={FaStar} /></span>
              <span className="font-medium">4.9 Rating</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white mx-4 -mt-10 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 relative z-10">
          <div className="flex flex-col items-center py-5 gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 text-3xl">
              <span className=""><IconWrapper icon={FaDumbbell} /></span>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-xl text-gray-500">Total Sessions</div>
          </div>
          <div className="flex flex-col items-center justify-center py-5 gap-2">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-600 text-2xl">
              <span className=""><IconWrapper icon={FaChartLine} /></span>
            </div>
            <div className="text-3xl font-bold text-gray-900">85%</div>
            <div className="text-xl text-gray-500">Recovery Rate</div>
          </div>
          <div className="flex flex-col items-center py-5 gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-500 text-3xl">
              <span className=""><IconWrapper icon={FaTrophy} /></span>
            </div>
            <div className="text-3xl font-bold text-gray-900">7</div>
            <div className="text-xl text-gray-500">Achievements</div>
          </div>
        </div>

        {/* Ongoing Sessions */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Ongoing Sessions</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>

          <div className="space-y-4">
            {/* Active Session */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Dr. Sarah"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-900">Dr. Sarah Al-Rashid</h4>
                    <p className="text-xl font-semibold text-gray-500">Musculoskeletal Specialist</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-xl font-medium">
                  <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span> Active
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 mb-3 space-y-3">
                <div className="flex justify-between mb-2">
                  <span className="text-xl font-semibold text-gray-800">Lower Back Recovery</span>
                  <span className="text-xl font-bold text-blue-500">Session 3/6</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-green-400 h-full w-[50%]"></div>
                </div>
                <div className="flex justify-between text-lg text-gray-500 mt-1">
                  <span>Progress: 50%</span>
                  <span>Next: Tomorrow 2:00 PM</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-white text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 text-xl shadow-[0_0_28px_rgba(0,0,0,0.1)] shadow-blue-200 transition">
                  <span className="text-2xl"><IconWrapper icon={FaVideo} /></span> Join Session
                </button>
                <button className="w-12 h-12 bg-white border border-gray-200 px-8 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
                  <span className="text-xl"><IconWrapper icon={FaMessage} /></span>
                </button>
                <button className="w-12 h-12 bg-white border border-gray-200 px-8 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
                  <span className="text-xl"><IconWrapper icon={FaCalendar} /></span>
                </button>
              </div>
            </div>

            {/* Scheduled Session */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Dr. Amina"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-900">Dr. Amina Hassan</h4>
                    <p className="text-xl font-semibold text-gray-500">Sports Rehabilitation</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500 text-xl font-medium">
                  <span className="w-3 h-3 bg-orange-400 rounded-full"></span> Scheduled
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-2xl font-semibold text-gray-800">Shoulder Mobility</span>
                  <span className="text-xl font-semibold text-orange-500">Initial Assessment</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-lg text-gray-700 mt-2">
                  <span className="flex items-center gap-1"><IconWrapper icon={FaCalendar} className="text-gray-400" /> Dec 15, 2024</span>
                  <span className="flex items-center gap-1"><IconWrapper icon={FaClock} className="text-gray-400" /> 10:00 AM</span>
                  <span className="flex items-center gap-1"><IconWrapper icon={FaLocationDot} className="text-gray-400" /> Home Visit</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-xl hover:bg-gray-200">Reschedule</button>
                <button className="flex-1 border border-orange-400 text-orange-500 py-3 rounded-xl font-medium text-xl hover:bg-orange-50">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Tips */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">AI Health Tips</h3>
            <button className="text-blue-500 text-xl">Personalize</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex-1 min-w-[260px] bg-blue-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className=""><IconWrapper icon={FaLightbulb} className="text-white text-xl" /></span>
                </div>
                <span className="text-xl font-medium">Daily Tip</span>
              </div>
              <h4 className="font-bold text-2xl mb-2">Morning Stretches</h4>
              <p className="text-white/80 text-xl mb-4">Start your day with 5-minute gentle stretches to improve flexibility and reduce morning stiffness.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl underline cursor-pointer">Learn More</span>
                <span className="text-lg flex items-center gap-1 text-white/70"><IconWrapper icon={FaClock} /> 5 min</span>
              </div>
            </div>

            <div className="flex-1 min-w-[260px] bg-gray-100 rounded-2xl p-6 text-gray-400 opacity-60">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl"><IconWrapper icon={IoIosWater} className="text-gray-400" /></span>
                </div>
                <span className="text-xl font-medium">Hydration</span>
              </div>
              <h4 className="font-bold text-2xl mb-2">Stay Hydrated</h4>
              <p className="text-xl mb-4">Proper hydration helps maintain joint lubrication and reduces friction in tissue.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl underline cursor-pointer">Set Reminder</span>
                <span className="text-lg flex items-center gap-1"><IconWrapper icon={FaGlassWater} /> 8 glasses</span>
              </div>
            </div>

            <div className="flex-1 min-w-[260px] bg-purple-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className=""><IconWrapper icon={FaBed} className="text-white text-2xl" /></span>
                </div>
                <span className="text-xl font-medium">Recovery</span>
              </div>
              <h4 className="font-bold text-2xl mb-2">Quality Sleep</h4>
              <p className="text-white/80 text-xl mb-4">7-9 hours of quality sleep accelerates tissue repair and reduces inflammation.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl underline cursor-pointer">Sleep Tips</span>
                <span className="text-lg flex items-center gap-1 text-white/70"><IconWrapper icon={FaMoon} /> 8 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: FaPlus, bg: 'bg-gradient-to-br from-blue-100 to-blue-200', color: 'text-blue-500', label: 'Book Again', sub: 'Schedule new session', path: '/book' },
              { icon: FaUserDoctor, bg: 'bg-white', color: 'text-gray-700', label: 'My Therapists', sub: 'View your specialists', path: '/specialist/1' },
              { icon: FaHistory, bg: 'bg-gradient-to-br from-purple-100 to-purple-200', color: 'text-purple-500', label: 'Health History', sub: 'View past sessions', path: '/sessions' },
              { icon: FaWallet, bg: 'bg-gradient-to-br from-orange-100 to-orange-200', color: 'text-orange-500', label: 'Wallet', sub: 'Manage payments', path: '/wallet' },
            ].map(({ icon, bg, color, label, sub, path }) => (
              <button
                key={label}
                onClick={() => this.props.navigate?.(path)}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-3 hover:shadow-md transition text-left"
              >
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-xl ${color}`}>
                  <span className="text-2xl"><IconWrapper icon={icon} /></span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xl">{label}</div>
                  <div className="text-xl text-gray-500">{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="mx-6 bg-gradient-to-r from-blue-500 to-blue-20 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-6xl text-white bg-white/70  rounded-full w-24 h-24 flex items-center justify-center">
            <IconWrapper icon={FaComments} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rou nded-full bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl"><IconWrapper icon={FaRobot} className="text-white" /></span>
            </div>
            <span className="font-medium text-2xl">AI Assistant</span>
          </div>
          <h4 className="font-bold text-2xl mb-1">Need Help?</h4>
          <p className="text-white/80 text-xl mb-4">Ask me about symptoms, exercises, or book a session</p>
          <button
            onClick={() => this.props.navigate?.('/ai-assistant')}
            className="bg-white text-blue-500 font-semibold text-xl px-4 py-3 rounded-xl flex items-center gap-3"
          >
            <span className=""><IconWrapper icon={BsChatFill} /></span> Start Chat
          </button>
        </div>

        {/* Your Progress */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Progress</h3>
            <button className="text-blue-500 text-xl">View Report</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="font-semibold text-2xl text-gray-900">Recovery Journey</div>
                <div className="font-medium text-xl text-gray-500">Lower Back Treatment</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">85%</div>
                <div className="text-lg text-gray-400">Improvement</div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {[
                { label: 'Pain Level Reduction', pct: '90%', color: 'bg-gradient-to-r from-green-400 to-green-500', val: '90%' },
                { label: 'Mobility Improvement', pct: '75%', color: 'bg-gradient-to-r from-blue-400 to-blue-500', val: '75%' },
                { label: 'Exercise Compliance', pct: '95%', color: 'bg-gradient-to-r from-purple-400 to-purple-500', val: '95%' },
              ].map(({ label, pct, color, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xl mb-2">
                    <span className="text-gray-600">{label}</span>
                    <span className="text-gray-700 font-medium">{val}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className={`${color} h-full rounded-full`} style={{ width: pct }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 mt-5 pt-5">
              <div><div className="text-3xl font-bold text-gray-900">12</div><div className="text-xl text-gray-500">Sessions</div></div>
              <div><div className="text-3xl font-bold text-gray-900">8.2</div><div className="text-xl text-gray-500">Avg Rating</div></div>
              <div><div className="text-3xl font-bold text-gray-900">4</div><div className="text-xl text-gray-500">Weeks</div></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-green-500 flex-shrink-0">
                <span className="text-2xl"><IconWrapper icon={FaCheck} /></span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-2xl">Session Completed</div>
                <div className="text-xl text-gray-500">Lower back therapy with Dr. Sarah</div>
              </div>
              <div className="text-right">
                <div className="text-lg text-gray-400">2 hours ago</div>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <span className="text-yellow-400 text-lg"><IconWrapper icon={FaStar} /></span>
                  <span className="text-lg text-gray-600">4.9</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0">
                <span className="text-2xl"><IconWrapper icon={FaCalendarPlus} /></span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-2xl">New Appointment Booked</div>
                <div className="text-xl text-gray-500">Shoulder therapy with Dr. Amina</div>
              </div>
              <div className="text-right">
                <div className="text-lg text-gray-400">Yesterday</div>
                <div className="text-lg text-orange-500 mt-1">Dec 15, 10:00 AM</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-700 flex-shrink-0">
                <span className="text-3xl"><IconWrapper icon={FaRobot} /></span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-2xl">AI Health Assessment</div>
                <div className="text-xl text-gray-500">Progress evaluation completed</div>
              </div>
              <div className="text-right">
                <div className="text-lg text-gray-400">2 days ago</div>
                <div className="text-lg text-green-500 mt-1">85% Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Reminders</h3>
            <button className="text-blue-500 text-xl">Manage</button>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-300 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                <span className="text-3xl"><IconWrapper icon={IoMdNotifications} /></span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-xl">Session Reminder</div>
                <div className="text-xl text-gray-500">Shoulder therapy tomorrow at 10:00 AM</div>
              </div>
              <button className="text-orange-500 text-xl font-medium">Snooze</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                <span className="text-3xl"><IconWrapper icon={FaDumbbell} /></span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-xl">Exercise Time</div>
                <div className="text-xl text-gray-500">Daily stretching routine in 30 minutes</div>
              </div>
              <button className="text-blue-500 text-xl font-medium">Start</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-300 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                <span className="text-3xl"><IconWrapper icon={FaPills} /></span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-xl">Medication Time</div>
                <div className="text-xl text-gray-500">Take prescribed supplements</div>
              </div>
              <button className="text-green-600 text-xl font-medium">Done</button>
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Health Insights</h3>
            <button className="text-blue-500 text-xl">View Report</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4 mb-5 border-b border-gray-100 pb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-blue-500 text-3xl mb-2"><IconWrapper icon={FaHeartPulse} /></span>
                <div className="text-4xl font-bold text-gray-900">72</div>
                <div className="text-lg text-gray-500">Avg Heart Rate</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-800 text-3xl mb-2"><IconWrapper icon={FaPersonWalking} /></span>
                <div className="text-4xl font-bold text-gray-900">8,547</div>
                <div className="text-lg text-gray-500">Daily Steps</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-2xl text-gray-900 mb-3">Weekly Summary</h4>
              <div className="space-y-3">
                {[
                  { label: 'Exercise Sessions', val: '5/5 ✓', color: 'text-green-500' },
                  { label: 'Pain Level (Avg)', val: '2.1/10', color: 'text-blue-500' },
                  { label: 'Sleep Quality', val: '8.3/10', color: 'text-purple-500' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex justify-between text-xl">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-medium ${color}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 mx-6 my-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl">
              <span className="text-3xl"><IconWrapper icon={FaPhone} /></span>
            </div>
            <div>
              <div className="font-bold text-2xl text-gray-900">Emergency Support</div>
              <div className="text-xl text-gray-500">24/7 medical assistance available</div>
            </div>
          </div>
          <button className="bg-red-500 text-white font-semibold text-xl px-5 py-3 rounded-xl hover:bg-red-600 transition">
            Call Now
          </button>
        </div>

        {/* Bottom Nav */}
        {/* <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaChartLine, label: 'Home', active: true },
              { icon: FaCalendar, label: 'Sessions', active: false },
              { icon: FaRobot, label: 'AI Chat', active: false, center: true },
              { icon: FaChartLine, label: 'Progress', active: false },
              { icon: FaUserDoctor, label: 'Profile', active: false },
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

// export default PatientDashboard;
function PatientDashboardWithRouter() {
  const navigate = useNavigate();
  return <PatientDashboard navigate={navigate} />;
}

export default PatientDashboardWithRouter;