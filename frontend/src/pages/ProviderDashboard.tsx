import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartTherapyAssistantSidebarWithRouter from './SmartTherapyAssistantSidebar';
import { MdNotifications } from 'react-icons/md';
import {
  FaCircleCheck, FaCalendarDay, FaArrowUp, FaCheck, FaPhone,
  FaClock, FaLocationDot, FaBuilding, FaRoute, FaMessage, FaCalendar,
  FaStar, FaChartLine, FaCalendarPlus, FaUsers, FaHouse,
} from 'react-icons/fa6';
import { IoIosArrowDown, IoMdSettings } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { IoReorderThree } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ──────────────────────────────────────────────────────────
interface DashboardData {
  doctor: {
    id: string; fullName: string; specialty: string; rating: number;
    experience: string; center: string; avatarUrl: string;
  };
  stats: {
    todaySessions: number; sessionChange: number;
    todayEarnings: number; earningsChange: number; currency: string;
  };
  weeklyChart: { day: string; earnings: number }[];
  weekly: {
    totalEarnings: number; sessionsCompleted: number;
    homeEarnings: number; clinicEarnings: number;
    homePercent: number; clinicPercent: number;
  };
  analytics: {
    totalPatients: number; successRate: number;
    patientSatisfaction: number; bookingCompletion: number;
  };
  appointments: {
    id: string; patientName: string; patientAvatar: string;
    treatment: string; time: string; sessionType: string; status: string;
  }[];
  recentMessages: {
    id: string; patientName: string; patientAvatar: string;
    message: string; time: string; tag: string;
  }[];
}

interface ProviderDashboardProps {
  navigate?: (path: string) => void;
}

interface ProviderDashboardState {
  sidebarOpen: boolean;
  data: DashboardData | null;
  loading: boolean;
  error: string;
}

// ── Toggle ─────────────────────────────────────────────────────────
const Toggle = ({ checked = false }: { checked?: boolean }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
    <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-green-500" />
  </label>
);

// ── Gauge ──────────────────────────────────────────────────────────
const GaugeChart = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
  const pct = Math.min(value / max, 1);
  const r = 45; const cx = 60; const cy = 58;
  const startAngle = Math.PI;
  const endAngle   = startAngle + pct * Math.PI;
  const x1 = cx + r * Math.cos(startAngle); const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);   const y2 = cy + r * Math.sin(endAngle);
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="120" height="72" viewBox="0 0 120 72">
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round" />
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}          fill="none" stroke={color}    strokeWidth="10" strokeLinecap="round" />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#3B82F6">{value}</text>
        </svg>
        <div className="flex justify-between text-gray-400 text-base px-1 -mt-1">
          <span>0</span><span>{max}</span>
        </div>
      </div>
      <p className="text-gray-500 text-lg mt-1 text-center">{label}</p>
    </div>
  );
};

// ── Status badge helpers ───────────────────────────────────────────
function getStatusStyle(status: string) {
  if (status === 'CONFIRMED') return { bg: 'bg-green-50',  color: 'text-green-600',  icon: FaCheck,   label: 'Start'     };
  if (status === 'PENDING')   return { bg: 'bg-gray-50',   color: 'text-gray-600',   icon: FaClock,   label: 'Pending'   };
  return                             { bg: 'bg-gray-50',   color: 'text-gray-600',   icon: FaClock,   label: 'Scheduled' };
}

function getLocationIcon(sessionType: string) {
  return sessionType === 'HOME_VISIT' ? FaLocationDot : FaBuilding;
}

function getLocationLabel(sessionType: string) {
  return sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic';
}

