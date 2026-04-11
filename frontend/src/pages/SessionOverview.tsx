import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaStar, FaChartLine, FaDumbbell, FaClock, FaCalendarDay, FaCalendar, FaCircleCheck, FaNoteSticky, FaCommentMedical, FaLightbulb, FaArrowRotateRight, FaDownload, FaAngleRight, FaBrain, FaAward, FaCheck, FaFileWaveform, FaArrowLeft, FaComments } from 'react-icons/fa6';
import { TbCircleDotted } from 'react-icons/tb';
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
//Page 8 src/pages/SessionOverview.tsx
interface SessionOverviewProps {
  navigate?: (path: string) => void;
}
class SessionOverview extends React.Component<SessionOverviewProps> {
  state = {
    activeTab: 'all',
    exercises: [
      { name: 'Core Strengthening', time: '15 minutes • Completed at 8:30 AM', done: true },
      { name: 'Stretching Routine', time: '10 minutes • Completed at 2:15 PM', done: true },
      { name: 'Walking Exercise', time: '20 minutes • Completed at 6:00 PM', done: true },
      { name: 'Posture Training', time: '5 minutes • Pending', done: false },
      { name: 'Heat Therapy', time: '15 minutes • Pending', done: false },
    ],
    loadingExercise: null,
  };

