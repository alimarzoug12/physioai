import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeartPulse, FaCircleUser, FaUser, FaUserDoctor, FaHospital,
  FaCalendarWeek, FaRobot, FaClipboardCheck,
  FaChartArea, FaMicroscope, FaChartPie,
  FaDatabase, FaBrain, FaShieldHalved, FaUsers,
  FaCircleQuestion, FaRightFromBracket,
  FaGaugeHigh, FaServer,
  FaTrophy, FaChartLine, FaHeart,
  FaDollarSign, FaGraduationCap,
  FaFlask, FaHandshake, FaNetworkWired,
  FaBuilding, FaLocationDot, FaChartBar,
  FaClipboard, FaBriefcase, FaDumbbell,
  FaCalendarDays,
  FaFileMedical,
  FaPrescriptionBottleMedical,
  FaClipboardList,
  FaMobileScreenButton,
  FaBookOpen,
  FaCamera,
  FaStethoscope,
  FaCalendarCheck,
  FaFilePrescription,
  FaUserGroup,
  FaUsersGear,
  FaBedPulse,
  FaShieldVirus,
  FaGlobe,
  FaLeaf,
  FaCheck,
} from 'react-icons/fa6';
import { MdOutlineShowChart, MdSettings } from 'react-icons/md';
import { FaBell, FaVideo, FaComments, FaFileAlt, FaTools } from 'react-icons/fa';
import { IoChevronForward, IoStatsChart } from 'react-icons/io5';
import { IoIosClose } from 'react-icons/io';
import { RiArrowRightUpLongFill } from 'react-icons/ri';
import { TbCircleDotted } from 'react-icons/tb';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface SmartRecoveryPlatformSideBarProps {
  navigate?: (path: string) => void;
  onClose?: () => void;
}

type Role = 'patient' | 'physiotherapist' | 'healthcenter';

interface State {
  activeRole: Role;
}
interface Props {
  onClose: () => void;
}

// page 14 src/pages/SmartRecoveryPlatformSideBar.tsx
class SmartRecoveryPlatformSideBar extends React.Component<SmartRecoveryPlatformSideBarProps, State> {
  state: State = {
    activeRole: 'patient',
  };

  setRole = (role: Role) => this.setState({ activeRole: role });

