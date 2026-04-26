import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarCheck, FaStar, FaHeartPulse, FaDumbbell, FaChartLine,
  FaTrophy, FaVideo, FaMessage, FaCalendar, FaClock, FaLocationDot,
  FaLightbulb, FaMoon, FaUserDoctor, FaPlus, FaWallet, FaRobot,
  FaCalendarPlus, FaCheck, FaPersonWalking, FaPhone, FaBed,
  FaGlassWater, FaComments, FaPills,
} from 'react-icons/fa6';
import { IoIosWater, IoMdNotifications, IoMdSettings } from 'react-icons/io';
import { BsChatFill } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

interface DashboardData {
  stats: {
    totalSessions: number;
    completedSessions: number;
    pendingSessions: number;
    recoveryRate: number;
  };
  bookings: Array<{
    id: string;
    status: string;
    sessionType: string;
    notes?: string;
    createdAt: string;
    slot: { date: string; startTime: string; endTime: string };
    doctor: {
      id: string;
      fullName: string;
      specialties: string[];
      rating: number;
      center: string;
      avatarUrl: string;
    };
  }>;
  recentActivity: Array<{
    id: string;
    status: string;
    createdAt: string;
    doctorName: string;
    specialty: string;
    slot: { date: string; startTime: string };
  }>;
  healthInsight: {
    heartRate: number | null;
    dailySteps: number | null;
    exerciseSessions: number;
    totalSessions: number;
    painLevel: number | null;
    sleepQuality: number | null;
  } | null;

  reminders: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    time: string | null;
  }>;

  progress: {
    painReduction: number;
    mobilityImprovement: number;
    exerciseCompliance: number;
    weeksInTreatment: number;
  };
}

interface PatientDashboardProps {
  navigate?: (path: string) => void;
  user?: { id: string; email: string; fullName: string; role: string } | null;
  token?: string | null;
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: string;
}