  handleStart = (name: string) => {
    this.setState({ loadingExercise: name });

    setTimeout(() => {
      this.setState((prevState: any) => ({
        exercises: prevState.exercises.map((ex: any) =>
          ex.name === name
            ? {
              ...ex,
              done: true,
              time: `${ex.time.split('•')[0]} • Completed just now`,
            }
            : ex
        ),
        loadingExercise: null,
      }));
    }, 2000);
  };
  render() {
    const { activeTab } = this.state;


    return (
      <div className="pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="text-gray-600 text-2xl"><IconWrapper icon={FaArrowLeft} /></button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">Session Overview</h1>
            <p className="text-lg text-gray-400 flex items-center justify-center gap-1">
              <span className="w-3 h-3 rounded-full animate-[colorCycle1_2s_ease-in-out_infinite]"></span>
              12 Sessions Completed
            </p>
          </div>
          <button className="text-gray-600 text-2xl"><IconWrapper icon={FaCalendarPlus} /></button>
        </header>

        {/* n1: Recovery Journey */}
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6">
          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-4">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900">Your Recovery Journey</h3>
              <p className="text-gray-500 text-xl">Lower Back Pain Treatment</p>
            </div>

            <div className="flex justify-around mb-6">
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2 text-3xl font-bold">12</div>
                <p className="font-semibold text-xl text-gray-900">Completed</p>
                <p className="text-gray-500 text-lg">Sessions</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 text-gray-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2 text-3xl font-bold">3</div>
                <p className="font-semibold text-xl text-gray-900">Upcoming</p>
                <p className="text-gray-500 text-lg">Sessions</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-xl font-medium text-gray-700">Recovery Progress</span>
                <span className="text-xl font-bold text-blue-500">85%</span>
              </div>
              <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full w-[85%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div>

                <p className="text-3xl font-bold text-gray-900">4.8</p>
                <div className="flex justify-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-2xl" />)}
                </div>
                <p className="text-gray-500 text-lg">Avg Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-gray-500 text-lg">Weeks in Treatment</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-gray-500 text-lg">Weeks Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-gray-50 grid grid-cols-3 gap-4 mb-4 p-6">
          {[
            { icon: FaChartLine, color: 'text-blue-500', label: 'Pain Reduced', val: '-70%', valColor: 'text-green-500' },
            { icon: FaDumbbell, color: 'text-gray-800', label: 'Mobility', val: '+60%', valColor: 'text-green-500' },
            { icon: FaClock, color: 'text-orange-500', label: 'Avg Session', val: '45 min', valColor: 'text-gray-700' },
          ].map(({ icon, color, label, val, valColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <span className={`flex justify-center text-3xl ${color} mb-2 block`}><IconWrapper icon={icon} /></span>
              <p className="text-xl font-bold text-gray-800">{label}</p>
              <p className={`text-lg font-semibold ${valColor}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='px-6 bg-white'>
          <div className="bg-gray-100 rounded-2xl p-1 grid grid-cols-3">
            {[
              { key: 'all', label: 'All Sessions' },
              { key: 'completed', label: 'Completed' },
              { key: 'upcoming', label: 'Upcoming' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => this.setState({ activeTab: key })}
                className={`py-3 text-xl font-semibold transition rounded-xl ${activeTab === key
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

            {/* Next Session Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-100 rounded-3xl p-6 mb-6 relative overflow-hidden hover:shadow-[0_0_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className=""><IconWrapper icon={FaCalendarDay} /></span>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">Next Session</p>
                  <p className="text-white/80 text-lg">Tomorrow at 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Dr. Sarah" className="w-14 h-14 rounded-full border-4 border-white/20 object-cover" />
                <div className="flex-1">
                  <p className="text-white font-bold text-xl">Dr. Sarah Al-Rashid</p>
                  <p className="text-white/80 text-lg">Musculoskeletal Specialist</p>
                </div>
                <div className="text-right text-white/70 text-lg">
                  <p>45 min</p>
                  <p>Home Visit</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 mb-5">
                <p className="text-white font-semibold text-lg">Session Focus:</p>
                <p className="text-white/80 text-lg">Advanced mobility exercises and posture correction techniques</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white/20 text-white py-3 rounded-2xl font-semibold text-xl">Reschedule</button>
                <button className="bg-white text-blue-500 py-3 rounded-2xl font-semibold text-xl">View Details</button>
              </div>
            </div>

            {[
              { num: '#14', date: 'Dec 8, 2024 • 2:30 PM', location: 'Clinic', doctor: 'Dr. Ahmed Hassan', clinic: 'Qatar Physiotherapy Center', img: 'https://randomuser.me/api/portraits/men/45.jpg', iconBg: 'bg-white', iconColor: 'text-gray-600' },
              { num: '#15', date: 'Dec 12, 2024 • 11:00 AM', location: 'Home', doctor: 'Dr. Sarah Al-Rashid', clinic: 'Final Assessment Session', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
            ].map(({ num, date, location, doctor, clinic, img, iconBg, iconColor }) => (
              <div key={num} className="bg-white rounded-2xl border border-gray-100 space-y-5 p-6 mb-6  hover:shadow-[0_0_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center ${iconColor}`}>
                    <span className="text-2xl"><IconWrapper icon={FaCalendar} /></span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">Session {num}</p>
                    <p className="text-gray-500 text-xl">{date}</p>
                  </div>
                  <span className={`${iconBg} ${iconColor} text-xl px-3 py-1 rounded-full`}>{location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <img src={img} alt={doctor} className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-xl">{doctor}</p>
                    <p className="text-gray-500 text-lg">{clinic}</p>
                  </div>
                  <button className=""><IconWrapper icon={FaAngleRight} className="text-gray-400 text-xl" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Sessions */}
        {(activeTab === 'all' || activeTab === 'completed') && (
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Recent Sessions</h3>
              <button className="text-blue-500 text-xl">View All</button>
            </div>

            {/* Session #12 - expanded */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6  relative overflow-hidden hover:shadow-[0_0_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                  <span className="text-2xl"><IconWrapper icon={FaCircleCheck} /></span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-xl">Session #12</p>
                  <p className="text-gray-500 text-xl">Dec 3, 2024 • 45 minutes</p>
                </div>
                <span className="bg-green-100 text-green-600 text-lg px-3 py-1 rounded-full font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Dr. Sarah" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xl">Dr. Sarah Al-Rashid</p>
                  <div className="flex gap-0.5 items-center">
                    {[...Array(5)].map((_, i) => <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-lg" />)}
                    <span className="text-gray-500 text-lg ml-1">(5.0)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xl">QAR 180</p>
                  <p className="text-gray-500 text-lg">Home Visit</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-500 text-2xl"><IconWrapper icon={FaNoteSticky} /></span>
                  <p className="font-semibold text-gray-900 text-xl">Session Notes</p>
                </div>
                <p className="text-gray-600 text-lg mb-4">Excellent progress with core strengthening exercises. Patient shows significant improvement in lower back flexibility and reports 70% reduction in daily pain levels. Recommended continuing current exercise routine.</p>
                <div className="grid grid-cols-2 gap-5 mb-4">
                  <div className='bg-white p-6 rounded-2xl'>
                    <div className="flex justify-between mb-1">
                      <span className="text-lg text-gray-600">Pain Level</span>
                      <span className="text-lg font-bold text-green-500">3/10</span>
                    </div>
                    <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full w-[30%]"></div>
                    </div>
                  </div>
                  <div className='bg-white p-6 rounded-2xl'>
                    <div className="flex justify-between mb-1">
                      <span className="text-lg text-gray-600">Mobility</span>
                      <span className="text-lg font-bold text-blue-500">8.5/10</span>
                    </div>
                    <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-500 text-2xl"><IconWrapper icon={FaCommentMedical} /></span>
                  <p className="font-semibold text-gray-900 text-xl">Your Feedback</p>
                </div>
                <p className="text-gray-600 text-lg">"Dr. Sarah was amazing! The exercises really helped and I can already feel the difference. Very professional and caring approach."</p>
              </div>

              {/* Recommendations */}
              <div className="">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-800 text-2xl"><IconWrapper icon={FaLightbulb} /></span>
                  <h3 className="font-semibold text-xl text-gray-900">Recommendations</h3>
                </div>
                <ul className="space-y-2 mb-5 text-lg text-gray-700">
                  <li>Continue daily core exercises (10 minutes)</li>
                  <li>Apply heat therapy before exercises</li>
                  <li>Maintain proper posture while working</li>
                </ul>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-100 text-gray-700 py-3 rounded-xl text-xl font-medium flex items-center justify-center gap-3">
                    <span className=""><IconWrapper icon={FaDownload} /></span> View Report
                  </button>
                  <button className="bg-blue-500 text-white py-3 rounded-xl text-xl font-medium flex items-center justify-center gap-3">
                    <span className=""><IconWrapper icon={FaArrowRotateRight} /></span> Book Again
                  </button>
                </div>
              </div>
            </div>



            {/* Sessions #11 and #10 */}
            {[
              { num: '#11', date: 'Nov 29, 2024 • 45 minutes', doctor: 'Dr. Ahmed Hassan', img: 'https://randomuser.me/api/portraits/men/45.jpg', rating: '4.8', price: 'QAR 150', visit: 'Clinic Visit' },
              { num: '#10', date: 'Nov 26, 2024 • 50 minutes', doctor: 'Dr. Sarah Al-Rashid', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', rating: '5.0', price: 'QAR 180', visit: 'Home Visit' },
            ].map(({ num, date, doctor, img, rating, price, visit }) => (
              <div key={num} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 relative overflow-hidden hover:shadow-[0_0_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-xl">
                    <span className="text-2xl"><IconWrapper icon={FaCircleCheck} /></span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">Session {num}</p>
                    <p className="text-gray-500 text-xl">{date}</p>
                  </div>
                  <span className="bg-green-100 text-green-600 text-lg px-3 py-1 rounded-full font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-6">
                  <img src={img} alt={doctor} className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-xl">{doctor}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-lg" />)}
                      <span className="text-gray-500 text-lg ml-1">({rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-xl">{price}</p>
                    <p className="text-gray-500 text-lg">{visit}</p>
                  </div>
                  <button className=""><IconWrapper icon={FaAngleRight} className="text-gray-400 text-xl ml-1" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Recovery Insights - always visible */}
        <div className='bg-gray-50 p-6'>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-100 p-6  space-y-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                <span className=""><IconWrapper icon={FaBrain} /></span>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-gray-900">AI Recovery Insights</h3>
                <p className="text-gray-500 text-lg">Based on your session data</p>
              </div>
            </div>
            {[
              { icon: FaChartLine, color: 'text-green-500', title: 'Progress Trend', text: "Your pain levels have consistently decreased over the past 4 weeks. You're recovering 15% faster than average patients with similar conditions." },
              { icon: TbCircleDotted, color: 'text-blue-500', title: 'Next Milestone', text: 'With 3 more sessions, you should achieve full mobility restoration. Consider adding swimming to your routine for enhanced recovery.' },
              { icon: FaAward, color: 'text-gray-800', title: 'Achievement Unlocked', text: "Consistency Champion! You've attended 100% of your scheduled sessions. This dedication is key to your excellent recovery rate." },
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
            <button className="text-blue-500 text-xl">100%</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-gray-900 text-xl">Today's Exercises</p>
                <p className="text-gray-500 text-lg">3 of 5 completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-500">60%</p>
                <div className="bg-gray-200 h-3 w-20 rounded-full mt-1 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {this.state.exercises.map(({ name, time, done }) => {
                const isLoading = this.state.loadingExercise === name;

                return (
                  <div
                    key={name}
                    className={`flex items-center gap-4 p-4 rounded-xl ${done
                        ? 'bg-green-50'
                        : 'bg-gray-50 border-4 border-dashed border-gray-200'
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${done ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'
                        }`}
                    >
                      <IconWrapper icon={done ? FaCheck : FaClock} />
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-semibold text-lg ${done ? 'text-gray-900' : 'text-gray-600'
                          }`}
                      >
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

        {/* Pain Level Tracking */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Pain Level Tracking</h3>
            <button className="text-blue-500 text-xl">Add Entry</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="font-semibold text-gray-900 text-xl mb-3">Weekly Average</p>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full w-[30%]"></div>
              </div>
              <span className="text-2xl font-bold text-green-600">3.0/10</span>
            </div>
            <p className="text-green-600 text-lg mb-4">↓ 2.5 points from last week</p>
            <div className="grid grid-cols-7 gap-2 text-center mb-4 border-b border-gray-100 pb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <p key={d} className="text-gray-500 text-lg">{d}</p>
              ))}
              {[
                { val: 2, bg: 'bg-green-100 text-green-600' },
                { val: 3, bg: 'bg-green-100 text-green-600' },
                { val: 4, bg: 'bg-yellow-100 text-yellow-600' },
                { val: 2, bg: 'bg-green-100 text-green-600' },
                { val: 3, bg: 'bg-green-100 text-green-600' },
                { val: 2, bg: 'bg-green-100 text-green-600' },
                { val: 1, bg: 'bg-green-100 text-green-600' },
              ].map(({ val, bg }, i) => (
                <div key={i} className={`${bg} rounded-full w-12 h-12 flex items-center justify-center mx-auto text-lg font-semibold`}>{val}</div>
              ))}
            </div>
            <p className="font-semibold text-gray-600 text-lg mb-2">Pain Triggers Identified:</p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-lg">Long sitting</span>
              <span className="bg-orange-100 text-orange-600 rounded-full px-4 py-1 text-lg">Cold weather</span>
              <span className="bg-yellow-100 text-yellow-600 rounded-full px-4 py-1 text-lg">Stress</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Messages</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Dr. Sarah Al-Rashid', time: '2 hours ago', msg: 'Great work on your exercises today! I noticed significant improvement in your flexibility. Keep up the excellent progress. See you tomorrow for our session.', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', unread: true },
              { name: 'Dr. Ahmed Hassan', time: '1 day ago', msg: "Don't forget to apply heat therapy before your morning exercises. It will help with muscle relaxation and improve your session effectiveness.", img: 'https://randomuser.me/api/portraits/men/45.jpg', unread: false },
            ].map(({ name, time, msg, img, unread }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={img} alt={name} className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-xl">{name}</p>
                    <p className="text-gray-500 text-lg">{time}</p>
                  </div>
                  {unread && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                </div>
                <p className="text-gray-600 text-xl">{msg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="col-span-1 bg-blue-500 text-white py-6 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl">
              <span className="text-3xl"><IconWrapper icon={FaCalendarPlus} /></span>
              Book Session
            </button>
            <button className="col-span-1 bg-white border border-gray-200 text-gray-700 py-6 rounded-2xl flex flex-col items-center gap-2 font-semibold text-xl">
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

        {/* Bottom Nav */}
        {/* <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaChartLine, label: 'Home', active: false },
              { icon: FaCalendar, label: 'Sessions', active: true },
              { icon: FaBrain, label: 'AI Chat', active: false, center: true },
              { icon: FaFileWaveform, label: 'Wallet', active: false },
              { icon: FaAward, label: 'Profile', active: false },
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

function SessionOverviewWithRouter() {
  const navigate = useNavigate();
  return <SessionOverview navigate={navigate} />;
}

export default SessionOverviewWithRouter;