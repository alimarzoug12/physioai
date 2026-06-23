import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  FaHome, FaCalendarAlt, FaUsers, FaWallet, FaBell, FaSearch,
  FaRobot, FaChartBar, FaCog, FaSignOutAlt, FaArrowUp, FaArrowDown,
  FaBars, FaSun, FaMoon, FaChevronRight, FaFilter, FaDownload,
  FaUserMd, FaHeartbeat, FaClinicMedical, FaStar, FaEllipsisV,
} from 'react-icons/fa';
import { MdPayment, MdAnalytics, MdMessage } from 'react-icons/md';

// ── Fake data (replace with real API calls) ───────────────────
const revenueData = [
  { month: 'Jan', revenue: 12400, bookings: 48 },
  { month: 'Feb', revenue: 15800, bookings: 62 },
  { month: 'Mar', revenue: 13200, bookings: 51 },
  { month: 'Apr', revenue: 18900, bookings: 74 },
  { month: 'May', revenue: 16700, bookings: 65 },
  { month: 'Jun', revenue: 21300, bookings: 83 },
  { month: 'Jul', revenue: 19800, bookings: 77 },
  { month: 'Aug', revenue: 24100, bookings: 94 },
  { month: 'Sep', revenue: 22600, bookings: 88 },
  { month: 'Oct', revenue: 27400, bookings: 107 },
  { month: 'Nov', revenue: 25800, bookings: 101 },
  { month: 'Dec', revenue: 31200, bookings: 122 },
];

const specialtyData = [
  { name: 'Musculoskeletal', value: 38, color: '#6366f1' },
  { name: 'Sports Medicine',  value: 27, color: '#22d3ee' },
  { name: 'Orthopedic',       value: 18, color: '#f59e0b' },
  { name: 'Neurological',     value: 11, color: '#10b981' },
  { name: 'Rehabilitation',   value: 6,  color: '#f43f5e' },
];

const bookingFlowData = [
  { day: 'Mon', confirmed: 18, cancelled: 3, pending: 5 },
  { day: 'Tue', confirmed: 24, cancelled: 2, pending: 7 },
  { day: 'Wed', confirmed: 16, cancelled: 5, pending: 4 },
  { day: 'Thu', confirmed: 29, cancelled: 1, pending: 9 },
  { day: 'Fri', confirmed: 22, cancelled: 4, pending: 6 },
  { day: 'Sat', confirmed: 31, cancelled: 2, pending: 3 },
  { day: 'Sun', confirmed: 14, cancelled: 6, pending: 2 },
];

const recentBookings = [
  { patient: 'Ahmed Al-Rashid',   doctor: 'Dr. Sarah Hassan',  specialty: 'Musculoskeletal', date: 'Today 10:30', amount: 350, status: 'CONFIRMED' },
  { patient: 'Fatima Al-Zahraa', doctor: 'Dr. Omar Khalil',   specialty: 'Sports Medicine',  date: 'Today 14:00', amount: 420, status: 'PENDING'   },
  { patient: 'Khalid Al-Mansouri',doctor: 'Dr. Amina Nour',   specialty: 'Neurological',    date: 'Today 11:15', amount: 500, status: 'CONFIRMED' },
  { patient: 'Layla Hassan',       doctor: 'Dr. Ahmed Samir',  specialty: 'Orthopedic',      date: 'Today 16:30', amount: 380, status: 'CANCELLED' },
  { patient: 'Sara Al-Ahmad',      doctor: 'Dr. Fatima Zahra', specialty: 'Rehabilitation',  date: 'Today 09:00', amount: 310, status: 'COMPLETED' },
];

const topDoctors = [
  { name: 'Dr. Sarah Hassan',  specialty: 'Musculoskeletal', sessions: 142, rating: 4.9, revenue: 49700 },
  { name: 'Dr. Omar Khalil',   specialty: 'Sports Medicine',  sessions: 128, rating: 4.8, revenue: 53760 },
  { name: 'Dr. Amina Nour',    specialty: 'Neurological',    sessions: 116, rating: 4.9, revenue: 58000 },
  { name: 'Dr. Ahmed Samir',   specialty: 'Orthopedic',      sessions: 109, rating: 4.7, revenue: 41420 },
];

