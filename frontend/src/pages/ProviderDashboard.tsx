import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartTherapyAssistantSidebarWithRouter from './SmartTherapyAssistantSidebar';
import { MdNotifications } from 'react-icons/md';
import {
  FaCircleCheck, FaCalendarDay, FaArrowUp, FaCheck, FaPhone,
  FaClock, FaLocationDot, FaBuilding, FaRoute, FaMessage, FaCalendar,
  FaStar, FaChartLine, FaCalendarPlus, FaUsers, FaHouse
} from 'react-icons/fa6';
import { IoIosArrowDown, IoMdSettings } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { IoReorderThree } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", earnings: 2400 },
  { day: "Tue", earnings: 2800 },
  { day: "Wed", earnings: 3200 },
  { day: "Thu", earnings: 2900 },
  { day: "Fri", earnings: 3400 },
  { day: "Sat", earnings: 3900 },
  { day: "Sun", earnings: 3240 },
];

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface ProviderDashboardProps {
  navigate?: (path: string) => void;
}

interface ProviderDashboardState {
  sidebarOpen: boolean;
}

//page 12 src/pages/ProviderDashboard.tsx
const Toggle = ({ checked = false }: { checked?: boolean }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
    <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-green-500"></div>
  </label>
);

const GaugeChart = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
  const pct = value / max;
  const r = 45;
  const cx = 60;
  const cy = 58;
  const startAngle = Math.PI;
  const endAngle = startAngle + pct * Math.PI;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="120" height="72" viewBox="0 0 120 72">
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round"
          />
          <path
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#3B82F6">{value}</text>
        </svg>
        <div className="flex justify-between text-gray-400 text-base px-1 -mt-1">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
      <p className="text-gray-500 text-lg mt-1 text-center">{label}</p>
    </div>
  );
};

