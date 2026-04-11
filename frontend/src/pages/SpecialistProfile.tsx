import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDirections, FaThumbsUp } from 'react-icons/fa';
import { FaAward, FaBolt, FaBrain, FaCalendar, FaCalendarPlus, FaCcMastercard, FaCcVisa, FaCheck, FaClock, FaComments, FaDumbbell, FaGraduationCap, FaHands, FaHeart, FaHospital, FaIdBadge, FaLanguage, FaLocationDot, FaMobileScreenButton, FaMoneyBill, FaPhone, FaShare, FaShieldHalved, FaSquareParking, FaStar, FaTag, FaTriangleExclamation, FaWhatsapp } from 'react-icons/fa6';
import { IoArrowBackOutline } from 'react-icons/io5';
import { PiCertificateBold } from 'react-icons/pi';
import { TbCircleDotted, TbMailFilled } from 'react-icons/tb';

//page 5 src/pages/SpecialistProfile.tsx
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface SpecialistProfileProps {
  navigate?: (path: string) => void;
}
class SpecialistProfile extends React.Component<SpecialistProfileProps> {
  state = {
    helpful: 5,
    liked: false,
  };

  handleHelpful = () => {
    this.setState((prev: any) => ({
      helpful: prev.liked ? prev.helpful - 1 : prev.helpful + 1,
      liked: !prev.liked,
    }));
  };

