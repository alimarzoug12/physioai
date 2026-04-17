import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaDirections, FaThumbsUp } from 'react-icons/fa';
import {
  FaAward, FaBolt, FaBrain, FaCalendar, FaCalendarPlus, FaCcMastercard,
  FaCcVisa, FaCheck, FaClock, FaComments, FaDumbbell, FaGraduationCap,
  FaHands, FaHeart, FaHospital, FaIdBadge, FaLanguage, FaLocationDot,
  FaMobileScreenButton, FaMoneyBill, FaPhone, FaShare, FaShieldHalved,
  FaSquareParking, FaStar, FaTag, FaTriangleExclamation, FaWhatsapp,
} from 'react-icons/fa6';
import { IoArrowBackOutline } from 'react-icons/io5';
import { PiCertificateBold } from 'react-icons/pi';
import { TbCircleDotted, TbMailFilled } from 'react-icons/tb';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ─────────────────────────────────────────────────────────
interface SlotData  { id: string; startTime: string; endTime: string }
interface OtherDoc  { id: string; fullName: string; specialty: string; rating: number; avatarUrl: string }
interface DoctorData {
  id: string; fullName: string; phone: string; email: string;
  specialty: string; specialties: string[]; rating: number;
  pricePerSession: number; languages: string[]; bio: string;
  experience: string; centerName: string; centerCity: string;
  centerAddress: string; centerPhone: string; centerEmail: string;
  isAvailable: boolean; avatarUrl: string;
  patientsTreated: number; successRate: number;
  todaySlots: SlotData[]; tomorrowSlots: SlotData[];
  sameCenter: OtherDoc[];
}

interface Props   { navigate?: (path: string | number) => void; doctorId?: string }
interface State   { doctor: DoctorData | null; loading: boolean; error: string; helpful: number; liked: boolean }

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
          <IconWrapper icon={FaStar} />
        </span>
      ))}
      {count !== undefined && (
        <span className="text-gray-700 font-medium text-xl ml-1">
          {rating.toFixed(1)} <span className="text-gray-500 font-normal">({count})</span>
        </span>
      )}
    </div>
  );
}

class SpecialistProfile extends React.Component<Props, State> {
  state: State = { doctor: null, loading: true, error: '', helpful: 5, liked: false };

  async componentDidMount() {
    const { doctorId } = this.props;
    console.log('Doctor ID received:', doctorId);
    if (!doctorId) { this.setState({ loading: false, error: 'No doctor ID provided' }); return; }
    try {
      const doctor = await api.getDoctorById(doctorId);
      this.setState({ doctor, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message || 'Failed to load doctor', loading: false });
    }
  }

  handleHelpful = () => {
    this.setState(prev => ({
      helpful: prev.liked ? prev.helpful - 1 : prev.helpful + 1,
      liked:   !prev.liked,
    }));
  };

  render() {
    const { doctor, loading, error, helpful, liked } = this.state;

    // ── Loading ──────────────────────────────────────────────
    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl text-gray-500">Loading specialist profile...</p>
        </div>
      </div>
    );

    // ── Error ────────────────────────────────────────────────
    if (error || !doctor) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-500 text-xl mb-4">{error || 'Doctor not found'}</p>
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

    // ── Derived values ───────────────────────────────────────
    const firstName = doctor.fullName.split(' ')[0];
    const totalReviews = Math.max(doctor.patientsTreated, 10);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-20">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-8 mx-1 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="font-medium text-gray-600 text-3xl hover:text-gray-900 transition"
          >
            <IconWrapper icon={IoArrowBackOutline} />
          </button>
          <h1 className="text-3xl font-bold text-cyan-500">Specialist Profile</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-500 text-3xl transition pr-2">
              <IconWrapper icon={FaHeart} />
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-3xl">
              <IconWrapper icon={FaShare} />
            </button>
          </div>
        </header>