const patientSegments = [
  { label: 'Champions',    count: 124, color: '#f59e0b', icon: '👑', desc: 'Booked 3+ times, recent' },
  { label: 'Loyal',        count: 287, color: '#10b981', icon: '💚', desc: 'Regular patients' },
  { label: 'At Risk',      count:  89, color: '#f43f5e', icon: '⚠️',  desc: 'Inactive 30+ days' },
  { label: 'New',          count: 213, color: '#6366f1', icon: '🆕',  desc: 'Joined this month' },
];

const forecastData = [
  { date: 'Dec 7',  forecast: 28, actual: 26 },
  { date: 'Dec 8',  forecast: 31, actual: 29 },
  { date: 'Dec 9',  forecast: 25, actual: 27 },
  { date: 'Dec 10', forecast: 34, actual: null },
  { date: 'Dec 11', forecast: 29, actual: null },
  { date: 'Dec 12', forecast: 37, actual: null },
  { date: 'Dec 13', forecast: 32, actual: null },
];

// ── Helper components ─────────────────────────────────────────
const Icon = ({ icon: I, className }: { icon: any; className?: string }) => <I className={className} />;

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  PENDING:   'bg-amber-100   text-amber-700',
  CANCELLED: 'bg-red-100     text-red-600',
  COMPLETED: 'bg-indigo-100  text-indigo-700',
};

const KpiCard = ({
  title, value, unit = '', growth, icon, color, bg,
}: {
  title: string; value: string | number; unit?: string;
  growth?: number; icon: any; color: string; bg: string;
}) => (
  <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-white/5 flex flex-col gap-4 hover:border-indigo-500/30 transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{title}</p>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon icon={icon} className={`text-lg ${color}`} />
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-lg text-gray-400 font-normal ml-1">{unit}</span>
      </p>
      {growth !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <Icon icon={growth >= 0 ? FaArrowUp : FaArrowDown} className="text-xs" />
          {Math.abs(growth)}% vs last month
        </div>
      )}
    </div>
  </div>
);

