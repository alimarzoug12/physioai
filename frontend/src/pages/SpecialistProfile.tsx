// src/components/SpecialistProfile.tsx
import React from 'react';

//page 5 src/pages/SpecialistProfile.tsx
const SpecialistProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button className="text-gray-700 text-2xl hover:text-gray-900 transition">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Specialist Profile</h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-red-500 text-2xl transition">
            ♡
          </button>
          <button className="text-gray-700 text-2xl">↺</button>
        </div>
      </header>

      {/* 1. Specialist Profile Header */}
      <div className="bg-white p-6 md:p-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Dr. Sarah Al-Rashid"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dr. Sarah Al-Rashid
            </h2>
            <p className="text-gray-600 mt-1 text-lg">
              Musculoskeletal Physiotherapist
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
              <span className="text-yellow-500 text-2xl">★★★★★</span>
              <span className="text-gray-700 text-lg">4.9 (127)</span>
            </div>

            <p className="text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-1">
              <span>📍</span> 1.2 km away • Doha Sports Medicine Center
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">250+</div>
                <div className="text-sm text-gray-600">Patients Treated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>

            <div className="mt-6 text-green-600 font-medium flex items-center justify-center md:justify-start gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Available Today
            </div>
          </div>
        </div>
      </div>

      {/* 2. Specializations */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Specializations</h3>
        <div className="flex flex-wrap gap-3">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            Lower Back Pain
          </span>
          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            Sports Injuries
          </span>
          <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">
            Neck & Shoulder
          </span>
          <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
            Post-Surgery Rehab
          </span>
          <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
            Chronic Pain
          </span>
          <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
            Manual Therapy
          </span>
        </div>
      </div>

      {/* 3. Credentials & Education */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Credentials & Education</h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xl">🎓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Manual Therapy Certification</h4>
              <p className="text-gray-600">
                International Federation of Orthopaedic Manipulative Physical Therapists
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-xl">🏅</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Sports Physiotherapy Diploma</h4>
              <p className="text-gray-600">
                Qatar Olympic Committee - 2018
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 text-xl">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Licensed Physiotherapist</h4>
              <p className="text-gray-600">
                Qatar Ministry of Health - License #PT-4571
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Location */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>

        <div className="relative h-64 md:h-80 bg-gray-200 rounded-xl overflow-hidden mb-4">
          {/* Placeholder pour carte Google Maps */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            [Google Maps - Doha Sports Medicine Center]
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <p className="font-medium text-gray-900">
              Doha Sports Medicine Center
            </p>
            <p className="text-gray-600 text-sm mt-1">
              1.2 km away • ~5 min drive
            </p>
            <button className="mt-3 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Navigate
            </button>
          </div>
        </div>
      </div>

      {/* 5. Services & Pricing */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Services & Pricing</h3>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Initial Consultation</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Comprehensive assessment and treatment plan (60 min)
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  Includes detailed examination & exercise prescription
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">200 QAR</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Follow-up Session</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Treatment session with progress evaluation (45 min)
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  Manual therapy, exercises & progress tracking
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">150 QAR</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Home Visit</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Physiotherapy session at your location (60 min)
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  Includes travel within 10km radius
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">300 QAR</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular Choice
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">Package Deal (5 sessions)</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Save 100 QAR with our treatment package
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 line-through">750 QAR</span>
                <span className="block text-2xl font-bold text-orange-600">650 QAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Next Available Slots */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Available Slots</h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-900">Today, Dec 4</span>
              <span className="text-green-600 text-sm">3 slots available</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                2:00 PM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                4:30 PM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                6:00 PM
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-900">Tomorrow, Dec 5</span>
              <span className="text-green-600 text-sm">5 slots available</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                9:00 AM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                11:30 AM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                2:00 PM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                4:30 PM
              </button>
              <button className="bg-green-50 border border-green-200 px-5 py-3 rounded-lg text-green-800 font-medium">
                6:00 PM
              </button>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-4 rounded-xl font-medium hover:bg-blue-100 transition">
            <span className="text-xl">📅</span>
            View Full Calendar
          </button>
        </div>
      </div>

      {/* 7. Patient Reviews - Score */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Patient Reviews</h3>
          <button className="text-blue-600 hover:underline text-sm">
            View all (127)
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gray-900">4.9</div>
          <div className="flex justify-center gap-1 my-2">
            <span className="text-yellow-500 text-3xl">★★★★★</span>
          </div>
          <p className="text-gray-600">Based on 127 reviews</p>
        </div>

        {/* Barre de distribution */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 text-right text-gray-600">5★</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[85%]"></div>
            </div>
            <span className="text-gray-600">108</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-right text-gray-600">4★</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[12%]"></div>
            </div>
            <span className="text-gray-600">15</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 text-right text-gray-600">3★</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[2%]"></div>
            </div>
            <span className="text-gray-600">3</span>
          </div>
          {/* ... autres étoiles ... */}
        </div>
      </div>

      {/* 8. Avis patients */}
      <div className="bg-white p-6">
        <div className="space-y-8">
          {/* Fatima K. */}
          <div className="border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                  F
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Fatima K.</h4>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
              <span className="ml-auto text-gray-500 text-sm">1 week ago</span>
            </div>

            <p className="text-gray-700 italic">
              "Dr. Sarah helped me recover from a sports injury. Her expertise in manual therapy is outstanding. The clinic is well-equipped and the staff is very friendly. I would definitely recommend her to anyone needing physiotherapy."
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <span>👍</span> Helpful (8)
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Verified Patient
              </span>
            </div>
          </div>

          {/* Omar H. */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                  O
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Omar H.</h4>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★☆</span>
                </div>
              </div>
              <span className="ml-auto text-gray-500 text-sm">2 weeks ago</span>
            </div>

            <p className="text-gray-700 italic">
              "Great physiotherapist with excellent knowledge. The treatment was effective and I felt improvement after the first session. Only minor complaint is the waiting time, but overall very satisfied with the care received."
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <span>👍</span> Helpful (5)
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Verified Patient
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Treatment Approaches */}
      <div className="bg-white p-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Treatment Approaches</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">👐</span>
              <h4 className="font-semibold text-gray-900">Manual Therapy</h4>
            </div>
            <p className="text-gray-600">
              Hands-on treatment techniques
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏋️</span>
              <h4 className="font-semibold text-gray-900">Exercise Therapy</h4>
            </div>
            <p className="text-gray-600">
              Customized rehabilitation programs
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">⚡</span>
              <h4 className="font-semibold text-gray-900">Electrotherapy</h4>
            </div>
            <p className="text-gray-600">
              Advanced pain relief techniques
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🧠</span>
              <h4 className="font-semibold text-gray-900">Pain Education</h4>
            </div>
            <p className="text-gray-600">
              Understanding your condition
            </p>
          </div>
        </div>
      </div>

      {/* 10. Insurance & Payment Options */}
      <div className="bg-white p-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Insurance & Payment Options</h3>

        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">Accepted Insurance</h4>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-800 px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="text-blue-600">🛡️</span> Qatar Insurance
            </span>
            <span className="bg-pink-100 text-pink-800 px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="text-pink-600">♥</span> Al Ahlia
            </span>
            <span className="bg-purple-100 text-purple-800 px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="text-purple-600">!</span> QLM
            </span>
          </div>
          <button className="text-blue-600 text-sm mt-3 hover:underline">
            View all accepted insurance
          </button>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
          <div className="flex flex-wrap gap-3">
            <span className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full text-sm font-medium">VISA</span>
            <span className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full text-sm font-medium">MasterCard</span>
            <span className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full text-sm font-medium">Mobile Pay</span>
            <span className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full text-sm font-medium">Cash</span>
          </div>
        </div>
      </div>

      {/* 11. Contact & Emergency */}
      <div className="bg-white p-6 border-t border-gray-200 sticky bottom-16 md:bottom-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
            <span className="text-xl">WhatsApp</span> WhatsApp Dr. Sarah
          </button>

          <button className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <span className="text-xl">📞</span> Call Clinic
          </button>

          <button className="bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2">
            <span className="text-xl">✉️</span> Send Email
          </button>
        </div>

        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-red-600 text-2xl">⚠️</span>
            <h4 className="font-bold text-red-800">Emergency Contact</h4>
          </div>
          <p className="text-red-700">
            For urgent medical situations outside clinic hours
          </p>
          <p className="text-red-800 font-medium mt-2">
            +974 4449 9999 (24/7 Emergency Line)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecialistProfile;