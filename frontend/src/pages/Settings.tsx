import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch } from 'react-icons/fa';
import {
  FaArrowLeft, FaCircleCheck, FaCrown, FaUserPen, FaShieldHalved, FaWallet,
  FaUser, FaPhone, FaCakeCandles, FaVenusMars, FaLocationDot, FaHeartPulse,
  FaPills, FaHandDots, FaDumbbell, FaLanguage, FaClock, FaGlobe, FaCoins,
  FaCalendarCheck, FaRobot, FaCreditCard, FaStar, FaFingerprint, FaLock,
  FaEye, FaMapLocationDot, FaKey, FaFileShield, FaMoon, FaTextHeight,
  FaWifi, FaVolumeHigh, FaBug, FaFileContract, FaDownload,
  FaUserSlash, FaTriangleExclamation, FaRightFromBracket, FaAngleRight,
  FaHeadset, FaCircleQuestion, FaAngleDown
} from 'react-icons/fa6';
import { MdNotifications } from 'react-icons/md';
import { IoInformationCircle } from 'react-icons/io5';
import { TbMailFilled } from 'react-icons/tb';
import { FaSyncAlt, FaCompressArrowsAlt, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';
import { TiStarburst } from 'react-icons/ti';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};


const Toggle = ({ checked = false }: { checked?: boolean }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
    <div className="w-16 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-8 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-cyan-400"></div>
  </label>
);