// ── Main ───────────────────────────────────────────────────────────
class ProviderDashboard extends React.Component<ProviderDashboardProps, ProviderDashboardState> {
  state: ProviderDashboardState = {
    sidebarOpen: false,
    data:        null,
    loading:     true,
    error:       '',
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setState({ error: 'Not logged in', loading: false });
      return;
    }
    try {
      const data = await api.getProviderDashboard(token);
      this.setState({ data, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message || 'Failed to load dashboard', loading: false });
    }
  }

  render() {
    const { sidebarOpen, data, loading, error } = this.state;

    // ── Loading ──────────────────────────────────────────────────
    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );

    // ── Not a doctor / error ─────────────────────────────────────
    if (error || !data) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-500 text-xl mb-4">{error || 'Dashboard unavailable'}</p>
          <p className="text-gray-500 text-lg">Make sure you are logged in as a Doctor account.</p>
          <p className="text-gray-400 text-lg mt-2">Try: dr.sarah@physioai.qa / doctor123</p>
        </div>
      </div>
    );

    const { doctor, stats, weeklyChart, weekly, analytics, appointments, recentMessages } = data;

    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed top-0 left-0 h-full z-50 overflow-y-auto shadow-2xl">
            <SmartTherapyAssistantSidebarWithRouter
              onClose={() => this.setState({ sidebarOpen: false })}
            />
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.setState({ sidebarOpen: true })} className="text-gray-600 text-4xl">
            <IconWrapper icon={IoReorderThree} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cyan-500 mb-1">Provider Dashboard</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Active Practice
            </p>
          </div>
          <button className="text-gray-600 text-4xl relative">
            <IconWrapper icon={MdNotifications} />
          </button>
        </header>

        {/* ── Doctor Profile Card ── */}
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 pt-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img src={doctor.avatarUrl} alt={doctor.fullName} className="w-20 h-20 rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center">
                  <IconWrapper icon={FaCircleCheck} className="text-green-500 text-3xl" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">Dr. {doctor.fullName}</h2>
                <p className="text-gray-500 text-xl">{doctor.specialty}</p>
                <div className="flex items-center gap-5 mt-1">
                  <span className="flex items-center gap-1 text-yellow-400 text-xl">
                    <IconWrapper icon={FaStar} />
                    <span className="text-gray-700">{doctor.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-blue-500 text-lg">
                    <IconWrapper icon={FaCalendarDay} />
                    <span className="text-gray-700">{doctor.experience}</span>
                  </span>
                </div>
              </div>
              <button className="text-gray-400 text-2xl">
                <IconWrapper icon={FaEdit} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="bg-gray-50 p-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-4xl font-bold text-gray-900">{stats.todaySessions}</p>
              <p className="text-gray-500 text-lg">Today's Sessions</p>
              <p className={`text-lg flex items-center gap-1 mt-1 ${stats.sessionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <IconWrapper icon={FaArrowUp} className="text-sm" />
                {stats.sessionChange >= 0 ? '+' : ''}{stats.sessionChange}% vs yesterday
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-3xl font-bold text-gray-900">{stats.currency} {stats.todayEarnings.toLocaleString()}</p>
              <p className="text-gray-500 text-lg">Today's Earnings</p>
              <p className={`text-lg flex items-center gap-1 mt-1 ${stats.earningsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <IconWrapper icon={FaArrowUp} className="text-sm" />
                {stats.earningsChange >= 0 ? '+' : ''}{stats.earningsChange}% vs yesterday
              </p>
            </div>
          </div>
        </div>

        {/* ── Performance Overview ── */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Performance Overview</h3>
            <div className="flex gap-2">
              <button className="text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full text-lg font-medium">Week</button>
              <button className="text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full text-lg">Month</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <GaugeChart value={doctor.rating}                             max={5}   label="Patient Rating"      color="#22c55e" />
            <GaugeChart value={analytics.bookingCompletion}               max={100} label="Session Completion"  color="#4ade80" />
            <GaugeChart value={Math.min(appointments.length > 0 ? 7 : 0, 10)} max={10}  label="Response Time"       color="#22c55e" />
          </div>

          {/* Area Chart — real weekly earnings */}
          <div className="rounded-2xl pt-4" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChart} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day"      tick={{ fill: '#9CA3AF', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={v => `QAR ${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB' }}
                  formatter={value => [`QAR ${value}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={3}
                  fill="url(#colorEarnings)" dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Today's Appointments ── */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Today's Appointments</h3>
            <button className="font-semibold text-blue-500 text-xl">View All</button>
          </div>

          {appointments.length === 0 && (
            <p className="text-gray-400 text-xl text-center py-8">No appointments today.</p>
          )}

          <div className="space-y-5">
            {appointments.map(appt => {
              const status   = getStatusStyle(appt.status);
              const LocIcon  = getLocationIcon(appt.sessionType);
              const locLabel = getLocationLabel(appt.sessionType);
              return (
                <div key={appt.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                  <img src={appt.patientAvatar} alt={appt.patientName} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">{appt.patientName}</p>
                    <p className="text-gray-500 text-lg">{appt.treatment}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-blue-500 text-xl">
                        <IconWrapper icon={FaClock} /> {appt.time}
                      </span>
                      <span className="flex items-center gap-1 text-gray-700 text-lg">
                        <IconWrapper icon={LocIcon} /> {locLabel}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-lg font-medium ${status.bg} ${status.color}`}>
                      <IconWrapper icon={status.icon} className="text-lg" /> {status.label}
                    </button>
                    <button className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-lg font-medium bg-blue-50 text-blue-600">
                      <IconWrapper icon={FaPhone} className="text-lg" /> Call
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent Messages ── */}
        <div className="p-6 pt-8">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Recent Messages</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          {recentMessages.length === 0 && (
            <p className="text-gray-400 text-xl text-center py-8">No messages yet.</p>
          )}
          <div className="space-y-5">
            {recentMessages.map(msg => (
              <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4 mb-3">
                  <img src={msg.patientAvatar} alt={msg.patientName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-gray-900 text-xl">{msg.patientName}</p>
                      <p className="text-gray-400 text-lg">{msg.time}</p>
                    </div>
                    <p className="text-gray-500 text-lg mt-1">{msg.message}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-lg text-blue-500 bg-blue-50">
                        {msg.tag}
                      </span>
                      <button className="text-blue-500 text-lg font-medium">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Weekly Earnings ── */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Weekly Earnings</h3>
            <button className="flex items-center gap-2 text-gray-600 text-xl">
              This Week <IconWrapper icon={IoIosArrowDown} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-4xl font-bold text-gray-900">QAR {weekly.totalEarnings.toLocaleString()}</p>
              <p className="text-gray-500 text-xl">Total Earnings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{weekly.sessionsCompleted}</p>
              <p className="text-gray-500 text-xl">Sessions Completed</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-700 text-lg">Home Visits</span>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-semibold text-lg">QAR {weekly.homeEarnings.toLocaleString()}</p>
                <p className="text-gray-400 text-lg">{weekly.homePercent}%</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-gray-700 text-lg">Clinic Sessions</span>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-semibold text-lg">QAR {weekly.clinicEarnings.toLocaleString()}</p>
                <p className="text-gray-400 text-lg">{weekly.clinicPercent}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Availability Settings (static UI — no DB needed) ── */}
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

        {/* ── Practice Analytics ── */}
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
              <p className="text-3xl font-bold text-blue-500">{analytics.totalPatients}</p>
              <p className="text-gray-500 text-lg">Total Patients</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-gray-900">{analytics.successRate}%</p>
              <p className="text-gray-500 text-lg">Success Rate</p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Patient Satisfaction',  val: `${analytics.patientSatisfaction}%`, w: `${analytics.patientSatisfaction}%` },
              { label: 'Booking Completion',     val: `${analytics.bookingCompletion}%`,   w: `${analytics.bookingCompletion}%`   },
              { label: 'Success Rate',           val: `${analytics.successRate}%`,         w: `${analytics.successRate}%`         },
            ].map(({ label, val, w }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-lg">{label}</span>
                  <span className="text-gray-700 text-lg font-semibold">{val}</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-300 h-full rounded-full" style={{ width: w }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions (static UI) ── */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaCalendarPlus, bg: 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200',     iconColor: 'text-blue-500',   label: 'Add Availability', sub: 'Set new time slots'  },
              { icon: FaChartLine,    bg: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200',     iconColor: 'text-gray-700',   label: 'View Reports',     sub: 'Detailed analytics' },
              { icon: FaUsers,        bg: 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200', iconColor: 'text-purple-500', label: 'Patient List',     sub: 'Manage patients'    },
              { icon: IoMdSettings,   bg: 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200', iconColor: 'text-orange-500', label: 'Settings',         sub: 'Profile & preferences' },
            ].map(({ icon, bg, iconColor, label, sub }) => (
              <button key={label} className={`${bg} rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow`}>
                <span className={`text-4xl mb-2 ${iconColor}`}><IconWrapper icon={icon} /></span>
                <p className="font-bold text-gray-900 text-xl">{label}</p>
                <p className="text-gray-500 text-lg">{sub}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }
}

export default ProviderDashboard;