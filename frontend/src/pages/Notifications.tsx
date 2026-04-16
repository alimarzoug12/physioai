import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from 'react-icons/io';
import {
  FaArrowLeft, FaCalendarCheck, FaChartLine, FaFire, FaDumbbell,
  FaLightbulb, FaBed, FaQuoteLeft, FaHeart, FaPills, FaCalendarPlus,
  FaPlus, FaComments, FaRobot, FaStar, FaCircleCheck, FaClock,
  FaShare, FaLocationDot,
} from 'react-icons/fa6';
import { FaAppleAlt, FaCalendarAlt } from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';
import { BiSolidAward } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

interface NotificationsData {
  healthJourney: {
    recoveryRate: number;
    weeksInTreatment: number;
    completedSessions: number;
    totalSessions: number;
    upcomingSessions: number;
    streakDays: number;
    improvement: string;
  };
  todaysUpdates: Array<{
    type: string;
    title: string;
    message: string;
    time: string;
    isNew: boolean;
    recoveryRate?: number;
    completedSessions?: number;
    doctorName?: string;
    location?: string;
    sessionTime?: string;
    exercises?: Array<{ name: string; duration: string; done: boolean }>;
  }>;
  weekProgress: {
    exerciseCompliance: number;
    painReduction: number;
    sessionsAttended: number;
    totalWeekSessions: number;
    exerciseMinutes: number;
    targetMinutes: number;
    sleepQuality: number;
  };
  reminders: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    time: string | null;
  }>;
  recoveryGoals: Array<{
    label: string;
    sub: string;
    pct: string;
    color: string;
    textColor: string;
  }>;
  healthInsight: {
    heartRate: number | null;
    dailySteps: number | null;
    painLevel: number | null;
    sleepQuality: number | null;
  } | null;
}

interface Props {
  navigate?: (path: string | number) => void;
  token?: string | null;
}

interface State {
  data: NotificationsData | null;
  loading: boolean;
  error: string;
}

class Notifications extends React.Component<Props, State> {
  state: State = { data: null, loading: true, error: '' };