const SidebarItem = ({
  icon, label, active = false, badge, onClick,
}: {
  icon: any; label: string; active?: boolean; badge?: string; onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon icon={icon} className="text-lg flex-shrink-0" />
    <span className="text-sm font-medium flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{badge}</span>
    )}
  </button>
);

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab,  setActiveTab]  = useState('overview');
  const [activeNav,  setActiveNav]  = useState('Dashboard');
  const [sidebarOpen,setSidebarOpen]= useState(true);
  const [darkMode,   setDarkMode]   = useState(true);
  const [period,     setPeriod]     = useState('This Month');

  const navItems = [
    { icon: FaHome,        label: 'Dashboard',   section: 'MAIN' },
    { icon: FaCalendarAlt, label: 'Bookings',    badge: '12' },
    { icon: FaUserMd,      label: 'Doctors' },
    { icon: FaUsers,       label: 'Patients' },
    { icon: MdPayment,     label: 'Payments' },
    { icon: FaWallet,      label: 'Wallet' },
    { icon: MdMessage,     label: 'Chat AI',     section: 'AI & ANALYTICS' },
    { icon: MdAnalytics,   label: 'Analytics' },
    { icon: FaRobot,       label: 'AI Insights' },
    { icon: FaChartBar,    label: 'Reports',     section: 'SETTINGS' },
    { icon: FaCog,         label: 'Settings' },
  ];

  const tabs = ['overview', 'patients', 'doctors', 'ai', 'forecast'];

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden font-sans">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-[#141820] border-r border-white/5 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon icon={FaHeartbeat} className="text-white text-lg" />
          </div>
          {sidebarOpen && (
            <span className="text-white font-bold text-lg tracking-tight">PhysioAI</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <React.Fragment key={item.label}>
              {item.section && sidebarOpen && (
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest px-4 pt-4 pb-2">
                  {item.section}
                </p>
              )}
              <SidebarItem
                icon={item.icon}
                label={sidebarOpen ? item.label : ''}
                active={activeNav === item.label}
                badge={item.badge}
                onClick={() => setActiveNav(item.label)}
              />
            </React.Fragment>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-white/5">
          <SidebarItem icon={FaSignOutAlt} label={sidebarOpen ? 'Sign Out' : ''} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-[#141820] border-b border-white/5 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            <Icon icon={FaBars} className="text-xl" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Icon icon={FaSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search patients, doctors, bookings..."
              className="w-full bg-[#1a1f2e] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span>PhysioAI</span>
              <Icon icon={FaChevronRight} className="text-xs" />
              <span className="text-indigo-400 font-medium">Dashboard</span>
            </div>

            {/* Notification */}
            <button className="relative w-9 h-9 rounded-xl bg-[#1a1f2e] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition">
              <Icon icon={FaBell} className="text-base" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Page title + tabs */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Welcome back — here's what's happening today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-[#1a1f2e] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                <Icon icon={FaFilter} className="text-xs" /> Filter
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 rounded-xl px-4 py-2 text-sm text-white hover:bg-indigo-700 transition">
                <Icon icon={FaDownload} className="text-xs" /> Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#1a1f2e] p-1 rounded-xl w-fit border border-white/5">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ──────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Hero banner + KPIs row */}
              <div className="grid grid-cols-12 gap-4">

                {/* Banner */}
                <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <p className="text-indigo-200 text-sm font-medium mb-2 relative">Platform Status</p>
                  <h2 className="text-white text-2xl font-bold mb-1 relative">All Systems</h2>
                  <h2 className="text-cyan-300 text-2xl font-bold mb-4 relative">Operational ✓</h2>
                  <div className="flex items-center gap-2 mb-4 relative">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-indigo-200 text-sm">AI Assistant · RAG · Payments</p>
                  </div>
                  <button className="bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition relative">
                    View Details →
                  </button>
                </div>

                {/* Balance card */}
                <div className="col-span-12 md:col-span-4 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500" />
                      <div className="w-5 h-5 rounded-full bg-amber-400 -ml-2" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">248,300</p>
                  <p className="text-gray-400 text-sm mb-4">QAR this year</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6">
                    <Icon icon={FaArrowUp} className="text-xs" />
                    <span className="font-semibold">14.2%</span>
                    <span className="text-gray-500">outstanding growth</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition">
                      Analytics
                    </button>
                    <button className="flex-1 bg-white/5 border border-white/10 text-white text-sm py-2.5 rounded-xl font-medium hover:bg-white/10 transition">
                      Export
                    </button>
                  </div>
                </div>

                {/* 4 mini KPIs */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'TOTAL BOOKINGS', value: '1,847',  icon: FaCalendarAlt, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'NEW PATIENTS',   value: '213',    icon: FaUsers,       color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
                    { label: 'AI SESSIONS',    value: '942',    icon: FaRobot,       color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { label: 'AVG VALUE',      value: '342 QAR',icon: FaClinicMedical,color:'text-emerald-400',bg: 'bg-emerald-500/10'},
                  ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="bg-[#1a1f2e] rounded-2xl p-4 border border-white/5">
                      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                        <Icon icon={icon} className={`text-sm ${color}`} />
                      </div>
                      <p className="text-white text-xl font-bold">{value}</p>
                      <p className="text-gray-500 text-xs mt-0.5 uppercase tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-12 gap-4">

                {/* Revenue bar chart */}
                <div className="col-span-12 md:col-span-7 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-semibold text-base">Revenue Report</h3>
                      <p className="text-gray-500 text-sm">Monthly overview</p>
                    </div>
                    <select
                      className="bg-[#0f1117] border border-white/10 text-gray-400 text-sm rounded-xl px-3 py-2 focus:outline-none"
                      value={period}
                      onChange={e => setPeriod(e.target.value)}
                    >
                      {['This Month', 'Last Month', 'This Year'].map(p => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueData} barSize={10}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                      <Tooltip
                        contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff' }}
                        formatter={(v: any) => [`${v.toLocaleString()} QAR`]}
                      />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="bookings" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                      <span className="text-gray-400 text-xs">Revenue (QAR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-cyan-400" />
                      <span className="text-gray-400 text-xs">Bookings</span>
                    </div>
                  </div>
                </div>

                {/* Donut chart */}
                <div className="col-span-12 md:col-span-5 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-base">Specialties</h3>
                      <p className="text-gray-500 text-sm">Booking distribution</p>
                    </div>
                    <button className="text-gray-500 hover:text-white transition">
                      <Icon icon={FaEllipsisV} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={specialtyData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                          {specialtyData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 10, color: '#fff', fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2.5">
                      {specialtyData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                            <span className="text-gray-400 text-xs truncate max-w-[90px]">{item.name}</span>
                          </div>
                          <span className="text-white text-xs font-semibold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking flow + Segments row */}
              <div className="grid grid-cols-12 gap-4">

                {/* Weekly booking flow */}
                <div className="col-span-12 md:col-span-8 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-semibold text-base">Booking Flow</h3>
                      <p className="text-gray-500 text-sm">Confirmed · Cancelled · Pending</p>
                    </div>
                    <select className="bg-[#0f1117] border border-white/10 text-gray-400 text-sm rounded-xl px-3 py-2 focus:outline-none">
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={bookingFlowData}>
                      <defs>
                        <linearGradient id="confirmed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="cancelled" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                      <Area type="monotone" dataKey="confirmed" stroke="#6366f1" fill="url(#confirmed)" strokeWidth={2} />
                      <Area type="monotone" dataKey="cancelled" stroke="#f43f5e" fill="url(#cancelled)" strokeWidth={2} />
                      <Area type="monotone" dataKey="pending"   stroke="#f59e0b" fill="none" strokeDasharray="4 2" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
                    {[
                      { label: 'Confirmed', value: '154', pct: '76%', color: 'text-indigo-400' },
                      { label: 'Cancelled', value: '23',  pct: '11%', color: 'text-red-400'    },
                      { label: 'Pending',   value: '36',  pct: '13%', color: 'text-amber-400'  },
                    ].map(({ label, value, pct, color }) => (
                      <div key={label} className="text-center">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-gray-500 text-xs">{label} · {pct}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient segments */}
                <div className="col-span-12 md:col-span-4 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold text-base mb-1">Patient Segments</h3>
                  <p className="text-gray-500 text-sm mb-5">RFM K-Means Analysis</p>
                  <div className="space-y-3">
                    {patientSegments.map(({ label, count, color, icon, desc }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition">
                        <span className="text-xl">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">{label}</p>
                          <p className="text-gray-500 text-xs truncate">{desc}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ color }}>{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-gray-500 text-xs text-center">
                      Total: <span className="text-white font-semibold">713 patients</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent bookings table */}
              <div className="bg-[#1a1f2e] rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-semibold text-base">Recent Bookings</h3>
                    <p className="text-gray-500 text-sm">Today's appointments</p>
                  </div>
                  <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition">
                    View all →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Patient', 'Doctor', 'Specialty', 'Date', 'Amount', 'Status'].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentBookings.map((b, i) => (
                        <tr key={i} className="hover:bg-white/2 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {b.patient[0]}
                              </div>
                              <span className="text-white text-sm font-medium">{b.patient}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{b.doctor}</td>
                          <td className="px-6 py-4">
                            <span className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                              {b.specialty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{b.date}</td>
                          <td className="px-6 py-4 text-white text-sm font-semibold">{b.amount} QAR</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusColors[b.status]}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── DOCTORS TAB ─────────────────────────────────── */}
          {activeTab === 'doctors' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Doctors',    value: '24',   icon: FaUserMd,       color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Available Today',  value: '18',   icon: FaHeartbeat,    color: 'text-emerald-400',bg: 'bg-emerald-500/10'},
                  { label: 'Slot Utilization', value: '73%',  icon: FaChartBar,     color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
                  { label: 'Avg Rating',       value: '4.82', icon: FaStar,         color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                ].map(c => <KpiCard key={c.label} title={c.label} value={c.value} icon={c.icon} color={c.color} bg={c.bg} />)}
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-white font-semibold">Top Performing Doctors</h3>
                  <p className="text-gray-500 text-sm">Ranked by sessions completed</p>
                </div>
                <div className="divide-y divide-white/5">
                  {topDoctors.map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {doc.name.split(' ')[1][0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{doc.name}</p>
                        <p className="text-gray-500 text-xs">{doc.specialty}</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-white text-sm font-bold">{doc.sessions}</p>
                        <p className="text-gray-500 text-xs">Sessions</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-yellow-400 text-sm font-bold flex items-center gap-1">
                          <Icon icon={FaStar} className="text-xs" /> {doc.rating}
                        </p>
                        <p className="text-gray-500 text-xs">Rating</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 text-sm font-bold">{doc.revenue.toLocaleString()} QAR</p>
                        <p className="text-gray-500 text-xs">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PATIENTS TAB ────────────────────────────────── */}
          {activeTab === 'patients' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard title="Total Patients"     value="713"  icon={FaUsers}     color="text-indigo-400" bg="bg-indigo-500/10"  growth={12.4} />
                <KpiCard title="New This Month"     value="213"  icon={FaArrowUp}   color="text-cyan-400"   bg="bg-cyan-500/10"   growth={8.1}  />
                <KpiCard title="Retention Rate"     value="68%"  icon={FaHeartbeat} color="text-emerald-400"bg="bg-emerald-500/10"              />
                <KpiCard title="Patient LTV"        value="1,847"unit="QAR" icon={FaWallet} color="text-violet-400" bg="bg-violet-500/10" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <KpiCard title="Churn Rate (30d)"      value="12.5%" icon={FaArrowDown} color="text-red-400"   bg="bg-red-500/10"   />
                <KpiCard title="Avg Sessions / Patient" value="2.6"   icon={FaChartBar} color="text-amber-400" bg="bg-amber-500/10" />
              </div>

              {/* Segments grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {patientSegments.map(({ label, count, color, icon, desc }) => (
                  <div key={label} className="bg-[#1a1f2e] rounded-2xl p-6 border border-white/5 text-center">
                    <div className="text-4xl mb-3">{icon}</div>
                    <p className="text-3xl font-bold mb-1" style={{ color }}>{count}</p>
                    <p className="text-white text-sm font-semibold mb-1">{label}</p>
                    <p className="text-gray-500 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── AI TAB ──────────────────────────────────────── */}
          {activeTab === 'ai' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard title="Chat Sessions"    value="942"  icon={MdMessage}    color="text-indigo-400" bg="bg-indigo-500/10"  />
                <KpiCard title="Total Messages"   value="4,831"icon={FaRobot}      color="text-violet-400" bg="bg-violet-500/10"  />
                <KpiCard title="AI Bookings"      value="312"  icon={FaCalendarAlt}color="text-emerald-400"bg="bg-emerald-500/10" />
                <KpiCard title="AI Conversion"    value="33.1" unit="%" icon={FaChartBar} color="text-cyan-400" bg="bg-cyan-500/10" />
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-7 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold mb-1">AI vs Manual Bookings</h3>
                  <p className="text-gray-500 text-sm mb-5">Trend over last 30 days</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueData.slice(-7)} barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="revenue"  fill="#6366f1" radius={[4, 4, 0, 0]} name="AI Bookings" />
                      <Bar dataKey="bookings" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Manual Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="col-span-12 md:col-span-5 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold mb-5">AI Performance</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Symptom Detection', pct: 94, color: '#6366f1' },
                      { label: 'Doctor Matching',   pct: 88, color: '#22d3ee' },
                      { label: 'Booking Completion',pct: 76, color: '#10b981' },
                      { label: 'User Satisfaction', pct: 91, color: '#f59e0b' },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">{label}</span>
                          <span className="text-white font-semibold">{pct}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── FORECAST TAB ────────────────────────────────── */}
          {activeTab === 'forecast' && (
            <>
              <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🔮</div>
                <div>
                  <p className="text-white font-semibold">ARIMA Forecasting Model</p>
                  <p className="text-gray-400 text-sm">Next 7 days booking prediction — trained on 90 days of historical data</p>
                </div>
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-white/5 mb-6">
                <h3 className="text-white font-semibold mb-1">Booking Forecast</h3>
                <p className="text-gray-500 text-sm mb-5">Actual vs Forecasted</p>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                    <Line type="monotone" dataKey="actual"   stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Actual" connectNulls={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: '#6366f1', r: 4 }} name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {forecastData.map((f, i) => (
                  <div key={i} className={`bg-[#1a1f2e] rounded-2xl p-4 border text-center ${
                    f.actual !== null ? 'border-emerald-500/30' : 'border-indigo-500/30'
                  }`}>
                    <p className="text-gray-500 text-xs mb-2">{f.date}</p>
                    <p className={`text-2xl font-bold mb-1 ${f.actual !== null ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {f.actual ?? f.forecast}
                    </p>
                    <p className="text-xs text-gray-600">{f.actual !== null ? 'actual' : 'forecast'}</p>
                    <div className="mt-2 h-1 rounded-full" style={{
                      background: f.actual !== null ? '#10b981' : '#6366f1',
                      opacity: 0.5,
                    }} />
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}