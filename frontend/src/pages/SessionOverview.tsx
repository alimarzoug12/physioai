import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarPlus, FaStar, FaChartLine, FaDumbbell, FaClock,
  FaCalendarDay, FaCalendar, FaCircleCheck, FaNoteSticky,
  FaCommentMedical, FaLightbulb, FaArrowRotateRight, FaDownload,
  FaAngleRight, FaBrain, FaAward, FaCheck, FaFileWaveform,
  FaArrowLeft, FaComments, FaLocationDot,
} from 'react-icons/fa6';
import { TbCircleDotted } from 'react-icons/tb';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ──────────────────────────────────────────────────────────
interface Doctor {
  fullName: string;
  specialty: string;
  center: string;
  rating: number;
  avatarUrl: string;
}

interface SessionItem {
  id: string;
  num: string;
  status: string;
  date: string;
  startTime: string;
  endTime?: string;
  sessionType: string;
  notes?: string;
  price?: string;
  doctor: Doctor;
}

interface SessionsData {
  stats: {
    totalSessions: number;
    completedSessions: number;
    upcomingSessions: number;
    recoveryRate: number;
    weeksInTreatment: number;
  };
  upcoming: SessionItem[];
  completed: SessionItem[];
  healthInsight: {
    painLevel: number | null;
    sleepQuality: number | null;
    exerciseSessions: number;
    totalExercises: number;
  } | null;
}

interface Props {
  navigate?: (path: string | number) => void;
  token?: string | null;
}

interface State {
  data: SessionsData | null;
  loading: boolean;
  error: string;
  activeTab: string;
  exercises: Array<{ name: string; time: string; done: boolean }>;
  loadingExercise: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

class SessionOverview extends React.Component<Props, State> {
  state: State = {
    data: null,
    loading: true,
    error: '',
    activeTab: 'all',
    exercises: [
      { name: 'Core Strengthening',  time: '15 minutes • Pending', done: false },
      { name: 'Stretching Routine',  time: '10 minutes • Pending', done: false },
      { name: 'Walking Exercise',    time: '20 minutes • Pending', done: false },
      { name: 'Posture Training',    time: '5 minutes • Pending',  done: false },
      { name: 'Heat Therapy',        time: '15 minutes • Pending', done: false },
    ],
    loadingExercise: null,
  };

