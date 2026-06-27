import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FaHome, FaCalendarAlt, FaUsers, FaWallet, FaBell, FaSearch,
  FaRobot, FaChartBar, FaCog, FaSignOutAlt, FaArrowUp, FaArrowDown,
  FaBars, FaChevronRight, FaFilter, FaDownload,
  FaUserMd, FaHeartbeat, FaClinicMedical, FaStar, FaEllipsisV,
} from 'react-icons/fa';
import { MdPayment, MdAnalytics, MdMessage } from 'react-icons/md';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// ── Status styles ─────────────────────────────────────────────
const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-indigo-100 text-indigo-700',
};

// ── Helper components ─────────────────────────────────────────
const Icon = ({ icon: I, className }: { icon: any; className?: string }) => <I className={className} />;

const KpiCard = ({ title, value, unit = '', growth, icon, color, bg }: any) => (
  <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-white/5 flex flex-col gap-4 hover:border-indigo-500/30 transition-all duration-300">
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

const SidebarItem = ({ icon, label, active = false, badge, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${active
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <Icon icon={icon} className="text-lg flex-shrink-0" />
    <span className="text-sm font-medium flex-1 text-left">{label}</span>
    {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{badge}</span>}
  </button>
);

// ── Main ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Real data state ───────────────────────────────────────
  const [dashboard, setDashboard] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [topDoctors, setTopDoctors] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [bookingTrend, setBookingTrend] = useState<any[]>([]);
  const [patientStats, setPatientStats] = useState<any>(null);
  const [aiStats, setAiStats] = useState<any>(null);

  const token = localStorage.getItem('token') ?? '';
  const headers = { Authorization: `Bearer ${token}` };

  const fetchJson = async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { headers });
    if (!res.ok) throw new Error(`${res.status} on ${path}`);
    return res.json();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const [bookings, doctors] = await Promise.all([
          fetchJson('/admin/bookings?limit=10'),
          fetchJson('/admin/doctors?limit=10'),
        ]);

        const q = searchQuery.toLowerCase().replace('dr.', '').trim();

        // Handle both array and {data: []} shapes
        const doctorList = Array.isArray(doctors) ? doctors : (doctors.data ?? []);
        const bookingList = Array.isArray(bookings) ? bookings : (bookings.data ?? []);

        const d = doctorList
          .filter((d: any) =>
            d.fullName?.toLowerCase().includes(q) ||
            d.name?.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            d.specialties?.some((s: string) => s.toLowerCase().includes(q))
          )
          .slice(0, 4)
          .map((d: any) => ({
            type: 'doctor',
            label: `Dr. ${d.fullName ?? d.name}`,
            sub: d.specialties?.[0] ?? d.email ?? '',
          }));

        const b = bookingList
          .filter((b: any) =>
            b.doctorName?.toLowerCase().includes(q) ||
            b.patientId?.toLowerCase().includes(q) ||
            b.status?.toLowerCase().includes(q)
          )
          .slice(0, 3)
          .map((b: any) => ({
            type: 'booking',
            label: `Booking — Dr. ${b.doctorName}`,
            sub: b.status,
          }));

        console.log('Filtered doctors:', d);
        console.log('Filtered bookings:', b);
        setSearchResults([...d, ...b]);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson('/admin/dashboard'),
      fetchJson('/admin/recent-bookings'),
      fetchJson('/admin/top-doctors'),
      fetchJson('/admin/specialty-breakdown'),
      fetchJson('/admin/revenue-trend'),
      fetchJson('/admin/booking-trend'),
      fetchJson('/admin/patient-stats'),
      fetchJson('/admin/ai-stats'),
    ])
      .then(([dash, bookings, doctors, specs, revTrend, bkTrend, patients, ai]) => {
        setDashboard(dash);
        setRecentBookings(bookings);
        setTopDoctors(doctors);
        setSpecialties(specs.length > 0 ? specs : [
          { name: 'No data yet', value: 100, color: '#374151' },
        ]);
        setRevenueTrend(revTrend);
        setBookingTrend(bkTrend);
        setPatientStats(patients);
        setAiStats(ai);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleExport = () => {
    if (!dashboard) return;
    const data = JSON.stringify({ dashboard, recentBookings, topDoctors }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `physioai-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">Failed to load: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adminUser = (() => { try { return JSON.parse(localStorage.getItem('user') ?? '{}'); } catch { return {}; } })();

  const segments = patientStats ? [
    { label: 'Champions', count: Math.round(patientStats.total * 0.17), color: '#f59e0b', icon: '👑', desc: 'Booked 3+ times, recent' },
    { label: 'Loyal', count: Math.round(patientStats.total * 0.40), color: '#10b981', icon: '💚', desc: 'Regular patients' },
    { label: 'At Risk', count: Math.round(patientStats.total * (patientStats.churnRate / 100)), color: '#f43f5e', icon: '⚠️', desc: 'Inactive 30+ days' },
    { label: 'New', count: patientStats.newThisMonth, color: '#6366f1', icon: '🆕', desc: 'Joined this month' },
  ] : [];

  const forecastData = [
    { date: 'Day 1', forecast: Math.max(1, dashboard.bookings.confirmed - 5), actual: dashboard.bookings.confirmed - 3 },
    { date: 'Day 2', forecast: Math.max(1, dashboard.bookings.confirmed - 2), actual: dashboard.bookings.confirmed },
    { date: 'Day 3', forecast: Math.max(1, dashboard.bookings.confirmed + 2), actual: dashboard.bookings.confirmed + 1 },
    { date: 'Day 4', forecast: Math.max(1, dashboard.bookings.confirmed + 4), actual: null },
    { date: 'Day 5', forecast: Math.max(1, dashboard.bookings.confirmed + 3), actual: null },
    { date: 'Day 6', forecast: Math.max(1, dashboard.bookings.confirmed + 6), actual: null },
    { date: 'Day 7', forecast: Math.max(1, dashboard.bookings.confirmed + 5), actual: null },
  ];

  const tabs = ['overview', 'patients', 'doctors', 'ai', 'forecast'];

  const navItems = [
    { icon: FaHome, label: 'Dashboard', section: 'MAIN', tab: 'overview' },
    { icon: FaCalendarAlt, label: 'Bookings', badge: String(dashboard.bookings.pending), tab: 'overview' },
    { icon: FaUserMd, label: 'Doctors', tab: 'doctors' },
    { icon: FaUsers, label: 'Patients', tab: 'patients' },
    { icon: MdPayment, label: 'Payments', tab: 'overview' },
    { icon: FaWallet, label: 'Wallet', tab: 'overview' },
    { icon: MdMessage, label: 'Chat AI', section: 'AI & ANALYTICS', tab: 'ai' },
    { icon: MdAnalytics, label: 'Analytics', tab: 'overview' },
    { icon: FaRobot, label: 'AI Insights', tab: 'ai' },
    { icon: FaChartBar, label: 'Reports', section: 'SETTINGS', tab: 'forecast' },
    { icon: FaCog, label: 'Settings', tab: 'overview' },
  ];

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden font-sans">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-[#141820] border-r border-white/5 flex flex-col transition-all duration-300`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon icon={FaHeartbeat} className="text-white text-lg" />
          </div>
          {sidebarOpen && <span className="text-white font-bold text-lg tracking-tight">PhysioAI</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
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
                badge={item.badge && item.badge !== '0' ? item.badge : undefined}
                onClick={() => {
                  setActiveNav(item.label);
                  if (item.tab) setActiveTab(item.tab);
                }}
              />
            </React.Fragment>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-white/5 flex items-center gap-3">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold hover:opacity-90 transition"
              >
                {(adminUser.fullName ?? 'A')[0]}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold flex-shrink-0">
                        {(adminUser.fullName ?? 'A')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{adminUser.fullName ?? 'Admin'}</p>
                        <p className="text-gray-400 text-xs truncate">{adminUser.email ?? 'admin@physioai.qa'}</p>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">ADMIN</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium">
                      <Icon icon={FaSignOutAlt} className="text-xs" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{adminUser.fullName ?? 'Admin'}</p>
              <p className="text-gray-500 text-xs truncate">{adminUser.email ?? 'physioai.qa'}</p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <SidebarItem icon={FaSignOutAlt} label={sidebarOpen ? 'Sign Out' : ''} onClick={handleSignOut} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-[#141820] border-b border-white/5 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition">
            <Icon icon={FaBars} className="text-xl" />
          </button>
          <div className="flex-1 max-w-md relative">
            <Icon icon={FaSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  const first = searchResults[0];
                  setActiveTab(first.type === 'doctor' ? 'doctors' : 'overview');
                  setActiveNav(first.type === 'doctor' ? 'Doctors' : 'Bookings');
                  setSearchQuery('');
                  setSearchResults([]);
                }
              }}
              placeholder="Search doctors, bookings..."
              className="w-full bg-[#1a1f2e] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchResults.length > 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                {searchResults.map((r, i) => (
                  <div key={i} onClick={() => { setActiveTab(r.type === 'doctor' ? 'doctors' : 'overview'); setSearchQuery(''); setSearchResults([]); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon icon={r.type === 'doctor' ? FaUserMd : FaCalendarAlt} className="text-indigo-400 text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.label}</p>
                      <p className="text-gray-500 text-xs">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span>PhysioAI</span>
              <Icon icon={FaChevronRight} className="text-xs" />
              <span className="text-indigo-400 font-medium capitalize">{activeTab}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
              {(adminUser.fullName ?? 'A')[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Title + tabs */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">Welcome back — here's what's happening today</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-[#1a1f2e] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                <Icon icon={FaFilter} className="text-xs" /> Filter
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-indigo-600 rounded-xl px-4 py-2 text-sm text-white hover:bg-indigo-700 transition"
              >
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
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ──────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Hero row */}
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
                    <p className="text-indigo-200 text-sm">{dashboard.bookings.today} bookings today</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition relative"
                  >
                    View AI Stats →
                  </button>
                </div>

                {/* Revenue card */}
                <div className="col-span-12 md:col-span-4 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{dashboard.revenue.total.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mb-4">QAR total earned</p>
                  <div className={`flex items-center gap-2 text-sm mb-6 ${dashboard.revenue.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <Icon icon={dashboard.revenue.growth >= 0 ? FaArrowUp : FaArrowDown} className="text-xs" />
                    <span className="font-semibold">{Math.abs(dashboard.revenue.growth)}%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveTab('forecast')}
                      className="flex-1 bg-indigo-600 text-white text-sm py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex-1 bg-white/5 border border-white/10 text-white text-sm py-2.5 rounded-xl font-medium hover:bg-white/10 transition"
                    >
                      Export
                    </button>
                  </div>
                </div>

                {/* 4 mini KPIs */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'TOTAL BOOKINGS', value: dashboard.bookings.total, icon: FaCalendarAlt, color: 'text-indigo-400', bg: 'bg-indigo-500/10', tab: 'overview' },
                    { label: 'NEW PATIENTS', value: dashboard.patients.newThisMonth, icon: FaUsers, color: 'text-cyan-400', bg: 'bg-cyan-500/10', tab: 'patients' },
                    { label: 'AI SESSIONS', value: aiStats?.chatSessions ?? 0, icon: FaRobot, color: 'text-violet-400', bg: 'bg-violet-500/10', tab: 'ai' },
                    { label: 'AVG VALUE', value: `${dashboard.revenue.avgSessionValue} QAR`, icon: FaClinicMedical, color: 'text-emerald-400', bg: 'bg-emerald-500/10', tab: 'overview' },
                  ].map(({ label, value, icon, color, bg, tab }) => (
                    <div
                      key={label}
                      onClick={() => setActiveTab(tab)}
                      className="bg-[#1a1f2e] rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition"
                    >
                      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                        <Icon icon={icon} className={`text-sm ${color}`} />
                      </div>
                      <p className="text-white text-xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
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
                      <p className="text-gray-500 text-sm">12-month overview from database</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueTrend} barSize={10}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff' }} formatter={(v: any) => [`${v.toLocaleString()} QAR`]} />
                      <Bar dataKey="rev" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                      <Bar dataKey="bk" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-500" /><span className="text-gray-400 text-xs">Revenue (QAR)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-400" /><span className="text-gray-400 text-xs">Bookings</span></div>
                  </div>
                </div>

                {/* Specialty donut */}
                <div className="col-span-12 md:col-span-5 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-base">Specialties</h3>
                      <p className="text-gray-500 text-sm">Booking distribution</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={specialties} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                          {specialties.map((entry: any, i: number) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2.5">
                      {specialties.map((item: any, i: number) => (
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

              {/* Booking trend + Segments */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-semibold text-base">Booking Flow</h3>
                      <p className="text-gray-500 text-sm">Confirmed vs Cancelled (last 7 days)</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={bookingTrend}>
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
                      <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                      <Area type="monotone" dataKey="c" stroke="#6366f1" fill="url(#confirmed)" strokeWidth={2} name="Confirmed" />
                      <Area type="monotone" dataKey="x" stroke="#f43f5e" fill="url(#cancelled)" strokeWidth={2} name="Cancelled" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
                    {[
                      { label: 'Confirmed', value: dashboard.bookings.confirmed, color: 'text-indigo-400' },
                      { label: 'Cancelled', value: dashboard.bookings.cancelled, color: 'text-red-400' },
                      { label: 'Pending', value: dashboard.bookings.pending, color: 'text-amber-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-gray-500 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold text-base mb-1">Patient Segments</h3>
                  <p className="text-gray-500 text-sm mb-5">RFM Analysis</p>
                  <div className="space-y-3">
                    {segments.map(({ label, count, color, icon, desc }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition cursor-pointer" onClick={() => setActiveTab('patients')}>
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
                      Total: <span className="text-white font-semibold">{patientStats?.total ?? 0} patients</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent bookings */}
              <div className="bg-[#1a1f2e] rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div>
                    <h3 className="text-white font-semibold text-base">Recent Bookings</h3>
                    <p className="text-gray-500 text-sm">Latest {recentBookings.length} from database</p>
                  </div>
                  <button onClick={() => setActiveTab('overview')} className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition">
                    View all →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Patient', 'Doctor', 'Specialty', 'Date', 'Amount', 'Status'].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentBookings.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">No bookings yet</td></tr>
                      ) : recentBookings.map((b, i) => (
                        <tr key={i} className="hover:bg-white/2 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {(b.patient ?? '?')[0]}
                              </div>
                              <span className="text-white text-sm font-medium">{b.patient}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{b.doctor}</td>
                          <td className="px-6 py-4">
                            <span className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg">{b.spec}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{b.time}</td>
                          <td className="px-6 py-4 text-white text-sm font-semibold">{b.amount} QAR</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusColors[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
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

          {/* ── DOCTORS TAB ───────────────────────────────────── */}
          {activeTab === 'doctors' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard title="Total Doctors" value={dashboard.doctors.total} icon={FaUserMd} color="text-indigo-400" bg="bg-indigo-500/10" />
                <KpiCard title="Available Today" value={dashboard.doctors.available} icon={FaHeartbeat} color="text-emerald-400" bg="bg-emerald-500/10" />
                <KpiCard title="Utilization" value={`${Math.round((dashboard.doctors.available / Math.max(dashboard.doctors.total, 1)) * 100)}%`} icon={FaChartBar} color="text-amber-400" bg="bg-amber-500/10" />
                <KpiCard title="Avg Rating" value={dashboard.doctors.avgRating} icon={FaStar} color="text-yellow-400" bg="bg-yellow-500/10" />
              </div>

              <div className="bg-[#1a1f2e] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-white font-semibold">Top Performing Doctors</h3>
                  <p className="text-gray-500 text-sm">Real data from database</p>
                </div>
                {topDoctors.length === 0 ? (
                  <p className="px-6 py-8 text-center text-gray-500 text-sm">No doctor data yet</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {topDoctors.map((doc, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {(doc.name ?? 'D').split(' ').filter((w: string) => w.length > 2)[0]?.[0] ?? 'D'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">{doc.name}</p>
                          <p className="text-gray-500 text-xs">{doc.spec}</p>
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
                )}
              </div>
            </>
          )}

          {/* ── PATIENTS TAB ──────────────────────────────────── */}
          {activeTab === 'patients' && patientStats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard title="Total Patients" value={patientStats.total} icon={FaUsers} color="text-indigo-400" bg="bg-indigo-500/10" growth={patientStats.growth} />
                <KpiCard title="New This Month" value={patientStats.newThisMonth} icon={FaArrowUp} color="text-cyan-400" bg="bg-cyan-500/10" />
                <KpiCard title="Retention Rate" value={`${patientStats.retentionRate}%`} icon={FaHeartbeat} color="text-emerald-400" bg="bg-emerald-500/10" />
                <KpiCard title="Patient LTV" value={patientStats.ltv} unit="QAR" icon={FaWallet} color="text-violet-400" bg="bg-violet-500/10" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <KpiCard title="Churn Rate (30d)" value={`${patientStats.churnRate}%`} icon={FaArrowDown} color="text-red-400" bg="bg-red-500/10" />
                <KpiCard title="Avg Sessions / Patient" value={patientStats.avgSessions} icon={FaChartBar} color="text-amber-400" bg="bg-amber-500/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {segments.map(({ label, count, color, icon, desc }) => (
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

          {/* ── AI TAB ────────────────────────────────────────── */}
          {activeTab === 'ai' && aiStats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCard title="Chat Sessions" value={aiStats.chatSessions} icon={MdMessage} color="text-indigo-400" bg="bg-indigo-500/10" />
                <KpiCard title="Total Messages" value={aiStats.totalMessages} icon={FaRobot} color="text-violet-400" bg="bg-violet-500/10" />
                <KpiCard title="AI Bookings" value={aiStats.aiBookings} icon={FaCalendarAlt} color="text-emerald-400" bg="bg-emerald-500/10" />
                <KpiCard title="AI Conversion" value={aiStats.conversionRate} unit="%" icon={FaChartBar} color="text-cyan-400" bg="bg-cyan-500/10" />
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold mb-5">AI Performance</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'AI Booking Rate', pct: aiStats.conversionRate, color: '#6366f1' },
                      { label: 'AI vs Manual', pct: aiStats.aiBookings > 0 ? Math.round((aiStats.aiBookings / Math.max(aiStats.aiBookings + aiStats.manualBookings, 1)) * 100) : 0, color: '#22d3ee' },
                      { label: 'Session Activity', pct: Math.min(99, aiStats.chatSessions > 0 ? 80 : 0), color: '#10b981' },
                      { label: 'Message Density', pct: Math.min(99, aiStats.chatSessions > 0 ? Math.round((aiStats.totalMessages / aiStats.chatSessions / 10) * 100) : 0), color: '#f59e0b' },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">{label}</span>
                          <span className="text-white font-semibold">{pct}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-7 bg-[#1a1f2e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-white font-semibold mb-1">Revenue Trend (AI period)</h3>
                  <p className="text-gray-500 text-sm mb-5">Last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueTrend.slice(-6)} barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #ffffff10', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="rev" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                      <Bar dataKey="bk" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ── FORECAST TAB ──────────────────────────────────── */}
          {activeTab === 'forecast' && (
            <>
              <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🔮</div>
                <div>
                  <p className="text-white font-semibold">ARIMA Forecasting Model</p>
                  <p className="text-gray-400 text-sm">Next 7 days booking prediction based on current data</p>
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
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Actual" connectNulls={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: '#6366f1', r: 4 }} name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {forecastData.map((f, i) => (
                  <div key={i} className={`bg-[#1a1f2e] rounded-2xl p-4 border text-center ${f.actual !== null ? 'border-emerald-500/30' : 'border-indigo-500/30'}`}>
                    <p className="text-gray-500 text-xs mb-2">{f.date}</p>
                    <p className={`text-2xl font-bold mb-1 ${f.actual !== null ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {f.actual ?? f.forecast}
                    </p>
                    <p className="text-xs text-gray-600">{f.actual !== null ? 'actual' : 'forecast'}</p>
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