  render() {
    const { helpful, liked } = this.state;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-8 mx-1 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="font-medium text-gray-600 text-3xl hover:text-gray-900 transition">
            <IconWrapper icon={IoArrowBackOutline} />
          </button>
          <h1 className="text-3xl font-bold text-cyan-500">Specialist Profile</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-500 text-3xl transition pr-2">
              <IconWrapper icon={FaHeart} />
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-3xl"><IconWrapper icon={FaShare} /></button>
          </div>
        </header>

        {/* 1. Specialist Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 p-8 border-b border-gray-200">
          {/* Top: centered profile */}
          <div className="flex flex-col items-center text-center gap-2">

            {/* Avatar */}
            <div className="relative mb-2">
              <div className="w-7 h-7 bg-green-400 rounded-full absolute -top-1 left- -translate-x-1/2 animate-[colorCycle_2s_ease-in-out_infinite]"></div>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Dr. Sarah Al-Rashid"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold"><IconWrapper icon={FaCheck} /></span>
              </div>
            </div>

            {/* Name & specialty */}
            <h2 className="text-3xl font-medium text-gray-900">Dr. Sarah Al-Rashid</h2>
            <p className="text-gray-500 text-xl">Musculoskeletal Physiotherapist</p>

            {/* Stars + experience */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex pl-3 gap-1">
                <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
                <span className="text-yellow-400 text-xl"><IconWrapper icon={FaStar} /></span>
              </div>
              <span className="text-gray-700 font-medium text-xl">4.9 <span className='text-gray-500 font-normal'>(127)</span></span>
              <span className="text-gray-300 text-xl px-1">•</span>
              <span className="text-gray-600 text-xl">8 years experience</span>
            </div>

            {/* Location */}
            <p className="text-gray-600 text-xl flex items-center gap-1">
              <span className="text-blue-500"><IconWrapper icon={FaLocationDot} /></span> 1.2 km away <span className='text-2xl px-1'>•</span> Doha Sports Medicine Center
            </p>

            {/* Available Today */}
            <div className="flex items-center gap-2 text-green-500 font-medium text-xl mt-1">
              <span className="w-2.5 h-2.5 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
              Available Today
            </div>
          </div>


        </div>

        {/* Bottom: 3 stats */}
        <div className="bg-white grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-blue-600">250+</div>
            <div className="text-lg text-gray-500 mt-1">Patients Treated</div>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-gray-900">95%</div>
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
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-lg font-semibold">
              Lower Back Pain
            </span>
            <span className="text-gray-600 px-4 py-2 rounded-full text-lg font-semibold">
              Sports Injuries
            </span>
            <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-lg font-semibold">
              Neck & Shoulder
            </span>
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-lg font-semibold">
              Post-Surgery Rehab
            </span>
            <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-lg font-semibold">
              Chronic Pain
            </span>
            <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-lg font-semibold">
              Manual Therapy
            </span>
          </div>
        </div>

        {/* 3. About */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About Dr. Sarah</h3>
          <div className="flex flex-wrap gap-3">
            <p className="text-gray-700 text-lg">
              Dr. Sarah Al-Rashid is a highly experienced musculoskeletal physiotherapist with over 8 years of clinical experience. She specializes in treating sports injuries, chronic pain conditions, and post-surgical rehabilitation. Dr. Sarah holds advanced certifications in manual therapy techniques and has helped hundreds of patients regain their mobility and quality of life.
            </p>
            <button className="font-medium text-blue-500 text-xl mt-3 hover:underline">
              Read more
            </button>
          </div>
        </div>

        {/* 3. Credentials & Education */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Credentials & Education</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl"><IconWrapper icon={FaGraduationCap} /></span>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-gray-900">Master's in Physiotherapy</h4>
                <p className="text-gray-600 text-lg">
                  Qatar University - 2015
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl"><IconWrapper icon={PiCertificateBold} /></span>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-gray-900">Manual Therapy Certification</h4>
                <p className="text-gray-600 text-lg">
                  International Federation of Orthopaedic Manipulative Physical Therapists
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl"><IconWrapper icon={FaAward} /></span>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-gray-900">Sports Physiotherapy Diploma</h4>
                <p className="text-gray-600 text-lg">
                  Qatar Olympic Committee - 2018
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl"><IconWrapper icon={FaIdBadge} /></span>
              </div>
              <div>
                <h4 className="font-semibold text-xl text-gray-900">Licensed Physiotherapist</h4>
                <p className="text-gray-600 text-lg">
                  Qatar Ministry of Health - License #PT-4571
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Clinic Information */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Clinic Information</h3>
          <div className='bg-gray-50 rounded-2xl p-6'>
            {/* Clinic Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-white rounded-xl p-5 text-blue-500 text-4xl shadow-sm">
                <IconWrapper icon={FaHospital} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Doha Sports Medicine Center</h4>
                <p className="text-lg text-gray-500">Premium healthcare facility specializing in sports medicine and rehabilitation</p>
              </div>
            </div>

            {/* Info List */}
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaLocationDot} className="text-gray-400 text-xl" />
                <span>Al Sadd Street, Building 45, Doha, Qatar</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaPhone} className="text-gray-400 text-xl" />
                <span>+974 4444 5555</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaClock} className="text-gray-400 text-xl" />
                <span>Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-lg">
                <IconWrapper icon={FaSquareParking} className="text-gray-400 text-xl" />
                <span>Free parking available</span>
              </div>
            </div>

            {/* Get Directions Button */}
            <button className="w-full border border-gray-200 bg-white rounded-xl py-3 flex items-center justify-center gap-2 text-gray-700 text-lg font-medium hover:bg-gray-50 transition">
              <IconWrapper icon={FaDirections} className="text-blue-500 text-xl" />
              Get Directions
            </button>
          </div>
        </div>

        {/* 5. Location */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>

          <div className="relative h-64 md:h-72 bg-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white rounded-full p-3 text-2xl animate-[bgCycle_2s_ease-in-out_infinite] flex items-center justify-center">
                <IconWrapper icon={FaLocationDot} />
              </span>
            </div>

            <div className="flex items-center justify-between absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">

              {/* LEFT: text */}
              <div className="flex flex-col">
                <p className="text-xl font-medium text-gray-900">
                  1.2 km away
                </p>
                <p className="text-lg text-gray-600">
                  ~5 min drive
                </p>
              </div>

              {/* RIGHT: button */}
              <button className="text-xl bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
                Navigate
              </button>

            </div>
          </div>
        </div>

        {/* 6. Services & Pricing */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Services & Pricing</h3>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 pt-8 border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Initial Consultation</h4>
                  <p className="text-gray-600 text-lg mt-1">
                    Comprehensive assessment and treatment plan (60 min)
                  </p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"> <IconWrapper icon={FaCheck} /> </span>
                    Includes detailed examination & exercise prescription
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">200 QAR</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 pt-8 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Follow-up Session</h4>
                  <p className="text-gray-600 text-lg mt-1">
                    Treatment session with progress evaluation (45 min)
                  </p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"> <IconWrapper icon={FaCheck} /> </span>
                    Manual therapy, exercises & progress tracking
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">150 QAR</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 pt-8 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Home Visit</h4>
                  <p className="text-gray-600 text-lg mt-1">
                    Physiotherapy session at your location (60 min)
                  </p>
                  <p className="text-lg text-gray-600 mt-2 flex items-center gap-3">
                    <span className="w-4 h-4 text-green-500"> <IconWrapper icon={FaCheck} /> </span>
                    Includes travel within 10km radius
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-purple-600">300 QAR</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 pt-8 border border-orange-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 pb-3">Package Deal (5 sessions)</h4>
                  <p className="text-gray-600 text-lg mt-1">
                    Save 100 QAR with our treatment package
                  </p>
                  <p className="text-xl text-orange-600 mt-2 flex items-center gap-2">
                    <span className="text-lg text-orange-500 rounded-full"><IconWrapper icon={FaTag} /></span>
                    Most Popular Choice
                  </p>
                </div>
                <div className="flex flex-content text-right gap-4">
                  <span className="text-xl font-medium text-gray-400 line-through">750 QAR</span>
                  <span className="block text-2xl font-bold text-orange-600">650 QAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Next Available Slots */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Next Available Slots</h3>

          <div className="space-y-6">
            <div className='border border-gray-200 p-5 rounded-2xl'>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-xl text-gray-900">Today, Dec 4</span>
                <span className="text-green-600 text-lg">3 slots available</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-100 px-5 py-3 rounded-xl text-green-700 font-semibold">
                  2:00 PM
                </button>
                <button className="bg-green-100 px-5 py-3 rounded-xl text-green-700 font-semibold">
                  4:30 PM
                </button>
                <button className="bg-green-100 px-5 py-3 rounded-xl text-green-700 font-semibold">
                  6:00 PM
                </button>
              </div>
            </div>

            <div className='border border-gray-200 p-5 rounded-2xl'>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-xl text-gray-900">Tomorrow, Dec 5</span>
                <span className="text-blue-600 text-lg">5 slots available</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                  9:00 AM
                </button>
                <button className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                  11:30 AM
                </button>
                <button className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                  2:00 PM
                </button>
                <button className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                  4:30 PM
                </button>
                <button className="bg-blue-100 px-5 py-3 rounded-xl text-blue-700 font-semibold">
                  6:00 PM
                </button>
              </div>
            </div>

            <button className="text-xl w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition">
              <span className="text-xl text-blue-500"><IconWrapper icon={FaCalendar} /></span>
              View Full Calendar
            </button>
          </div>
        </div>

        {/* 8. Patient Reviews - Score */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Patient Reviews</h3>
            <button className="text-blue-400 text-xl">
              View all (127)
            </button>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            {/* Score Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl font-bold text-gray-900">4.9</div>
              <div>
                <div className="flex gap-0.5 pb-2">
                  {[...Array(5)].map((_, i) => (
                    <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-2xl" />
                  ))}
                </div>
                <p className="text-gray-500 text-lg">Based on 127 reviews</p>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-1">
              {[
                { star: 5, count: 108, width: "85%" },
                { star: 4, count: 15, width: "12%" },
                { star: 3, count: 3, width: "2%" },
                { star: 2, count: 1, width: "1%" },
                { star: 1, count: 0, width: "0%" },
              ].map(({ star, count, width }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-6 text-right text-gray-600 text-xl mr-6">{star}★</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width }}
                    ></div>
                  </div>
                  <span className="w-6 text-gray-500 text-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 9. Avis patients */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="space-y-8">

            {/* Ahmed M. */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Ahmed M."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-xl text-gray-900 pb-1">Ahmed M.</h4>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-xl" />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-gray-400 text-lg">2 days ago</span>
              </div>

              <p className="text-gray-700 text-xl">
                "Excellent experience with Dr. Sarah! She diagnosed my lower back issue quickly and provided a comprehensive treatment plan. After just 3 sessions, my pain has significantly reduced. Highly professional and caring."
              </p>

              <div className="flex items-center gap-4 mt-3 text-lg">
                <span
                  className="flex items-center gap-1 text-gray-500 cursor-pointer select-none"
                  onClick={this.handleHelpful}
                >
                  <IconWrapper
                    icon={FaThumbsUp}
                    className={`mr-1 transition-colors ${liked ? "text-blue-500" : "text-gray-400"}`}
                  />
                  Helpful ({helpful})
                </span>
                <span className="flex items-center gap-1 text-gray-700 text-lg font-semibold">
                  ✓ Verified Patient
                </span>
              </div>
            </div>

            {/* Fatima K. */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Fatima K."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-xl text-gray-900 pb-1">Fatima K.</h4>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-xl" />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-gray-400 text-lg">1 week ago</span>
              </div>

              <p className="text-gray-700 text-xl">
                "Dr. Sarah helped me recover from a sports injury. Her expertise in manual therapy is outstanding. The clinic is well-equipped and the staff is very friendly. I would definitely recommend her to anyone needing physiotherapy."
              </p>

              <div className="flex items-center gap-4 mt-3 text-lg">
                <span
                  className="flex items-center gap-1 text-gray-500 cursor-pointer select-none"
                  onClick={this.handleHelpful}
                >
                  <IconWrapper
                    icon={FaThumbsUp}
                    className={`mr-1 transition-colors ${liked ? "text-blue-500" : "text-gray-400"}`}
                  />
                  Helpful ({helpful})
                </span>
                <span className="flex items-center gap-1 text-gray-700 text-lg font-semibold">
                  ✓ Verified Patient
                </span>
              </div>
            </div>

            {/* Omar H. */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="https://randomuser.me/api/portraits/men/54.jpg"
                  alt="Omar H."
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-xl text-gray-900 pb-1">Omar H.</h4>
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <IconWrapper key={i} icon={FaStar} className="text-yellow-400 text-xl" />
                    ))}
                    <IconWrapper icon={FaStar} className="text-gray-300 text-xl" />
                  </div>
                </div>
                <span className="ml-auto text-gray-400 text-lg">2 week ago</span>
              </div>

              <p className="text-gray-700 text-xl">
                "Great physiotherapist with excellent knowledge. The treatment was effective and I felt improvement after the first session. Only minor complaint is the waiting time, but overall very satisfied with the care received."
              </p>

              <div className="flex items-center gap-4 mt-3 text-lg">
                <span
                  className="flex items-center gap-1 text-gray-500 cursor-pointer select-none"
                  onClick={this.handleHelpful}
                >
                  <IconWrapper
                    icon={FaThumbsUp}
                    className={`mr-1 transition-colors ${liked ? "text-blue-500" : "text-gray-400"}`}
                  />
                  Helpful ({helpful})
                </span>
                <span className="flex items-center gap-1 text-gray-700 text-lg font-semibold">
                  ✓ Verified Patient
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 10. Treatment Approaches */}
        <div className="text-left bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Treatment Approaches</h3>

          <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
              <span className="text-blue-500 text-3xl flex justify-center pb-2"><IconWrapper icon={FaHands} /></span>
              <h4 className="font-semibold text-gray-900 text-lg">Manual Therapy</h4>
              <p className="text-gray-600 text-lg">
                Hands-on treatment techniques
              </p>
            </div>

            <div className="text-center bg-white border border-gray-200 rounded-2xl p-5">
              <span className="text-3xl flex justify-center pb-2"><IconWrapper icon={FaDumbbell} /></span>
              <h4 className="font-semibold text-gray-900 text-lg">Exercise Therapy</h4>
              <p className="text-gray-600 text-lg">
                Customized rehabilitation programs
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5">
              <span className="text-purple-500 text-3xl flex justify-center pb-2"><IconWrapper icon={FaBolt} /></span>
              <h4 className="font-semibold text-gray-900 text-lg">Electrotherapy</h4>
              <p className="text-gray-600 text-lg">
                Advanced pain relief techniques
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-5">
              <span className="text-orange-500 text-3xl flex justify-center pb-2"><IconWrapper icon={FaBrain} /></span>
              <h4 className="font-semibold text-gray-900 text-lg">Pain Education</h4>
              <p className="text-gray-600 text-lg">
                Understanding your condition
              </p>
            </div>
          </div>
        </div>

        {/* 11. Languages & Communication */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Languages & Communication</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 p-2 text-3xl mt-0.5">
                <IconWrapper icon={FaLanguage} />
              </span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Languages Spoken</h4>
                <p className="text-gray-500 text-lg">Arabic (Native), English (Fluent), French (Conversational)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-gray-800 p-2 text-3xl mt-0.5">
                <IconWrapper icon={FaComments} />
              </span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Communication Style</h4>
                <p className="text-gray-500 text-lg">Patient-centered, clear explanations, empathetic approach</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-purple-600 p-2 text-3xl mt-0.5">
                <IconWrapper icon={FaMobileScreenButton} />
              </span>
              <div>
                <h4 className="font-semibold text-gray-900 text-xl">Follow-up Support</h4>
                <p className="text-gray-500 text-lg">WhatsApp consultations, exercise video guidance available</p>
              </div>
            </div>
          </div>
        </div>

        {/* 12. Insurance & Payment Options */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance & Payment Options</h3>

          <div className="mb-5">
            <h4 className="font-semibold text-gray-700 text-xl mb-3">Accepted Insurance</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-blue-200 bg-blue-50 rounded-xl flex flex-col items-center justify-center py-4 gap-2">
                <IconWrapper icon={FaShieldHalved} className="text-blue-600 text-2xl" />
                <span className="text-gray-700 text-lg">Qatar Insurance</span>
              </div>
              <div className="border border-gray-200 rounded-xl flex flex-col items-center justify-center py-4 gap-2">
                <IconWrapper icon={FaHeart} className="text-gray-900 text-2xl" />
                <span className="text-gray-700 text-lg">Al Ahlia</span>
              </div>
              <div className="border border-purple-200 bg-purple-50 rounded-xl flex flex-col items-center justify-center py-4 gap-2">
                <IconWrapper icon={TbCircleDotted} className="text-purple-500 text-2xl" />
                <span className="text-gray-700 text-lg">QLM</span>
              </div>
            </div>
            <button className="text-blue-500 text-lg mt-3 hover:underline">
              View all accepted insurance
            </button>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 text-xl mb-3">Payment Methods</h4>
            <div className="flex items-center gap-3">
              <IconWrapper icon={FaCcVisa} className="text-blue-700 text-4xl" />
              <IconWrapper icon={FaCcMastercard} className="text-red-500 text-4xl" />
              <IconWrapper icon={FaMobileScreenButton} className="text-gray-700 text-3xl" />
              <IconWrapper icon={FaMoneyBill} className="text-green-500 text-3xl" />
              <span className="text-gray-600 text-lg">Cards, Mobile Pay, Cash</span>
            </div>
          </div>
        </div>

        {/* 12. Contact & Emergency */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact & Emergency</h3>

          <div className="flex flex-col gap-4">
            {/* WhatsApp */}
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
              <IconWrapper icon={FaWhatsapp} className="text-2xl" />
              WhatsApp Dr. Sarah
            </button>

            {/* Call + Email */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
                <IconWrapper icon={FaPhone} className="text-xl" />
                Call Clinic
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 text-purple-600 py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2">
                <IconWrapper icon={TbMailFilled} className="text-xl" />
                Send Email
              </button>
            </div>

            {/* Emergency */}
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

        {/* 13. Other Specialists */}
        <div className="bg-gray-50 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Other Specialists You Might Like</h3>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              {
                name: "Dr. Mohammed Al-Thani",
                specialty: "Sports Physiotherapist",
                rating: 4.8,
                stars: 5,
                distance: "2.1 km",
                img: "https://randomuser.me/api/portraits/men/41.jpg",
              },
              {
                name: "Dr. Aisha Rahman",
                specialty: "Rehabilitation Specialist",
                rating: 4.7,
                stars: 4,
                distance: "3.5 km",
                img: "https://randomuser.me/api/portraits/women/65.jpg",
              },
              {
                name: "Dr. Hassan Al-Kuwari",
                specialty: "Manual Therapist",
                rating: 4.9,
                stars: 5,
                distance: "1.8 km",
                img: "https://randomuser.me/api/portraits/men/22.jpg",
              },
            ].map((doctor, index) => (
              <div
                key={index}
                className="bg-white min-w-[180px] max-w-[400px] border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xl leading-tight">{doctor.name}</h4>
                    <p className="text-gray-500 text-xl">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <IconWrapper
                      key={i}
                      icon={FaStar}
                      className={`text-xl ${i < doctor.stars ? "text-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="text-gray-700 text-lg ml-1">{doctor.rating}</span>
                  <span className="text-gray-400 text-lg ml-auto">{doctor.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 14. Book Appointment */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[540px] bg-white rounded-3xl shadow-2xl p-6 z-50 mb-8">

          {/* Top Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-br from-blue-500 to-blue-50 text-white rounded-full p-5 text-xl">
                <IconWrapper icon={FaCalendar} />
              </span>
              <div>
                <h4 className="font-bold text-gray-900 text-xl">Book Appointment</h4>
                <p className="text-gray-500 text-lg">Next available: Today 2:00 PM</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-bold text-3xl">200 QAR</p>
              <p className="text-gray-400 text-lg">Initial consultation</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => this.props.navigate?.('/book')} className="bg-gradient-to-r from-blue-500 to-white hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold text-xl transition flex items-center justify-center gap-2 shadow-lg">
              <IconWrapper icon={FaCalendarPlus} />
              Book Now
            </button>
            <button onClick={() => this.props.navigate?.('/ai-assistant')} style={{ border: "3px solid #2563eb" }} className="text-blue-600 hover:bg-blue-50 py-4 rounded-2xl font-semibold text-2xl transition flex items-center justify-center gap-2">
              <IconWrapper icon={FaComments} />
              Chat First
            </button>
          </div>
        </div>

      </div>
    );
  }
}

function SpecialistProfileWithRouter() {
  const navigate = useNavigate();
  return <SpecialistProfile navigate={navigate} />;
}

export default SpecialistProfileWithRouter;