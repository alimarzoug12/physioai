import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBrain, FaChartLine, FaCalendarCheck, FaUsers, FaClipboardList,
  FaRobot, FaEye, FaDumbbell, FaChartBar, FaMicrophone, FaUserPlus,
  FaFolderOpen, FaFileMedical, FaImages, FaRulerCombined, FaScaleBalanced,
  FaPersonWalking, FaHand, FaPersonRunning, FaCirclePlay,
  FaPrescriptionBottleMedical, FaStopwatch, FaHeartPulse, FaChartPie,
  FaComments, FaVideo, FaShareNodes, FaBookMedical, FaGraduationCap,
  FaNewspaper, FaUsersGear, FaPlus, FaCalendarPlus, FaHeadset,
  FaCamera, FaLanguage, FaDownload, FaCircleQuestion,
  FaStar,
} from 'react-icons/fa6';
import { TbCircleDotted } from 'react-icons/tb';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import { MdNotifications, MdSettings } from 'react-icons/md';
import { FaUserCog } from 'react-icons/fa';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ─────────────────────────────────────────────────────────
interface DoctorProfile {
  id: string; fullName: string; email: string; phone: string;
  specialty: string; rating: number; experience: string;
  center: string; isAvailable: boolean; avatarUrl: string;
  totalPatients: number; completedSessions: number;
}

interface Props {
  navigate?: (path: string) => void;
  onClose?:  () => void;
}

interface State {
  activeItem:  string;
  doctor:      DoctorProfile | null;
  loading:     boolean;
  error:       string;
}

class SmartTherapyAssistantSidebar extends React.Component<Props, State> {
  state: State = {
    activeItem: 'Overview',
    doctor:     null,
    loading:    true,
    error:      '',
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (!token) { this.setState({ loading: false, error: 'Not logged in' }); return; }
    try {
      const doctor = await api.getDoctorMe(token);
      this.setState({ doctor, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message, loading: false });
    }
  }

  setActive = (label: string) => this.setState({ activeItem: label });

  li = (label: string, extra = '') =>
    `${extra} cursor-pointer ${
      this.state.activeItem === label
        ? 'bg-white/10 border-l-8 border-white hover:translate-x-2 transition-transform duration-200'
        : 'hover:bg-white/10 hover:translate-x-2 transition-transform duration-200'
    }`;

