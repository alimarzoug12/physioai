import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaHeart, FaHospital, FaCheck, FaLocationDot, FaPlus,
  FaSun, FaMoon, FaClock, FaWallet, FaCreditCard, FaMobileScreenButton,
  FaMoneyBillWave, FaTag, FaTriangleExclamation, FaStar,
} from 'react-icons/fa6';
import { TiHome } from 'react-icons/ti';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

// ── IconWrapper fixes ALL "cannot be used as JSX component" errors ─
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// ── Types ──────────────────────────────────────────────────────────
interface DoctorInfo {
  id: string;
  fullName: string;
  specialty: string;
  rating: number;
  pricePerSession: number;
  experience: string;
  centerName: string;
  avatarUrl: string;
  isAvailable: boolean;
}

interface TimeSlot {
  time: string;
  status: 'available' | 'booked';
}

interface BookSessionProps {
  navigate?: (path: string | number) => void;
  doctorId?: string;
}

interface BookSessionState {
  // UI state
  selectedDate: string;
  selectedTime: string;
  sessionType: string;
  sessionDuration: string;
  paymentMethod: string;
  showPromo: boolean;
  promoCode: string;
  promoApplied: boolean;
  calendarMonth: string; // "November 2024"
  calendarYear: number;
  calendarMonthIndex: number;
  notes: string;
  agreedTerms: boolean;
  agreedHealth: boolean;
  checkedReqs: string[];
  // DB data
  doctor: DoctorInfo | null;
  loadingDoctor: boolean;
  doctorError: string;
  walletBalance: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// Build calendar cells for a given year/month
function buildCalendar(year: number, month: number): { day: number; faded: boolean }[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { day: number; faded: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, faded: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, faded: false });
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) cells.push({ day: d, faded: true });
  return cells;
}

// ── Main Class ─────────────────────────────────────────────────────
class BookSession extends React.Component<BookSessionProps, BookSessionState> {
  private today = new Date();

  constructor(props: BookSessionProps) {
    super(props);
    const y = this.today.getFullYear();
    const m = this.today.getMonth();
    this.state = {
      selectedDate: this.today.getDate().toString(),
      selectedTime: '10:30 AM',
      sessionType: 'clinic',
      sessionDuration: '60',
      paymentMethod: 'wallet',
      showPromo: false,
      promoCode: '',
      promoApplied: false,
      calendarMonth: MONTH_NAMES[m],
      calendarYear: y,
      calendarMonthIndex: m,
      notes: '',
      agreedTerms: false,
      agreedHealth: false,
      checkedReqs: [],
      doctor: null,
      loadingDoctor: true,
      doctorError: '',
      walletBalance: 450,
    };
  }

