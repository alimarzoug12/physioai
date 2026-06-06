import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaHeart, FaHospital, FaCheck, FaLocationDot, FaPlus,
  FaSun, FaMoon, FaClock, FaWallet, FaCreditCard, FaMobileScreenButton,
  FaMoneyBillWave, FaTag, FaTriangleExclamation, FaStar,
} from 'react-icons/fa6';
import { TiHome } from 'react-icons/ti';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { api } from '../services/api';
import { paymentsApi } from '../services/payments';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ──────────────────────────────────────────────────────────
interface DoctorInfo {
  id: string;
  fullName: string;
  specialty: string;
  rating: number;
  pricePerSession: number;
  experience: string;
  centerName: string;
  centerCity: string;
  avatarUrl: string;
  isAvailable: boolean;
  currency?: string;
}

interface SlotData {
  id: string;
  time: string;
  endTime: string;
  status: 'available' | 'booked';
  period: 'morning' | 'afternoon' | 'evening';
}

interface PromoResult {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  label?: string;
  message?: string;
}

interface WalletData {
  balance: number;
  currency: string;
}

interface State {
  resolvedDoctorId: string;
  // Doctor
  doctor: DoctorInfo | null;
  loadingDoctor: boolean;
  // Slots
  slots: SlotData[];
  loadingSlots: boolean;
  // Wallet
  wallet: WalletData | null;
  // Promo
  promoResult: PromoResult | null;
  promoLoading: boolean;
  // UI selections
  selectedDate: Date;
  selectedSlotId: string;
  selectedSlotTime: string;
  sessionType: 'clinic' | 'home';
  sessionDuration: '60' | '90';
  paymentMethod: string;
  showPromo: boolean;
  promoCode: string;
  notes: string;
  agreedTerms: boolean;
  agreedHealth: boolean;
  checkedReqs: string[];
  // Calendar nav
  calendarYear: number;
  calendarMonthIndex: number;
  // Submission
  submitting: boolean;
  submitError: string;
  submitSuccess: boolean;
  homeAddress: string;
  addressError: string;
  patientLat: number | null;
  patientLon: number | null;
  travelFeeEstimate: number | null;
  distanceEstimate: number | null;
  detectingLocation: boolean;
}

