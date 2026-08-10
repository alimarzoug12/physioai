import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSwimmingPool } from 'react-icons/fa';
import {
  FaArrowLeft, FaBrain, FaClock, FaDollarSign, FaFilter, FaHeart,
  FaList, FaLocationDot, FaMap, FaStar, FaVenusMars, FaCrown,
  FaShieldHalved, FaCheck, FaPhone, FaMedal, FaCalendar, FaLanguage,
  FaBuilding, FaHouseChimneyMedical, FaHandHoldingMedical, FaDumbbell,
  FaRocket, FaCreditCard, FaMobileScreenButton, FaBuildingColumns,
} from 'react-icons/fa6';
import { TiHome } from 'react-icons/ti';
import { api } from '../services/api';
import DoctorSearch from '../components/DoctorSearch';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ─────────────────────────────────────────────────────────
interface Slot { id: string; startTime: string; endTime: string }
interface Doctor {
  id: string; fullName: string; specialty: string; specialties: string[];
  rating: number; pricePerSession: number; languages: string[]; bio: string;
  experience: string; centerName: string; centerCity: string;
  centerAddress: string; isAvailable: boolean; avatarUrl: string;
  todaySlots: Slot[]; isTopPick: boolean;
}
interface State {
  view: 'list' | 'map';
  doctors: Doctor[];
  loading: boolean;
  error: string;
  filterNearby: boolean;
  filterRating: boolean;
  filterAvailable: boolean;
  filterPrice: boolean;
  filterGender: 'any' | 'male' | 'female';
}
interface Props { navigate?: (path: string) => void }

// ── Helpers ───────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}>
          <IconWrapper icon={FaStar} />
        </span>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
class PhysioBookingFlow extends React.Component<Props, State> {
  state: State = {
    view: 'list',
    doctors: [],
    loading: true,
    error: '',
    filterNearby: false,
    filterRating: false,
    filterAvailable: false,
    filterPrice: false,
    filterGender: 'any',
  };

  async componentDidMount() {
    try {
      const result = await api.getDoctors();
      const doctors = Array.isArray(result)
        ? result
        : (result as any).doctors
        ?? [];
      this.setState({ doctors, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message || 'Failed to load doctors', loading: false });
    }
  }

  getFilteredDoctors(): Doctor[] {
    const { doctors, filterRating, filterAvailable, filterPrice } = this.state;
    let result = [...doctors];

    if (filterRating) {
      result = result.filter(d => d.rating >= 4);
    }
    if (filterAvailable) {
      result = result.filter(d => d.todaySlots && d.todaySlots.length > 0);
    }
    if (filterPrice) {
      result = result.sort((a, b) => a.pricePerSession - b.pricePerSession);
    }

    return result;
  }

