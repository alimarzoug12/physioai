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
} from 'react-icons/fa6';
import { TbCircleDotted } from 'react-icons/tb';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import { MdNotifications, MdSettings } from 'react-icons/md';
import { FaUserCog } from 'react-icons/fa';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface SmartTherapyAssistantSidebarProps {
  navigate?: (path: string) => void;
  onClose?: () => void;
}

// page 13 src/pages/SmartTherapyAssistantSidebar.tsx
class SmartTherapyAssistantSidebar extends React.Component<SmartTherapyAssistantSidebarProps> {
  state = {
    activeItem: 'Overview',
  };
  setActive = (label: string) => {
    this.setState({ activeItem: label });
  };

  li = (label: string, extra = '') =>
    `${extra} cursor-pointer ${this.state.activeItem === label ? 'bg-white/10 border-l-8 border-white hover:translate-x-2 transition-transform duration-200' : 'hover:bg-white/10 hover:translate-x-2 transition-transform duration-200'}`;
  render() {
    return (
      <div className="w-[481px] bg-gradient-to-br from-[#6C8AEB] via-[#5a52b8] to-[#4a3f9f] text-white flex flex-col">

        {/* n1: header */}
        <div className="relative p-9 border-b border-white/10">
          <div className="flex items-center justify-between">

            {/* Left: icon + title */}
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-4 rounded-2xl">
                <IconWrapper icon={FaBrain} className="text-white text-4xl" />
              </div>
              <div>
                <h1 className="font-bold text-4xl leading-tight">Physio AI</h1>
                <p className="text-xl text-white/60">Smart Therapy Assistant</p>
              </div>
            </div>

            {/* Right: close button */}
            <button
              onClick={() => this.props.onClose?.()}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-6xl font-light"
            >
              <IconWrapper icon={IoIosClose} />
            </button>

          </div>
        </div>
        <div className="p-6 border-b border-white/10">
          <div className="bg-white/15 rounded-2xl p-5 flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
              alt="Dr. Sarah Mitchell"
              className="w-16 h-16 rounded-full border-2 border-white/40 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xl truncate">Dr. Sarah Mitchell</p>
              <p className="text-lg text-white/60 truncate">Licensed Physiotherapist</p>
              <div className="flex items-center gap-2.5 mt-0.5">
                <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
                <span className="text-lg text-white/70">Online</span>
              </div>
            </div>
            <IconWrapper icon={IoIosArrowDown} className="text-white/60 text-3xl flex-shrink-0" />
          </div>
        </div>

        {/* n2: dashboard */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Dashboard</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Overview')} className={this.li('Overview', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaChartLine} className="text-white text-xl w-5" />
                <span>Overview</span>
              </div>
              <span className="bg-white/20 text-white text-lg px-2.5 py-1 rounded-full">12</span>
            </li>
            <li onClick={() => this.setActive('Appointments')} className={this.li('Appointments', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaCalendarCheck} className="text-white text-xl w-5" />
                <span>Appointments</span>
              </div>
              <span className="bg-red-500 text-white text-lg px-2.5 py-1 rounded-full">3</span>
            </li>
            <li onClick={() => this.setActive('Patients')} className={this.li('Patients', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaUsers} className="text-white text-xl w-5" />
                <span>Patients</span>
              </div>
              <span className="text-white/60 text-lg">248</span>
            </li>
            <li onClick={() => this.setActive('Treatment Plans')} className={this.li('Treatment Plans', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaClipboardList} className="text-white text-xl w-5" />
              <span>Treatment Plans</span>
            </li>
          </ul>
        </div>

        {/* n3: ai tools */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">AI Tools</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('AI Diagnosis')} className={this.li('AI Diagnosis', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaRobot} className="text-white text-xl w-5" />
                <span>AI Diagnosis</span>
              </div>
              <span className="bg-green-500 text-white text-lg px-2.5 py-1 rounded-full">New</span>
            </li>
            <li onClick={() => this.setActive('Movement Analysis')} className={this.li('Movement Analysis', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaEye} className="text-white text-xl w-5" />
              <span>Movement Analysis</span>
            </li>
            <li onClick={() => this.setActive('Exercise Generator')} className={this.li('Exercise Generator', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaDumbbell} className="text-white text-xl w-5" />
              <span>Exercise Generator</span>
            </li>
            <li onClick={() => this.setActive('Progress Tracking')} className={this.li('Progress Tracking', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaChartBar} className="text-white text-xl w-5" />
              <span>Progress Tracking</span>
            </li>
          </ul>
        </div>

        {/* n4: voice commands */}
        <div className="pt-1">
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Voice Commands')} className={this.li('Voice Commands', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaMicrophone} className="text-white text-xl w-5" />
                <span>Voice Commands</span>
              </div>
              <span className="bg-blue-500 text-white text-lg px-2.5 py-1 rounded-full">Beta</span>
            </li>
          </ul>
        </div>

        {/* n5: patient management */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Patient Management</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Add Patient')} className={this.li('Add Patient', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaUserPlus} className="text-white text-xl w-5" />
              <span>Add Patient</span>
            </li>
            <li onClick={() => this.setActive('Patient Records')} className={this.li('Patient Records', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaFolderOpen} className="text-white text-xl w-5" />
              <span>Patient Records</span>
            </li>
            <li onClick={() => this.setActive('Medical History')} className={this.li('Medical History', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaFileMedical} className="text-white text-xl w-5" />
              <span>Medical History</span>
            </li>
            <li onClick={() => this.setActive('X-Ray Analysis')} className={this.li('X-Ray Analysis', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaImages} className="text-white text-xl w-5" />
              <span>X-Ray Analysis</span>
            </li>
            <li onClick={() => this.setActive('Treatment Notes')} className={this.li('Treatment Notes', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaClipboardList} className="text-white text-xl w-5" />
              <span>Treatment Notes</span>
            </li>
          </ul>
        </div>

        {/* n6: assessment tools */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Assessment Tools</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Range of Motion')} className={this.li('Range of Motion', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaRulerCombined} className="text-white text-xl w-5" />
              <span>Range of Motion</span>
            </li>
            <li onClick={() => this.setActive('Strength Testing')} className={this.li('Strength Testing', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaScaleBalanced} className="text-white text-xl w-5" />
              <span>Strength Testing</span>
            </li>
            <li onClick={() => this.setActive('Balance Assessment')} className={this.li('Balance Assessment', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaScaleBalanced} className="text-white text-xl w-5" />
              <span>Balance Assessment</span>
            </li>
            <li onClick={() => this.setActive('Gait Analysis')} className={this.li('Gait Analysis', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaPersonWalking} className="text-white text-xl w-5" />
              <span>Gait Analysis</span>
            </li>
          </ul>
        </div>

        {/* n7: treatment */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Treatment</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Pain Assessment')} className={this.li('Pain Assessment', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaHand} className="text-white text-xl w-5" />
              <span>Pain Assessment</span>
            </li>
            <li onClick={() => this.setActive('Exercise Library')} className={this.li('Exercise Library', 'flex items-center justify-between py-5 px-9')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaPersonRunning} className="text-white text-xl w-5" />
                <span>Exercise Library</span>
              </div>
              <span className="text-white/60 text-lg">2.4k</span>
            </li>
            <li onClick={() => this.setActive('Video Exercises')} className={this.li('Video Exercises', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaCirclePlay} className="text-white text-xl w-5" />
              <span>Video Exercises</span>
            </li>
            <li onClick={() => this.setActive('Treatment Protocols')} className={this.li('Treatment Protocols', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaPrescriptionBottleMedical} className="text-white text-xl w-5" />
              <span>Treatment Protocols</span>
            </li>
            <li onClick={() => this.setActive('Session Timer')} className={this.li('Session Timer', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaStopwatch} className="text-white text-xl w-5" />
              <span>Session Timer</span>
            </li>
            <li onClick={() => this.setActive('Recovery Plans')} className={this.li('Recovery Plans', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaHeartPulse} className="text-white text-xl w-5" />
              <span>Recovery Plans</span>
            </li>
          </ul>
        </div>

        {/* n8: analytics */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Analytics</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Performance Metrics')} className={this.li('Performance Metrics', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaChartPie} className="text-white text-xl w-5" />
              <span>Performance Metrics</span>
            </li>
            <li onClick={() => this.setActive('Progress Reports')} className={this.li('Progress Reports', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={TbCircleDotted} className="text-white text-xl w-5" />
              <span>Progress Reports</span>
            </li>
            <li onClick={() => this.setActive('Outcome Analysis')} className={this.li('Outcome Analysis', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={TbCircleDotted} className="text-white text-xl w-5" />
              <span>Outcome Analysis</span>
            </li>
            <li onClick={() => this.setActive('Treatment History')} className={this.li('Treatment History', 'flex items-center gap-6 text-2xl py-5 px-9')}>
              <IconWrapper icon={FaChartLine} className="text-white text-xl w-5" />
              <span>Treatment History</span>
            </li>
          </ul>
        </div>

        {/* n9: communication */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Communication</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Messages')} className={this.li('Messages', 'flex items-center justify-between py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaComments} className="text-white text-xl w-5" />
                <span>Messages</span>
              </div>
              <span className="bg-red-500 text-white text-lg px-3 py-1 rounded-full">7</span>
            </li>
            <li onClick={() => this.setActive('Video Calls')} className={this.li('Video Calls', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaVideo} className="text-white text-xl w-5" />
              <span>Video Calls</span>
            </li>
            <li onClick={() => this.setActive('Notifications')} className={this.li('Notifications', 'flex items-center justify-between py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={MdNotifications} className="text-white text-xl w-5" />
                <span>Notifications</span>
              </div>
              <span className="bg-orange-500 text-white text-lg px-2.5 py-1 rounded-full">15</span>
            </li>
            <li onClick={() => this.setActive('Referrals')} className={this.li('Referrals', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaShareNodes} className="text-white text-xl w-5" />
              <span>Referrals</span>
            </li>
          </ul>
        </div>

        {/* n10: resources */}
        <div className="pt-2">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Resources</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Knowledge Base')} className={this.li('Knowledge Base', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaBookMedical} className="text-white text-xl w-5" />
              <span>Knowledge Base</span>
            </li>
            <li onClick={() => this.setActive('Training Materials')} className={this.li('Training Materials', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaGraduationCap} className="text-white text-xl w-5" />
              <span>Training Materials</span>
            </li>
            <li onClick={() => this.setActive('Research Papers')} className={this.li('Research Papers', 'flex items-center justify-between py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <div className="flex items-center gap-6 text-2xl">
                <IconWrapper icon={FaNewspaper} className="text-white text-xl w-5" />
                <span>Research Papers</span>
              </div>
              <span className="bg-blue-500 text-white text-lg px-2.5 py-1 rounded-full">Updated</span>
            </li>
            <li onClick={() => this.setActive('Community')} className={this.li('Community', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaUsersGear} className="text-white text-xl w-5" />
              <span>Community</span>
            </li>
          </ul>
        </div>

        {/* n11: quick actions */}
        <div className="px-6 pt-3 pb-6 border-t border-white/10">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 py-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors">
              <IconWrapper icon={FaPlus} className="text-white text-[25px]" />
              <span className="text-lg text-white">New Patient</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors">
              <IconWrapper icon={FaCalendarPlus} className="text-white text-[25px]" />
              <span className="text-lg text-white/90">Schedule</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors">
              <IconWrapper icon={FaCamera} className="text-white text-[25px]" />
              <span className="text-lg text-white/90">Scan QR</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors">
              <IconWrapper icon={FaHeadset} className="text-white text-[25px]" />
              <span className="text-lg text-white/90">Support</span>
            </button>
          </div>
        </div>

        {/* n12: settings */}
        <div className="pt-3 mb-2 border-t border-white/10">
          <p className="text-lg font-semibold uppercase tracking-widest text-white/40 px-6 py-2">Settings</p>
          <ul className="space-y-0.5">
            <li onClick={() => this.setActive('Profile Settings')} className={this.li('Profile Settings', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaUserCog} className="text-white text-[25px] w-5" />
              <span>Profile Settings</span>
            </li>
            <li onClick={() => this.setActive('Privacy & Security')} className={this.li('Privacy & Security', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaUsers} className="text-white text-[25px] w-5" />
              <span>Privacy & Security</span>
            </li>
            <li onClick={() => this.setActive('Appearance')} className={this.li('Appearance', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaChartBar} className="text-white text-[25px] w-5" />
              <span>Appearance</span>
            </li>
            <li onClick={() => this.setActive('Language')} className={this.li('Language', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaLanguage} className="text-white text-[25px] w-5" />
              <span>Language</span>
            </li>
            <li onClick={() => this.setActive('Backup & Sync')} className={this.li('Backup & Sync', 'flex items-center gap-6 text-2xl py-5 px-9 hover:bg-white/10 cursor-pointer')}>
              <IconWrapper icon={FaDownload} className="text-white text-[25px] w-5" />
              <span>Backup & Sync</span>
            </li>
          </ul>
        </div>

        {/* n13: storage used */}
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
          <div className="flex justify-between items-center ">
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
          <p className="text-lg text-center mt-3 text-white/50">v2.1.4  •  AI Enhanced</p>
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