interface Props {
  navigate?: (path: string | number) => void;
  doctorId?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function buildCalendar(year: number, month: number) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { day: number; faded: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, faded: true });
  for (let d = 1; d <= daysInMonth; d++)   cells.push({ day: d, faded: false });
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) cells.push({ day: d, faded: true });
  return cells;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getPeriod(timeStr: string): 'morning' | 'afternoon' | 'evening' {
  // handles "10:00 AM", "2:30 PM", "09:00", "14:30"
  const upper = timeStr.toUpperCase();

  if (upper.includes('AM')) {
    const hour = parseInt(timeStr);
    return hour < 12 ? 'morning' : 'morning';
  }

  if (upper.includes('PM')) {
    const hour = parseInt(timeStr);
    if (hour === 12 || hour < 5) return 'afternoon';
    return 'evening';
  }

  // 24-hour format fallback
  const hour = parseInt(timeStr.split(':')[0]);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// ── Component ──────────────────────────────────────────────────────
class BookSession extends React.Component<Props, State> {
  private today = new Date();

  constructor(props: Props) {
    super(props);
    this.state = {
      resolvedDoctorId: '',
      doctor: null,
      loadingDoctor: true,
      slots: [],
      loadingSlots: false,
      wallet: null,
      promoResult: null,
      promoLoading: false,
      selectedDate: this.today,
      selectedSlotId: '',
      selectedSlotTime: '',
      sessionType: 'clinic',
      sessionDuration: '60',
      paymentMethod: 'wallet',
      showPromo: false,
      promoCode: '',
      notes: '',
      agreedTerms: false,
      agreedHealth: false,
      checkedReqs: [],
      calendarYear: this.today.getFullYear(),
      calendarMonthIndex: this.today.getMonth(),
      submitting: false,
      submitError: '',
      submitSuccess: false,
      homeAddress: '',
      addressError: '',
      patientLat: null,
      patientLon: null,
      travelFeeEstimate: null,
      distanceEstimate: null,
      detectingLocation: false,
    };
  }

  async componentDidMount() {
    let doctorId = this.props.doctorId ?? '';

    if (!doctorId) {
      try {
        const result = await api.getDoctors();
        const doctors = result?.doctors ?? result;
        if (doctors?.length > 0) doctorId = doctors[0].id;
      } catch { }
    }

    const token = localStorage.getItem('token') ?? '';
    const [doctorData, walletData] = await Promise.all([
      doctorId ? api.getDoctorById(doctorId).catch(() => null) : Promise.resolve(null),
      api.getWallet(token).catch(() => null),
    ]);

    this.setState(
      { doctor: doctorData, wallet: walletData, loadingDoctor: false, resolvedDoctorId: doctorId },
      () => { if (doctorId) this.loadSlotsForDate(this.today); }
    );
  }

  // loadSlotsForDate = async (date: Date) => {
  //   const doctorId = this.props.doctorId || this.state.resolvedDoctorId;
  //   if (!doctorId) {
  //     console.error('❌ No doctorId available');
  //     return;
  //   }

  //   const dateStr = toDateString(date.getFullYear(), date.getMonth(), date.getDate());
  //   this.setState({ loadingSlots: true, selectedSlotId: '', selectedSlotTime: '' });

  //   try {
  //     const token = localStorage.getItem('token') ?? '';
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/doctors/${doctorId}/slots?date=${dateStr}`,
  //       { headers: { 'Authorization': `Bearer ${token}` } }
  //     );

  //     console.log('Slots response:', response.status, 'for date:', dateStr);

  //     if (!response.ok) { this.setState({ slots: [], loadingSlots: false }); return; }

  //     const rawSlots = await response.json();
  //     console.log('Raw slots:', rawSlots);

  //     const slots: SlotData[] = (rawSlots || []).map((slot: any) => {
  //       const timeStr = slot.startTime || slot.time || '';
  //       return {
  //         id: slot.id,
  //         time: timeStr,
  //         endTime: slot.endTime || '',
  //         status: slot.isBooked ? 'booked' : 'available',
  //         period: getPeriod(timeStr),
  //       };
  //     });

  //     this.setState({ slots, loadingSlots: false });
  //   } catch (err) {
  //     console.error('Slots error:', err);
  //     this.setState({ slots: [], loadingSlots: false });
  //   }
  // };

  loadSlotsForDate = async (date: Date) => {
    const doctorId = this.props.doctorId || this.state.resolvedDoctorId;
    if (!doctorId) return;

    const dateStr = toDateString(date.getFullYear(), date.getMonth(), date.getDate());
    this.setState({ loadingSlots: true, selectedSlotId: '', selectedSlotTime: '' });

    try {
      const rawSlots = await api.getSlotsForDate(doctorId, dateStr);
      const slots: SlotData[] = (rawSlots || []).map((slot: any) => {
        const timeStr = slot.startTime || slot.time || '';
        return {
          id: slot.id,
          time: timeStr,
          endTime: slot.endTime || '',
          status: slot.isBooked ? 'booked' : 'available',
          period: getPeriod(timeStr),
        };
      });
      this.setState({ slots, loadingSlots: false });
    } catch (err) {
      console.error('Slots error:', err);
      this.setState({ slots: [], loadingSlots: false });
    }
  };

  selectDate = (day: number) => {
    const { calendarYear, calendarMonthIndex } = this.state;
    const date = new Date(calendarYear, calendarMonthIndex, day);
    this.setState({ selectedDate: date }, () => this.loadSlotsForDate(date));
  };

  prevMonth = () => {
    this.setState(prev => {
      const m = prev.calendarMonthIndex === 0 ? 11 : prev.calendarMonthIndex - 1;
      const y = prev.calendarMonthIndex === 0 ? prev.calendarYear - 1 : prev.calendarYear;
      return { calendarMonthIndex: m, calendarYear: y };
    });
  };

  nextMonth = () => {
    this.setState(prev => {
      const m = prev.calendarMonthIndex === 11 ? 0 : prev.calendarMonthIndex + 1;
      const y = prev.calendarMonthIndex === 11 ? prev.calendarYear + 1 : prev.calendarYear;
      return { calendarMonthIndex: m, calendarYear: y };
    });
  };

  toggleReq = (req: string) => {
    this.setState(prev => ({
      checkedReqs: prev.checkedReqs.includes(req)
        ? prev.checkedReqs.filter(r => r !== req)
        : [...prev.checkedReqs, req],
    }));
  };

  applyPromo = async () => {
    const { promoCode } = this.state;
    if (!promoCode.trim()) return;
    this.setState({ promoLoading: true });
    try {
      const result = await api.validatePromo(promoCode.trim());
      this.setState({ promoResult: result, promoLoading: false });
    } catch {
      this.setState({ promoResult: { valid: false, message: 'Could not validate code' }, promoLoading: false });
    }
  };

  detectLocation = () => {
    if (!navigator.geolocation) {
      this.setState({ addressError: 'Geolocation not supported by your browser' });
      return;
    }
    this.setState({ detectingLocation: true });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        this.setState({ patientLat: lat, patientLon: lon });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          this.setState({ homeAddress: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
        } catch {
          this.setState({ homeAddress: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
        }
        await this.estimateTravelFee(lat, lon);
        this.setState({ detectingLocation: false });
      },
      () => {
        this.setState({
          detectingLocation: false,
          addressError: 'Could not get your location. Please enter your address manually.',
        });
      },
      { timeout: 10000 }
    );
  };

  estimateTravelFee = async (lat: number, lon: number) => {
    const { doctor } = this.state;
    if (!doctor) return;
    try {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/bookings/estimate-travel-fee`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ doctorId: doctor.id, latitude: lat, longitude: lon }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        this.setState({ travelFeeEstimate: data.travelFee, distanceEstimate: data.distanceKm });
      }
    } catch { }
  };

  // ── Pricing ────────────────────────────────────────────────────
  getSessionFee(): number {
    const { doctor, sessionType, sessionDuration, travelFeeEstimate } = this.state;
    const base = doctor?.pricePerSession ?? 200;
    const homeExtra = sessionType === 'home' ? (travelFeeEstimate ?? 80) : 0;
    const durExtra = sessionDuration === '90' ? 100 : 0;
    return base + homeExtra + durExtra;
  }

  getPlatformFee(): number { return 15; }

  getDiscount(): number {
    const { promoResult } = this.state;
    if (!promoResult?.valid || !promoResult.discountPercent) return 0;
    return Math.round(this.getSessionFee() * promoResult.discountPercent / 100);
  }

  getTotal(): number {
    return this.getSessionFee() + this.getPlatformFee() - this.getDiscount();
  }

  // ── Submit ─────────────────────────────────────────────────────
  // Replace handleSubmit in BookSession.tsx

  // handleSubmit = async () => {
  //   const {
  //     doctor, selectedSlotId, sessionType, sessionDuration,
  //     paymentMethod, promoResult, notes, checkedReqs,
  //   } = this.state;
  //   if (!doctor || !selectedSlotId) return;

  //   // ✅ get token here (used below)
  //   const token = localStorage.getItem('token') ?? '';
  //   this.setState({ submitting: true, submitError: '' });

  //   try {
  //     // ✅ pass token as second argument
  //     const booking = await api.createBooking({
  //       doctorId: doctor.id,
  //       slotId: selectedSlotId,
  //       sessionType: sessionType === 'clinic' ? 'CLINIC' : 'HOME_VISIT',
  //       durationMinutes: parseInt(sessionDuration, 10),
  //       paymentMethod,
  //       promoCode: promoResult?.valid ? promoResult.code : undefined,
  //       notes,
  //       requirements: checkedReqs,
  //       totalAmount: this.getTotal(),
  //     }, token);  // ✅ second argument

  //     if (paymentMethod === 'cash' || paymentMethod === 'wallet') {
  //       this.setState({ submitting: false, submitSuccess: true });
  //       setTimeout(() => this.props.navigate?.('/sessions'), 1500);
  //       return;
  //     }

  //     const charge = await paymentsApi.createCharge({
  //       bookingId: booking.bookingId,
  //       amount: this.getTotal(),
  //       currency: 'QAR',
  //       description: `PhysioAI session with Dr. ${doctor.fullName}`,
  //     });

  //     if (charge.paymentUrl) {
  //       window.location.href = charge.paymentUrl;
  //     } else {
  //       throw new Error('Payment URL not received from payment provider');
  //     }
  //   } catch (err: any) {
  //     this.setState({ submitting: false, submitError: err.message });
  //   }
  // };

  handleSubmit = async () => {
    const {
      doctor, selectedSlotId, sessionType, sessionDuration,
      paymentMethod, promoResult, notes, checkedReqs,
    } = this.state;

    if (!doctor || !selectedSlotId) return;

    this.setState({ submitting: true, submitError: '' });

    try {
      // ✅ No token argument — apiFetch handles auth automatically
      const booking = await api.createBooking({
        doctorId: doctor.id,
        slotId: selectedSlotId,
        sessionType: sessionType === 'clinic' ? 'CLINIC' : 'HOME_VISIT',
        durationMinutes: parseInt(sessionDuration, 10),
        paymentMethod,
        promoCode: promoResult?.valid ? promoResult.code : undefined,
        notes,
        requirements: checkedReqs,
        totalAmount: this.getTotal(),
        homeAddress: sessionType === 'home' && this.state.homeAddress.trim()
          ? this.state.homeAddress.trim()
          : undefined,
        latitude: sessionType === 'home' && this.state.patientLat !== null
          ? this.state.patientLat
          : undefined,
        longitude: sessionType === 'home' && this.state.patientLon !== null
          ? this.state.patientLon
          : undefined,
      });

      // Wallet or cash — already confirmed by backend, go to sessions
      if (!booking.requiresPayment) {
        this.setState({ submitting: false, submitSuccess: true });
        setTimeout(() => this.props.navigate?.('/sessions'), 1500);
        return;
      }

      // Card payment — redirect to Stripe checkout
      const charge = await paymentsApi.createCharge({
        bookingId: booking.bookingId,
        amount: this.getTotal(),
        currency: 'QAR',
        description: `PhysioAI session with Dr. ${doctor.fullName}`,
      });

      if (charge.paymentUrl) {
        window.location.href = charge.paymentUrl;
      } else {
        throw new Error('Payment URL not received. Please try again.');
      }

    } catch (err: any) {
      this.setState({ submitting: false, submitError: err.message });
    }
  };

  render() {
    const {
      doctor, loadingDoctor, slots, loadingSlots, wallet,
      promoResult, promoLoading, promoCode,
      selectedDate, selectedSlotId, selectedSlotTime,
      sessionType, sessionDuration, paymentMethod,
      showPromo, notes, agreedTerms, agreedHealth, checkedReqs,
      calendarYear, calendarMonthIndex,
      submitting, submitError, submitSuccess,
    } = this.state;

    // ── Display values (DB or fallback) ───────────────────────────
    const doctorName = doctor ? `Dr. ${doctor.fullName}` : 'Dr. Sarah Al-Mahmoud';
    const doctorSpecialty = doctor?.specialty ?? 'Musculoskeletal Physiotherapist';
    const doctorRating = doctor?.rating ?? 4.9;
    const doctorPrice = doctor?.pricePerSession ?? 200;
    const doctorExp = doctor?.experience ?? '8 years exp';
    const doctorCenter = doctor?.centerName ?? 'Al Sadd Medical Center';
    const isOnline = doctor?.isAvailable ?? true;
    const doctorAvatar = doctor?.avatarUrl
      ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
    const walletBalance = wallet?.balance ?? 0;
    const currency = wallet?.currency ?? 'QAR';

    const sessionFee = this.getSessionFee();
    const platformFee = this.getPlatformFee();
    const discount = this.getDiscount();
    const totalAmount = this.getTotal();
    const canContinue = selectedSlotId && agreedTerms && agreedHealth && !submitting;

    // Group slots by period
    const slotsByPeriod = {
      morning: slots.filter(s => s.period === 'morning'),
      afternoon: slots.filter(s => s.period === 'afternoon'),
      evening: slots.filter(s => s.period === 'evening'),
    };

    const calendarCells = buildCalendar(calendarYear, calendarMonthIndex);
    const selectedDay = selectedDate.getDate();
    const isSelectedMonth =
      selectedDate.getMonth() === calendarMonthIndex &&
      selectedDate.getFullYear() === calendarYear;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-32">

        {/* ── Header ── */}
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1)} className="text-gray-700 text-2xl hover:text-gray-800">
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${i === 0
                    ? 'bg-gradient-to-br from-blue-500 to-green-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                    }`}>{i + 1}</div>
                  <span className={`text-xl ${i === 0 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                    {label}
                  </span>
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
                <img src={doctorAvatar} alt={doctorName}
                  className="w-24 h-24 rounded-full object-cover shadow-lg" />
              )}
              {isOnline && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full"
                  style={{ border: '3px solid white' }} />
              )}
            </div>
            <div className="flex-1">
              {loadingDoctor ? (
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-36" />
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                {doctorPrice} {currency}
              </div>
              <div className="text-lg text-gray-500">per session</div>
            </div>
          </div>

          {/* ── Session Type ── */}
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-5">Session Type</h3>
          <div className="space-y-3">
            {[
              {
                id: 'clinic' as const,
                icon: FaHospital, label: 'Clinic Visit',
                sub: 'Visit our modern clinic facility',
                extra: <div className="flex items-center gap-2 text-xl text-gray-400 mt-1">
                  <IconWrapper icon={FaLocationDot} className="text-xl" />
                  <span>{doctorCenter}</span>
                </div>,
                price: doctorPrice,
                border: 'border-blue-500', bg: 'bg-blue-50', checkBg: 'bg-blue-500',
                iconBg: 'bg-gradient-to-br from-blue-500 to-blue-50',
              },
              {
                id: 'home' as const,
                icon: TiHome, label: 'Home Visit',
                sub: 'Convenient treatment at your location',
                extra: <div className="flex items-center gap-2 text-xl text-green-500 mt-1">
                  <IconWrapper icon={FaPlus} className="text-xl" /><span>Travel fee included</span>
                </div>,
                price: doctorPrice + 80,
                border: 'border-purple-500', bg: 'bg-purple-50', checkBg: 'bg-purple-500',
                iconBg: 'bg-gradient-to-br from-purple-400 to-pink-400',
              },
            ].map(opt => {
              const selected = sessionType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => this.setState({ sessionType: opt.id })}
                  className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition ${selected ? `${opt.border} ${opt.bg}` : 'border-gray-100 bg-white'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-full ${opt.iconBg} flex items-center justify-center text-white text-2xl`}>
                    <IconWrapper icon={opt.icon} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-2xl text-gray-900">{opt.label}</div>
                    <div className="text-xl text-gray-500">{opt.sub}</div>
                    {opt.extra}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl">{opt.price} {currency}</div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${selected ? `${opt.checkBg} border-transparent` : 'border-gray-300'
                      }`}>
                      {selected && <IconWrapper icon={FaCheck} className="text-white text-xs" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Home Address Input (only for home visits) ── */}
          {sessionType === 'home' && (
            <div className="mt-5 p-5 bg-purple-50 border border-purple-200 rounded-2xl">
              <h4 className="font-bold text-xl text-gray-900 mb-3">
                📍 Your Address for Home Visit
              </h4>

              <input
                type="text"
                value={this.state.homeAddress}
                onChange={e => this.setState({
                  homeAddress: e.target.value,
                  addressError: '',
                })}
                placeholder="Enter your full address (Street, Building, City)"
                className="w-full px-5 py-4 text-xl border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 mb-3"
              />

              {/* Get GPS coordinates button */}
              <button
                onClick={this.detectLocation}
                disabled={this.state.detectingLocation}
                className="w-full py-3 bg-purple-100 text-purple-700 rounded-xl text-lg font-medium hover:bg-purple-200 transition flex items-center justify-center gap-2"
              >
                {this.state.detectingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Detecting location...
                  </>
                ) : (
                  '📡 Use My Current Location'
                )}
              </button>

              {/* Travel fee estimate */}
              {this.state.travelFeeEstimate !== null && (
                <div className="mt-3 bg-white border border-purple-200 rounded-xl p-4">
                  <p className="text-purple-700 text-lg font-medium">
                    🚗 Travel fee: <strong>{this.state.travelFeeEstimate} QAR</strong>
                    {this.state.distanceEstimate && (
                      <span className="text-gray-500 font-normal ml-2">
                        ({this.state.distanceEstimate} km from clinic)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {this.state.addressError && (
                <p className="text-red-500 text-lg mt-2">{this.state.addressError}</p>
              )}
            </div>
          )}

        </div>

        {/* ── Calendar ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
            <div className="flex items-center gap-3">
              <button onClick={this.prevMonth} className="text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowBack} /></span>
              </button>
              <span className="text-xl font-medium text-gray-700">
                {MONTH_NAMES[calendarMonthIndex]} {calendarYear}
              </span>
              <button onClick={this.nextMonth} className="text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowForward} /></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {DAYS.map(d => (
              <div key={d} className="text-gray-400 text-lg font-medium py-2">{d}</div>
            ))}
            {calendarCells.map((cell, idx) => {
              const isSelected = isSelectedMonth && cell.day === selectedDay && !cell.faded;
              const isPast = !cell.faded && new Date(calendarYear, calendarMonthIndex, cell.day) < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
              return (
                <button
                  key={idx}
                  disabled={cell.faded || isPast}
                  onClick={() => !cell.faded && !isPast && this.selectDate(cell.day)}
                  className={`py-5 rounded-xl text-xl font-medium transition ${isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold'
                    : cell.faded || isPast
                      ? 'text-gray-300 cursor-default'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Time Slots ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h3>

          {loadingSlots ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-gray-400 text-xl text-center py-8">
              No slots available for this date. Please select another day.
            </p>
          ) : (
            [
              { label: 'Morning', icon: FaSun, iconClass: 'text-yellow-400 text-2xl', slots: slotsByPeriod.morning },
              { label: 'Afternoon', icon: FaSun, iconClass: 'text-orange-400 text-2xl', slots: slotsByPeriod.afternoon },
              { label: 'Evening', icon: FaMoon, iconClass: 'text-indigo-400 text-2xl', slots: slotsByPeriod.evening },
            ].map(({ label, icon, iconClass, slots: periodSlots }) =>
              periodSlots.length > 0 && (
                <div key={label} className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={iconClass}><IconWrapper icon={icon} /></span>
                    <span className="font-semibold text-gray-800 text-xl">{label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {periodSlots.map(slot => (
                      <button
                        key={slot.id}
                        disabled={slot.status === 'booked'}
                        onClick={() => slot.status !== 'booked' && this.setState({
                          selectedSlotId: slot.id,
                          selectedSlotTime: slot.time,
                        })}
                        className={`py-4 rounded-xl text-center transition ${slot.status === 'booked'
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : selectedSlotId === slot.id
                            ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <div className="font-semibold text-xl">{slot.time}</div>
                        <div className="text-lg mt-0.5">
                          {slot.status === 'booked' ? 'Booked' : 'Available'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* ── Session Duration ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Duration</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '60' as const, label: '60 Minutes', sub: 'Standard session', extra: null, iconBg: 'from-blue-500 to-blue-100', checkBg: 'bg-blue-500', border: 'border-blue-500', gradBg: 'from-blue-50' },
              { value: '90' as const, label: '90 Minutes', sub: 'Extended session', extra: '+100 QAR', iconBg: 'from-purple-500 to-pink-400', checkBg: 'bg-purple-500', border: 'border-purple-500', gradBg: 'from-purple-50' },
            ].map(opt => {
              const selected = sessionDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => this.setState({ sessionDuration: opt.value })}
                  className={`p-6 border-2 rounded-2xl text-center transition ${selected ? `${opt.border} bg-gradient-to-r ${opt.gradBg} to-white` : 'border-gray-100'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl bg-gradient-to-br ${opt.iconBg}`}>
                    <IconWrapper icon={FaClock} />
                  </div>
                  <div className="font-bold text-gray-900 text-2xl">{opt.label}</div>
                  <div className="text-xl text-gray-500 mt-1">{opt.sub}</div>
                  {opt.extra && <div className="text-green-500 text-xl font-medium mt-1">{opt.extra}</div>}
                  <div className={`w-7 h-7 rounded-full mx-auto mt-3 flex items-center justify-center ${selected ? opt.checkBg : 'border-2 border-gray-300'
                    }`}>
                    {selected && <IconWrapper icon={FaCheck} className="text-white text-lg" />}
                  </div>
                </button>
              );
            })}
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
              { id: 'wallet', icon: FaWallet, bg: 'bg-green-500', label: 'Physio AI Wallet', sub: `Balance: ${walletBalance.toLocaleString()} ${currency}` },
              { id: 'card', icon: FaCreditCard, bg: 'bg-blue-600', label: 'Credit/Debit Card', sub: 'Visa, Mastercard accepted' },
              { id: 'sadad', icon: FaMobileScreenButton, bg: 'bg-purple-600', label: 'Sadad Payment', sub: "Qatar's national payment system" },
              { id: 'cash', icon: FaMoneyBillWave, bg: 'bg-gray-800', label: 'Cash Payment', sub: 'Pay at the clinic' },
            ].map(method => (
              <label
                key={method.id}
                onClick={() => this.setState({ paymentMethod: method.id })}
                className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === method.id
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
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
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
                  onChange={e => this.setState({ promoCode: e.target.value, promoResult: null })}
                  placeholder="Enter promo code"
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
                <button
                  onClick={this.applyPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-7 py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoResult && (
                <div className={`flex items-center gap-2 mt-3 rounded-xl p-4 border-2 ${promoResult.valid
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
                  }`}>
                  <span className={`w-6 h-6 rounded-full text-white text-lg flex items-center justify-center ${promoResult.valid ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {promoResult.valid ? <IconWrapper icon={FaCheck} /> : '✕'}
                  </span>
                  <span className={`text-xl font-medium ${promoResult.valid ? 'text-green-600' : 'text-red-500'}`}>
                    {promoResult.valid
                      ? `${promoResult.code} applied — ${promoResult.label}`
                      : promoResult.message}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Booking Summary ── */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 space-y-4">
            <div className="flex justify-between text-gray-700 text-xl">
              <span>Session Fee ({sessionDuration} min{sessionType === 'home' ? ' + Home Visit' : ''})</span>
              <span>{sessionFee} {currency}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-xl">
              <span>Platform Fee</span>
              <span>{platformFee} {currency}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500 text-xl">
                <span>Promo Discount ({promoResult?.code})</span>
                <span>-{discount} {currency}</span>
              </div>
            )}
            <div className="border-t border-blue-100 pt-3 flex justify-between font-bold text-2xl">
              <span>Total Amount</span>
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                {totalAmount} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* ── Submit error ── */}
        {submitError && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-xl text-center">
            {submitError}
          </div>
        )}

        {/* ── Success banner ── */}
        {submitSuccess && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-300 rounded-xl p-4 text-green-600 text-xl text-center font-semibold">
            ✓ Booking confirmed! Redirecting to your sessions...
          </div>
        )}

        {/* ── Emergency ── */}
        <div className="bg-red-50 p-6 mb-6 flex items-center gap-4 border-b border-gray-100">
          <span className="text-red-500 text-2xl mt-1"><IconWrapper icon={FaTriangleExclamation} /></span>
          <div>
            <p className="text-red-600 font-semibold text-xl">Need immediate medical attention?</p>
            <a href="tel:999" className="text-red-500 underline text-xl">Call Emergency: 999</a>
          </div>
        </div>

        {/* ── Consent ── */}
        <div className="space-y-4 p-6 mb-6">
          {[
            {
              key: 'terms',
              checked: agreedTerms,
              onChange: (v: boolean) => this.setState({ agreedTerms: v }),
              label: <>I agree to the <span className="text-blue-500">Terms of Service</span> and{' '}
                <span className="text-blue-500">Privacy Policy</span>. I understand the cancellation policy and payment terms.</>,
            },
            {
              key: 'health',
              checked: agreedHealth,
              onChange: (v: boolean) => this.setState({ agreedHealth: v }),
              label: 'I consent to share my health information with the selected physiotherapist for treatment purposes.',
            },
          ].map(({ key, checked, onChange, label }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-7 h-7 mt-0.5 rounded border-gray-300 accent-blue-500"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
              />
              <span className="text-xl font-semibold text-gray-600">{label}</span>
            </label>
          ))}
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
            onClick={this.handleSubmit}
            disabled={!canContinue}
            className="text-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Booking...
              </>
            ) : 'Confirm Booking'}
          </button>
        </div>

      </div>
    );
  }
}

function BookSessionWithRouter() {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId?: string }>();
  return <BookSession navigate={navigate as any} doctorId={doctorId} />;
}

export default BookSessionWithRouter;