function getFirstName(fullName?: string) {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function getAvatarUrl(fullName?: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=3b82f6&color=fff&size=128`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

// ── Status badge color ────────────────────────────────────────────
function statusColor(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'text-green-600';
    case 'PENDING': return 'text-orange-500';
    case 'COMPLETED': return 'text-blue-500';
    case 'CANCELLED': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

class PatientDashboard extends React.Component<PatientDashboardProps, State> {
  state: State = { data: null, loading: true, error: '' };

  async componentDidMount() {
    // const { token } = this.props;
    // if (!token) { this.setState({ loading: false }); return; }
    try {
      const data = await api.getDashboard();
      this.setState({ data: data as any, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {
    const { user } = this.props;
    const { data, loading, error } = this.state;

    const firstName = getFirstName(user?.fullName);
    const greeting = getGreeting();
    const avatarUrl = getAvatarUrl(user?.fullName);
    const fullName = user?.fullName || 'User';

    // use real stats or fall back to zeros while loading
    const stats = data?.stats ?? {
      totalSessions: 0, completedSessions: 0,
      pendingSessions: 0, recoveryRate: 0,
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img src={avatarUrl} alt={fullName}
              className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{greeting}, {firstName}</h2>
              <p className="text-xl text-gray-500 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                Ready for your wellness journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative" onClick={() => this.props.navigate?.('/notifications')}>
              <span className="text-3xl text-gray-600"><IconWrapper icon={IoMdNotifications} /></span>
              <span className="absolute -top-4 -right-4 bg-red-500 text-white border-2 border-white text-lg rounded-full w-7 h-7 flex items-center justify-center">3</span>
            </button>
            <button className="text-3xl text-gray-600" onClick={() => this.props.navigate?.('/settings')}>
              <IconWrapper icon={IoMdSettings} />
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-100 text-white p-6 pb-16 relative overflow-hidden">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white text-3xl"><IconWrapper icon={FaHeartPulse} /></span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Welcome back, {firstName}! 👋</h1>
          <p className="text-white/80 text-xl mb-4">Your health journey continues with personalized care</p>
          <div className="flex items-center gap-6 text-xl">
            <div className="flex items-center gap-2">
              <span className="text-white"><IconWrapper icon={FaCalendarCheck} /></span>
              <span className="font-medium">{stats.completedSessions} Sessions Completed</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white mx-4 -mt-10 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 relative z-10">
          {loading ? (
            <div className="col-span-3 py-8 text-center text-gray-400 text-xl">Loading...</div>
          ) : (
            <>
              <div className="flex flex-col items-center py-5 gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 text-3xl">
                  <IconWrapper icon={FaDumbbell} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalSessions}</div>
                <div className="text-xl text-gray-500">Total Sessions</div>
              </div>
              <div className="flex flex-col items-center justify-center py-5 gap-2">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-600 text-2xl">
                  <IconWrapper icon={FaChartLine} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.recoveryRate}%</div>
                <div className="text-xl text-gray-500">Completion Rate</div>
              </div>
              <div className="flex flex-col items-center py-5 gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-500 text-3xl">
                  <IconWrapper icon={FaTrophy} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.completedSessions}</div>
                <div className="text-xl text-gray-500">Completed</div>
              </div>
            </>
          )}
        </div>

        {/* Ongoing Sessions */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Ongoing Sessions</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>

          {loading && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xl">
              Loading sessions...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-500 text-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && data?.bookings.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <IconWrapper icon={FaCalendarCheck} className="text-gray-300 text-5xl mx-auto mb-3" />
              <p className="text-gray-500 text-xl">No ongoing sessions</p>
              <button
                onClick={() => this.props.navigate?.('/book')}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl text-xl font-medium"
              >
                Book a Session
              </button>
            </div>
          )}

          {!loading && data?.bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.doctor.avatarUrl}
                    alt={booking.doctor.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-900">
                      Dr. {booking.doctor.fullName}
                    </h4>
                    <p className="text-xl font-semibold text-gray-500">
                      {booking.doctor.specialties[0]}
                    </p>
                    <p className="text-lg text-gray-400">{booking.doctor.center}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-xl font-medium ${statusColor(booking.status)}`}>
                  <span className="w-3 h-3 rounded-full bg-current"></span>
                  {booking.status}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-4 text-lg text-gray-600">
                  <span className="flex items-center gap-1">
                    <IconWrapper icon={FaCalendar} className="text-gray-400" />
                    {formatDate(booking.slot.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconWrapper icon={FaClock} className="text-gray-400" />
                    {booking.slot.startTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconWrapper icon={FaLocationDot} className="text-gray-400" />
                    {booking.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic'}
                  </span>
                </div>
                {booking.notes && (
                  <p className="text-lg text-gray-500 italic">"{booking.notes}"</p>
                )}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-300 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-3 text-xl shadow-sm">
                  <IconWrapper icon={FaVideo} /> Join Session
                </button>
                <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50">
                  <IconWrapper icon={FaMessage} />
                </button>
                <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50">
                  <IconWrapper icon={FaCalendar} />
                </button>
              </div>
            </div>
          ))}
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
              <button key={label} onClick={() => this.props.navigate?.(path)}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-3 hover:shadow-md transition text-left">
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
        <div className="mx-6 bg-gradient-to-r from-blue-500 to-blue-200 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-6xl text-white bg-white/70 rounded-full w-24 h-24 flex items-center justify-center">
            <IconWrapper icon={FaComments} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <IconWrapper icon={FaRobot} className="text-white text-2xl" />
            </div>
            <span className="font-medium text-2xl">AI Assistant</span>
          </div>
          <h4 className="font-bold text-2xl mb-1">Need Help?</h4>
          <p className="text-white/80 text-xl mb-4">Ask me about symptoms, exercises, or book a session</p>
          <button onClick={() => this.props.navigate?.('/ai-assistant')}
            className="bg-white text-blue-500 font-semibold text-xl px-4 py-3 rounded-xl flex items-center gap-3">
            <IconWrapper icon={BsChatFill} /> Start Chat
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
                <div className="font-medium text-xl text-gray-500">Treatment Progress</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                  {stats.recoveryRate}%
                </div>
                <div className="text-lg text-gray-400">Completion Rate</div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {[
                {
                  label: 'Pain Level Reduction',
                  pct: `${data?.progress.painReduction ?? 0}%`,
                  color: 'bg-gradient-to-r from-green-400 to-green-500',
                  val: `${data?.progress.painReduction ?? 0}%`,
                },
                {
                  label: 'Mobility Improvement',
                  pct: `${data?.progress.mobilityImprovement ?? 0}%`,
                  color: 'bg-gradient-to-r from-blue-400 to-blue-500',
                  val: `${data?.progress.mobilityImprovement ?? 0}%`,
                },
                {
                  label: 'Exercise Compliance',
                  pct: `${data?.progress.exerciseCompliance ?? 0}%`,
                  color: 'bg-gradient-to-r from-purple-400 to-purple-500',
                  val: `${data?.progress.exerciseCompliance ?? 0}%`,
                },
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
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalSessions}</div>
                <div className="text-xl text-gray-500">Sessions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.completedSessions}</div>
                <div className="text-xl text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{data?.progress.weeksInTreatment ?? 0}</div>
                <div className="text-xl text-gray-500">Weeks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity — from DB */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>

          {!loading && data?.recentActivity.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-xl">
              No activity yet
            </div>
          )}

          <div className="space-y-3">
            {data?.recentActivity.map(activity => (
              <div key={activity.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${activity.status === 'COMPLETED'
                  ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-500'
                  : activity.status === 'CONFIRMED'
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-500'
                    : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-500'
                  }`}>
                  <span className="text-2xl">
                    <IconWrapper icon={
                      activity.status === 'COMPLETED' ? FaCheck :
                        activity.status === 'CONFIRMED' ? FaCalendarPlus : FaClock
                    } />
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-2xl">
                    {activity.status === 'COMPLETED' ? 'Session Completed' :
                      activity.status === 'CONFIRMED' ? 'Appointment Confirmed' : 'Appointment Pending'}
                  </div>
                  <div className="text-xl text-gray-500">
                    {activity.specialty} with Dr. {activity.doctorName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-400">{timeAgo(activity.createdAt)}</div>
                  <div className={`text-lg mt-1 ${statusColor(activity.status)}`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Reminders</h3>
            <button className="text-blue-500 text-xl">Manage</button>
          </div>

          {!loading && data?.reminders.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-xl">
              No reminders yet
            </div>
          )}

          <div className="space-y-3">
            {data?.reminders.map(reminder => {
              const isSession = reminder.type === 'SESSION';
              const isExercise = reminder.type === 'EXERCISE';
              const isMedication = reminder.type === 'MEDICATION';

              return (
                <div key={reminder.id} className={`rounded-2xl border p-6 flex items-center gap-4 ${isSession ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-100' :
                    isExercise ? 'bg-white border-gray-100' :
                      'bg-white border-gray-100'
                  }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 ${isSession ? 'bg-gradient-to-br from-orange-400 to-orange-300' :
                      isExercise ? 'bg-gradient-to-br from-blue-400 to-blue-200' :
                        'bg-gradient-to-br from-green-400 to-green-300'
                    }`}>
                    <span className="text-3xl">
                      <IconWrapper icon={
                        isSession ? IoMdNotifications :
                          isExercise ? FaDumbbell :
                            FaPills
                      } />
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-xl">{reminder.title}</div>
                    <div className="text-xl text-gray-500">{reminder.message}</div>
                    {reminder.time && (
                      <div className="text-lg text-gray-400 mt-1">{reminder.time}</div>
                    )}
                  </div>
                  <button className={`text-xl font-medium ${isSession ? 'text-orange-500' :
                      isExercise ? 'text-blue-500' :
                        'text-green-600'
                    }`}>
                    {isSession ? 'Snooze' : isExercise ? 'Start' : 'Done'}
                  </button>
                </div>
              );
            })}
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
                <div className="text-4xl font-bold text-gray-900">
                  {data?.healthInsight?.heartRate ?? '--'}
                </div>
                <div className="text-lg text-gray-500">Avg Heart Rate</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-800 text-3xl mb-2"><IconWrapper icon={FaPersonWalking} /></span>
                <div className="text-4xl font-bold text-gray-900">
                  {data?.healthInsight?.dailySteps?.toLocaleString() ?? '--'}
                </div>
                <div className="text-lg text-gray-500">Daily Steps</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-2xl text-gray-900 mb-3">Weekly Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xl">
                  <span className="text-gray-600">Exercise Sessions</span>
                  <span className="font-medium text-green-500">
                    {data?.healthInsight
                      ? `${data.healthInsight.exerciseSessions}/${data.healthInsight.totalSessions} ✓`
                      : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="text-gray-600">Pain Level (Avg)</span>
                  <span className="font-medium text-blue-500">
                    {data?.healthInsight?.painLevel != null
                      ? `${data.healthInsight.painLevel}/10`
                      : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="text-gray-600">Sleep Quality</span>
                  <span className="font-medium text-purple-500">
                    {data?.healthInsight?.sleepQuality != null
                      ? `${data.healthInsight.sleepQuality}/10`
                      : '--'}
                  </span>
                </div>
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

      </div>
    );
  }
}

// ── Router wrapper ────────────────────────────────────────────────
function PatientDashboardWithRouter() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  return <PatientDashboard navigate={navigate} user={user} token={token} />;
}

export default PatientDashboardWithRouter;