const SettingRow = ({ icon, iconClass, label, sub, right, bg }: any) => (
  <div className={`flex items-center gap-4 p-6 rounded-3xl ${bg ?? 'bg-gray-50'}`}>
    <span className={`text-2xl ${iconClass}`}><IconWrapper icon={icon} /></span>
    <div className="flex-1">
      <p className="font-semibold text-gray-900 text-xl">{label}</p>
      <p className="text-gray-500 text-lg">{sub}</p>
    </div>
    {right}
  </div>
);
function getAvatarUrl(fullName?: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=3b82f6&color=fff&size=128`;
}
interface SettingsProps {
  navigate?: (path: string) => void;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

class Settings extends React.Component<SettingsProps> {
  render() {
    const { user } = this.props;
    const fullName = user?.fullName || 'Ahmed Al-Mansouri';
    const email = user?.email || 'ahmed.almansouri@email.com';
    const avatarUrl = getAvatarUrl(user?.fullName);
    const role = user?.role || 'PATIENT';
    return (
      <div className="bg-gray-50 min-h-screen pb-10">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="text-gray-600 text-2xl"><span className=""><IconWrapper icon={FaArrowLeft} /></span></button>
          <div className="text-center">

            <h1 className="text-3xl font-bold text-cyan-500 mb-2">Settings</h1>
            <p className="text-gray-500 text-lg">Manage your preferences</p>
          </div>
          <button className="text-gray-600 text-3xl mr-3"><span className=""><IconWrapper icon={FaSearch} /></span></button>
        </header>

        {/* Profile Card */}
        <div className='bg-gradient-to-br from-blue-50 to-gray-50 p-6'>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-5 mb-5">
              <div className="relative">
                {/* CHANGED: dynamic avatar */}
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full border-2 border-white flex items-center justify-center">
                  <IconWrapper icon={FaCircleCheck} className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {/* CHANGED: dynamic name and email */}
                <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                <p className="text-gray-500 text-xl">{email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-full text-lg">
                    <span className='w-3 h-3 bg-green-500 rounded-full'></span> Verified
                  </span>
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-lg">
                    <IconWrapper icon={FaCrown} className="text-xl" />
                    {/* CHANGED: dynamic role */}
                    {role === 'ADMIN' ? 'Admin' : role === 'DOCTOR' ? 'Doctor' : 'Premium'}
                  </span>
                </div>
              </div>
              <button className="text-gray-600 text-2xl"><IconWrapper icon={FaEdit} /></button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
              {[{ val: '12', label: 'Sessions' }, { val: '4.9', label: 'Rating' }, { val: '8mo', label: 'Member' }].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-cyan-500 mb-1">{val}</p>
                  <p className="text-gray-500 text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: FaUserPen, bg: 'bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200', iconColor: 'text-blue-500', label: 'Edit Profile', sub: 'Update personal info', path: null },
              { icon: FaShieldHalved, bg: 'bg-white border border-gray-200', iconColor: 'text-gray-800', label: 'Privacy', sub: 'Security settings', path: null },
              { icon: FaWallet, bg: 'bg-gradient-to-b from-purple-50 to-purple-100 border border-purple-200', iconColor: 'text-purple-500', label: 'Payment', sub: 'Cards & billing', path: '/wallet' },
              { icon: MdNotifications, bg: 'bg-gradient-to-b from-orange-50 to-orange-100 border border-orange-200', iconColor: 'text-orange-500', label: 'Notifications', sub: 'Alerts & updates', path: '/notifications', badge: '3' },
            ].map(({ icon, bg, iconColor, label, sub, badge, path }) => (
              <button
                key={label}
                onClick={() => path && this.props.navigate?.(path)}
                className={`${bg} rounded-2xl p-6 flex flex-col items-center text-center relative hover:shadow-lg transition-shadow`}
              >
                {badge && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-lg rounded-full w-8 h-8 flex items-center justify-center font-bold">{badge}</span>}
                <span className={`text-4xl mb-2 ${iconColor}`}><IconWrapper icon={icon} /></span>
                <p className="font-bold text-gray-900 text-xl">{label}</p>
                <p className="text-gray-500 text-lg">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Personal Information</h3>
          <div className="space-y-5">
            {[
              { icon: FaUser, iconClass: 'text-gray-500', label: 'Full Name', sub: fullName },
              { icon: TbMailFilled, iconClass: 'text-gray-500', label: 'Email', sub: email },
              { icon: FaPhone, iconClass: 'text-gray-500', label: 'Phone Number', sub: '+974 5555 1234' },
              { icon: FaCakeCandles, iconClass: 'text-gray-500', label: 'Date of Birth', sub: 'March 15, 1990' },
              { icon: FaVenusMars, iconClass: 'text-gray-500', label: 'Gender', sub: 'Male' },
              { icon: FaLocationDot, iconClass: 'text-gray-500', label: 'Location', sub: 'Doha, Qatar' },
            ].map(({ icon, iconClass, label, sub }) => (
              <SettingRow key={label} icon={icon} iconClass={iconClass} label={label} sub={sub}
                right={<button className="text-blue-500 text-xl font-medium">Edit</button>} />
            ))}
          </div>
        </div>

        {/* Health Profile */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Health Profile</h3>
          <div className="space-y-5">
            {[
              { icon: FaHeartPulse, iconClass: 'text-red-500', label: 'Medical Conditions', sub: 'Lower back issues, Previous sports injury', bg: 'bg-red-50 border border-red-100', btnColor: 'text-red-500' },
              { icon: FaPills, iconClass: 'text-green-500', label: 'Current Medications', sub: 'Ibuprofen 400mg (as needed)', bg: 'bg-green-50 border border-green-100', btnColor: 'text-green-500' },
              { icon: FaHandDots, iconClass: 'text-blue-500', label: 'Allergies', sub: 'None reported', bg: 'bg-blue-50 border border-blue-100', btnColor: 'text-blue-500' },
              { icon: FaDumbbell, iconClass: 'text-purple-500', label: 'Activity Level', sub: 'Moderately active, 3x/week gym', bg: 'bg-purple-50 border border-purple-100', btnColor: 'text-purple-500' },
            ].map(({ icon, iconClass, label, sub, bg, btnColor }) => (
              <SettingRow key={label} icon={icon} iconClass={iconClass} label={label} sub={sub} bg={bg}
                right={<button className={`${btnColor} text-xl font-semibold`}>Update</button>} />
            ))}
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Language & Region</h3>
          <div className="space-y-5">
            <SettingRow icon={FaLanguage} iconClass="text-gray-500" label="App Language" sub="English (US)"
              right={<button className="flex items-center gap-1 text-blue-500 text-xl font-medium">English <IconWrapper icon={FaAngleDown} /></button>} />
            <SettingRow icon={FaGlobe} iconClass="text-gray-500" label="Region" sub="Qatar (QR)"
              right={<button className="flex items-center gap-1 text-blue-500 text-xl font-medium">Qatar <IconWrapper icon={FaAngleDown} /></button>} />
            <SettingRow icon={FaCoins} iconClass="text-gray-500" label="Currency" sub="Qatari Riyal (QAR)"
              right={<button className="flex items-center gap-1 text-blue-500 text-xl font-medium">QAR <IconWrapper icon={FaAngleDown} /></button>} />
            <SettingRow icon={FaClock} iconClass="text-gray-500" label="Time Format" sub="12-hour (AM/PM)"
              right={<Toggle checked={true} />} />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-gray-900">Notification Settings</h3>
            <span className="flex items-center gap-1 bg-red-100 text-red-500 px-3 py-1 rounded-full text-lg font-medium">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></span> 3 New
            </span>
          </div>
          <div className="space-y-5">
            {[
              { icon: MdNotifications, iconClass: 'text-blue-500', label: 'Push Notifications', sub: 'Receive alerts on your device', checked: true },
              { icon: FaCalendarCheck, iconClass: 'text-green-500', label: 'Appointment Reminders', sub: '24h and 1h before sessions', checked: true },
              { icon: FaRobot, iconClass: 'text-purple-500', label: 'AI Health Tips', sub: 'Daily wellness recommendations', checked: true },
              { icon: FaCreditCard, iconClass: 'text-orange-500', label: 'Payment Updates', sub: 'Billing and transaction alerts', checked: true },
              { icon: FaStar, iconClass: 'text-yellow-400', label: 'Session Feedback', sub: 'Rate your therapist after sessions', checked: true },
              { icon: TbMailFilled, iconClass: 'text-blue-400', label: 'Email Notifications', sub: 'Weekly summary and updates', checked: false },
              { icon: FaVolumeHigh, iconClass: 'text-red-500', label: 'Sound & Vibration', sub: 'Audio alerts for notifications', checked: true },
            ].map(({ icon, iconClass, label, sub, checked }) => (
              <SettingRow key={label} icon={icon} iconClass={iconClass} label={label} sub={sub}
                right={<Toggle checked={checked} />} />
            ))}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 text-3xl flex-shrink-0"><IconWrapper icon={IoInformationCircle} /></span>
                <div>
                  <p className="font-bold text-blue-600 text-xl">Notification Schedule</p>
                  <p className="text-blue-500 text-lg">Quiet hours: 10:00 PM - 7:00 AM</p>
                  <p className="text-blue-500 text-lg underline cursor-pointer">Customize schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Privacy & Security</h3>
          <div className="space-y-5">
            <SettingRow icon={FaFingerprint} iconClass="text-blue-500" label="Biometric Login" sub="Use fingerprint or face ID" right={<Toggle checked={true} />} />
            <SettingRow icon={FaLock} iconClass="text-green-500" label="Two-Factor Authentication" sub="Extra security for your account" right={<Toggle checked={true} />} />
            <SettingRow icon={FaEye} iconClass="text-purple-500" label="Data Sharing" sub="Share health insights with providers" right={<Toggle checked={true} />} />
            <SettingRow icon={FaMapLocationDot} iconClass="text-red-500" label="Location Services" sub="Find nearby physiotherapists" right={<Toggle checked={true} />} />
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaKey} iconClass="text-orange-400" label="Change Password" sub="Update your account password" right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaFileShield} iconClass="text-blue-500" label="Privacy Policy" sub="Review how we protect your data" right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>} />
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">App Preferences</h3>
          <div className="space-y-5">
            <SettingRow icon={FaMoon} iconClass="text-blue-800" label="Dark Mode" sub="Switch to dark theme" right={<Toggle checked={false} />} />
            <SettingRow icon={IoMdColorPalette} iconClass="text-pink-500" label="App Theme" sub="Blue & Mint (Default)"
              right={
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  <div className="w-5 h-5 bg-purple-400 rounded-full"></div>
                  <div className="w-5 h-5 bg-orange-400 rounded-full"></div>
                </div>
              } />
            <SettingRow icon={FaTextHeight} iconClass="text-green-500" label="Font Size" sub="Medium (Recommended)"
              right={<button className="flex items-center gap-1 text-blue-500 text-lg font-medium">Medium <IconWrapper icon={FaAngleDown} /></button>} />
            <SettingRow icon={FaCompressArrowsAlt} iconClass="text-blue-500" label="Compact Mode" sub="Show more content on screen" right={<Toggle checked={false} />} />
            <SettingRow icon={FaWifi} iconClass="text-orange-400" label="Auto-Download" sub="Download content on WiFi only" right={<Toggle checked={true} />} />
          </div>
        </div>

        {/* Support & Help */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Support & Help</h3>
          <div className="space-y-5">
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaCircleQuestion} iconClass="text-blue-500" label="FAQ & Help Center" sub="Find answers to common questions" right={<span className="text-gray-400 text-3xl"><button><IconWrapper icon={FaAngleRight} /></button></span>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaHeadset} iconClass="text-green-500" label="Live Chat Support" sub="Chat with our support team"
                right={
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-500 text-lg font-medium"><span className="w-3 h-3 rounded-full mr-1 animate-[colorCycle_2s_ease-in-out_infinite]"></span> Online</span>
                    <span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>
                  </div>
                } />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaPhone} iconClass="text-purple-500" label="Call Support" sub="+974 4000 1234 (24/7)" right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaBug} iconClass="text-red-400" label="Report a Bug" sub="Help us improve the app" right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaStar} iconClass="text-yellow-400" label="Rate the App" sub="Share your experience"
                right={
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-xl" />)}
                    <span className="text-gray-400 text-3xl ml-1"><IconWrapper icon={FaAngleRight} /></span>
                  </div>
                } />
            </button>
          </div>
        </div>

        {/* About & Legal */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">About & Legal</h3>
          <div className="space-y-5">
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={IoInformationCircle} iconClass="text-blue-500" label="About Physio AI" sub="Version 2.1.3 (Build 2103)" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaFileContract} iconClass="text-green-500" label="Terms of Service" sub="User agreement and conditions" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={FaShieldHalved} iconClass="text-purple-500" label="Privacy Policy" sub="How we handle your data" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
            <button className="w-full text-left hover:bg-gray-100 rounded-3xl transition-colors">
              <SettingRow icon={TiStarburst} iconClass="text-orange-400" label="Licenses" sub="Open source acknowledgments" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Data Management</h3>
          <div className="space-y-5">
            <button className="w-full text-left border border-blue-200 rounded-3xl hover:shadow-lg transition-shadow">
              <SettingRow icon={FaDownload} iconClass="text-blue-500" label="Export My Data" sub="Download your health records" bg="bg-blue-50" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
            <button className="w-full text-left border border-yellow-200 rounded-3xl hover:shadow-lg transition-shadow">
              <SettingRow icon={FaSyncAlt} iconClass="text-yellow-500" label="Sync Data" sub="Last sync: 2 hours ago" bg="bg-yellow-50" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
            <button className="w-full text-left border border-red-200 rounded-3xl hover:shadow-lg transition-shadow">
              <SettingRow icon={FaTrashAlt} iconClass="text-red-500" label="Clear Cache" sub="Free up 128 MB of storage" bg="bg-red-50" right={<button className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></button>} />
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Account Actions</h3>
          <div className="space-y-5">

            {/* CHANGED: Sign Out calls onLogout */}
            <button
              onClick={() => this.props.onLogout?.()}
              className="w-full text-left border border-orange-200 rounded-3xl hover:shadow-lg transition-shadow"
            >
              <SettingRow
                icon={FaRightFromBracket}
                iconClass="text-orange-500"
                label="Sign Out"
                sub="Log out from this device"
                bg="bg-orange-50"
                right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>}
              />
            </button>

            {/* Delete Account stays the same */}
            <button className="w-full text-left border border-red-200 rounded-3xl hover:shadow-lg transition-shadow">
              <SettingRow
                icon={FaUserSlash}
                iconClass="text-red-400"
                label="Delete Account"
                sub="Permanently remove your account"
                bg="bg-red-50"
                right={<span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>}
              />
            </button>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex gap-2 mb-1">
                <span className="text-red-500 text-2xl">
                  <IconWrapper icon={FaTriangleExclamation} />
                </span>
                <div className="flex flex-col">
                  <p className="font-bold text-red-600 text-xl">Important Notice</p>
                  <p className="text-red-500 text-lg">
                    Deleting your account will permanently remove all your health data, session history, and cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 p-6 text-center">
          {/* Logo + Name */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-200 rounded-full flex items-center justify-center text-white text-2xl">
              <IconWrapper icon={FaRobot} />
            </div>

            <p className="font-semibold text-3xl bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
              Physio AI
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-gray-500 text-lg">
            Your trusted AI-powered physiotherapy companion
          </p>

          {/* Footer */}
          <p className="text-gray-400 text-lg mt-3">
            Version 2.1.3 <span className="mx-2">•</span> Made in Qatar <span className="mx-2">•</span> © 2024
          </p>
        </div>

      </div>
    );
  }
}

function SettingsWithRouter() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();           
    navigate('/');
  };

  return (
    <Settings
      navigate={navigate}
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default SettingsWithRouter;