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
  FaHeadset, FaCircleQuestion, FaCheck, FaXmark,
} from 'react-icons/fa6';
import { MdNotifications } from 'react-icons/md';
import { IoInformationCircle } from 'react-icons/io5';
import { TbMailFilled } from 'react-icons/tb';
import { FaSyncAlt, FaCompressArrowsAlt, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';
import { TiStarburst } from 'react-icons/ti';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => <Icon className={className} />;

const Toggle = ({ checked = false, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={checked} onChange={e => onChange?.(e.target.checked)} />
    <div className="w-16 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-8 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-cyan-400" />
  </label>
);

function getAvatarUrl(name?: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=3b82f6&color=fff&size=128`;
}

// ── Region → Currency map ─────────────────────────────────────
const REGION_CURRENCIES: Record<string, string[]> = {
  'Qatar':        ['QAR', 'USD'],
  'Saudi Arabia': ['SAR', 'USD'],
  'UAE':          ['AED', 'USD'],
  'Tunisia':      ['TND', 'USD'],
  'Morocco':      ['MAD', 'USD'],
  'France':       ['EUR', 'USD'],
};

const REGION_DEFAULT_CURRENCY: Record<string, string> = {
  'Qatar':        'QAR',
  'Saudi Arabia': 'SAR',
  'UAE':          'AED',
  'Tunisia':      'TND',
  'Morocco':      'MAD',
  'France':       'EUR',
};

const LANGUAGES = [
  { key: 'English', label: 'English',  flag: '🇺🇸' },
  { key: 'Arabic',  label: 'العربية', flag: '🇸🇦' },
  { key: 'French',  label: 'Français', flag: '🇫🇷' },
];

const REGIONS = Object.keys(REGION_CURRENCIES);

// ── Inline editable field ─────────────────────────────────────
interface InlineFieldProps {
  icon: any;
  iconClass: string;
  label: string;
  value: string;
  type?: string;
  onSave: (val: string) => void;
}

interface InlineFieldState {
  editing: boolean;
  draft: string;
}

class InlineField extends React.Component<InlineFieldProps, InlineFieldState> {
  constructor(props: InlineFieldProps) {
    super(props);
    this.state = { editing: false, draft: props.value };
  }

  startEdit = () => this.setState({ editing: true, draft: this.props.value });
  cancel    = () => this.setState({ editing: false });
  save      = () => { this.props.onSave(this.state.draft); this.setState({ editing: false }); };

  render() {
    const { icon, iconClass, label, type = 'text' } = this.props;
    const { editing, draft } = this.state;

    return (
      <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
        <span className={`text-2xl ${iconClass}`}><IconWrapper icon={icon} /></span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xl mb-1">{label}</p>
          {editing ? (
            <input
              type={type}
              value={draft}
              autoFocus
              onChange={e => this.setState({ draft: e.target.value })}
              className="w-full px-4 py-2 bg-white border-2 border-blue-400 rounded-xl text-xl focus:outline-none"
            />
          ) : (
            <p className="text-gray-500 text-lg">{this.props.value}</p>
          )}
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={this.save}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-lg font-semibold flex items-center gap-1"
            >
              <IconWrapper icon={FaCheck} /> Save
            </button>
            <button
              onClick={this.cancel}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-lg font-semibold flex items-center gap-1"
            >
              <IconWrapper icon={FaXmark} /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={this.startEdit} className="text-blue-500 text-xl font-medium">
            Edit
          </button>
        )}
      </div>
    );
  }
}

// ── Health editable textarea field ────────────────────────────
class InlineTextareaField extends React.Component<InlineFieldProps, InlineFieldState> {
  constructor(props: InlineFieldProps) {
    super(props);
    this.state = { editing: false, draft: props.value };
  }
  startEdit = () => this.setState({ editing: true, draft: this.props.value });
  cancel    = () => this.setState({ editing: false });
  save      = () => { this.props.onSave(this.state.draft); this.setState({ editing: false }); };

  render() {
    const { icon, iconClass, label } = this.props;
    const { editing, draft } = this.state;
    return (
      <div className="flex items-start gap-4 p-5 rounded-3xl bg-gray-50">
        <span className={`text-2xl mt-1 ${iconClass}`}><IconWrapper icon={icon} /></span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xl mb-1">{label}</p>
          {editing ? (
            <textarea
              value={draft}
              autoFocus
              rows={2}
              onChange={e => this.setState({ draft: e.target.value })}
              className="w-full px-4 py-2 bg-white border-2 border-purple-400 rounded-xl text-xl focus:outline-none resize-none"
            />
          ) : (
            <p className="text-gray-500 text-lg">{this.props.value}</p>
          )}
        </div>
        {editing ? (
          <div className="flex flex-col gap-2">
            <button onClick={this.save} className="bg-purple-500 text-white px-4 py-2 rounded-xl text-lg font-semibold flex items-center gap-1">
              <IconWrapper icon={FaCheck} /> Save
            </button>
            <button onClick={this.cancel} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-lg font-semibold flex items-center gap-1">
              <IconWrapper icon={FaXmark} /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={this.startEdit} className="text-purple-500 text-xl font-semibold">Update</button>
        )}
      </div>
    );
  }
}

// ── Main Settings component ───────────────────────────────────
interface Props {
  navigate?: (path: string | number) => void;
  user?: { id: string; email: string; fullName: string; role: string } | null;
  onLogout?: () => void;
}

interface State {
  // Personal info
  fullName: string;
  phone:    string;
  dob:      string;
  gender:   string;
  location: string;
  // Health
  conditions:    string;
  medications:   string;
  allergies:     string;
  activityLevel: string;
  // Language sidebar
  showLanguageSidebar: boolean;
  showRegionSidebar:   boolean;
  showCurrencySidebar: boolean;
  selectedLanguage: string;
  selectedRegion:   string;
  selectedCurrency: string;
  // Change password
  showChangePassword: boolean;
  currentPassword:    string;
  newPassword:        string;
  confirmPassword:    string;
  passwordError:      string;
  passwordSuccess:    boolean;
  // Preferences
  darkMode:     boolean;
  compactMode:  boolean;
  autoDownload: boolean;
  fontSize:     string;
  showFontSidebar: boolean;
}

class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fullName: props.user?.fullName || '',
      phone:    '+974 5555 1234',
      dob:      'March 15, 1990',
      gender:   'Male',
      location: 'Doha, Qatar',
      conditions:    'Lower back issues, Previous sports injury',
      medications:   'Ibuprofen 400mg (as needed)',
      allergies:     'None reported',
      activityLevel: 'Moderately active, 3x/week gym',
      showLanguageSidebar: false,
      showRegionSidebar:   false,
      showCurrencySidebar: false,
      selectedLanguage: 'English',
      selectedRegion:   'Qatar',
      selectedCurrency: 'QAR',
      showChangePassword: false,
      currentPassword:    '',
      newPassword:        '',
      confirmPassword:    '',
      passwordError:      '',
      passwordSuccess:    false,
      darkMode:     false,
      compactMode:  false,
      autoDownload: true,
      fontSize:     'Medium',
      showFontSidebar: false,
    };
  }

  // ── Save to backend ───────────────────────────────────────
  saveField = async (field: string, value: string) => {
    const token = localStorage.getItem('token') ?? '';
    try {
      await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  saveHealthField = async (field: string, value: string) => {
    const token = localStorage.getItem('token') ?? '';
    try {
      await fetch(`${API_URL}/users/health-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (e) {
      console.error('Health save failed:', e);
    }
  };

  handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = this.state;
    if (!currentPassword || !newPassword || !confirmPassword) {
      this.setState({ passwordError: 'Please fill in all fields.' }); return;
    }
    if (newPassword !== confirmPassword) {
      this.setState({ passwordError: 'Passwords do not match.' }); return;
    }
    if (newPassword.length < 6) {
      this.setState({ passwordError: 'Minimum 6 characters.' }); return;
    }
    const token = localStorage.getItem('token') ?? '';
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        this.setState({ passwordError: err.message || 'Incorrect password.' }); return;
      }
      this.setState({ passwordSuccess: true, passwordError: '', currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => this.setState({ showChangePassword: false, passwordSuccess: false }), 2000);
    } catch {
      this.setState({ passwordError: 'Connection error.' });
    }
  };

  // ── When region changes → update currency automatically ───
  handleRegionChange = (region: string) => {
    const defaultCurrency = REGION_DEFAULT_CURRENCY[region] || 'USD';
    this.setState({ selectedRegion: region, selectedCurrency: defaultCurrency, showRegionSidebar: false });
  };

  render() {
    const { user } = this.props;
    const { darkMode, showLanguageSidebar, showRegionSidebar, showCurrencySidebar, showFontSidebar,
            selectedLanguage, selectedRegion, selectedCurrency, showChangePassword } = this.state;
    const email = user?.email || '';
    const role  = user?.role  || 'PATIENT';
    const bg    = darkMode ? 'bg-gray-900' : 'bg-gray-50';
    const card  = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const txt   = darkMode ? 'text-white' : 'text-gray-900';

    const availableCurrencies = REGION_CURRENCIES[selectedRegion] || ['USD'];

    return (
      <div className={`min-h-screen pb-10 ${bg}`}>

        {/* ── SIDEBAR: Language ─────────────────────────────── */}
        {showLanguageSidebar && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => this.setState({ showLanguageSidebar: false })} />
            <div className="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Language</h2>
                <button onClick={() => this.setState({ showLanguageSidebar: false })}>
                  <IconWrapper icon={FaXmark} className="text-gray-500 text-3xl" />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                {LANGUAGES.map(({ key, label, flag }) => (
                  <button
                    key={key}
                    onClick={() => { this.setState({ selectedLanguage: key, showLanguageSidebar: false }); }}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-xl transition ${
                      selectedLanguage === key
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{flag}&nbsp;&nbsp;{label}</span>
                    {selectedLanguage === key && <IconWrapper icon={FaCheck} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── SIDEBAR: Region ───────────────────────────────── */}
        {showRegionSidebar && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => this.setState({ showRegionSidebar: false })} />
            <div className="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Region</h2>
                <button onClick={() => this.setState({ showRegionSidebar: false })}>
                  <IconWrapper icon={FaXmark} className="text-gray-500 text-3xl" />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => this.handleRegionChange(region)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-xl transition ${
                      selectedRegion === region
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{region}</span>
                    {selectedRegion === region && <IconWrapper icon={FaCheck} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── SIDEBAR: Currency ─────────────────────────────── */}
        {showCurrencySidebar && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => this.setState({ showCurrencySidebar: false })} />
            <div className="fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Currency</h2>
                <p className="text-gray-400 text-lg">For region: {selectedRegion}</p>
                <button onClick={() => this.setState({ showCurrencySidebar: false })}>
                  <IconWrapper icon={FaXmark} className="text-gray-500 text-3xl" />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                {availableCurrencies.map(cur => (
                  <button
                    key={cur}
                    onClick={() => this.setState({ selectedCurrency: cur, showCurrencySidebar: false })}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-xl transition ${
                      selectedCurrency === cur
                        ? 'bg-green-50 border-green-400 text-green-700 font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{cur}</span>
                    {selectedCurrency === cur && <IconWrapper icon={FaCheck} className="text-green-500" />}
                  </button>
                ))}
              </div>
              <div className="p-5 border-t bg-blue-50">
                <p className="text-blue-600 text-lg text-center">
                  💡 Currency auto-set from your region. You can also choose USD.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── SIDEBAR: Font Size ────────────────────────────── */}
        {showFontSidebar && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => this.setState({ showFontSidebar: false })} />
            <div className="fixed top-0 right-0 h-full w-64 z-50 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Font Size</h2>
                <button onClick={() => this.setState({ showFontSidebar: false })}>
                  <IconWrapper icon={FaXmark} className="text-gray-500 text-3xl" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                {['Small', 'Medium', 'Large'].map(f => (
                  <button
                    key={f}
                    onClick={() => this.setState({ fontSize: f, showFontSidebar: false })}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition ${
                      this.state.fontSize === f
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                    style={{ fontSize: f === 'Small' ? 14 : f === 'Large' ? 20 : 17 }}
                  >
                    <span>{f}</span>
                    {this.state.fontSize === f && <IconWrapper icon={FaCheck} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── MODAL: Change Password ────────────────────────── */}
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="bg-white w-full rounded-t-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <button onClick={() => this.setState({ showChangePassword: false, passwordError: '' })}>
                  <IconWrapper icon={FaXmark} className="text-gray-500 text-3xl" />
                </button>
              </div>
              {this.state.passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
                  <IconWrapper icon={FaCheck} className="text-green-500 text-2xl" />
                  <p className="text-green-700 text-xl">Password changed successfully!</p>
                </div>
              )}
              {this.state.passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-red-500 text-lg">{this.state.passwordError}</p>
                </div>
              )}
              {[
                { label: 'Current Password', key: 'currentPassword', placeholder: 'Enter current password' },
                { label: 'New Password',     key: 'newPassword',     placeholder: 'At least 6 characters' },
                { label: 'Confirm Password', key: 'confirmPassword', placeholder: 'Repeat new password' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="mb-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type="password"
                    value={(this.state as any)[key]}
                    onChange={e => this.setState({ [key]: e.target.value, passwordError: '' } as any)}
                    placeholder={placeholder}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button onClick={this.handleChangePassword} className="w-full bg-blue-500 text-white py-4 rounded-2xl text-xl font-semibold mt-2">
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* ── Header ───────────────────────────────────────── */}
        <header className={`border-b p-6 flex items-center justify-between sticky top-0 z-10 ${card}`}>
          <button onClick={() => this.props.navigate?.(-1)} className="text-gray-600 text-2xl">
            <IconWrapper icon={FaArrowLeft} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-1">Settings</h1>
            <p className="text-gray-500 text-lg">Manage your preferences</p>
          </div>
          <button className="text-gray-600 text-3xl mr-3"><IconWrapper icon={FaSearch} /></button>
        </header>

        {/* ── Profile Card ──────────────────────────────────── */}
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-gray-50'}`}>
          <div className={`rounded-2xl border p-6 ${card}`}>
            <div className="flex items-center gap-5 mb-5">
              <div className="relative">
                <img src={getAvatarUrl(this.state.fullName)} alt={this.state.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                  <IconWrapper icon={FaCircleCheck} className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${txt}`}>{this.state.fullName}</h2>
                <p className="text-gray-500 text-xl">{email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-full text-lg">
                    <span className='w-3 h-3 bg-green-500 rounded-full' /> Verified
                  </span>
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-lg">
                    <IconWrapper icon={FaCrown} />
                    {role === 'ADMIN' ? 'Admin' : role === 'DOCTOR' ? 'Doctor' : 'Premium'}
                  </span>
                </div>
              </div>
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

        {/* ── Personal Information — inline editing ─────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>Personal Information</h3>
          <div className="space-y-4">
            <InlineField icon={FaUser}        iconClass="text-gray-500" label="Full Name"     value={this.state.fullName}
              onSave={v => { this.setState({ fullName: v }); this.saveField('fullName', v); }} />
            {/* Email — read only */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={TbMailFilled} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Email</p>
                <p className="text-gray-500 text-lg">{email}</p>
              </div>
              <span className="text-gray-400 text-lg">Read only</span>
            </div>
            <InlineField icon={FaPhone}       iconClass="text-gray-500" label="Phone Number"  value={this.state.phone}    type="tel"
              onSave={v => { this.setState({ phone: v }); this.saveField('phone', v); }} />
            <InlineField icon={FaCakeCandles} iconClass="text-gray-500" label="Date of Birth" value={this.state.dob}
              onSave={v => { this.setState({ dob: v }); this.saveField('dateOfBirth', v); }} />
            <InlineField icon={FaLocationDot} iconClass="text-gray-500" label="Location"      value={this.state.location}
              onSave={v => { this.setState({ location: v }); this.saveField('location', v); }} />
            {/* Gender selector inline */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={FaVenusMars} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl mb-2">Gender</p>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      onClick={() => { this.setState({ gender: g }); this.saveField('gender', g); }}
                      className={`px-4 py-2 rounded-xl text-lg border transition ${
                        this.state.gender === g
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Health Profile — inline editing ───────────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>Health Profile</h3>
          <div className="space-y-4">
            <InlineTextareaField icon={FaHeartPulse} iconClass="text-red-500"    label="Medical Conditions"  value={this.state.conditions}
              onSave={v => { this.setState({ conditions: v }); this.saveHealthField('conditions', v); }} />
            <InlineTextareaField icon={FaPills}      iconClass="text-green-500"  label="Current Medications" value={this.state.medications}
              onSave={v => { this.setState({ medications: v }); this.saveHealthField('medications', v); }} />
            <InlineTextareaField icon={FaHandDots}   iconClass="text-blue-500"   label="Allergies"           value={this.state.allergies}
              onSave={v => { this.setState({ allergies: v }); this.saveHealthField('allergies', v); }} />
            {/* Activity level selector */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-purple-500"><IconWrapper icon={FaDumbbell} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl mb-2">Activity Level</p>
                <div className="flex gap-2 flex-wrap">
                  {['Low', 'Moderate', 'High'].map(level => (
                    <button
                      key={level}
                      onClick={() => { this.setState({ activityLevel: level }); this.saveHealthField('activityLevel', level); }}
                      className={`px-4 py-2 rounded-xl text-lg border transition ${
                        this.state.activityLevel === level
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Language & Region ─────────────────────────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>Language & Region</h3>
          <div className="space-y-4">
            {/* Language */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={FaLanguage} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">App Language</p>
                <p className="text-gray-500 text-lg">{LANGUAGES.find(l => l.key === selectedLanguage)?.label}</p>
              </div>
              <button
                onClick={() => this.setState({ showLanguageSidebar: true })}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-lg font-medium border border-blue-200"
              >
                {LANGUAGES.find(l => l.key === selectedLanguage)?.flag}&nbsp;Change
              </button>
            </div>
            {/* Region */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={FaGlobe} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Region</p>
                <p className="text-gray-500 text-lg">{selectedRegion}</p>
              </div>
              <button
                onClick={() => this.setState({ showRegionSidebar: true })}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-lg font-medium border border-blue-200"
              >
                Change
              </button>
            </div>
            {/* Currency */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={FaCoins} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Currency</p>
                <p className="text-gray-500 text-lg">{selectedCurrency} — auto from {selectedRegion}</p>
              </div>
              <button
                onClick={() => this.setState({ showCurrencySidebar: true })}
                className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-lg font-medium border border-green-200"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-gray-500"><IconWrapper icon={FaClock} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Time Format</p>
                <p className="text-gray-500 text-lg">12-hour (AM/PM)</p>
              </div>
              <Toggle checked={true} />
            </div>
          </div>
        </div>

        {/* ── App Preferences ───────────────────────────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>App Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-blue-800"><IconWrapper icon={FaMoon} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Dark Mode</p>
                <p className="text-gray-500 text-lg">{darkMode ? 'Dark theme active' : 'Light theme active'}</p>
              </div>
              <Toggle checked={darkMode} onChange={v => this.setState({ darkMode: v })} />
            </div>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-green-500"><IconWrapper icon={FaTextHeight} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Font Size</p>
                <p className="text-gray-500 text-lg">{this.state.fontSize}</p>
              </div>
              <button
                onClick={() => this.setState({ showFontSidebar: true })}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-lg font-medium border border-gray-200"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-blue-500"><IconWrapper icon={FaCompressArrowsAlt} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Compact Mode</p>
                <p className="text-gray-500 text-lg">Show more content on screen</p>
              </div>
              <Toggle checked={this.state.compactMode} onChange={v => this.setState({ compactMode: v })} />
            </div>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
              <span className="text-2xl text-orange-400"><IconWrapper icon={FaWifi} /></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">Auto-Download</p>
                <p className="text-gray-500 text-lg">Download content on WiFi only</p>
              </div>
              <Toggle checked={this.state.autoDownload} onChange={v => this.setState({ autoDownload: v })} />
            </div>
          </div>
        </div>

        {/* ── Privacy & Security ────────────────────────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>Privacy & Security</h3>
          <div className="space-y-4">
            {[
              { icon: FaFingerprint,    iconClass: 'text-blue-500',   label: 'Biometric Login',           sub: 'Use fingerprint or face ID',          checked: true },
              { icon: FaLock,           iconClass: 'text-green-500',  label: 'Two-Factor Authentication', sub: 'Extra security for your account',     checked: true },
              { icon: FaEye,            iconClass: 'text-purple-500', label: 'Data Sharing',              sub: 'Share health insights with providers', checked: true },
              { icon: FaMapLocationDot, iconClass: 'text-red-500',    label: 'Location Services',         sub: 'Find nearby physiotherapists',         checked: true },
            ].map(({ icon, iconClass, label, sub, checked }) => (
              <div key={label} className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50">
                <span className={`text-2xl ${iconClass}`}><IconWrapper icon={icon} /></span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xl">{label}</p>
                  <p className="text-gray-500 text-lg">{sub}</p>
                </div>
                <Toggle checked={checked} />
              </div>
            ))}
            <button
              onClick={() => this.setState({ showChangePassword: true })}
              className="w-full flex items-center gap-4 p-5 rounded-3xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-2xl text-orange-400"><IconWrapper icon={FaKey} /></span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-xl">Change Password</p>
                <p className="text-gray-500 text-lg">Update your account password</p>
              </div>
              <span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>
            </button>
          </div>
        </div>

        {/* ── Account Actions ───────────────────────────────── */}
        <div className={`p-6 border-b ${card}`}>
          <h3 className={`text-2xl font-bold mb-5 ${txt}`}>Account Actions</h3>
          <div className="space-y-4">
            <button onClick={() => this.props.onLogout?.()} className="w-full flex items-center gap-4 p-5 rounded-3xl bg-orange-50 border border-orange-200 hover:shadow-lg transition">
              <span className="text-2xl text-orange-500"><IconWrapper icon={FaRightFromBracket} /></span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-xl">Sign Out</p>
                <p className="text-gray-500 text-lg">Log out from this device</p>
              </div>
              <span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>
            </button>
            <button className="w-full flex items-center gap-4 p-5 rounded-3xl bg-red-50 border border-red-200 hover:shadow-lg transition">
              <span className="text-2xl text-red-400"><IconWrapper icon={FaUserSlash} /></span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-xl">Delete Account</p>
                <p className="text-gray-500 text-lg">Permanently remove your account</p>
              </div>
              <span className="text-gray-400 text-3xl"><IconWrapper icon={FaAngleRight} /></span>
            </button>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex gap-2">
                <span className="text-red-500 text-2xl"><IconWrapper icon={FaTriangleExclamation} /></span>
                <div>
                  <p className="font-bold text-red-600 text-xl">Important Notice</p>
                  <p className="text-red-500 text-lg">Deleting your account will permanently remove all your health data and cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className={`p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-200 rounded-full flex items-center justify-center text-white text-2xl">
              <IconWrapper icon={FaRobot} />
            </div>
            <p className="font-semibold text-3xl bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">Physio AI</p>
          </div>
          <p className="text-gray-500 text-lg">Your trusted AI-powered physiotherapy companion</p>
          <p className="text-gray-400 text-lg mt-3">Version 2.1.3 • Made in Qatar • © 2024</p>
        </div>
      </div>
    );
  }
}

function SettingsWithRouter() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <Settings
      navigate={navigate as any}
      user={user}
      onLogout={() => { logout(); navigate('/'); }}
    />
  );
}

export default SettingsWithRouter;