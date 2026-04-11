import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSwimmingPool } from 'react-icons/fa';
import { FaArrowLeft, FaBrain, FaClock, FaDollarSign, FaFilter, FaHeart, FaList, FaLocationDot, FaMap, FaStar, FaVenusMars, FaCrown, FaShieldHalved, FaCheck, FaPhone, FaMedal, FaCalendar, FaLanguage, FaBuilding, FaHouseChimneyMedical, FaHandHoldingMedical, FaDumbbell, FaRocket, FaCreditCard, FaMobileScreenButton, FaBuildingColumns } from "react-icons/fa6";
import { TiHome } from "react-icons/ti";

//page 4 src/components/PhysioBookingFlow.tsx
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface PhysioBookingFlowProps {
  navigate?: (path: string) => void;
}
class PhysioBookingFlow extends React.Component<PhysioBookingFlowProps, {}> {
  state = {
    view: 'list' as 'list' | 'map',
  };
  render() {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-y-auto pb-20">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 relative">

          {/* Left & Right Icons */}
          <button onClick={() => this.props.navigate?.(-1 as any)} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-2xl">
            <IconWrapper icon={FaArrowLeft} />
          </button>

          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
            <IconWrapper icon={FaHeart} />
          </button>

          {/* Center Title */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-medium text-cyan-500">
              Recommended Specialists
            </h2>

            <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
              <IconWrapper icon={FaLocationDot} className="text-blue-500 text-sm" />
              Doha, Qatar
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="">
          <div className="p-6 bg-blue-50">
            {/* AI MATCH CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">

              {/* TOP ROW */}
              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-100 rounded-full flex items-center justify-center">
                    <IconWrapper icon={FaBrain} className="text-white text-xl" />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      AI Match Results
                    </h3>
                    <p className="text-lg text-gray-500">
                      Based on lower back strain symptoms
                    </p>
                  </div>
                </div>

                {/* RIGHT SCORE */}
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-semibold text-cyan-400">
                    94%
                  </div>
                  <p className="text-lg text-gray-500">Match Score</p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 text-center pt-4">

                <div>
                  <p className="text-lg font-semibold text-blue-600">12</p>
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

          {/* Filtres */}
          <div className="flex flex-col bg-white gap-3 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 py-2 text-xl font-medium">
                <span><IconWrapper icon={FaFilter} className='text-gray-500' /> </span> Filters
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl">
                <button
                  onClick={() => this.setState({ view: 'list' })}
                  className={`flex items-center gap-1 py-1 px-4 rounded-lg ${this.state.view === 'list' ? 'bg-white text-gray-900' : 'text-gray-500'
                    }`}
                >
                  <span className="text-xl"><IconWrapper icon={FaList} /></span> List
                </button>
                <button
                  onClick={() => this.setState({ view: 'map' })}
                  className={`flex items-center gap-1 py-1 px-4 rounded-lg ${this.state.view === 'map' ? 'bg-white text-gray-900' : 'text-gray-500'
                    }`}
                >
                  <span className="text-xl"><IconWrapper icon={FaMap} /></span> Map
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full border border-blue-200 text-xl font-normal flex items-center gap-2 hover:bg-blue-200 transition mr-1">
                <span><IconWrapper icon={FaLocationDot} /></span> Nearby (5km)
              </button>
              <button className="bg-gray-100 text-gray-700 px-5 py-3 rounded-full border border-gray-200 text-xl font-normal flex items-center gap-1 hover:bg-gray-200 transition mr-1">
                <span><IconWrapper icon={FaStar} /></span> 4+ Rating
              </button>
              <button className="bg-gray-100 text-gray-700 px-5 py-3 rounded-full border border-gray-200 text-xl font-normal flex items-center gap-1 hover:bg-gray-200 transition mr-1">
                <span><IconWrapper icon={FaClock} /></span> Available Today
              </button>
              <button className="bg-gray-100 text-gray-700 px-5 py-3 rounded-full border border-gray-200 text-xl font-normal flex items-center gap-1 hover:bg-gray-200 transition mr-1">
                <span><IconWrapper icon={FaDollarSign} /></span> Price Range
              </button>
              <button className="bg-gray-100 text-gray-700 px-5 py-3 rounded-full border border-gray-200 text-xl font-normal flex items-center gap-1 hover:bg-gray-200 transition">
                <span><IconWrapper icon={FaVenusMars} /></span> Gender
              </button>
            </div>
          </div>
          {/* MAP VIEW */}
          {this.state.view === 'map' && (
            <div className="relative w-full p-6" style={{ height: '500px' }}>
              <iframe
                className="w-full h-full rounded-2xl overflow-hidden"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.openstreetmap.org/export/embed.html?bbox=51.4700%2C25.2300%2C51.5700%2C25.3300&layer=mapnik&marker=25.2854%2C51.5310"
              />

              {/* Doctor popup on map */}
              <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 z-10 min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p className="font-semibold text-gray-900 text-lg">Dr. Sarah Al-Mansouri</p>
                </div>
                <p className="text-gray-500 text-lg">QAR 180 • 4.9★</p>
              </div>

              {/* Map pins legend */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 z-10">
                <p className="text-lg text-gray-600 font-medium">12 specialists nearby</p>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {this.state.view === 'list' && (
            <div>

              {/* AI Top Pick Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mx-6 my-6">
                <div className="relative h-48 md:h-48 bg-gradient-to-br from-blue-400 to-cyan-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="bg-gradient-to-r from-blue-500 to-transparent text-white text-lg font-medium px-4 py-2 rounded-full flex items-center">
                        <span className="text-white text-2xl pr-2"><IconWrapper icon={FaCrown} /></span>AI TOP PICK
                      </span>
                      <button className="text-gray-400 bg-white rounded-full p-2 text-2xl hover:text-red-400 transition">
                        <IconWrapper icon={FaHeart} />
                      </button>
                    </div>
                    <div className="mt-auto"></div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Dr. Sarah Al-Mansouri"
                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow"
                      />
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-lg"><IconWrapper icon={FaCheck} /></span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                          Dr. Sarah Al-Mansouri
                        </h3>
                        <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                      </div>

                      <p className="text-xl text-gray-600 mt-1">
                        Musculoskeletal Physiotherapist
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.9 (127)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <span><IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /></span> 1.2 km away
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-6 mt-2 text-lg">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">8 years</span>
                            <p className="text-gray-600">Experience</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">QAR 180</span>
                            <p className="text-gray-600">Per session</p>
                          </div>
                        </div>
                        <div className="flex gap-4 ml-auto">
                          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium transition flex items-center gap-2">
                            <IconWrapper icon={FaPhone} /> Call
                          </button>
                          <button onClick={() => this.props.navigate?.('/book')} className="bg-gradient-to-r from-blue-500 to-white text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 shadow-[0_0_20px_rgba(0,0,0,0.1)] shadow-blue-200 transition">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 text-lg text-gray-600 font-normal">
                        <IconWrapper icon={FaClock} className='text-xl text-green-500' />
                        Available Today
                      </span>
                      <button className="text-blue-500 text-lg">
                        View all slots
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <button className="bg-green-50 border border-green-200 rounded-xl py-2 text-center">
                        <div className="text-xl font-medium text-green-700">10:00</div>
                        <div className="text-lg text-green-600">AM</div>
                      </button>
                      <button className="bg-green-50 border border-green-200 rounded-xl py-2 text-center">
                        <div className="text-xl font-medium text-green-700">2:30</div>
                        <div className="text-lg text-green-600">PM</div>
                      </button>
                      <button className="bg-green-50 border border-green-200 rounded-xl py-2 text-center">
                        <div className="text-xl font-medium text-green-700">4:00</div>
                        <div className="text-lg text-green-600">PM</div>
                      </button>
                      <button className="bg-gray-100 border border-gray-200 rounded-xl py-2 text-center flex flex-col items-center justify-center">
                        <div className="text-xl font-medium text-gray-600">+3</div>
                        <div className="text-lg text-gray-500">More</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-normal text-xl text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl text-yellow-500"><IconWrapper icon={FaMedal} /></span> Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xl">
                        Lower Back Pain
                      </span>
                      <span className="text-gray-800 px-3 py-1 rounded-full text-xl">
                        Sports Injuries
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xl">
                        Manual Therapy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dr. Ahmed Hassan */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow mx-6 my-4">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Dr. Ahmed Hassan"
                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Dr. Ahmed Hassan
                          </h3>
                          <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                        </div>
                        <button className="text-gray-400 bg-gray-50 rounded-full p-2 text-2xl hover:text-red-400 transition">
                          <IconWrapper icon={FaHeart} />
                        </button>
                      </div>

                      <p className="text-xl text-gray-600 mt-1">
                        Orthopedic Physiotherapist
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.7 (89)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <span><IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /></span> 2.1 km away
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-6 mt-2 text-lg">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">12 years</span>
                            <p className="text-gray-600">Experience</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">QAR 160</span>
                            <p className="text-gray-600">Per session</p>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <button onClick={() => this.props.navigate?.('/specialist/:id')} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl transition flex items-center gap-2">
                            View
                          </button>
                          <button onClick={() => this.props.navigate?.('/book')} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-blue-700 transition">
                            Book
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                    <div>
                      <span className="flex items-center gap-2 text-lg text-gray-600 font-normal">
                        <IconWrapper icon={FaCalendar} className='text-xl text-green-500' />
                        Available Today
                      </span>
                    </div>
                    <div>
                      <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-lg mr-2">
                        Spine Care
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-lg">
                        +2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dr. Fatima Al-Zahra */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow mx-6 my-4">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Dr. Fatima Al-Zahra"
                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Dr. Fatima Al-Zahra
                          </h3>
                          <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                        </div>
                        <button className="text-gray-400 bg-gray-50 rounded-full p-2 text-2xl hover:text-red-400 transition">
                          <IconWrapper icon={FaHeart} />
                        </button>
                      </div>

                      <p className="text-xl text-gray-600 mt-1">
                        Sports Medicine & Rehabilitation
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.8 (156)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <span><IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /></span> 3.5 km away
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-6 mt-2 text-lg">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">6 years</span>
                            <p className="text-gray-600">Experience</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">QAR 200</span>
                            <p className="text-gray-600">Per session</p>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <button onClick={() => this.props.navigate?.('/specialist/:id')} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl transition flex items-center gap-2">
                            View
                          </button>
                          <button onClick={() => this.props.navigate?.('/book')} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-blue-700 transition">
                            Book
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                    <div>
                      <span className="flex items-center gap-2 text-lg text-gray-800 font-normal">
                        <IconWrapper icon={TiHome} className='text-3xl text-gray-900' />
                        Offers Home Visits
                        <span className="text-xl font-medium text-gray-900 ml-2">+QAR 50 </span>
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 px-3 py-1 text-lg">
                        Home Care
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elite Physo Center */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mx-6 my-6">
                <div className="relative h-48 md:h-48 bg-gradient-to-br from-blue-400 to-cyan-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="bg-purple-500 text-white text-lg font-medium px-3 py-1 rounded-full flex items-center">
                        <span className="text-white text-xl pr-1"><IconWrapper icon={FaBuilding} /></span>CLINIC
                      </span>
                      <button className="text-gray-400 bg-white rounded-full p-2 text-2xl hover:text-red-400 transition">
                        <IconWrapper icon={FaHeart} />
                      </button>
                    </div>
                    <div className="mt-auto"></div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 shadow flex-shrink-0 flex items-center justify-center">
                      <IconWrapper icon={FaHouseChimneyMedical} className="w-8 h-8 text-2xl text-purple-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                          Elite Physio Center
                        </h3>
                        <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                      </div>

                      <p className="text-xl text-gray-600 mt-1">
                        Multi-specialist Rehabilitation Center
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-gray-300 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.6 (234)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <span><IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /></span> 1.8 km away
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2 text-lg">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">8 Doctors</span>
                            <p className="text-gray-600">Available</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">QAR 150</span>
                            <p className="text-gray-600">Starting from</p>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl transition flex items-center gap-2">
                            View
                          </button>
                          <button className="bg-purple-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-purple-700 transition">
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">

                      {/* Hydrotherapy */}
                      <button className="bg-blue-50 hover:bg-blue-100 rounded-2xl py-4 flex flex-col items-center justify-center transition-all">
                        <div className="mb-2">
                          <IconWrapper icon={FaSwimmingPool} className="text-2xl text-blue-600" />
                        </div>
                        <div className="text-lg font-medium text-blue-700 text-center">Hydrotherapy</div>
                      </button>

                      {/* Gym Access */}
                      <button className="bg-white hover:bg-gray-50 rounded-2xl py-4 flex flex-col items-center justify-center transition-all">
                        <div className="mb-2">
                          <IconWrapper icon={FaDumbbell} className="text-2xl text-gray-800" />
                        </div>
                        <div className="text-lg font-medium text-gray-800 text-center">Gym Access</div>
                      </button>

                      {/* Massage */}
                      <button className="bg-purple-50 hover:bg-purple-100 rounded-2xl py-4 flex flex-col items-center justify-center transition-all">
                        <div className="mb-2">
                          <IconWrapper icon={FaHandHoldingMedical} className="text-2xl text-purple-600" />
                        </div>
                        <div className="text-lg font-medium text-purple-700 text-center">Massage</div>
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              {/* Dr. Omar Khalil */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow mx-6 my-4">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                        alt="Dr. Omar Khalil"
                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Dr. Omar Khalil
                          </h3>
                          <span className="text-blue-500 text-xl"><IconWrapper icon={FaShieldHalved} /></span>
                        </div>
                        <button className="text-gray-400 bg-gray-50 rounded-full p-2 text-2xl hover:text-red-400 transition">
                          <IconWrapper icon={FaHeart} />
                        </button>
                      </div>

                      <p className="text-xl text-gray-600 mt-1">
                        Orthopedic Physiotherapist
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-500 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-lg text-gray-600">4.9 (78)</span>
                        <p className="text-lg text-gray-600 mt-1 flex items-center pl-2 gap-1">
                          <span><IconWrapper icon={FaLocationDot} className="text-blue-500 text-lg" /></span> 4.2 km away
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-6 mt-2 text-lg">
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold">15 years</span>
                            <p className="text-gray-600">Experience</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-green-600">QAR 220</span>
                            <p className="text-gray-600">Per session</p>
                          </div>
                        </div>
                        <div className="flex gap-3 ml-auto">
                          <button onClick={() => this.props.navigate?.('/specialist/:id')} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-normal text-xl transition flex items-center gap-2">
                            View
                          </button>
                          <button onClick={() => this.props.navigate?.('/book')} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-normal text-xl hover:bg-blue-700 transition">
                            Book
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                    <div>
                      <span className="flex items-center gap-2 text-lg text-gray-600 font-normal">
                        <IconWrapper icon={FaLanguage} className='text-2xl text-blue-500' />
                        Arabic, English, French
                      </span>
                    </div>
                    <div>
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-lg mr-2">
                        Pain Relief
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-lg">
                        Acupuncture
                      </span>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* Quick Book */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden m-6 mb-6 py-3">
            <div className="px-6 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-50 w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl"><IconWrapper icon={FaRocket} /></span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl text-gray-800 font-medium">
                    Quick Book
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 opacity-90">
                    Skip the browsing, book instantly
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 grid grid-cols-2 gap-2">
              {/* Next Available */}
              <button className="bg-blue-500 flex flex-col items-center justify-center rounded-2xl text-white p-5 mr-2">
                <span className="text-2xl mb-1"><IconWrapper icon={FaClock} /></span>
                <span className="font-medium text-xl">Next Available</span>
                <p className="text-lg text-blue-50">Today 10:00 AM</p>
              </button>

              {/* Home Visit */}
              <button className="bg-gradient-to-r from-blue-50 to-white rounded-2xl flex flex-col items-center justify-center p-5">
                <span className="text-2xl text-blue-700 mb-1"><IconWrapper icon={TiHome} /></span>
                <span className="font-medium text-xl text-blue-700">Home Visit</span>
                <p className="text-blue-500 text-lg">Tomorrow 02:00 PM</p>
              </button>
            </div>
          </div>

          {/* What Patients Say */}
          <div className="bg-white shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-3xl font-medium text-gray-700">
                What Patients Say
              </h3>
              <button className="text-blue-500 hover:text-blue-400 text-xl font-normal">
                View all
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-start gap-1 my-2">
                  <div className="relative w-14 h-14 mr-4 ml-1">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="Mohammed Al-Rashid"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <h4 className="font-medium text-xl text-gray-900">
                        Mohammed Al-Rashid
                      </h4>
                      <div className="flex pl-3 gap-1">
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-lg text-gray-600 mb-3">
                        "Dr. Sarah helped me recover from my back injury completely. Her approach was professional and the AI matching was spot on!"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-gray-400">
                      <span>2 days ago</span>
                      <span className="text-blue-500 px-2 py-0.5 text-lg">
                        Verified patient
                      </span>
                    </div>
                  </div>
                </div>


              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-start gap-1 my-2">
                  <div className="relative w-14 h-14 mr-4 ml-1">
                    <img
                      src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="Aisha Hassan"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <h4 className="font-medium text-xl text-gray-900">
                        Aisha Hassan
                      </h4>
                      <div className="flex pl-3 gap-1">
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                        <span className="text-gray-300 text-xl"><IconWrapper icon={FaStar} /></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-lg text-gray-600 mb-3">
                        "The home visit service was excellent. Very convenient and the therapist was well-prepared with all equipment."
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-gray-400">
                      <span>1 week ago</span>
                      <span className="text-blue-500 px-2 py-0.5 text-lg">
                        Verified patient
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* Insurance & Payments */}
          <div className='bg-gradient-to-br from-green-50 to-blue-50 p-6'>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl"><IconWrapper icon={FaShieldHalved} /></span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Insurance & Payments
                    <p className="text-lg font-normal text-gray-600">
                      We accept most insurance plans
                    </p>
                  </h2>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-4 mx-6 border-b border-gray-100 pb-4">
                <div className="text-center bg-gray-50 rounded-2xl p-3">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-blue-500 text-3xl"><IconWrapper icon={FaCreditCard} /></span>
                  </div>
                  <p className="text-lg font-medium text-gray-500">Cards</p>
                </div>

                <div className="text-center bg-gray-50 rounded-2xl p-3">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-orange-500 text-3xl"><IconWrapper icon={FaBuildingColumns} /></span>
                  </div>
                  <p className="text-lg font-medium text-gray-500">
                    Next: Tomorrow 9:00 AM
                  </p>
                </div>

                <div className="text-center bg-gray-50 rounded-2xl p-3">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-purple-500 text-3xl"><IconWrapper icon={FaMobileScreenButton} /></span>
                  </div>
                  <p className="text-lg font-medium text-gray-500">Digital</p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-start justify-between">
                <h3 className="text-xl text-gray-700">
                  Accepted Insurance
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-lg font-medium">
                    QNIC
                  </span>
                  <span className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-lg font-medium">
                    Doha Insurance
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-lg font-medium">
                    +3
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency */}
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

        {/* Barre de navigation fixe en bas */}
        {/* <nav className="bg-white border-t border-gray-200 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <span className="text-2xl">🏠</span>
              <span className="text-xs mt-1">Home</span>
            </button>

            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <span className="text-2xl">🔍</span>
              <span className="text-xs mt-1">Search</span>
            </button>

            <button className="flex flex-col items-center text-gray-600 relative">
              <span className="text-2xl">📅</span>
              <span className="text-xs mt-1">Calendar</span>
            </button>

            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <span className="text-2xl">❤️</span>
              <span className="text-xs mt-1">Saved</span>
            </button>

            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <span className="text-2xl">👤</span>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </nav> */}
      </div>
    );
  }
}

function PhysioBookingFlowWithRouter() {
  const navigate = useNavigate();
  return <PhysioBookingFlow navigate={navigate} />;
}

export default PhysioBookingFlowWithRouter;