  render() {
    const { doctor, loading, error } = this.state;

    return (
      <div className="w-[481px] bg-gradient-to-br from-[#6C8AEB] via-[#5a52b8] to-[#4a3f9f] text-white flex flex-col">

        {/* Header */}
        <div className="relative p-9 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-4 rounded-2xl">
                <IconWrapper icon={FaBrain} className="text-white text-4xl" />
              </div>
              <div>
                <h1 className="font-bold text-4xl leading-tight">Physio AI</h1>
                <p className="text-xl text-white/60">Smart Therapy Assistant</p>
              </div>
            </div>
            <button
              onClick={() => this.props.onClose?.()}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-6xl font-light"
            >
              <IconWrapper icon={IoIosClose} />
            </button>
          </div>
        </div>

        {/* ── Doctor Profile Card — DYNAMIC ────────────────── */}
        <div className="p-6 border-b border-white/10">
          {loading ? (
            <div className="bg-white/15 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ) : error || !doctor ? (
            <div className="bg-white/15 rounded-2xl p-5 text-center text-white/60 text-xl">
              {error || 'Doctor profile unavailable'}
            </div>
          ) : (
            <div className="bg-white/15 rounded-2xl p-5 flex items-center gap-5">
              <img
                src={doctor.avatarUrl}
                alt={doctor.fullName}
                className="w-16 h-16 rounded-full border-2 border-white/40 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xl truncate">Dr. {doctor.fullName}</p>
                <p className="text-lg text-white/60 truncate">{doctor.specialty}</p>
                <p className="text-lg text-white/50 truncate">{doctor.center}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {/* Online dot */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${doctor.isAvailable ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-lg text-white/70">{doctor.isAvailable ? 'Online' : 'Offline'}</span>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-300 text-lg">
                    <IconWrapper icon={FaStar} className="text-base" />
                    <span>{doctor.rating.toFixed(1)}</span>
                  </div>
                </div>
                {/* Mini stats */}
                <div className="flex gap-4 mt-2">
                  <div className="text-center">
                    <p className="font-bold text-white text-lg leading-tight">{doctor.totalPatients}</p>
                    <p className="text-white/50 text-base">Patients</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white text-lg leading-tight">{doctor.completedSessions}</p>
                    <p className="text-white/50 text-base">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white text-lg leading-tight">{doctor.experience}</p>
                    <p className="text-white/50 text-base">Exp</p>
                  </div>
                </div>
              </div>
              <IconWrapper icon={IoIosArrowDown} className="text-white/60 text-3xl flex-shrink-0" />
            </div>
          )}
        </div>

        {/* ── All nav sections below are IDENTICAL to original ── */}

        {/* Dashboard */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Dashboard</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Overview')} className={this.li('Overview', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaChartLine} className="text-white text-xl w-5" /><span>Overview</span></div>
              <span className="bg-white/20 text-white text-lg px-2.5 py-1 rounded-full">12</span>
            </li>
            <li onClick={() => this.setActive('Appointments')} className={this.li('Appointments', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaCalendarCheck} className="text-white text-xl w-5" /><span>Appointments</span></div>
              <span className="bg-red-500 text-white text-lg px-2.5 py-1 rounded-full">3</span>
            </li>
            <li onClick={() => this.setActive('Patients')} className={this.li('Patients', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaUsers} className="text-white text-xl w-5" /><span>Patients</span></div>
              <span className="text-white/60 text-lg">{doctor?.totalPatients ?? '—'}</span>
            </li>
            <li onClick={() => this.setActive('Treatment Plans')} className={this.li('Treatment Plans', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaClipboardList} className="text-white text-xl w-5" /><span>Treatment Plans</span>
            </li>
          </ul>
        </div>

        {/* AI Tools */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">AI Tools</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('AI Diagnosis')} className={this.li('AI Diagnosis', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaRobot} className="text-white text-xl w-5" /><span>AI Diagnosis</span></div>
              <span className="bg-green-500 text-white text-lg px-2.5 py-1 rounded-full">New</span>
            </li>
            <li onClick={() => this.setActive('Movement Analysis')} className={this.li('Movement Analysis', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaEye} className="text-white text-xl w-5" /><span>Movement Analysis</span>
            </li>
            <li onClick={() => this.setActive('Exercise Generator')} className={this.li('Exercise Generator', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaDumbbell} className="text-white text-xl w-5" /><span>Exercise Generator</span>
            </li>
            <li onClick={() => this.setActive('Progress Tracking')} className={this.li('Progress Tracking', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaChartBar} className="text-white text-xl w-5" /><span>Progress Tracking</span>
            </li>
          </ul>
        </div>

        {/* Voice Commands */}
        <div className="pt-1">
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Voice Commands')} className={this.li('Voice Commands', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaMicrophone} className="text-white text-xl w-5" /><span>Voice Commands</span></div>
              <span className="bg-blue-500 text-white text-lg px-2.5 py-1 rounded-full">Beta</span>
            </li>
          </ul>
        </div>

        {/* Patient Management */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Patient Management</p>
          <ul className="space-y-0.5">
            {[
              { label: 'Add Patient',      icon: FaUserPlus      },
              { label: 'Patient Records',  icon: FaFolderOpen    },
              { label: 'Medical History',  icon: FaFileMedical   },
              { label: 'X-Ray Analysis',   icon: FaImages        },
              { label: 'Treatment Notes',  icon: FaClipboardList },
            ].map(({ label, icon }) => (
              <li key={label} onClick={() => this.setActive(label)} className={this.li(label, 'flex items-center gap-6 text-2xl py-5 px-9')}>
                <IconWrapper icon={icon} className="text-white text-xl w-5" /><span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assessment Tools */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Assessment Tools</p>
          <ul className="space-y-0.5">
            {[
              { label: 'Range of Motion',    icon: FaRulerCombined  },
              { label: 'Strength Testing',   icon: FaScaleBalanced  },
              { label: 'Balance Assessment', icon: FaScaleBalanced  },
              { label: 'Gait Analysis',      icon: FaPersonWalking  },
            ].map(({ label, icon }) => (
              <li key={label} onClick={() => this.setActive(label)} className={this.li(label, 'flex items-center gap-6 text-2xl py-5 px-9')}>
                <IconWrapper icon={icon} className="text-white text-xl w-5" /><span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Treatment</p>
          <ul className="space-y-0.5">
            {[
              { label: 'Pain Assessment',      icon: FaHand,                        extra: '' },
              { label: 'Exercise Library',     icon: FaPersonRunning,               extra: 'justify-between' },
              { label: 'Video Exercises',      icon: FaCirclePlay,                  extra: '' },
              { label: 'Treatment Protocols',  icon: FaPrescriptionBottleMedical,   extra: '' },
              { label: 'Session Timer',        icon: FaStopwatch,                   extra: '' },
              { label: 'Recovery Plans',       icon: FaHeartPulse,                  extra: '' },
            ].map(({ label, icon }) => (
              <li key={label} onClick={() => this.setActive(label)} className={this.li(label, 'flex items-center gap-6 text-2xl py-5 px-9')}>
                <IconWrapper icon={icon} className="text-white text-xl w-5" /><span>{label}</span>
                {label === 'Exercise Library' && <span className="ml-auto text-white/60 text-lg">2.4k</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Analytics */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Analytics</p>
          <ul className="space-y-0.5">
            {[
              { label: 'Performance Metrics', icon: FaChartPie  },
              { label: 'Progress Reports',    icon: TbCircleDotted },
              { label: 'Outcome Analysis',    icon: TbCircleDotted },
              { label: 'Treatment History',   icon: FaChartLine },
            ].map(({ label, icon }) => (
              <li key={label} onClick={() => this.setActive(label)} className={this.li(label, 'flex items-center gap-6 text-2xl py-5 px-9')}>
                <IconWrapper icon={icon} className="text-white text-xl w-5" /><span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Communication */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Communication</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Messages')} className={this.li('Messages', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaComments} className="text-white text-xl w-5" /><span>Messages</span></div>
              <span className="bg-red-500 text-white text-lg px-3 py-1 rounded-full">7</span>
            </li>
            <li onClick={() => this.setActive('Video Calls')} className={this.li('Video Calls', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaVideo} className="text-white text-xl w-5" /><span>Video Calls</span>
            </li>
            <li onClick={() => this.setActive('Notifications')} className={this.li('Notifications', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={MdNotifications} className="text-white text-xl w-5" /><span>Notifications</span></div>
              <span className="bg-orange-500 text-white text-lg px-2.5 py-1 rounded-full">15</span>
            </li>
            <li onClick={() => this.setActive('Referrals')} className={this.li('Referrals', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaShareNodes} className="text-white text-xl w-5" /><span>Referrals</span>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Resources</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Knowledge Base')} className={this.li('Knowledge Base', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaBookMedical} className="text-white text-xl w-5" /><span>Knowledge Base</span>
            </li>
            <li onClick={() => this.setActive('Training Materials')} className={this.li('Training Materials', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaGraduationCap} className="text-white text-xl w-5" /><span>Training Materials</span>
            </li>
            <li onClick={() => this.setActive('Research Papers')} className={this.li('Research Papers', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl"><IconWrapper icon={FaNewspaper} className="text-white text-xl w-5" /><span>Research Papers</span></div>
              <span className="bg-blue-500 text-white text-lg px-2.5 py-1 rounded-full">Updated</span>
            </li>
            <li onClick={() => this.setActive('Community')} className={this.li('Community', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaUsersGear} className="text-white text-xl w-5" /><span>Community</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pt-3 pb-6 border-t border-white/10">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 py-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FaPlus,        label: 'New Patient' },
              { icon: FaCalendarPlus,label: 'Schedule'    },
              { icon: FaCamera,      label: 'Scan QR'     },
              { icon: FaHeadset,     label: 'Support'     },
            ].map(({ icon, label }) => (
              <button key={label} className="bg-white/10 hover:bg-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors">
                <IconWrapper icon={icon} className="text-white text-[25px]" />
                <span className="text-lg text-white/90">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="pt-3 mb-2 border-t border-white/10">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Settings</p>
          <ul className="space-y-0.5">
            {[
              { label: 'Profile Settings',  icon: FaUserCog  },
              { label: 'Privacy & Security',icon: FaUsers    },
              { label: 'Appearance',        icon: FaChartBar },
              { label: 'Language',          icon: FaLanguage },
              { label: 'Backup & Sync',     icon: FaDownload },
            ].map(({ label, icon }) => (
              <li key={label} onClick={() => this.setActive(label)} className={this.li(label, 'flex items-center gap-6 text-2xl py-5 px-9')}>
                <IconWrapper icon={icon} className="text-white text-[25px] w-5" /><span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Storage */}
        <div className="px-6 py-6 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-4 gap-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Storage Used</p>
              <p className="text-lg text-white/70">2.4GB / 5GB</p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
              <div className="bg-white h-2 rounded-full w-[48%]" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="bg-white/10 rounded-xl p-3 hover:bg-white/25 transition-colors">
              <IconWrapper icon={FaCircleQuestion} className="text-white text-2xl" />
            </button>
            <button className="bg-white/10 rounded-xl p-3 hover:bg-white/25 transition-colors">
              <IconWrapper icon={MdSettings} className="text-white text-2xl" />
            </button>
            <button className="bg-white/10 rounded-xl p-3 hover:bg-white/25 transition-colors">
              <IconWrapper icon={FaShareNodes} className="text-white text-2xl" />
            </button>
          </div>
          <p className="text-lg text-center mt-3 text-white/50">
            v2.1.4 • AI Enhanced
            {doctor && <span> • {doctor.email}</span>}
          </p>
        </div>

      </div>
    );
  }
}

function SmartTherapyAssistantSidebarWithRouter({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  return <SmartTherapyAssistantSidebar navigate={navigate} onClose={onClose} />;
}

export default SmartTherapyAssistantSidebarWithRouter;