  // ── Top Pick Card (first doctor) ─────────────────────────────
  renderTopPickCard(doctor: Doctor) {
    return (
      <div key={doctor.id} className="bg-white rounded-2xl shadow-md overflow-hidden mx-6 my-6">

        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="bg-gradient-to-r from-blue-500 to-transparent text-white text-lg font-medium px-4 py-2 rounded-full flex items-center gap-2">
                <IconWrapper icon={FaCrown} className="text-white text-2xl" /> AI TOP PICK
              </span>
              <button className="text-gray-400 bg-white rounded-full p-2 text-2xl hover:text-red-400 transition">
                <IconWrapper icon={FaHeart} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">

            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img src={doctor.avatarUrl} alt={doctor.fullName}
                className="w-full h-full object-cover rounded-2xl border-4 border-white shadow" />
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-lg"><IconWrapper icon={FaCheck} /></span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Dr. {doctor.fullName}</h3>
                <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
              </div>
              <p className="text-xl text-gray-600 mt-1">{doctor.specialty}</p>

              {/* Stars + location */}
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <StarRating rating={doctor.rating} />
                <span className="text-lg text-gray-600">{doctor.rating.toFixed(1)}</span>
                <p className="text-lg text-gray-600 flex items-center gap-1 pl-2">
                  <IconWrapper icon={FaLocationDot} className="text-blue-500" /> {doctor.centerCity}
                </p>
              </div>

              {/* Experience + Price + Buttons */}
              <div className="flex justify-between items-center mb-6 mt-2 text-lg flex-wrap gap-2">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">{doctor.experience}</span>
                    <p className="text-gray-600">Experience</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold text-green-600">QAR {doctor.pricePerSession}</span>
                    <p className="text-gray-600">Per session</p>
                  </div>
                </div>
                <div className="flex gap-4 ml-auto">
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium flex items-center gap-2">
                    <IconWrapper icon={FaPhone} /> Call
                  </button>
                  <button
                    onClick={() => this.props.navigate?.('/book')}
                    className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's slots */}
          {doctor.todaySlots.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-lg text-gray-600">
                  <IconWrapper icon={FaClock} className="text-green-500 text-xl" /> Available Today
                </span>
                <button className="text-blue-500 text-lg">View all slots</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {doctor.todaySlots.slice(0, 3).map(slot => (
                  <button key={slot.id} className="bg-green-50 border border-green-200 rounded-xl py-2 text-center">
                    <div className="text-xl font-medium text-green-700">
                      {slot.startTime.replace(' AM', '').replace(' PM', '')}
                    </div>
                    <div className="text-lg text-green-600">
                      {slot.startTime.includes('AM') ? 'AM' : 'PM'}
                    </div>
                  </button>
                ))}
                {doctor.todaySlots.length > 3 && (
                  <button className="bg-gray-100 border border-gray-200 rounded-xl py-2 text-center">
                    <div className="text-xl font-medium text-gray-600">+{doctor.todaySlots.length - 3}</div>
                    <div className="text-lg text-gray-500">More</div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Specializations */}
          <div>
            <h4 className="font-normal text-xl text-gray-800 mb-3 flex items-center gap-2">
              <IconWrapper icon={FaMedal} className="text-yellow-500 text-xl" /> Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((s, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xl ${i === 0 ? 'bg-blue-50 text-blue-700' :
                  i === 1 ? 'text-gray-800' : 'bg-purple-50 text-purple-700'
                  }`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Regular Doctor Card ───────────────────────────────────────
  renderDoctorCard(doctor: Doctor) {
    return (
      <div key={doctor.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow mx-6 my-4">
        <div className="p-6">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img src={doctor.avatarUrl} alt={doctor.fullName}
                className="w-full h-full object-cover rounded-2xl border-4 border-white shadow" />
              <div className={`absolute -top-1 -right-1 w-6 h-6 ${doctor.isAvailable ? 'bg-green-400' : 'bg-gray-400'} rounded-full border-2 border-white`} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Dr. {doctor.fullName}</h3>
                  <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                </div>
                <button className="text-gray-400 bg-gray-50 rounded-full p-2 text-2xl hover:text-red-400 transition">
                  <IconWrapper icon={FaHeart} />
                </button>
              </div>

              <p className="text-xl text-gray-600 mt-1">{doctor.specialty}</p>

              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <StarRating rating={doctor.rating} />
                <span className="text-lg text-gray-600">{doctor.rating.toFixed(1)}</span>
                <p className="text-lg text-gray-600 flex items-center gap-1 pl-2">
                  <IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /> {doctor.centerCity}
                </p>
              </div>

              <div className="flex justify-between items-center mb-4 mt-2 text-lg flex-wrap gap-2">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">{doctor.experience}</span>
                    <p className="text-gray-600">Experience</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold text-green-600">QAR {doctor.pricePerSession}</span>
                    <p className="text-gray-600">Per session</p>
                  </div>
                </div>
                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={() => this.props.navigate?.(`/specialist/${doctor.id}`)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl"
                  >
                    View
                  </button>
                  <button
                    onClick={() => this.props.navigate?.('/book')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-blue-600 transition"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row — availability + specialties */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5 flex-wrap gap-2">
            <span className="flex items-center gap-2 text-lg text-gray-600">
              <IconWrapper icon={FaCalendar} className="text-green-500 text-xl" />
              {doctor.todaySlots.length > 0 ? 'Available Today' : 'Check Availability'}
            </span>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.slice(0, 2).map((s, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-lg ${i === 0 ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                  }`}>{s}</span>
              ))}
              {doctor.specialties.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-lg">
                  +{doctor.specialties.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Languages */}
          {doctor.languages.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <IconWrapper icon={FaLanguage} className="text-2xl text-blue-500" />
              <span className="text-lg text-gray-600">{doctor.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { view, doctors, loading, error } = this.state;
    const filteredDoctors = this.getFilteredDoctors();
    const topDoctor = filteredDoctors[0];
    const otherDoctors = filteredDoctors.slice(1);


    return (
      <div className="flex flex-col min-h-screen bg-gray-50 overflow-y-auto pb-20">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 relative">
          <button
            onClick={() => this.props.navigate?.(-1 as any)}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-2xl"
          >
            <IconWrapper icon={FaArrowLeft} />
          </button>
          {/* <DoctorSearch
            onSelectDoctor={(doctorId) => this.props.navigate?.(`/book/${doctorId}`)}
          /> */}
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
            <IconWrapper icon={FaHeart} />
          </button>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-medium text-cyan-500">Recommended Specialists</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
              <IconWrapper icon={FaLocationDot} className="text-blue-500 text-sm" /> Doha, Qatar
            </p>
          </div>
        </div>

        {/* AI MATCH CARD */}
        <div className="p-6 bg-blue-50">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-100 rounded-full flex items-center justify-center">
                  <IconWrapper icon={FaBrain} className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">AI Match Results</h3>
                  <p className="text-lg text-gray-500">Based on lower back strain symptoms</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-semibold text-cyan-400">94%</div>
                <p className="text-lg text-gray-500">Match Score</p>
              </div>
            </div>
            <div className="grid grid-cols-3 text-center pt-4">
              <div>
                <p className="text-lg font-semibold text-blue-600">{loading ? '...' : doctors.length}</p>
                <p className="text-sm text-gray-500">Specialists</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">2.3km</p>
                <p className="text-sm text-gray-500">Avg Distance</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-purple-500">Today</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        {/* <div className="flex flex-col bg-white gap-3 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 py-2 text-xl font-medium">
              <IconWrapper icon={FaFilter} className="text-gray-500" /> Filters
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl">
              <button
                onClick={() => this.setState({ view: 'list' })}
                className={`flex items-center gap-1 py-1 px-4 rounded-lg ${view === 'list' ? 'bg-white text-gray-900' : 'text-gray-500'}`}
              >
                <span className="text-xl"><IconWrapper icon={FaList} /></span> List
              </button>
              <button
                onClick={() => this.setState({ view: 'map' })}
                className={`flex items-center gap-1 py-1 px-4 rounded-lg ${view === 'map' ? 'bg-white text-gray-900' : 'text-gray-500'}`}
              >
                <span className="text-xl"><IconWrapper icon={FaMap} /></span> Map
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { icon: FaLocationDot, label: 'Nearby (5km)', active: true },
              { icon: FaStar, label: '4+ Rating', active: false },
              { icon: FaClock, label: 'Available Today', active: false },
              { icon: FaDollarSign, label: 'Price Range', active: false },
              { icon: FaVenusMars, label: 'Gender', active: false },
            ].map(({ icon, label, active }) => (
              <button key={label} className={`px-5 py-3 rounded-full border text-xl font-normal flex items-center gap-2 transition mr-1 ${active ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}>
                <IconWrapper icon={icon} /> {label}
              </button>
            ))}
          </div>
        </div> */}

        {/* FILTERS */}
        <div className="flex flex-col bg-white gap-3 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 py-2 text-xl font-medium">
              <IconWrapper icon={FaFilter} className="text-gray-500" /> Filters
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl">
              <button
                onClick={() => this.setState({ view: 'list' })}
                className={`flex items-center gap-1 py-1 px-4 rounded-lg ${view === 'list' ? 'bg-white text-gray-900' : 'text-gray-500'}`}
              >
                <span className="text-xl"><IconWrapper icon={FaList} /></span> List
              </button>
              <button
                onClick={() => this.setState({ view: 'map' })}
                className={`flex items-center gap-1 py-1 px-4 rounded-lg ${view === 'map' ? 'bg-white text-gray-900' : 'text-gray-500'}`}
              >
                <span className="text-xl"><IconWrapper icon={FaMap} /></span> Map
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              {
                icon: FaLocationDot,
                label: 'Nearby (5km)',
                active: this.state.filterNearby,
                onClick: () => this.setState(p => ({ filterNearby: !p.filterNearby })),
              },
              {
                icon: FaStar,
                label: '4+ Rating',
                active: this.state.filterRating,
                onClick: () => this.setState(p => ({ filterRating: !p.filterRating })),
              },
              {
                icon: FaClock,
                label: 'Available Today',
                active: this.state.filterAvailable,
                onClick: () => this.setState(p => ({ filterAvailable: !p.filterAvailable })),
              },
              {
                icon: FaDollarSign,
                label: 'Price Range',
                active: this.state.filterPrice,
                onClick: () => this.setState(p => ({ filterPrice: !p.filterPrice })),
              },
              {
                icon: FaVenusMars,
                label: 'Gender',
                active: this.state.filterGender !== 'any',
                onClick: () => this.setState(p => ({
                  filterGender: p.filterGender === 'any' ? 'male'
                    : p.filterGender === 'male' ? 'female' : 'any'
                })),
              },
            ].map(({ icon, label, active, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`px-5 py-3 rounded-full border text-xl font-normal flex items-center gap-2 transition mr-1 ${active
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
              >
                <IconWrapper icon={icon} /> {label}
                {label === 'Gender' && this.state.filterGender !== 'any' && (
                  <span className="ml-1 capitalize">{this.state.filterGender}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MAP VIEW */}
        {view === 'map' && (
          <div className="relative w-full p-6" style={{ height: '500px' }}>
            <iframe
              className="w-full h-full rounded-2xl overflow-hidden"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.openstreetmap.org/export/embed.html?bbox=51.4700%2C25.2300%2C51.5700%2C25.3300&layer=mapnik&marker=25.2854%2C51.5310"
            />
            <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 z-10 min-w-[180px]">
              <p className="font-semibold text-gray-900 text-lg">
                {topDoctor ? `Dr. ${topDoctor.fullName}` : 'Loading...'}
              </p>
              <p className="text-gray-500 text-lg">
                {topDoctor ? `QAR ${topDoctor.pricePerSession} • ${topDoctor.rating}★` : ''}
              </p>
            </div>
            <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 z-10">
              <p className="text-lg text-gray-600 font-medium">{doctors.length} specialists nearby</p>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xl text-gray-500">Finding specialists near you...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="mx-6 my-6 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-500 text-xl">{error}</p>
                <button
                  onClick={() => {
                    this.setState({ loading: true, error: '' });
                    api.getDoctors()
                      .then(result => {
                        const doctors = Array.isArray(result)
                          ? result
                          : (result as any).doctors ?? [];
                        this.setState({ doctors, loading: false });
                      })
                      .catch(e => this.setState({ error: e.message, loading: false }));
                  }}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl text-xl"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Top Pick — first doctor from DB */}
            {!loading && !error && topDoctor && this.renderTopPickCard(topDoctor)}

            {/* Other doctors */}
            {!loading && !error && otherDoctors.map(doctor => this.renderDoctorCard(doctor))}

            {/* Elite Physio Center — kept as static center showcase card */}
            {!loading && !error && doctors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mx-6 my-6">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="bg-purple-500 text-white text-lg font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <IconWrapper icon={FaBuilding} className="text-white text-xl" /> CLINIC
                      </span>
                      <button className="text-gray-400 bg-white rounded-full p-2 text-2xl hover:text-red-400 transition">
                        <IconWrapper icon={FaHeart} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 shadow flex-shrink-0 flex items-center justify-center">
                      <IconWrapper icon={FaHouseChimneyMedical} className="text-2xl text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Elite Physio Center</h3>
                        <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                      </div>
                      <p className="text-xl text-gray-600 mt-1">Multi-specialist Rehabilitation Center</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4].map(i => <span key={i} className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>)}
                        <span className="text-gray-300 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.6 (234)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /> 1.8 km away
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-lg flex-wrap gap-2">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">{doctors.length > 3 ? doctors.length : 8} Doctors</span>
                            <p className="text-gray-600">Available</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">
                              QAR {Math.min(...doctors.map(d => d.pricePerSession))}
                            </span>
                            <p className="text-gray-600">Starting from</p>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl">View</button>
                          <button className="bg-purple-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-purple-700 transition">Book</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Services */}
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
                    {[
                      { icon: FaSwimmingPool, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', label: 'Hydrotherapy' },
                      { icon: FaDumbbell, color: 'text-gray-800', bg: 'bg-white hover:bg-gray-50', label: 'Gym Access' },
                      { icon: FaHandHoldingMedical, color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100', label: 'Massage' },
                    ].map(({ icon, color, bg, label }) => (
                      <button key={label} className={`${bg} rounded-2xl py-4 flex flex-col items-center justify-center transition-all`}>
                        <IconWrapper icon={icon} className={`text-2xl ${color} mb-2`} />
                        <div className={`text-lg font-medium ${color} text-center`}>{label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && doctors.length === 0 && (
              <div className="mx-6 my-10 text-center">
                <p className="text-xl text-gray-500">No specialists found.</p>
              </div>
            )}
          </div>
        )}

        {/* QUICK BOOK */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden m-6 mb-6 py-3">
          <div className="px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-50 w-14 h-14 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl"><IconWrapper icon={FaRocket} /></span>
              </div>
              <div>
                <h3 className="text-xl text-gray-800 font-medium">Quick Book</h3>
                <p className="text-lg text-gray-600">Skip the browsing, book instantly</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 grid grid-cols-2 gap-2">
            <button className="bg-blue-500 flex flex-col items-center justify-center rounded-2xl text-white p-5">
              <span className="text-2xl mb-1"><IconWrapper icon={FaClock} /></span>
              <span className="font-medium text-xl">Next Available</span>
              <p className="text-lg text-blue-50">
                {topDoctor?.todaySlots[0] ? `Today ${topDoctor.todaySlots[0].startTime}` : 'Today 10:00 AM'}
              </p>
            </button>
            <button className="bg-gradient-to-r from-blue-50 to-white rounded-2xl flex flex-col items-center justify-center p-5">
              <span className="text-2xl text-blue-700 mb-1"><IconWrapper icon={TiHome} /></span>
              <span className="font-medium text-xl text-blue-700">Home Visit</span>
              <p className="text-blue-500 text-lg">Tomorrow 02:00 PM</p>
            </button>
          </div>
        </div>

        {/* WHAT PATIENTS SAY — kept static (reviews feature is future) */}
        <div className="bg-white shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-3xl font-medium text-gray-700">What Patients Say</h3>
            <button className="text-blue-500 text-xl">View all</button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Mohammed Al-Rashid', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', stars: 5, text: 'Dr. Sarah helped me recover from my back injury completely. Her approach was professional and the AI matching was spot on!', time: '2 days ago' },
              { name: 'Aisha Hassan', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', stars: 4, text: 'The home visit service was excellent. Very convenient and the therapist was well-prepared with all equipment.', time: '1 week ago' },
            ].map(({ name, img, stars, text, time }) => (
              <div key={name} className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-start gap-1 my-2">
                  <img src={img} alt={name} className="w-14 h-14 rounded-full object-cover mr-4 ml-1 flex-shrink-0" />
                  <div>
                    <div className="flex items-center mb-3 gap-3">
                      <h4 className="font-medium text-xl text-gray-900">{name}</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <span key={i} className={i <= stars ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                            <IconWrapper icon={FaStar} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-3">"{text}"</p>
                    <div className="flex items-center gap-3 text-lg text-gray-400">
                      <span>{time}</span>
                      <span className="text-blue-500 text-lg">Verified patient</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSURANCE & PAYMENTS */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl"><IconWrapper icon={FaShieldHalved} /></span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Insurance & Payments
                  <p className="text-lg font-normal text-gray-600">We accept most insurance plans</p>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mx-6 border-b border-gray-100 pb-4">
              {[
                { icon: FaCreditCard, color: 'text-blue-500', label: 'Cards' },
                { icon: FaBuildingColumns, color: 'text-orange-500', label: 'Transfer' },
                { icon: FaMobileScreenButton, color: 'text-purple-500', label: 'Digital' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="text-center bg-gray-50 rounded-2xl p-3">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    <span className={`text-3xl ${color}`}><IconWrapper icon={icon} /></span>
                  </div>
                  <p className="text-lg font-medium text-gray-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 flex items-start justify-between">
              <h3 className="text-xl text-gray-700">Accepted Insurance</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'QNIC', cls: 'bg-blue-100 text-blue-600' },
                  { label: 'Doha Insurance', cls: 'bg-green-100 text-green-600' },
                  { label: '+3', cls: 'bg-gray-100 text-gray-600' },
                ].map(({ label, cls }) => (
                  <span key={label} className={`${cls} px-3 py-2 rounded-lg text-lg font-medium`}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY */}
        <div className="bg-red-50 border-t border-red-200 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 rounded-full text-white text-xl p-4 flex items-center justify-center">
              <IconWrapper icon={FaPhone} />
            </span>
            <div>
              <h3 className="text-xl font-medium text-red-700">Emergency?</h3>
              <p className="text-lg text-red-600">For severe pain or urgent care, call 999 immediately</p>
            </div>
          </div>
          <button className="bg-red-500 text-white font-semibold text-lg py-2 px-5 rounded-xl hover:bg-red-600 transition whitespace-nowrap">
            Call 999
          </button>
        </div>

      </div>
    );
  }
}

function PhysioBookingFlowWithRouter() {
  const navigate = useNavigate();
  return <PhysioBookingFlow navigate={navigate} />;
}

export default PhysioBookingFlowWithRouter;