  async componentDidMount() {
    const { doctorId } = this.props;
    if (!doctorId) {
      this.setState({ loadingDoctor: false });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/doctors/${doctorId}`);
      if (!res.ok) throw new Error('Doctor not found');
      const data = await res.json();
      this.setState({ doctor: data, loadingDoctor: false });
    } catch (err: any) {
      // Fall back gracefully — show static data
      this.setState({ loadingDoctor: false });
    }
  }

  prevMonth = () => {
    this.setState(prev => {
      const m = prev.calendarMonthIndex === 0 ? 11 : prev.calendarMonthIndex - 1;
      const y = prev.calendarMonthIndex === 0 ? prev.calendarYear - 1 : prev.calendarYear;
      return { calendarMonthIndex: m, calendarYear: y, calendarMonth: MONTH_NAMES[m] };
    });
  };

  nextMonth = () => {
    this.setState(prev => {
      const m = prev.calendarMonthIndex === 11 ? 0 : prev.calendarMonthIndex + 1;
      const y = prev.calendarMonthIndex === 11 ? prev.calendarYear + 1 : prev.calendarYear;
      return { calendarMonthIndex: m, calendarYear: y, calendarMonth: MONTH_NAMES[m] };
    });
  };

  toggleReq = (req: string) => {
    this.setState(prev => {
      const next = prev.checkedReqs.includes(req)
        ? prev.checkedReqs.filter(r => r !== req)
        : [...prev.checkedReqs, req];
      return { checkedReqs: next };
    });
  };

  // ── Computed values ────────────────────────────────────────────
  getSessionFee(): number {
    const { doctor, sessionType, sessionDuration } = this.state;
    const base = doctor?.pricePerSession ?? 200;
    const homeExtra = sessionType === 'home' ? 80 : 0;
    const durationExtra = sessionDuration === '90' ? 100 : 0;
    return base + homeExtra + durationExtra;
  }

  getTotal(): number {
    const fee = this.getSessionFee();
    const platform = 15;
    const discount = this.state.promoApplied && this.state.promoCode ? Math.round(fee * 0.2) : 0;
    return fee + platform - discount;
  }

  // ── Time slots (static for now — can be replaced with API call) ─
  timeSlots = {
    morning:   [
      { time: '9:00 AM',  status: 'available' as const },
      { time: '10:30 AM', status: 'available' as const },
      { time: '11:00 AM', status: 'booked'    as const },
    ],
    afternoon: [
      { time: '2:00 PM',  status: 'available' as const },
      { time: '3:30 PM',  status: 'available' as const },
      { time: '5:00 PM',  status: 'available' as const },
    ],
    evening: [
      { time: '6:30 PM',  status: 'available' as const },
      { time: '7:00 PM',  status: 'available' as const },
      { time: '8:00 PM',  status: 'booked'    as const },
    ],
  };

  render() {
    const {
      selectedDate, selectedTime, sessionType, sessionDuration,
      paymentMethod, showPromo, promoCode, promoApplied,
      calendarMonth, calendarYear, calendarMonthIndex,
      notes, agreedTerms, agreedHealth, checkedReqs,
      doctor, loadingDoctor,
      walletBalance,
    } = this.state;

    // Use real DB data if available, otherwise fall back to static
    const doctorName     = doctor ? `Dr. ${doctor.fullName}` : 'Dr. Sarah Al-Mahmoud';
    const doctorSpecialty = doctor?.specialty ?? 'Musculoskeletal Physiotherapist';
    const doctorRating   = doctor?.rating ?? 4.9;
    const doctorPrice    = doctor?.pricePerSession ?? 200;
    const doctorExp      = doctor?.experience ?? '8 years exp';
    const doctorAvatar   = doctor?.avatarUrl
      ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
    const doctorCenter   = doctor?.centerName ?? 'Al Sadd Medical Center';
    const isOnline       = doctor?.isAvailable ?? true;

    const calendarCells = buildCalendar(calendarYear, calendarMonthIndex);
    const sessionFee    = this.getSessionFee();
    const platformFee   = 15;
    const promoDiscount = promoApplied && promoCode ? Math.round(sessionFee * 0.2) : 0;
    const totalAmount   = sessionFee + platformFee - promoDiscount;
    const canContinue   = selectedDate && selectedTime && agreedTerms && agreedHealth;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-32">

        {/* ── Header ── */}
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="text-gray-700 text-2xl hover:text-gray-800"
          >
            <IconWrapper icon={FaArrowLeft} />
          </button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-cyan-500">Book Session</h1>
            <p className="text-xl text-gray-500">{doctorName}</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 text-2xl">
            <IconWrapper icon={FaHeart} />
          </button>
        </header>

        {/* ── Step Indicator ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {['Date & Time', 'Payment', 'Confirm'].map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    i === 0
                      ? 'bg-gradient-to-br from-blue-500 to-green-300 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>{i + 1}</div>
                  <span className={`text-xl ${i === 0 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Doctor Info ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="relative">
              {loadingDoctor ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <img
                  src={doctorAvatar}
                  alt={doctorName}
                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                />
              )}
              {isOnline && (
                <div
                  className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full"
                  style={{ border: '3px solid white' }}
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{doctorName}</h2>
              <p className="text-gray-500 text-xl">{doctorSpecialty}</p>
              <div className="flex items-center gap-2 mt-1 text-xl text-gray-500 flex-wrap">
                <span className="text-yellow-400"><IconWrapper icon={FaStar} /></span>
                <span>{doctorRating}</span>
                <span className="text-gray-400 ml-1"><IconWrapper icon={FaClock} /></span>
                <span>{doctorExp}</span>
                <span className="text-gray-400 ml-1"><IconWrapper icon={FaLocationDot} /></span>
                <span>1.2 km</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                {doctorPrice} QAR
              </div>
              <div className="text-lg text-gray-500">per session</div>
            </div>
          </div>

          {/* ── Session Type ── */}
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-5">Session Type</h3>
          <div className="space-y-3">
            {/* Clinic */}
            <button
              onClick={() => this.setState({ sessionType: 'clinic' })}
              className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition ${
                sessionType === 'clinic'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-50 flex items-center justify-center text-white text-2xl">
                <IconWrapper icon={FaHospital} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-2xl text-gray-900">Clinic Visit</div>
                <div className="text-xl text-gray-500">Visit our modern clinic facility</div>
                <div className="flex items-center gap-2 text-xl text-gray-400 mt-1">
                  <IconWrapper icon={FaLocationDot} className="text-xl" />
                  <span>{doctorCenter}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl">{doctorPrice} QAR</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${
                  sessionType === 'clinic' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {sessionType === 'clinic' && <IconWrapper icon={FaCheck} className="text-white text-xs" />}
                </div>
              </div>
            </button>

            {/* Home Visit */}
            <button
              onClick={() => this.setState({ sessionType: 'home' })}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                sessionType === 'home'
                  ? 'border-purple-500 bg-purple-50 text-purple-600'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl">
                <IconWrapper icon={TiHome} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-2xl text-gray-900">Home Visit</div>
                <div className="text-xl text-gray-500">Convenient treatment at your location</div>
                <div className="flex items-center gap-2 text-xl text-green-500 mt-1">
                  <IconWrapper icon={FaPlus} className="text-xl" />
                  <span>Travel fee included</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl">{doctorPrice + 80} QAR</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${
                  sessionType === 'home' ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                }`}>
                  {sessionType === 'home' && <IconWrapper icon={FaCheck} className="text-white text-xs" />}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ── Select Date ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
            <div className="flex items-center gap-3">
              <button onClick={this.prevMonth} className="text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowBack} /></span>
              </button>
              <span className="text-xl font-medium text-gray-700">{calendarMonth} {calendarYear}</span>
              <button onClick={this.nextMonth} className="text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowForward} /></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {DAYS.map(day => (
              <div key={day} className="text-gray-400 text-lg font-medium py-2">{day}</div>
            ))}
            {calendarCells.map((item, idx) => (
              <button
                key={idx}
                onClick={() => !item.faded && this.setState({ selectedDate: item.day.toString() })}
                className={`py-5 rounded-xl text-xl font-medium transition ${
                  item.day.toString() === selectedDate && !item.faded
                    ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold'
                    : item.faded
                      ? 'text-gray-300 cursor-default'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.day}
              </button>
            ))}
          </div>
        </div>

        {/* ── Time Slots ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h3>
          {[
            { label: 'Morning',   icon: FaSun,  iconClass: 'text-yellow-400 text-2xl', slots: this.timeSlots.morning   },
            { label: 'Afternoon', icon: FaSun,  iconClass: 'text-orange-400 text-2xl', slots: this.timeSlots.afternoon },
            { label: 'Evening',   icon: FaMoon, iconClass: 'text-indigo-400 text-2xl', slots: this.timeSlots.evening   },
          ].map(({ label, icon, iconClass, slots }) => (
            <div key={label} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={iconClass}><IconWrapper icon={icon} /></span>
                <span className="font-semibold text-gray-800 text-xl">{label}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {slots.map((slot: TimeSlot) => (
                  <button
                    key={slot.time}
                    disabled={slot.status === 'booked'}
                    onClick={() => slot.status !== 'booked' && this.setState({ selectedTime: slot.time })}
                    className={`py-4 rounded-xl text-center transition ${
                      slot.status === 'booked'
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : selectedTime === slot.time
                          ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-xl">{slot.time}</div>
                    <div className="text-lg mt-0.5">{slot.status === 'booked' ? 'Booked' : 'Available'}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Session Duration ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Duration</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 60 min */}
            <button
              onClick={() => this.setState({ sessionDuration: '60' })}
              className={`p-6 border-2 rounded-2xl text-center transition ${
                sessionDuration === '60'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-white'
                  : 'border-gray-100'
              }`}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl bg-gradient-to-br from-blue-500 to-blue-100">
                <IconWrapper icon={FaClock} />
              </div>
              <div className="font-bold text-gray-900 text-2xl">60 Minutes</div>
              <div className="text-xl text-gray-500 mt-1">Standard session</div>
              <div className={`w-7 h-7 rounded-full mx-auto mt-3 flex items-center justify-center ${
                sessionDuration === '60' ? 'bg-blue-500' : 'border-2 border-gray-300'
              }`}>
                {sessionDuration === '60' && <IconWrapper icon={FaCheck} className="text-white text-lg" />}
              </div>
            </button>

            {/* 90 min */}
            <button
              onClick={() => this.setState({ sessionDuration: '90' })}
              className={`p-6 border-2 rounded-2xl text-center transition ${
                sessionDuration === '90'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-white'
                  : 'border-gray-100'
              }`}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl bg-gradient-to-br from-purple-500 to-pink-400">
                <IconWrapper icon={FaClock} />
              </div>
              <div className="font-bold text-gray-900 text-2xl">90 Minutes</div>
              <div className="text-xl text-gray-500 mt-1">Extended session</div>
              <div className="text-green-500 text-xl font-medium mt-1">+100 QAR</div>
              <div className={`w-7 h-7 rounded-full mx-auto mt-2 flex items-center justify-center ${
                sessionDuration === '90' ? 'bg-purple-500' : 'border-2 border-gray-300'
              }`}>
                {sessionDuration === '90' && <IconWrapper icon={FaCheck} className="text-white text-lg" />}
              </div>
            </button>
          </div>
        </div>

        {/* ── Special Requirements ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Special Requirements</h3>
          <div className="space-y-4 mb-6">
            {[
              'Wheelchair accessible facility needed',
              'Arabic translation assistance',
              'Specialized equipment required',
              'Companion/caregiver will attend',
            ].map(req => (
              <label key={req} className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-7 h-7 rounded border-gray-300 accent-blue-500"
                  checked={checkedReqs.includes(req)}
                  onChange={() => this.toggleReq(req)}
                />
                <span className="text-gray-700 text-xl">{req}</span>
              </label>
            ))}
          </div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xl">Additional Notes</h4>
          <textarea
            value={notes}
            onChange={e => this.setState({ notes: e.target.value })}
            className="text-xl w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px] text-gray-600 placeholder-gray-300"
            placeholder="Any specific concerns or requests..."
          />
        </div>

        {/* ── Payment Method ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-5">
            {[
              { id: 'wallet',  icon: FaWallet,              bg: 'bg-green-500',  label: 'Physio AI Wallet',       sub: `Balance: ${walletBalance} QAR` },
              { id: 'card',    icon: FaCreditCard,           bg: 'bg-blue-600',   label: 'Credit/Debit Card',      sub: 'Visa, Mastercard accepted' },
              { id: 'sadad',   icon: FaMobileScreenButton,   bg: 'bg-purple-600', label: 'Sadad Payment',          sub: "Qatar's national payment system" },
              { id: 'cash',    icon: FaMoneyBillWave,        bg: 'bg-gray-800',   label: 'Cash Payment',           sub: 'Pay at the clinic' },
            ].map(method => (
              <label
                key={method.id}
                onClick={() => this.setState({ paymentMethod: method.id })}
                className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === method.id
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-green-50'
                    : 'border-gray-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-full ${method.bg} flex items-center justify-center text-white text-xl`}>
                  <span className="text-2xl"><IconWrapper icon={method.icon} /></span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-2xl">{method.label}</div>
                  <div className="text-xl text-gray-500">{method.sub}</div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === method.id && <IconWrapper icon={FaCheck} className="text-white text-lg" />}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ── Promo Code ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Promo Code</h3>
            <button
              onClick={() => this.setState(prev => ({ showPromo: !prev.showPromo }))}
              className="flex items-center gap-1 text-blue-500 text-xl font-semibold"
            >
              <span className="text-blue-400 text-2xl"><IconWrapper icon={FaTag} /></span> Add Code
            </button>
          </div>
          {showPromo && (
            <div className="mt-3">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => this.setState({ promoCode: e.target.value, promoApplied: false })}
                  placeholder="Enter promo code"
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
                <button
                  onClick={() => promoCode && this.setState({ promoApplied: true })}
                  className="bg-gradient-to-r from-blue-500 to-blue-100 text-white px-7 py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition"
                >
                  Apply
                </button>
              </div>
              {promoApplied && promoCode && (
                <div className="flex items-center gap-2 mt-3 bg-green-50 border-2 border-green-300 rounded-xl p-4">
                  <span className="w-6 h-6 bg-green-500 rounded-full text-white text-lg flex items-center justify-center">
                    <IconWrapper icon={FaCheck} />
                  </span>
                  <span className="text-green-600 text-xl font-medium">{promoCode} applied — 20% discount</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Booking Summary ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 mb-6 space-y-4">
            <div className="flex justify-between text-gray-700 text-xl">
              <span>Session Fee ({sessionDuration} min)</span>
              <span>{sessionFee} QAR</span>
            </div>
            <div className="flex justify-between text-gray-700 text-xl">
              <span>Platform Fee</span>
              <span>{platformFee} QAR</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-500 text-xl">
                <span>Promo Discount ({promoCode})</span>
                <span>-{promoDiscount} QAR</span>
              </div>
            )}
            <div className="border-t border-blue-100 pt-3 flex justify-between font-bold text-2xl">
              <span>Total Amount</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                {totalAmount} QAR
              </span>
            </div>
          </div>
        </div>

        {/* ── Emergency ── */}
        <div className="bg-red-50 p-6 mb-6 flex items-center gap-4 border-b border-gray-100">
          <span className="text-red-500 text-2xl mt-1"><IconWrapper icon={FaTriangleExclamation} /></span>
          <div>
            <p className="text-red-600 font-semibold text-xl">Need immediate medical attention?</p>
            <a href="tel:999" className="text-red-500 underline text-xl">Call Emergency: 999</a>
          </div>
        </div>

        {/* ── Consent Checkboxes ── */}
        <div className="space-y-4 p-6 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-7 h-7 mt-0.5 rounded border-gray-300 accent-blue-500"
              checked={agreedTerms}
              onChange={e => this.setState({ agreedTerms: e.target.checked })}
            />
            <span className="text-xl font-semibold text-gray-600">
              I agree to the <span className="text-blue-500">Terms of Service</span> and{' '}
              <span className="text-blue-500">Privacy Policy</span>. I understand the cancellation
              policy and payment terms.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-7 h-7 mt-0.5 rounded border-gray-300 accent-blue-500"
              checked={agreedHealth}
              onChange={e => this.setState({ agreedHealth: e.target.checked })}
            />
            <span className="text-xl font-semibold text-gray-600">
              I consent to share my health information with the selected physiotherapist for treatment purposes.
            </span>
          </label>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="fixed bottom-0 left-0 right-0 grid grid-cols-2 gap-4 p-6 bg-white border-t border-gray-100 z-50">
          <button
            onClick={() => this.props.navigate?.('/ai-assistant')}
            className="text-xl bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition"
          >
            Back to Chat
          </button>
          <button
            disabled={!canContinue}
            className="text-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </div>

      </div>
    );
  }
}

// ── Router wrapper ─────────────────────────────────────────────────
function BookSessionWithRouter() {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId?: string }>();
  return <BookSession navigate={navigate as any} doctorId={doctorId} />;
}

export default BookSessionWithRouter;