  renderPatientContent() {
    return (
      <>
        {/* patient dashboard */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold uppercase tracking-widest text-white/50">Patient Dashboard</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-lg text-green-400">Live</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/30 border border-blue-400/30 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <span className="text-3xl text-yellow-400"><IconWrapper icon={FaTrophy} /></span>
            <div>
              <p className="font-bold text-xl">Today's Achievement</p>
              <p className="text-lg text-white/70">Completed 3 exercises • 45 min session</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaGaugeHigh} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Health Overview</p>
                <p className="text-lg text-white/60">Complete health summary</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">3 Updates</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-blue-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaDumbbell} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Exercise Library</p>
                <p className="text-lg text-white/60">Personalized routines & tracking</p>
              </div>
              <div className="bg-orange-500 px-2 py-0.5 rounded-full text-lg font-semibold">5 New</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <button onClick={() => this.props.navigate?.('/sessions')} className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartLine} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Progress Analytics</p>
                <p className="text-lg text-white/60">Recovery metrics & insights</p>
              </div>
              <div className="bg-purple-600/60 p-2 rounded-full">
                <IconWrapper icon={RiArrowRightUpLongFill} className="text-white text-lg" />
              </div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </button>
          </div>
        </div>

        {/* ai powered features */}
        <div className="px-6 py-5 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">AI-Powered Features</p>
          <div className="space-y-3">
            <button onClick={() => this.props.navigate?.('/ai-assistant')} className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaRobot} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">AI Health Assistant</p>
                <p className="text-lg text-white/60">Smart guidance & recommendations</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-lg text-green-400">Active</span>
              </div>
            </button>
            <button onClick={() => this.props.navigate?.('/book')} className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCalendarDays} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Appointments</p>
                <p className="text-lg text-white/60">Schedule & manage sessions</p>
              </div>
              <div className="bg-red-500 px-3 py-0.5 rounded-full text-lg font-semibold">2 Today</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </button>
          </div>
        </div>

        {/* health records */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Health Records & Data</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-yellow-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaFileMedical} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Medical History</p>
                <p className="text-lg text-white/60">Complete health records</p>
              </div>
              <span className="text-lg text-white/50">Updated 2d ago</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-indigo-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaPrescriptionBottleMedical} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Medications</p>
                <p className="text-lg text-white/60">Current prescriptions & dosages</p>
              </div>
              <div className="bg-indigo-500/60 px-2 py-0.5 rounded-full text-lg font-semibold">3 Active</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-pink-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaHeartPulse} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Vital Signs Monitor</p>
                <p className="text-lg text-white/60">Real-time health metrics</p>
              </div>
              <div className="flex items-center gap-1.5">
                <IconWrapper icon={FaHeart} className="text-pink-400 text-lg" />
                <span className="text-lg text-pink-400">72 BPM</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaClipboardList} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Assessment Results</p>
                <p className="text-lg text-white/60">Evaluation scores & reports</p>
              </div>
              <span className="text-lg text-green-400">Score: 8.2/10</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* communication hub */}
        <div className="px-6 py-5 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Communication Hub</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaComments} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Secure Messaging</p>
                <p className="text-lg text-white/60">Chat with healthcare team</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">7 New</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaVideo} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Telehealth Sessions</p>
                <p className="text-lg text-white/60">Virtual consultations</p>
              </div>
              <span className="text-lg text-orange-400">Next: 2:30 PM</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaBell} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Notifications Center</p>
                <p className="text-lg text-white/60">Alerts & reminders</p>
              </div>
              <div className="bg-purple-500/60 px-2 py-0.5 rounded-full text-lg font-semibold">12</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* tools & resources */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Tools & Resources</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaMobileScreenButton} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Exercise Mobile App</p>
                <p className="text-lg text-white/60">Guided workouts & tracking</p>
              </div>
              <span className="text-lg text-green-400">v2.1.4</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaBookOpen} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Education Library</p>
                <p className="text-lg text-white/60">Learning materials & guides</p>
              </div>
              <div className="bg-red-500 px-2 py-0.5 rounded-full text-lg font-semibold">15 New</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUsers} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Support Groups</p>
                <p className="text-lg text-white/60">Community & peer support</p>
              </div>
              <span className="text-lg text-teal-400">248 Members</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-yellow-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCamera} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Movement Tracker</p>
                <p className="text-lg text-white/60">AI-powered form analysis</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-lg text-yellow-400">Smart</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderPhysiotherapistContent() {
    return (
      <>
        {/* physiotherapist portal */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold uppercase tracking-widest text-white/50">Physiotherapist Portal</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-lg text-purple-400">Pro</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/30 border border-purple-400/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <IconWrapper icon={FaStethoscope} className="text-purple-400 text-2xl" />
            <div>
              <p className="font-bold text-xl">Practice Status</p>
              <p className="text-lg text-white/70">24 Active Patients • 8 Sessions Today</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartPie} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Practice Dashboard</p>
                <p className="text-lg text-white/60">Complete practice overview</p>
              </div>
              <div className="bg-purple-500 px-2 py-0.5 rounded-full text-lg font-semibold">12 Alerts</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-blue-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUsers} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Patient Management</p>
                <p className="text-lg text-white/60">Active caseload & records</p>
              </div>
              <div className="bg-blue-500 px-2 py-0.5 rounded-full text-lg font-semibold">24 Active</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCalendarCheck} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Smart Scheduler</p>
                <p className="text-lg text-white/60">AI-optimized appointments</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">8 Today</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaBrain} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">AI Treatment Plans</p>
                <p className="text-lg text-white/60">Evidence-based recommendations</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-lg text-teal-400">Smart</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaClipboardList} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Digital Assessments</p>
                <p className="text-lg text-white/60">Comprehensive evaluation tools</p>
              </div>
              <span className="text-lg text-red-400">15 Templates</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* treatment management */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Treatment Management</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-yellow-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaDumbbell} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Exercise Database</p>
                <p className="text-lg text-white/60">Comprehensive library & builder</p>
              </div>
              <div className="bg-yellow-500 px-2 py-0.5 rounded-full text-lg font-semibold">500+ Exercises</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-indigo-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaFilePrescription} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Protocol Library</p>
                <p className="text-lg text-white/60">Evidence-based care plans</p>
              </div>
              <span className="text-lg text-white/50">Updated Weekly</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-pink-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartLine} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Outcome Analytics</p>
                <p className="text-lg text-white/60">Patient progress tracking</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-pink-600/40 p-1.5 rounded-full">
                  <IconWrapper icon={RiArrowRightUpLongFill} className="text-white text-sm" />
                </div>
                <span className="text-lg text-pink-400">+12%</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCamera} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Movement Analysis</p>
                <p className="text-lg text-white/60">AI-powered biomechanics</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-lg text-teal-400">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaMicroscope} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Research Tools</p>
                <p className="text-lg text-white/60">Clinical studies & data</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">3 Studies</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* professional network */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Professional Network</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaComments} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Patient Communication</p>
                <p className="text-lg text-white/60">Secure messaging platform</p>
              </div>
              <div className="bg-orange-500 px-2 py-0.5 rounded-full text-lg font-semibold">15 New</div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaVideo} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Telehealth Platform</p>
                <p className="text-lg text-white/60">Virtual consultation suite</p>
              </div>
              <span className="text-lg text-green-400">HD Quality</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUserDoctor} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Colleague Network</p>
                <p className="text-lg text-white/60">Professional collaboration</p>
              </div>
              <span className="text-lg text-purple-500">127 Connections</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaHandshake} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Referral Network</p>
                <p className="text-lg text-white/60">Specialist connections</p>
              </div>
              <div className="bg-red-500 px-2 py-0.5 rounded-full text-lg font-semibold">5 Pending</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* business operations */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Business Operations</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaDollarSign} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Billing & Insurance</p>
                <p className="text-lg text-white/60">Financial management suite</p>
              </div>
              <span className="text-lg text-teal-400">$12,450 MTD</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-yellow-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartBar} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Practice Analytics</p>
                <p className="text-lg text-white/60">Performance metrics & KPIs</p>
              </div>
              <span className="text-lg text-yellow-400">+8.2%</span>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaGraduationCap} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Continuing Education</p>
                <p className="text-lg text-white/60">Professional development</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">12 CEUs</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  renderHealthCenterContent() {
    return (
      <>
        {/* health center portal */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold uppercase tracking-widest text-white/50">Health Center Management</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-lg text-orange-400">Enterprise</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-600/30 border border-orange-400/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <IconWrapper icon={FaBuilding} className="text-orange-400 text-2xl" />
            <div>
              <p className="font-bold text-xl">Facility Overview</p>
              <p className="text-lg text-white/70">4 Active Facilities • 342 Patients • 18 Staff</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaHospital} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Facility Command Center</p>
                <p className="text-lg text-white/60">Multi-location dashboard</p>
              </div>
              <div className="bg-green-500 px-2 py-0.5 rounded-full text-lg font-semibold">4 Sites</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-blue-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUserGroup} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Staff Management Hub</p>
                <p className="text-lg text-white/60">Team coordination & scheduling</p>
              </div>
              <div className="bg-blue-500 px-2 py-0.5 rounded-full text-lg font-semibold">18 Active</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUsersGear} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Patient Registry</p>
                <p className="text-lg text-white/60">Entreprise patient database</p>
              </div>
              <div className="bg-purple-500 px-2 py-0.5 rounded-full text-lg font-semibold">342 Total</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCalendarWeek} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Master Scheduler</p>
                <p className="text-lg text-white/60">Multi-therapist coordination</p>
              </div>
              <div className="bg-teal-500 px-2 py-0.5 rounded-full text-lg font-semibold">27 Today</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaRobot} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">AI Operations Center</p>
                <p className="text-lg text-white/60">Intelligent automation suite</p>
              </div>
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <span className="text-lg text-green-400">Active</span>
            </div>
          </div>
        </div>

        {/* Clinic operations */}
        <div className="px-6 py-5 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">clinical Operations</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-yellow-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaBedPulse} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Treatment Protocols</p>
                <p className="text-lg text-white/60">Standardized care pathways</p>
              </div>
              <span className="text-lg text-yellow-400">45 Protocols</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-indigo-400 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaClipboardCheck} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Quality Assurance</p>
                <p className="text-lg text-white/60">Care standards monitoring</p>
              </div>
              <IconWrapper icon={FaCheck} className="text-indigo-300 text-2xl" />
              <span className="text-lg text-indigo-400">98.2%</span>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-pink-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartArea} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Outcome Analytics</p>
                <p className="text-lg text-white/60">Treatment effectiveness metrics</p>
              </div>
              <IconWrapper icon={MdOutlineShowChart} className="text-pink-400 text-2xl" />
              <span className="text-lg text-pink-400">+15.3%</span>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaMicroscope} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Research Portal</p>
                <p className="text-lg text-white/60">Clinical studies & trials</p>
              </div>
              <div className="bg-teal-500 px-2 py-0.5 rounded-full text-lg font-semibold">7 Active</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaShieldVirus} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Infection Control</p>
                <p className="text-lg text-white/60">Safety protocols & monitoring</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <span className="text-lg text-green-400">Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Intelligence */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Business Intelligence</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaChartPie} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Financial Command Center</p>
                <p className="text-lg text-white/60">Revenue, costs & profitability</p>
              </div>
              <span className="text-lg text-orange-400">$1.2M APR</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={TbCircleDotted} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Performance Dashboard</p>
                <p className="text-lg text-white/60">KPI tracking & benchmarking</p>
              </div>
              <IconWrapper icon={IoStatsChart } className="text-green-400 text-2xl" />
              <span className="text-lg text-green-400">Real-time</span>
              
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaDatabase} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Data Warehouse</p>
                <p className="text-lg text-white/60">Integrated reporting & analytics</p>
              </div>
              <span className="text-lg text-purple-400">2.3TB Data</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-rose-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaBrain} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Predictive Analytics</p>
                <p className="text-lg text-white/60">AI-Driven business insights</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                <span className="text-lg text-rose-500">ML Active</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-cyan-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaGlobe} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Market Intelligence</p>
                <p className="text-lg text-white/60">Competitive analysis & trends</p>
              </div>
              <div className="bg-cyan-500 px-2 py-0.5 rounded-full text-lg font-semibold">Weekly</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>            
          </div>
          
        </div>
        {/* Enterprise Management */}
        <div className="p-6 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <p className="text-xl font-bold uppercase tracking-widest text-white/50 mb-4">Enterprise Management</p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-orange-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaTools} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Equipement Management</p>
                <p className="text-lg text-white/60">Inventory, maintenance & lifecycle</p>
              </div>
              <div className="bg-orange-500 px-2 py-0.5 rounded-full text-lg font-semibold">245 Items</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-green-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaLocationDot} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Space Management</p>
                <p className="text-lg text-white/60">Room scheduling & optimization</p>
              </div>
              <span className="text-lg text-green-400">24 Rooms</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-rose-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaShieldHalved} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Compliance Center</p>
                <p className="text-lg text-white/60">Regulatory adherence & audits</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <span className="text-lg text-green-400">Certified</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-purple-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaUsers} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">HR Management</p>
                <p className="text-lg text-white/60">Staff administration & development</p>
              </div>
              <div className="bg-purple-500 px-2 py-0.5 rounded-full text-lg font-semibold">18 Staff</div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-cyan-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaNetworkWired} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">IT Infrastructure</p>
                <p className="text-lg text-white/60">Systems & network management</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <span className="text-lg text-green-400">99.9% Uptime</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-teal-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaLeaf} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Sustainability Hub</p>
                <p className="text-lg text-white/60">Environment impact tracking</p>
              </div>
              <span className="text-lg text-teal-400">Carbon Neutral</span>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>
        
      </>
    );
  }

  render() {
    const { activeRole } = this.state;

    return (
      <div className="relative w-[481px] bg-gradient-to-b from-[#2E2D87] to-[#1a237e] text-white flex flex-col overflow-y-auto">

        {/* n1: header */}
        <div className="p-9 bg-gradient-to-br from-[#2E2D87] to-[#1a237e]">
          <div className="flex items-center justify-between mb-9">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-700 p-5 rounded-2xl shadow-lg">
                <IconWrapper icon={FaHeartPulse} className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="font-bold text-4xl leading-tight">PhysioAI</h1>
                <p className="text-xl text-white/60">Smart Recovery Platform</p>
              </div>
            </div>
            <button onClick={this.props.onClose} className="absolute top-4 right-4 text-white/60 hover:text-white text-6xl font-light">
              <IconWrapper icon={IoIosClose} />
            </button>
          </div>

          {/* patient card */}
          <div className="bg-[#3633A6] rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Sarah Johnson"
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="font-bold text-2xl">Sarah Johnson</p>
                <p className="text-xl text-white/60">Premium Member</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium text-base text-green-400">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { value: '24', label: 'Sessions' },
                { value: '85%', label: 'Progress' },
                { value: '12', label: 'Streak' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 rounded-xl py-3 text-center">
                  <p className="font-bold text-3xl">{value}</p>
                  <p className="text-lg text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* n2: switch role */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xl font-bold uppercase tracking-widest text-white/70">Switch Role</p>
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-full">
                <IconWrapper icon={FaCircleUser} className="text-white text-lg" />
              </div>
            </div>
            <div className="space-y-3">
              {/* patient portal */}
              <div
                onClick={() => this.setRole('patient')}
                className={`rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeRole === 'patient' ? 'bg-blue-600/60' : 'hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]'}`}
              >
                <div className="bg-teal-500 p-3 rounded-xl flex-shrink-0">
                  <IconWrapper icon={FaUser} className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl">Patient Portal</p>
                  <p className="text-lg text-white/60">Personal health journey</p>
                </div>
                {activeRole === 'patient' ? (
                  <div className="flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full animate-pulse">
                    <span className="text-lg font-semibold">Active</span>
                  </div>
                ) : (
                  <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
                )}
              </div>

              {/* physiotherapist */}
              <div
                onClick={() => this.setRole('physiotherapist')}
                className={`rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeRole === 'physiotherapist' ? 'bg-blue-600/60' : 'hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]'}`}
              >
                <div className="bg-purple-500 p-3 rounded-xl flex-shrink-0">
                  <IconWrapper icon={FaUserDoctor} className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl">Physiotherapist</p>
                  <p className="text-lg text-white/60">Professional practice</p>
                </div>
                {activeRole === 'physiotherapist' ? (
                  <div className="flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full animate-pulse">
                    <span className="text-lg font-semibold">Active</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-purple-500 px-2 py-1.5 rounded-full text-lg font-semibold">24 Patients</div>
                    <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
                  </>
                )}
              </div>

              {/* health center */}
              <div
                onClick={() => this.setRole('healthcenter')}
                className={`rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeRole === 'healthcenter' ? 'bg-blue-600/60' : 'hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]'}`}
              >
                <div className="bg-orange-500 p-3 rounded-xl flex-shrink-0">
                  <IconWrapper icon={FaHospital} className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl">Health Center</p>
                  <p className="text-lg text-white/60">Facility management</p>
                </div>
                {activeRole === 'healthcenter' ? (
                  <div className="flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full animate-pulse">
                    <span className="text-lg font-semibold">Active</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-orange-500 px-2 py-1.5 rounded-full text-lg font-semibold">4 Locations</div>
                    <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* dynamic content based on active role */}
        {activeRole === 'patient' && this.renderPatientContent()}
        {activeRole === 'physiotherapist' && this.renderPhysiotherapistContent()}
        {activeRole === 'healthcenter' && this.renderHealthCenterContent()}

        {/* n8: settings & sign out — always visible */}
        <div className="px-6 py-5 border-b" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1' }}>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={MdSettings} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Settings & Preferences</p>
                <p className="text-lg text-white/60">Account configuration</p>
              </div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaCircleQuestion} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Help & Support</p>
                <p className="text-lg text-white/60">24/7 assistance available</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-lg text-green-400">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-blue-800 rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl flex-shrink-0">
                <IconWrapper icon={FaRightFromBracket} className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl">Sign Out</p>
                <p className="text-lg text-white/60">Secure session logout</p>
              </div>
              <IconWrapper icon={IoChevronForward} className="text-white/50 text-2xl" />
            </div>
          </div>
        </div>

        {/* n9: system health — always visible */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold text-xl">System Health</span>
            </div>
            <span className="text-green-400 font-bold text-lg tracking-wide">OPTIMAL</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/10 rounded-xl px-3 py-3 flex flex-col text-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <IconWrapper icon={FaServer} className="text-green-400 text-xl" />
                <p className="font-bold text-lg text-green-400">99.9%</p>
              </div>
              <p className="text-md text-white/50">Uptime</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-3 flex flex-col text-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <IconWrapper icon={FaGaugeHigh} className="text-blue-400 text-xl" />
                <p className="font-bold text-lg text-blue-400">45ms</p>
              </div>
              <p className="text-md text-white/50">Response</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-3 flex flex-col text-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <IconWrapper icon={FaShieldHalved} className="text-purple-400 text-xl" />
                <p className="font-bold text-lg text-purple-400">Secure</p>
              </div>
              <p className="text-md text-white/50">Status</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl">PhysioAI v3.2.1</p>
            <p className="text-lg text-white/50">Last updated: 2 hours ago</p>
          </div>
        </div>

      </div>
    );
  }
}

function SmartRecoveryPlatformSideBarWithRouter({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  return <SmartRecoveryPlatformSideBar navigate={navigate} onClose={onClose} />;
}

export default SmartRecoveryPlatformSideBarWithRouter;