  async componentDidMount() {
    const { token } = this.props;
    if (!token) { this.setState({ loading: false }); return; }
    try {
      const data = await api.getSessions(token);
      this.setState({ data, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleStart = (name: string) => {
    this.setState({ loadingExercise: name });
    setTimeout(() => {
      this.setState(prev => ({
        exercises: prev.exercises.map(ex =>
          ex.name === name
            ? { ...ex, done: true, time: `${ex.time.split('•')[0]}• Completed just now` }
            : ex
        ),
        loadingExercise: null,
      }));
    }, 2000);
  };

  render() {
    const { data, loading, error, activeTab } = this.state;
    const stats = data?.stats;

    // ── completed exercises count ──────────────────────────
    const doneCount  = this.state.exercises.filter(e => e.done).length;
    const totalCount = this.state.exercises.length;
    const exercisePct = Math.round((doneCount / totalCount) * 100);

    return (
      <div className="pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="text-gray-600 text-2xl"
          >
            <IconWrapper icon={FaArrowLeft} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">Session Overview</h1>
            <p className="text-lg text-gray-400 flex items-center justify-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              {loading ? '...' : `${stats?.completedSessions ?? 0} Sessions Completed`}
            </p>
          </div>
          <button
            onClick={() => this.props.navigate?.('/book')}
            className="text-gray-600 text-2xl"
          >
            <IconWrapper icon={FaCalendarPlus} />
          </button>
        </header>

        {/* Loading */}
        {loading && (
          <div className="p-12 text-center text-gray-400 text-xl">
            Loading your sessions...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="m-6 bg-red-50 border border-red-200 rounded-2xl p-6 text-red-500 text-xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Recovery Journey */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6">
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-4">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900">Your Recovery Journey</h3>
                  <p className="text-gray-500 text-xl">Treatment Progress</p>
                </div>

                <div className="flex justify-around mb-6">
                  <div className="text-center">
                    <div className="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2 text-3xl font-bold">
                      {stats?.completedSessions ?? 0}
                    </div>
                    <p className="font-semibold text-xl text-gray-900">Completed</p>
                    <p className="text-gray-500 text-lg">Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-100 text-gray-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2 text-3xl font-bold">
                      {stats?.upcomingSessions ?? 0}
                    </div>
                    <p className="font-semibold text-xl text-gray-900">Upcoming</p>
                    <p className="text-gray-500 text-lg">Sessions</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xl font-medium text-gray-700">Recovery Progress</span>
                    <span className="text-xl font-bold text-blue-500">{stats?.recoveryRate ?? 0}%</span>
                  </div>
                  <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full"
                      style={{ width: `${stats?.recoveryRate ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mt-6">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.totalSessions ?? 0}
                    </p>
                    <div className="flex justify-center gap-0.5 my-2">
                      {[...Array(5)].map((_, i) => (
                        <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-2xl" />
                      ))}
                    </div>
                    <p className="text-gray-500 text-lg">Total Sessions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats?.weeksInTreatment ?? 0}</p>
                    <p className="text-gray-500 text-lg">Weeks in Treatment</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats?.upcomingSessions ?? 0}</p>
                    <p className="text-gray-500 text-lg">Sessions Left</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="bg-gray-50 grid grid-cols-3 gap-4 mb-4 p-6">
              {[
                { icon: FaChartLine, color: 'text-blue-500',  label: 'Recovery Rate', val: `${stats?.recoveryRate ?? 0}%`,    valColor: 'text-green-500' },
                { icon: FaDumbbell,  color: 'text-gray-800',  label: 'Completed',     val: `${stats?.completedSessions ?? 0}`, valColor: 'text-green-500' },
                { icon: FaClock,     color: 'text-orange-500',label: 'Upcoming',      val: `${stats?.upcomingSessions ?? 0}`,  valColor: 'text-gray-700' },
              ].map(({ icon, color, label, val, valColor }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <span className={`flex justify-center text-3xl ${color} mb-2 block`}>
                    <IconWrapper icon={icon} />
                  </span>
                  <p className="text-xl font-bold text-gray-800">{label}</p>
                  <p className={`text-lg font-semibold ${valColor}`}>{val}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className='px-6 bg-white'>
              <div className="bg-gray-100 rounded-2xl p-1 grid grid-cols-3">
                {[
                  { key: 'all',       label: 'All Sessions' },
                  { key: 'completed', label: 'Completed'    },
                  { key: 'upcoming',  label: 'Upcoming'     },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => this.setState({ activeTab: key })}
                    className={`py-3 text-xl font-semibold transition rounded-xl ${
                      activeTab === key
                        ? 'text-blue-500 bg-white m-0.5 shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            {(activeTab === 'all' || activeTab === 'upcoming') && (
              <div className="bg-gray-50 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h3>
                  <button className="text-blue-500 text-xl">View Calendar</button>
                </div>

                {data?.upcoming.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-400 text-xl mb-4">No upcoming sessions</p>
                    <button
                      onClick={() => this.props.navigate?.('/book')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl"
                    >
                      Book a Session
                    </button>
                  </div>
                )}

                {/* Next session banner — first upcoming */}
                {data?.upcoming[0] && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-100 rounded-3xl p-6 mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">
                        <IconWrapper icon={FaCalendarDay} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-xl">Next Session</p>
                        <p className="text-white/80 text-lg">
                          {formatDate(data.upcoming[0].date)} at {data.upcoming[0].startTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={data.upcoming[0].doctor.avatarUrl}
                        alt={data.upcoming[0].doctor.fullName}
                        className="w-14 h-14 rounded-full border-4 border-white/20 object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-bold text-xl">
                          Dr. {data.upcoming[0].doctor.fullName}
                        </p>
                        <p className="text-white/80 text-lg">
                          {data.upcoming[0].doctor.specialty}
                        </p>
                      </div>
                      <div className="text-right text-white/70 text-lg">
                        <p>{data.upcoming[0].sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic'}</p>
                        <p className={`font-medium ${
                          data.upcoming[0].status === 'CONFIRMED' ? 'text-green-300' : 'text-yellow-300'
                        }`}>
                          {data.upcoming[0].status}
                        </p>
                      </div>
                    </div>
                    {data.upcoming[0].notes && (
                      <div className="bg-white/10 rounded-2xl p-4 mb-5">
                        <p className="text-white font-semibold text-lg">Notes:</p>
                        <p className="text-white/80 text-lg">{data.upcoming[0].notes}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-white/20 text-white py-3 rounded-2xl font-semibold text-xl">
                        Reschedule
                      </button>
                      <button className="bg-white text-blue-500 py-3 rounded-2xl font-semibold text-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Rest of upcoming sessions */}
                {data?.upcoming.slice(1).map(session => (
                  <div key={session.id} className="bg-white rounded-2xl border border-gray-100 space-y-5 p-6 mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                        <span className="text-2xl"><IconWrapper icon={FaCalendar} /></span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-xl">Session {session.num}</p>
                        <p className="text-gray-500 text-xl">
                          {formatDate(session.date)} • {session.startTime}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-500 text-xl px-3 py-1 rounded-full">
                        {session.sessionType === 'HOME_VISIT' ? 'Home' : 'Clinic'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={session.doctor.avatarUrl}
                        alt={session.doctor.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-xl">
                          Dr. {session.doctor.fullName}
                        </p>
                        <p className="text-gray-500 text-lg">{session.doctor.center}</p>
                      </div>
                      <button>
                        <IconWrapper icon={FaAngleRight} className="text-gray-400 text-xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Sessions */}
            {(activeTab === 'all' || activeTab === 'completed') && (
              <div className="bg-gray-50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Recent Sessions</h3>
                  <button className="text-blue-500 text-xl">View All</button>
                </div>

                {data?.completed.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-xl">
                    No completed sessions yet
                  </div>
                )}

                {/* First completed — expanded card */}
                {data?.completed[0] && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                        <IconWrapper icon={FaCircleCheck} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-xl">
                          Session {data.completed[0].num}
                        </p>
                        <p className="text-gray-500 text-xl">
                          {formatDate(data.completed[0].date)} • {data.completed[0].startTime}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-600 text-lg px-3 py-1 rounded-full font-medium">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <img
                        src={data.completed[0].doctor.avatarUrl}
                        alt={data.completed[0].doctor.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-xl">
                          Dr. {data.completed[0].doctor.fullName}
                        </p>
                        <div className="flex gap-0.5 items-center">
                          {[...Array(5)].map((_, i) => (
                            <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-lg" />
                          ))}
                          <span className="text-gray-500 text-lg ml-1">
                            ({data.completed[0].doctor.rating})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-xl">{data.completed[0].price}</p>
                        <p className="text-gray-500 text-lg">
                          {data.completed[0].sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit'}
                        </p>
                      </div>
                    </div>

                    {data.completed[0].notes && (
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-blue-500 text-2xl"><IconWrapper icon={FaNoteSticky} /></span>
                          <p className="font-semibold text-gray-900 text-xl">Session Notes</p>
                        </div>
                        <p className="text-gray-600 text-lg">{data.completed[0].notes}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gray-100 text-gray-700 py-3 rounded-xl text-xl font-medium flex items-center justify-center gap-3">
                        <IconWrapper icon={FaDownload} /> View Report
                      </button>
                      <button
                        onClick={() => this.props.navigate?.('/book')}
                        className="bg-blue-500 text-white py-3 rounded-xl text-xl font-medium flex items-center justify-center gap-3"
                      >
                        <IconWrapper icon={FaArrowRotateRight} /> Book Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Rest of completed sessions */}
                {data?.completed.slice(1).map(session => (
                  <div key={session.id} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-xl">
                        <IconWrapper icon={FaCircleCheck} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-xl">Session {session.num}</p>
                        <p className="text-gray-500 text-xl">
                          {formatDate(session.date)} • {session.startTime}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-600 text-lg px-3 py-1 rounded-full font-medium">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <img
                        src={session.doctor.avatarUrl}
                        alt={session.doctor.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-xl">
                          Dr. {session.doctor.fullName}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-lg" />
                          ))}
                          <span className="text-gray-500 text-lg ml-1">({session.doctor.rating})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-xl">{session.price}</p>
                        <p className="text-gray-500 text-lg">
                          {session.sessionType === 'HOME_VISIT' ? 'Home Visit' : 'Clinic Visit'}
                        </p>
                      </div>
                      <button>
                        <IconWrapper icon={FaAngleRight} className="text-gray-400 text-xl ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Recovery Insights */}
            <div className='bg-gray-50 p-6'>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                    <IconWrapper icon={FaBrain} />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900">AI Recovery Insights</h3>
                    <p className="text-gray-500 text-lg">Based on your session data</p>
                  </div>
                </div>
                {[
                  {
                    icon: FaChartLine,
                    color: 'text-green-500',
                    title: 'Progress Trend',
                    text: `You have completed ${stats?.completedSessions ?? 0} out of ${stats?.totalSessions ?? 0} sessions with a ${stats?.recoveryRate ?? 0}% recovery rate. ${
                      (stats?.recoveryRate ?? 0) >= 50
                        ? "You're making excellent progress!"
                        : "Keep going, every session counts!"
                    }`,
                  },
                  {
                    icon: TbCircleDotted,
                    color: 'text-blue-500',
                    title: 'Next Milestone',
                    text: `You have ${stats?.upcomingSessions ?? 0} upcoming sessions. ${
                      (stats?.upcomingSessions ?? 0) > 0
                        ? 'Stay consistent to maximize your recovery.'
                        : 'Consider booking your next session to continue your progress.'
                    }`,
                  },
                  {
                    icon: FaAward,
                    color: 'text-gray-800',
                    title: 'Achievement',
                    text: `${stats?.weeksInTreatment ?? 0} weeks in treatment. ${
                      (stats?.completedSessions ?? 0) > 0
                        ? `You've completed ${stats?.completedSessions} sessions — great dedication!`
                        : 'Start your journey by booking your first session.'
                    }`,
                  },
                ].map(({ icon, color, title, text }) => (
                  <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-2xl ${color}`}><IconWrapper icon={icon} /></span>
                      <p className="font-bold text-gray-900 text-xl">{title}</p>
                    </div>
                    <p className="text-gray-600 text-lg">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Exercise Tracking */}
            <div className="bg-gray-50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Home Exercise Tracking</h3>
                <button className="text-blue-500 text-xl">{exercisePct}%</button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-xl">Today's Exercises</p>
                    <p className="text-gray-500 text-lg">{doneCount} of {totalCount} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-500">{exercisePct}%</p>
                    <div className="bg-gray-200 h-3 w-20 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${exercisePct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {this.state.exercises.map(({ name, time, done }) => {
                    const isLoading = this.state.loadingExercise === name;
                    return (
                      <div
                        key={name}
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          done ? 'bg-green-50' : 'bg-gray-50 border-4 border-dashed border-gray-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                          done ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'
                        }`}>
                          <IconWrapper icon={done ? FaCheck : FaClock} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-lg ${done ? 'text-gray-900' : 'text-gray-600'}`}>
                            {name}
                          </p>
                          <p className="text-gray-500 text-lg">
                            {isLoading ? 'In progress...' : time}
                          </p>
                        </div>
                        {!done && (
                          <button
                            onClick={() => this.handleStart(name)}
                            disabled={isLoading}
                            className="text-blue-500 text-lg font-medium"
                          >
                            {isLoading ? 'In progress...' : 'Start Now'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pain Level Tracking — from health insight */}
            <div className="bg-gray-50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Pain Level Tracking</h3>
                <button className="text-blue-500 text-xl">Add Entry</button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="font-semibold text-gray-900 text-xl mb-3">Weekly Average</p>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${((data?.healthInsight?.painLevel ?? 3) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {data?.healthInsight?.painLevel ?? '--'}/10
                  </span>
                </div>
                <p className="text-green-600 text-lg mb-4">
                  {data?.healthInsight?.painLevel != null && data.healthInsight.painLevel <= 4
                    ? '↓ Pain level is under control'
                    : '↑ Work with your therapist to reduce pain'}
                </p>
                <p className="font-semibold text-gray-600 text-lg mb-2">Pain Triggers Identified:</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-lg">Long sitting</span>
                  <span className="bg-orange-100 text-orange-600 rounded-full px-4 py-1 text-lg">Cold weather</span>
                  <span className="bg-yellow-100 text-yellow-600 rounded-full px-4 py-1 text-lg">Stress</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => this.props.navigate?.('/book')}
                  className="col-span-1 bg-blue-500 text-white py-6 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl"
                >
                  <span className="text-3xl"><IconWrapper icon={FaCalendarPlus} /></span>
                  Book Session
                </button>
                <button
                  onClick={() => this.props.navigate?.('/ai-assistant')}
                  className="col-span-1 bg-white border border-gray-200 text-gray-700 py-6 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl"
                >
                  <span className="text-3xl text-gray-500"><IconWrapper icon={FaComments} /></span>
                  Chat with AI
                </button>
                <button className="col-span-1 bg-white border border-gray-200 text-gray-700 py-6 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl">
                  <span className="text-3xl text-gray-500"><IconWrapper icon={FaFileWaveform} /></span>
                  Download Reports
                </button>
                <button className="col-span-1 bg-white border border-gray-200 text-gray-700 py-5 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl">
                  <span className="text-3xl text-yellow-400"><IconWrapper icon={FaStar} /></span>
                  Rate Sessions
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

// ── Router wrapper ─────────────────────────────────────────────────
function SessionOverviewWithRouter() {
  const navigate = useNavigate();
  const { token } = useAuth();
  return <SessionOverview navigate={navigate as any} token={token} />;
}

export default SessionOverviewWithRouter;