class ProviderDashboard extends React.Component<ProviderDashboardProps, ProviderDashboardState> {
  state: ProviderDashboardState = {
    sidebarOpen: false,
  };
  render() {
    const { sidebarOpen } = this.state;
    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Sidebar */}
        {sidebarOpen && (
          <>
            {/* dark backdrop — click to close */}
            <div className="fixed top-0 left-0 h-full z-50 overflow-y-auto shadow-2xl">
              <SmartTherapyAssistantSidebarWithRouter
                onClose={() => this.setState({ sidebarOpen: false })}
              />
            </div>
          </>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.setState({ sidebarOpen: true })} className="text-gray-600 text-4xl">
            <span className=""><IconWrapper icon={IoReorderThree} /></span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cyan-500 mb-1">Provider Dashboard</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
              Active Practice
            </p>
          </div>
          <button className="text-gray-600 text-4xl relative">
            <span className=""><IconWrapper icon={MdNotifications} /></span>
          </button>
        </header>

        {/* Doctor Profile Card */}
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 pt-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Dr. Sarah"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center">
                  <IconWrapper icon={FaCircleCheck} className="text-green-500 text-3xl" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">Dr. Sarah Al-Mahmoud</h2>
                <p className="text-gray-500 text-xl">Licensed Physiotherapist</p>
                <div className="flex items-center gap-5 mt-1">
                  <span className="flex items-center gap-1 text-yellow-400 text-xl">
                    <IconWrapper icon={FaStar} />
                    <span className="text-gray-700">4.9</span>
                  </span>
                  <span className="flex items-center gap-1 text-blue-500 text-lg">
                    <IconWrapper icon={FaCalendarDay} />
                    <span className="text-gray-700">8 years exp.</span>
                  </span>
                </div>
              </div>
              <button className="text-gray-400 text-2xl">
                <IconWrapper icon={FaEdit} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-gray-50 p-6 rounded-2xl">
          <div className="grid grid-cols-2 gap-5 relative">
            {/* Left: Sessions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-4xl font-bold text-gray-900">24</p>
              <p className="text-gray-500 text-lg">Today's Sessions</p>
              <p className="text-green-500 text-lg flex items-center gap-1 mt-1">
                <IconWrapper icon={FaArrowUp} className="text-sm" /> +12% vs yesterday
              </p>
              {/* <div className="absolute right-6 top-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-md z-10">
                <IconWrapper icon={FaCalendarDay} />
              </div> */}
            </div>

            {/* Right: Earnings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="pl-8">
                <p className="text-4xl font-bold text-gray-900">QAR 3,240</p>
                <p className="text-gray-500 text-lg">Today's Earnings</p>
                <p className="text-green-500 text-lg flex items-center gap-1 mt-1">
                  <IconWrapper icon={FaArrowUp} className="text-sm" /> +8% vs yesterday
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Performance Overview</h3>
            <div className="flex gap-2">
              <button className="text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full text-lg font-medium">Week</button>
              <button className="text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full text-lg">Month</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <GaugeChart value={4.9} max={6} label="Patient Rating" color="#22c55e" />
            <GaugeChart value={90} max={100} label="Session Completion" color="#4ade80" />
            <GaugeChart value={7} max={10} label="Response Time" color="#22c55e" />
          </div>

          {/* Area Chart */}
          <div className="rounded-2xl pt-4" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `QAR ${v}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB" }}
                  formatter={(value) => [`QAR ${value}`, "Earnings"]}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorEarnings)"
                  dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Today's Appointments</h3>
            <button className="font-semibold text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-5">
            {[
              {
                name: 'Ahmed Hassan', sub: 'Lower back pain treatment',
                time: '10:30 AM', location: 'Home Visit', locationIcon: FaLocationDot,
                img: 'https://randomuser.me/api/portraits/men/32.jpg',
                btn1: { label: 'Start', icon: FaCheck, color: 'text-green-600' },
                btn2: { label: 'Call', icon: FaPhone, color: 'text-blue-600' },
                bg1: 'bg-green-50',
              },
              {
                name: 'Fatima Al-Zahra', sub: 'Knee rehabilitation session',
                time: '12:00 PM', location: 'Clinic', locationIcon: FaBuilding,
                img: 'https://randomuser.me/api/portraits/women/44.jpg',
                btn1: { label: 'Pending', icon: FaClock, color: 'text-gray-600' },
                btn2: { label: 'Chat', icon: FaMessage, color: 'text-blue-600' },
                bg1: 'bg-gray-50',
              },
              {
                name: 'Omar Khalil', sub: 'Sports injury recovery',
                time: '2:30 PM', location: 'Home Visit', locationIcon: FaLocationDot,
                img: 'https://randomuser.me/api/portraits/men/55.jpg',
                btn1: { label: 'Scheduled', icon: FaClock, color: 'text-gray-600' },
                btn2: { label: 'Route', icon: FaRoute, color: 'text-blue-600' },
                bg1: 'bg-gray-50',
              },
            ].map(({ name, sub, time, location, locationIcon, img, btn1, btn2, bg1 }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                <img src={img} alt={name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-xl">{name}</p>
                  <p className="text-gray-500 text-lg">{sub}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-blue-500 text-xl  ">
                      <IconWrapper icon={FaClock} /> {time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-700 text-lg">
                      <IconWrapper icon={locationIcon} /> {location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-lg font-medium ${bg1} ${btn1.color}`}>
                    <IconWrapper icon={btn1.icon} className="text-lg" /> {btn1.label}
                  </button>
                  <button className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-lg font-medium bg-blue-50 ${btn2.color}`}>
                    <IconWrapper icon={btn2.icon} className="text-lg" /> {btn2.label}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="p-6 pt-8">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Recent Messages</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-5">
            {[
              {
                name: 'Khalid Mansour', time: '5 min ago',
                msg: "Doctor, I'm feeling much better after yesterday's session. Should I continue with the exercises you recommended?",
                img: 'https://randomuser.me/api/portraits/men/41.jpg',
                tag: 'Follow-up', tagColor: 'text-blue-500 bg-blue-50', dot: false,
              },
              {
                name: 'Layla Ahmed', time: '15 min ago',
                msg: 'Thank you for the session today! I have a question about the home exercises you showed me.',
                img: 'https://randomuser.me/api/portraits/women/65.jpg',
                tag: 'Exercise Query', tagColor: 'text-gray-600 bg-white', dot: true,
              },
            ].map(({ name, time, msg, img, tag, tagColor, dot }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4 mb-3">
                  <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-gray-900 text-xl">{name}</p>
                      <p className="text-gray-400 text-lg">{time}</p>
                    </div>
                    <p className="text-gray-500 text-lg mt-1">{msg}</p>

                    <div className="flex justify-between items-center mt-4">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-lg ${tagColor}`}>
                        {tag}
                        {dot && <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                      </span>
                      <button className="text-blue-500 text-lg font-medium">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Earnings */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Weekly Earnings</h3>
            <button className="flex items-center gap-2 text-gray-600 text-xl">
              This Week <IconWrapper icon={IoIosArrowDown} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-4xl font-bold text-gray-900">QAR 18,450</p>
              <p className="text-gray-500 text-xl">Total Earnings</p>
              <p className="text-green-500 text-lg flex items-center gap-1 mt-1">
                <IconWrapper icon={FaArrowUp} className="text-sm" /> +15%
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-gray-500 text-xl">Sessions Completed</p>
              <p className="text-green-500 text-lg flex items-center gap-1 mt-1">
                <IconWrapper icon={FaArrowUp} className="text-sm" /> +8%
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700 text-lg">Home Visits</span>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-semibold text-lg">QAR 12,300</p>
                <p className="text-gray-400 text-lg">67%</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                <span className="text-gray-700 text-lg">Clinic Sessions</span>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-semibold text-lg">QAR 6,150</p>
                <p className="text-gray-400 text-lg">33%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Availability Settings</h3>
            <button className="text-blue-500 text-xl">Edit Schedule</button>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 rounded-3xl p-5 mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              <IconWrapper icon={FaCalendar} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-xl">Today's Status</p>
              <p className="text-gray-500 text-xl">Available until 6:00 PM</p>
            </div>
            <Toggle checked={true} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500 text-3xl"><IconWrapper icon={TiHome} /></span>
                <p className="font-bold text-gray-900 text-xl">Home Visits</p>
              </div>
              <p className="text-gray-500 text-lg">6 slots available today</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-700 text-2xl"><IconWrapper icon={FaBuilding} /></span>
                <p className="font-bold text-gray-900 text-xl">Clinic Sessions</p>
              </div>
              <p className="text-gray-500 text-lg">4 slots available today</p>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Recent Reviews</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-4">
            {[
              {
                name: 'Hassan Al-Rashid', time: '2 hours ago', stars: 5,
                msg: 'Excellent service! Dr. Sarah was very professional and the treatment was exactly what I needed. My back pain is almost gone.',
                img: 'https://randomuser.me/api/portraits/men/22.jpg',
                btn: 'Thank Patient',
              },
              {
                name: 'Noor Abdallah', time: '1 day ago', stars: 4,
                msg: 'Great experience with the home visit service. Very convenient and Dr. Sarah explained everything clearly.',
                img: 'https://randomuser.me/api/portraits/women/32.jpg',
                btn: 'Respond',
              },
            ].map(({ name, time, stars, msg, img, btn }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4 mb-3">
                  <img src={img} alt={name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-900 text-xl">{name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <IconWrapper key={i} icon={FaStar} className={`text-xl ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-lg mt-1">{msg}</p>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-400 text-lg">{time}</p>
                      <button className="text-blue-500 text-lg font-medium">{btn}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Analytics */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Practice Analytics</h3>
            <div className="flex gap-2">
              <button className="text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-lg font-medium">This Month</button>
              <button className="text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full text-lg">Last Month</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">342</p>
              <p className="text-gray-500 text-lg">Total Patients</p>
              <p className="text-green-500 text-lg flex items-center justify-center gap-1 mt-1">
                <IconWrapper icon={FaArrowUp} className="text-sm" /> +23
              </p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-gray-900">96%</p>
              <p className="text-gray-500 text-lg">Success Rate</p>
              <p className="text-green-500 text-lg flex items-center justify-center gap-1 mt-1">
                <IconWrapper icon={FaArrowUp} className="text-sm" /> +2%
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Patient Satisfaction', val: '94%', color: 'bg-gradient-to-r from-blue-500 to-blue-300', w: 'w-[94%]' },
              { label: 'Booking Completion', val: '87%', color: 'bg-gradient-to-r from-blue-500 to-blue-300', w: 'w-[87%]' },
              { label: 'Response Time', val: '2.3 min avg', color: 'bg-gradient-to-r from-blue-500 to-blue-300', w: 'w-[50%]' },
            ].map(({ label, val, color, w }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-lg">{label}</span>
                  <span className="text-gray-700 text-lg font-semibold">{val}</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full ${w}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 ">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaCalendarPlus, bg: 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200', iconColor: 'text-blue-500', label: 'Add Availability', sub: 'Set new time slots' },
              { icon: FaChartLine, bg: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200', iconColor: 'text-gray-700', label: 'View Reports', sub: 'Detailed analytics' },
              { icon: FaUsers, bg: 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200', iconColor: 'text-purple-500', label: 'Patient List', sub: 'Manage patients' },
              { icon: IoMdSettings, bg: 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200', iconColor: 'text-orange-500', label: 'Settings', sub: 'Profile & preferences' },
            ].map(({ icon, bg, iconColor, label, sub }) => (
              <div key={label} className={`${bg} rounded-3xl p-6 flex flex-col items-center text-center`}>
                <span className={`text-4xl mb-2 ${iconColor}`}><IconWrapper icon={icon} /></span>
                <p className="font-bold text-gray-900 text-xl">{label}</p>
                <p className="text-gray-500 text-lg">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        {/* <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaHouse, label: 'Dashboard', active: true },
              { icon: FaCalendar, label: 'Schedule', active: false },
              { icon: FaMessage, label: 'Messages', active: false },
              { icon: FaChartLine, label: 'Analytics', active: false },
              { icon: FaUsers, label: 'Profile', active: false },
            ].map(({ icon, label, active }) => (
              <button key={label} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-500' : 'text-gray-400'}`}>
                <span className="text-xl"><IconWrapper icon={icon} /></span>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </nav> */}

      </div>
    );
  }
}

export default ProviderDashboard;