        {/* 1. Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 p-8 border-b border-gray-200">
          <div className="flex flex-col items-center text-center gap-2">

            {/* Avatar */}
            <div className="relative mb-2">
              <div className="w-7 h-7 bg-green-400 rounded-full absolute -top-1 -translate-x-1/2 animate-pulse" />
              <img
                src={doctor.avatarUrl}
                alt={doctor.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {doctor.isAvailable && (
                <div className="absolute bottom-0 right-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold"><IconWrapper icon={FaCheck} /></span>
                </div>
              )}
            </div>

            {/* Name & specialty */}
            <h2 className="text-3xl font-medium text-gray-900">Dr. {doctor.fullName}</h2>
            <p className="text-gray-500 text-xl">{doctor.specialty}</p>

            {/* Stars + experience */}
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={doctor.rating} count={totalReviews} />
              <span className="text-gray-300 text-xl px-1">•</span>
              <span className="text-gray-600 text-xl">{doctor.experience}</span>
            </div>

            {/* Location */}
            <p className="text-gray-600 text-xl flex items-center gap-1">
              <span className="text-blue-500"><IconWrapper icon={FaLocationDot} /></span>
              {doctor.centerCity} <span className="text-2xl px-1">•</span> {doctor.centerName}
            </p>

            {/* Available Today */}
            {doctor.isAvailable && (
              <div className="flex items-center gap-2 text-green-500 font-medium text-xl mt-1">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                Available Today
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-blue-600">{doctor.patientsTreated}+</div>
            <div className="text-lg text-gray-500 mt-1">Patients Treated</div>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-gray-900">{doctor.successRate}%</div>
            <div className="text-lg text-gray-500 mt-1">Success Rate</div>
          </div>
          <div className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-purple-600">24h</div>
            <div className="text-lg text-gray-500 mt-1">Response Time</div>
          </div>
        </div>

        {/* 2. Specializations */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-3">
            {doctor.specialties.map((s, i) => {
              const colors = [
                'bg-blue-100 text-blue-600',
                'text-gray-600',
                'bg-purple-100 text-purple-600',
                'bg-orange-100 text-orange-600',
                'bg-pink-100 text-pink-600',
                'bg-indigo-100 text-indigo-600',
              ];
              return (
                <span key={i} className={`${colors[i % colors.length]} px-4 py-2 rounded-full text-lg font-semibold`}>
                  {s}
                </span>
              );
            })}
          </div>
        </div>

        {/* 3. About */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About Dr. {firstName}</h3>
          <div className="flex flex-wrap gap-3">
            <p className="text-gray-700 text-lg">{doctor.bio}</p>
            <button className="font-medium text-blue-500 text-xl mt-3 hover:underline">Read more</button>
          </div>
        </div>

        {/* 4. Credentials & Education — kept as semi-static since no credentials table exists */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Credentials & Education</h3>
          <div className="space-y-6">
            {[
              { icon: FaGraduationCap, bg: 'bg-blue-600',   title: "Master's in Physiotherapy",       sub: 'Qatar University - 2015' },
              { icon: PiCertificateBold, bg: 'bg-yellow-600', title: 'Manual Therapy Certification',   sub: 'International Federation of Orthopaedic Manipulative Physical Therapists' },
              { icon: FaAward,         bg: 'bg-purple-600', title: 'Sports Physiotherapy Diploma',    sub: 'Qatar Olympic Committee - 2018' },
              { icon: FaIdBadge,       bg: 'bg-orange-600', title: 'Licensed Physiotherapist',        sub: 'Qatar Ministry of Health' },
            ].map(({ icon, bg, title, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-2xl"><IconWrapper icon={icon} /></span>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-gray-900">{title}</h4>
                  <p className="text-gray-600 text-lg">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Clinic Information — dynamic from DB */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Clinic Information</h3>
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-white rounded-xl p-5 text-blue-500 text-4xl shadow-sm">
                <IconWrapper icon={FaHospital} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{doctor.centerName}</h4>
                <p className="text-lg text-gray-500">Premium healthcare facility specializing in physiotherapy</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaLocationDot} className="text-gray-400 text-xl" />
                <span>{doctor.centerAddress}, {doctor.centerCity}, Qatar</span>
              </div>
              {doctor.centerPhone && (
                <div className="flex items-center gap-3 text-gray-500 text-lg">
                  <IconWrapper icon={FaPhone} className="text-gray-400 text-xl" />
                  <span>{doctor.centerPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaClock} className="text-gray-400 text-xl" />
                <span>Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaSquareParking} className="text-gray-400 text-xl" />
                <span>Free parking available</span>
              </div>
            </div>
            <button className="w-full border border-gray-200 bg-white rounded-xl py-3 flex items-center justify-center gap-2 text-gray-700 text-lg font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaDirections} className="text-blue-500 text-xl" />
              Get Directions
            </button>
          </div>
        </div>

        {/* 6. Location */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
          <div className="relative h-64 bg-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-500 text-5xl animate-bounce">
                <IconWrapper icon={FaLocationDot} />
              </span>
            </div>
            <div className="flex items-center justify-between absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex flex-col">
                <p className="text-xl font-medium text-gray-900">{doctor.centerCity}</p>
                <p className="text-lg text-gray-600">{doctor.centerAddress}</p>
              </div>
              <button className="text-xl bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* 7. Services & Pricing — dynamic from pricePerSession */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Services & Pricing</h3>
          <div className="space-y-6">

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 pt-8 border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Initial Consultation</h4>
                  <p className="text-gray-600 text-lg mt-1">Comprehensive assessment and treatment plan (60 min)</p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"><IconWrapper icon={FaCheck} /></span>
                    Includes detailed examination & exercise prescription
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(doctor.pricePerSession * 1.1)} QAR
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 pt-8 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Follow-up Session</h4>
                  <p className="text-gray-600 text-lg mt-1">Treatment session with progress evaluation (45 min)</p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"><IconWrapper icon={FaCheck} /></span>
                    Manual therapy, exercises & progress tracking
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{doctor.pricePerSession} QAR</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 pt-8 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Home Visit</h4>
                  <p className="text-gray-600 text-lg mt-1">Physiotherapy session at your location (60 min)</p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"><IconWrapper icon={FaCheck} /></span>
                    Includes travel within 10km radius
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.round(doctor.pricePerSession * 1.6)} QAR
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 pt-8 border border-orange-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Package Deal (5 sessions)</h4>
                  <p className="text-gray-600 text-lg mt-1">
                    Save {Math.round(doctor.pricePerSession * 0.5)} QAR with our treatment package
                  </p>
                  <p className="text-xl text-orange-600 mt-2 flex items-center gap-2">
                    <IconWrapper icon={FaTag} className="text-orange-500" /> Most Popular Choice
                  </p>
                </div>
                <div className="flex flex-col text-right gap-1">
                  <span className="text-xl font-medium text-gray-400 line-through">
                    {doctor.pricePerSession * 5} QAR
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {Math.round(doctor.pricePerSession * 4.5)} QAR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Next Available Slots — dynamic from DB */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Next Available Slots</h3>
          <div className="space-y-6">

            {/* Today */}
            <div className="border border-gray-200 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-xl text-gray-900">
                  Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-green-600 text-lg">
                  {doctor.todaySlots.length} slot{doctor.todaySlots.length !== 1 ? 's' : ''} available
                </span>
              </div>
              {doctor.todaySlots.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {doctor.todaySlots.map(slot => (
                    <button key={slot.id} className="bg-green-100 px-5 py-3 rounded-xl text-green-700 font-semibold">
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-lg">No slots available today</p>
              )}
            </div>

            {/* Tomorrow */}
            <div className="border border-gray-200 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-xl text-gray-900">
                  Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-blue-600 text-lg">
                  {doctor.tomorrowSlots.length} slot{doctor.tomorrowSlots.length !== 1 ? 's' : ''} available
                </span>
              </div>
              {doctor.tomorrowSlots.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {doctor.tomorrowSlots.map(slot => (
                    <button key={slot.id} className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-lg">No slots available tomorrow</p>
              )}
            </div>

            <button className="text-xl w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition">
              <span className="text-xl text-blue-500"><IconWrapper icon={FaCalendar} /></span>
              View Full Calendar
            </button>
          </div>
        </div>

        {/* 9. Patient Reviews Score */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Patient Reviews</h3>
            <button className="text-blue-400 text-xl">View all ({totalReviews})</button>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl font-bold text-gray-900">{doctor.rating.toFixed(1)}</div>
              <div>
                <StarRating rating={doctor.rating} />
                <p className="text-gray-500 text-lg mt-1">Based on {totalReviews} reviews</p>
              </div>
            </div>
            {/* Distribution bars — derived from rating */}
            <div className="space-y-1">
              {[
                { star: 5, pct: Math.round((doctor.rating - 4) * 80 + 20) },
                { star: 4, pct: Math.round((5 - doctor.rating) * 30) },
                { star: 3, pct: 3 },
                { star: 2, pct: 1 },
                { star: 1, pct: 0 },
              ].map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-6 text-right text-gray-600 text-xl mr-6">{star}★</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-gray-500 text-lg">
                    {Math.round(totalReviews * pct / 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10. Static review cards — kept as-is (no reviews table) */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="space-y-8">
            {[
              { name: 'Ahmed M.',  img: 'https://randomuser.me/api/portraits/men/32.jpg',   stars: 5, text: `Excellent experience with Dr. ${firstName}! Highly professional and caring.`,                              time: '2 days ago'  },
              { name: 'Fatima K.', img: 'https://randomuser.me/api/portraits/women/44.jpg', stars: 5, text: `Dr. ${firstName} helped me recover from a sports injury. Outstanding expertise in manual therapy.`,       time: '1 week ago'  },
              { name: 'Omar H.',   img: 'https://randomuser.me/api/portraits/men/54.jpg',   stars: 4, text: 'Great physiotherapist with excellent knowledge. Felt improvement after the first session.',              time: '2 weeks ago' },
            ].map(({ name, img, stars, text, time }) => (
              <div key={name} className="border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-5">
                  <img src={img} alt={name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900 pb-1">{name}</h4>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <IconWrapper key={i} icon={FaStar} className={i < stars ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-gray-400 text-lg">{time}</span>
                </div>
                <p className="text-gray-700 text-xl">"{text}"</p>
                <div className="flex items-center gap-4 mt-3 text-lg">
                  <span className="flex items-center gap-1 text-gray-500 cursor-pointer" onClick={this.handleHelpful}>
                    <IconWrapper icon={FaThumbsUp} className={`mr-1 transition-colors ${liked ? 'text-blue-500' : 'text-gray-400'}`} />
                    Helpful ({helpful})
                  </span>
                  <span className="text-gray-700 text-lg font-semibold">✓ Verified Patient</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 11. Treatment Approaches */}
        <div className="text-left bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Treatment Approaches</h3>
          <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: FaHands,   color: 'text-blue-500',   bg: 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200',     title: 'Manual Therapy',   sub: 'Hands-on treatment techniques'      },
              { icon: FaDumbbell,color: 'text-gray-800',   bg: 'bg-white border border-gray-200',                                        title: 'Exercise Therapy', sub: 'Customized rehabilitation programs'  },
              { icon: FaBolt,    color: 'text-purple-500', bg: 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200', title: 'Electrotherapy',   sub: 'Advanced pain relief techniques'    },
              { icon: FaBrain,   color: 'text-orange-500', bg: 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200', title: 'Pain Education',   sub: 'Understanding your condition'       },
            ].map(({ icon, color, bg, title, sub }) => (
              <div key={title} className={`${bg} rounded-2xl p-5`}>
                <span className={`${color} text-3xl flex justify-center pb-2`}><IconWrapper icon={icon} /></span>
                <h4 className="font-semibold text-gray-900 text-lg">{title}</h4>
                <p className="text-gray-600 text-lg">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 12. Languages — dynamic */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Languages & Communication</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 p-2 text-3xl mt-0.5"><IconWrapper icon={FaLanguage} /></span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Languages Spoken</h4>
                <p className="text-gray-500 text-lg">{doctor.languages.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-800 p-2 text-3xl mt-0.5"><IconWrapper icon={FaComments} /></span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Communication Style</h4>
                <p className="text-gray-500 text-lg">Patient-centered, clear explanations, empathetic approach</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 p-2 text-3xl mt-0.5"><IconWrapper icon={FaMobileScreenButton} /></span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Follow-up Support</h4>
                <p className="text-gray-500 text-lg">WhatsApp consultations, exercise video guidance available</p>
              </div>
            </div>
          </div>
        </div>

        {/* 13. Insurance & Payment */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance & Payment Options</h3>
          <div className="mb-5">
            <h4 className="font-semibold text-gray-700 text-xl mb-3">Accepted Insurance</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FaShieldHalved, color: 'text-blue-600',   bg: 'border-blue-200 bg-blue-50',     label: 'Qatar Insurance' },
                { icon: FaHeart,        color: 'text-gray-900',   bg: 'border-gray-200',                label: 'Al Ahlia'        },
                { icon: TbCircleDotted, color: 'text-purple-500', bg: 'border-purple-200 bg-purple-50', label: 'QLM'             },
              ].map(({ icon, color, bg, label }) => (
                <div key={label} className={`border ${bg} rounded-xl flex flex-col items-center justify-center py-4 gap-2`}>
                  <IconWrapper icon={icon} className={`${color} text-2xl`} />
                  <span className="text-gray-700 text-lg">{label}</span>
                </div>
              ))}
            </div>
            <button className="text-blue-500 text-lg mt-3 hover:underline">View all accepted insurance</button>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-xl mb-3">Payment Methods</h4>
            <div className="flex items-center gap-3">
              <IconWrapper icon={FaCcVisa}          className="text-blue-700 text-4xl" />
              <IconWrapper icon={FaCcMastercard}    className="text-red-500 text-4xl" />
              <IconWrapper icon={FaMobileScreenButton} className="text-gray-700 text-3xl" />
              <IconWrapper icon={FaMoneyBill}       className="text-green-500 text-3xl" />
              <span className="text-gray-600 text-lg">Cards, Mobile Pay, Cash</span>
            </div>
          </div>
        </div>

        {/* 14. Contact & Emergency — dynamic */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact & Emergency</h3>
          <div className="flex flex-col gap-4">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
              <IconWrapper icon={FaWhatsapp} className="text-2xl" />
              WhatsApp Dr. {firstName}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <a href={`tel:${doctor.centerPhone}`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
                <IconWrapper icon={FaPhone} className="text-xl" /> Call Clinic
              </a>
              {doctor.centerEmail && (
                <a href={`mailto:${doctor.centerEmail}`}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-600 py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
                  <IconWrapper icon={TbMailFilled} className="text-xl" /> Send Email
                </a>
              )}
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-1">
              <div className="flex items-center gap-2 mb-2">
                <IconWrapper icon={FaTriangleExclamation} className="text-red-500 text-xl" />
                <h4 className="font-semibold text-red-700 text-xl">Emergency Contact</h4>
              </div>
              <p className="text-red-500 text-lg">For urgent medical situations outside clinic hours</p>
              <a href="tel:+97444449999" className="text-red-500 underline text-lg mt-1 block">
                +974 4444 9999 (24/7 Emergency Line)
              </a>
            </div>
          </div>
        </div>

        {/* 15. Other Specialists — dynamic from sameCenter */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Other Specialists You Might Like</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {doctor.sameCenter.length > 0 ? doctor.sameCenter.map(other => (
              <div
                key={other.id}
                onClick={() => this.props.navigate?.(`/specialist/${other.id}`)}
                className="bg-white min-w-[200px] border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img src={other.avatarUrl} alt={other.fullName}
                    className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xl leading-tight">Dr. {other.fullName}</h4>
                    <p className="text-gray-500 text-lg">{other.specialty}</p>
                  </div>
                </div>
                <StarRating rating={other.rating} />
              </div>
            )) : (
              /* fallback static cards if no same-center doctors */
              [{name:'Dr. Mohammed Al-Thani', specialty:'Sports Physiotherapist', rating:4.8, img:'https://randomuser.me/api/portraits/men/41.jpg'},
               {name:'Dr. Aisha Rahman',       specialty:'Rehabilitation Specialist', rating:4.7, img:'https://randomuser.me/api/portraits/women/65.jpg'}]
              .map(d => (
                <div key={d.name} className="bg-white min-w-[200px] border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <img src={d.img} alt={d.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xl">{d.name}</h4>
                      <p className="text-gray-500 text-lg">{d.specialty}</p>
                    </div>
                  </div>
                  <StarRating rating={d.rating} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* 16. Book Appointment — fixed bottom */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 z-50 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-br from-blue-500 to-blue-50 text-white rounded-full p-5 text-xl">
                <IconWrapper icon={FaCalendar} />
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-xl">Book Appointment</h4>
                <p className="text-gray-500 text-lg">
                  {doctor.todaySlots[0]
                    ? `Next available: Today ${doctor.todaySlots[0].startTime}`
                    : doctor.tomorrowSlots[0]
                    ? `Next available: Tomorrow ${doctor.tomorrowSlots[0].startTime}`
                    : 'Check availability'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-bold text-3xl">{doctor.pricePerSession} QAR</p>
              <p className="text-gray-400 text-lg">Per session</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => this.props.navigate?.('/book')}
              className="bg-gradient-to-r from-blue-500 to-blue-300 text-white py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <IconWrapper icon={FaCalendarPlus} /> Book Now
            </button>
            <button
              onClick={() => this.props.navigate?.('/ai-assistant')}
              style={{ border: '3px solid #2563eb' }}
              className="text-blue-600 hover:bg-blue-50 py-4 rounded-2xl font-semibold text-2xl transition flex items-center justify-center gap-2"
            >
              <IconWrapper icon={FaComments} /> Chat First
            </button>
          </div>
        </div>

      </div>
    );
  }
}

// ── Router wrapper — reads :id from URL ──────────────────────────
function SpecialistProfileWithRouter() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  
  console.log('URL param id:', id);  // ← add this to debug
  
  return <SpecialistProfile navigate={navigate as any} doctorId={id} />;
}

export default SpecialistProfileWithRouter;