  async componentDidMount() {
    const { token } = this.props;
    if (!token) { this.setState({ loading: false }); return; }
    try {
      const data = await api.getNotifications(token);
      this.setState({ data, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {
    const { data, loading } = this.state;
    const journey    = data?.healthJourney;
    const week       = data?.weekProgress;
    const newCount   = data?.todaysUpdates.filter(u => u.isNew).length ?? 0;

    return (
      <div className="pb-24 relative">

        {/* Floating AI Button */}
        <button
          onClick={() => this.props.navigate?.('/ai-assistant')}
          className="fixed bottom-8 right-6 z-50 w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.85) 0%, rgba(219,234,254,0.75) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            animation: 'floatUpDown 2s ease-in-out infinite',
          }}
        >
          <IconWrapper icon={FaRobot} className="text-white text-4xl drop-shadow" />
        </button>

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1)} className="text-gray-600 text-2xl">
            <IconWrapper icon={FaArrowLeft} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">Smart Notifications</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-1">
              <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
              {loading ? '...' : `${newCount} New Updates`}
            </p>
          </div>
          <button onClick={() => this.props.navigate?.('/settings')} className="text-gray-600 text-3xl">
            <IconWrapper icon={IoMdSettings} />
          </button>
        </header>

        {/* Loading */}
        {loading && (
          <div className="p-12 text-center text-gray-400 text-xl">Loading notifications...</div>
        )}

        {!loading && (
          <>
            {/* Health Journey Card */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 px-6 py-8">
              <div className="bg-white rounded-2xl border border-gray-100 px-6 py-8 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <div className='space-y-1'>
                    <h3 className="text-2xl font-bold text-gray-900">Your Health Journey</h3>
                    <p className="text-gray-500 text-xl">
                      Week {journey?.weeksInTreatment ?? 0} of Recovery
                    </p>
                  </div>
                  {/* Dynamic circular progress */}
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(130deg)' }}>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#E5E7EB" strokeWidth="3.5"
                        strokeDasharray="100, 100" strokeLinecap="round"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#4F7EF7" strokeWidth="3.5"
                        strokeDasharray={`${journey?.recoveryRate ?? 0}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-blue-500">
                      {journey?.recoveryRate ?? 0}%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-14 h-14 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-xl mb-2">
                      <IconWrapper icon={FaCalendarCheck} />
                    </div>
                    <p className="text-gray-500 text-lg">Sessions</p>
                    <p className="font-bold text-xl text-gray-900">
                      {journey?.completedSessions ?? 0}/{journey?.totalSessions ?? 0}
                    </p>
                  </div>
                  <div>
                    <div className="w-14 h-14 bg-white rounded-full mx-auto flex items-center justify-center text-gray-900 text-xl mb-2">
                      <IconWrapper icon={FaChartLine} />
                    </div>
                    <p className="text-gray-500 text-lg">Improvement</p>
                    <p className="font-bold text-xl text-gray-900">{journey?.improvement ?? '0%'}</p>
                  </div>
                  <div>
                    <div className="w-14 h-14 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-orange-600 text-xl mb-2">
                      <IconWrapper icon={FaFire} />
                    </div>
                    <p className="text-gray-500 text-lg">Streak</p>
                    <p className="font-bold text-xl text-gray-900">{journey?.streakDays ?? 0} days</p>
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
                {data?.todaysUpdates.map((update, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-start gap-4">

                      {/* Icon per type */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 ${
                        update.type === 'SESSION_REMINDER' ? 'bg-blue-600' :
                        update.type === 'ACHIEVEMENT'      ? 'bg-yellow-400' :
                                                             'bg-orange-500'
                      }`}>
                        <IconWrapper icon={
                          update.type === 'SESSION_REMINDER' ? FaCalendarAlt :
                          update.type === 'ACHIEVEMENT'      ? BiSolidAward :
                                                               FaDumbbell
                        } />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-900 text-xl">{update.title}</p>
                          <div className="flex items-center gap-2 text-gray-400 text-lg">
                            <span>{update.time}</span>
                            {update.isNew && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>}
                          </div>
                        </div>

                        <p className="text-gray-500 text-xl mt-1">{update.message}</p>

                        {/* Session location */}
                        {update.type === 'SESSION_REMINDER' && update.location && (
                          <p className="flex items-center gap-1 text-lg text-blue-500 mt-1">
                            <IconWrapper icon={FaLocationDot} /> {update.location}
                          </p>
                        )}

                        {/* Achievement progress bar */}
                        {update.type === 'ACHIEVEMENT' && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-gray-600 text-lg font-medium">Recovery Progress</p>
                              <p className="text-gray-900 font-bold text-xl">{update.recoveryRate}%</p>
                            </div>
                            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full"
                                style={{ width: `${update.recoveryRate}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Exercise list */}
                        {update.type === 'EXERCISE' && update.exercises && (
                          <div className="bg-orange-50 rounded-xl p-4 mb-4 mt-5">
                            <p className="text-orange-500 font-semibold text-lg mb-2">Today's Exercises</p>
                            <div className="space-y-1">
                              {update.exercises.map((ex, i) => (
                                <div key={i} className="flex items-center gap-2 text-lg text-gray-700">
                                  <span className={ex.done ? 'text-green-500' : 'text-orange-400'}>
                                    <IconWrapper icon={ex.done ? FaCircleCheck : FaClock} />
                                  </span>
                                  {ex.name} ({ex.duration})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-4">
                          {update.type === 'SESSION_REMINDER' && (
                            <>
                              <button
                                onClick={() => this.props.navigate?.('/sessions')}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl text-lg font-medium"
                              >
                                View Details
                              </button>
                              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-lg font-medium">
                                Reschedule
                              </button>
                            </>
                          )}
                          {update.type === 'EXERCISE' && (
                            <>
                              <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-lg font-medium">
                                Start Exercises
                              </button>
                              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-lg font-medium">
                                Remind Later
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Health Tips — kept static (content tips) */}
            <div className="p-6 bg-purple-50">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-3xl font-bold text-gray-900">AI Health Tips</h3>
                <button className="text-purple-500 text-xl">See All</button>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      <IconWrapper icon={FaLightbulb} />
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
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      <IconWrapper icon={FaBed} />
                    </div>
                    <p className="text-gray-500 text-lg">Sleep Quality</p>
                  </div>
                  <p className="font-bold text-gray-900 text-xl mb-2">Optimize Your Sleep Position</p>
                  <p className="text-gray-500 text-lg mb-4">
                    Sleep on your side with a pillow between your knees to maintain spinal alignment.
                    {data?.healthInsight?.sleepQuality != null &&
                      ` Your sleep quality: ${data.healthInsight.sleepQuality}/10.`}
                  </p>
                  <button className="text-gray-700 text-lg font-medium">Learn More</button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                      <IconWrapper icon={FaAppleAlt} />
                    </div>
                    <p className="text-gray-500 text-lg">Nutrition</p>
                  </div>
                  <p className="font-bold text-gray-900 text-xl mb-2">Anti-Inflammatory Foods</p>
                  <p className="text-gray-500 text-lg mb-4">Include omega-3 rich foods like salmon, walnuts, and leafy greens to reduce inflammation naturally.</p>
                  <button className="text-orange-600 text-lg font-medium">View Meal Plan</button>
                </div>
              </div>
            </div>

            {/* This Week's Progress — dynamic */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">This Week's Progress</h3>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{week?.exerciseCompliance ?? 0}%</p>
                    <p className="text-gray-500 text-lg mt-1">Exercise Compliance</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(130deg)' }}>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#4F7EF7" strokeWidth="3.5"
                          strokeDasharray={`${week?.painReduction ?? 0}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-blue-500">
                        {week?.painReduction ?? 0}%
                      </p>
                    </div>
                    <p className="text-gray-500 text-lg mt-1">Pain Reduction</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xl">
                    <span className="text-gray-600">Sessions Attended</span>
                    <span className="font-bold text-gray-900">
                      {week?.sessionsAttended ?? 0}/{week?.totalWeekSessions ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl">
                    <span className="text-gray-600">Exercise Minutes</span>
                    <span className="font-bold text-gray-900">
                      {week?.exerciseMinutes ?? 0}/{week?.targetMinutes ?? 150} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-600">Sleep Quality</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <IconWrapper
                          key={i}
                          icon={FaStar}
                          className={`text-xl ${
                            i < Math.round((week?.sleepQuality ?? 4) / 2)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Motivation — static (content) */}
            <div className="p-6 bg-yellow-50">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">Daily Motivation</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                      <IconWrapper icon={FaQuoteLeft} />
                    </div>
                    <p className="text-gray-500 text-lg">Daily Quote</p>
                  </div>
                  <p className="text-gray-900 text-xl font-medium mb-1">
                    "Every step forward, no matter how small, is progress worth celebrating."
                  </p>
                  <p className="text-gray-500 text-lg">Your consistency is paying off - keep going!</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                      <IconWrapper icon={FaHeart} />
                    </div>
                    <p className="text-gray-500 text-lg">Wellness Tip</p>
                  </div>
                  <p className="text-gray-900 text-xl font-medium mb-1">Remember to listen to your body</p>
                  <p className="text-gray-500 text-lg">
                    Some discomfort during recovery is normal, but sharp pain means it's time to rest.
                    {data?.healthInsight?.painLevel != null && data.healthInsight.painLevel > 5
                      ? ' Your pain level is above average — please consult your therapist.'
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders — dynamic */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">Upcoming Reminders</h3>
              <div className="space-y-4">
                {data?.reminders.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-xl">
                    No reminders set
                  </div>
                )}
                {data?.reminders.map(reminder => (
                  <div key={reminder.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-2xl ${
                        reminder.type === 'SESSION'    ? 'text-blue-500' :
                        reminder.type === 'MEDICATION' ? 'text-gray-700' :
                                                         'text-orange-500'
                      }`}>
                        <IconWrapper icon={
                          reminder.type === 'SESSION'    ? FaCalendarCheck :
                          reminder.type === 'MEDICATION' ? FaPills :
                                                           FaDumbbell
                        } />
                      </span>
                      <div className="flex-1 flex justify-between items-center">
                        <p className="font-semibold text-gray-900 text-xl">{reminder.title}</p>
                        <p className="text-gray-400 text-lg">{reminder.time}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-lg">{reminder.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Goals — dynamic */}
            <div className="p-6 bg-blue-50">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">Recovery Goals</h3>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                {data?.recoveryGoals.map(goal => (
                  <div key={goal.label}>
                    <div className="flex justify-between mb-3">
                      <p className="font-medium text-gray-900 text-xl">{goal.label}</p>
                      <p className={`font-semibold text-xl ${goal.textColor}`}>{goal.pct}</p>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                      <div className={`${goal.color} h-full rounded-full`} style={{ width: goal.pct }} />
                    </div>
                    <p className="text-gray-500 text-lg">{goal.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Support — static */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">Community Support</h3>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="u1" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <img src="https://randomuser.me/api/portraits/men/45.jpg"   alt="u2" className="w-12 h-12 rounded-full border-2 border-white object-cover -ml-3" />
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="u3" className="w-12 h-12 rounded-full border-2 border-white object-cover -ml-3" />
                    <span className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 text-lg font-medium flex items-center justify-center -ml-3 border-2 border-white">+12</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-xl">Recovery Group</p>
                    <p className="text-gray-500 text-lg">15 members with similar conditions</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 mb-4">
                  <p className="text-gray-700 text-lg">
                    <span className="font-bold">Sarah M.:</span> "Just completed my 4th week! The exercises really do help. Stay consistent everyone! 💪"
                  </p>
                  <p className="text-gray-400 text-lg mt-1">2 hours ago</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl text-xl font-semibold">
                    Join Discussion
                  </button>
                  <button className="w-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 text-xl">
                    <IconWrapper icon={FaShare} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-5">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FaPlus,         bg: 'bg-gradient-to-br from-blue-500 to-blue-600',   label: 'Log Symptoms',  path: null },
                  { icon: GiProgression,  bg: 'bg-gray-100',                                   label: 'View Progress', textColor: 'text-gray-600', path: '/sessions' },
                  { icon: FaCalendarPlus, bg: 'bg-gradient-to-br from-orange-500 to-orange-600', label: 'Book Session', path: '/book' },
                  { icon: FaComments,     bg: 'bg-gradient-to-br from-purple-500 to-purple-600', label: 'AI Chat',      path: '/ai-assistant' },
                ].map(({ icon, bg, label, textColor, path }) => (
                  <button
                    key={label}
                    onClick={() => path && this.props.navigate?.(path)}
                    className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-3"
                  >
                    <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-2xl ${textColor ?? 'text-white'}`}>
                      <IconWrapper icon={icon} />
                    </div>
                    <p className="text-gray-700 text-xl font-medium">{label}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

function NotificationsWithRouter() {
  const navigate = useNavigate();
  const { token } = useAuth();
  return <Notifications navigate={navigate as any} token={token} />;
}

export default NotificationsWithRouter;