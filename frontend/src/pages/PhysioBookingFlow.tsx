//page 4 src/components/PhysioBookingFlow.tsx
import React from 'react';

//page 4 src/components/PhysioBookingFlow.tsx
interface AppState {
  step: number; // 1 → 4
}

class PhysioBookingFlow extends React.Component<{}, AppState> {
  state: AppState = {
    step: 1, // Commence par l'écran 1
  };

  handleNextStep = () => {
    this.setState(prev => ({ step: prev.step + 1 }));
  };

  renderStep() {
    const { step } = this.state;

    // Étape 1: Recommended Specialists (premier screenshot)
    if (step === 1) {
      return (
        <div className="flex-1 px-4 py-6 md:px-8 md:py-10 max-w-5xl mx-auto w-full">
          {/* Localisation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Doha, Qatar</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Recommended Specialists
              </h2>
            </div>
            <p className="text-sm text-gray-500">📍 Doha, Qatar</p>
          </div>

          {/* NOUVELLE SECTION : AI Match Results (placée ici, juste avant les filtres) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🧠</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  AI Match Results
                </h3>
              </div>

              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">94%</div>
                <div className="text-sm text-gray-500">Match Score</div>
              </div>
            </div>

            <p className="text-gray-600 mb-5">
              Based on lower back strain symptoms
            </p>

            <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-5">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Specialists</div>
              </div>

              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">2.3km</div>
                <div className="text-sm text-gray-600">Avg Distance</div>
              </div>

              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">Today</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
              <span>▼</span> Filters
            </button>

            <div className="flex flex-wrap gap-2">
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 transition">
                <span>📍</span> Nearby (5km)
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition">
                <span>★</span> 4+ Rating
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition">
                <span>🕒</span> Available Today
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition">
                <span>$</span> Price Range
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition">
                <span>♂♀</span> Gender
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="text-gray-700 hover:text-gray-900">
                <span className="text-xl">≡</span> List
              </button>
              <button className="text-gray-700 hover:text-gray-900">
                <span className="text-xl">🗺</span> Map
              </button>
            </div>
          </div>

          {/* AI Top Pick Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-400 to-cyan-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <span className="bg-blue-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                    AI TOP PICK
                  </span>
                </div>
                <button className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 transition">
                  ♡
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt="Dr. Sarah Al-Mansouri"
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Dr. Sarah Al-Mansouri
                    </h3>
                    <span className="text-blue-600 text-lg">✓</span>
                  </div>

                  <p className="text-gray-600 mt-1">
                    Musculoskeletal Physiotherapist
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500 text-lg">★★★★★</span>
                    <span className="text-gray-600">4.9 (127)</span>
                  </div>

                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <span>📍</span> 1.2 km away
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-bold">8 years</span>
                  <p className="text-gray-600">Experience</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">QAR 180</span>
                  <p className="text-gray-600">Per session</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 transition">
                  Call
                </button>
                <button
                  onClick={this.handleNextStep}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Available Today
                  </span>
                  <button className="text-blue-600 text-sm hover:underline">
                    View all slots
                  </button>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg py-3 text-center text-sm font-medium text-green-800">
                    10:00 AM
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg py-3 text-center text-sm font-medium text-green-800">
                    2:30 PM
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg py-3 text-center text-sm font-medium text-green-800">
                    4:00 PM
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg py-3 text-center text-sm font-medium text-gray-600">
                    +3 More
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-yellow-600">✦</span> Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                    Lower Back Pain
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                    Sports Injuries
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                    Manual Therapy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Étape 2: Liste des spécialistes + cliniques
    if (step === 2) {
      return (
        <div className="flex-1 px-4 py-6 md:px-8 md:py-10 max-w-4xl mx-auto w-full">
          {/* NOUVELLE SECTION AJOUTÉE : Dr. Ahmed Hassan + Dr. Fatima Al-Zahra */}
          <div className="space-y-6 mb-8">
            {/* Dr. Ahmed Hassan */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="Dr. Ahmed Hassan"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. Ahmed Hassan
                      </h3>
                      <span className="text-blue-600 text-lg">✓</span>
                    </div>

                    <p className="text-gray-600 mt-1">
                      Orthopedic Physiotherapist
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-gray-600">4.7 (89)</span>
                    </div>

                    <p className="text-gray-600 mt-1 flex items-center gap-1">
                      <span>📍</span> 2.1 km away
                    </p>

                    <div className="flex items-center justify-between mt-4 text-sm">
                      <div>
                        <span className="font-bold">12 years</span>
                        <span className="text-gray-600"> Experience</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">QAR 160</span>
                        <span className="text-gray-600"> Per session</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                        View
                      </button>
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Book
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      Available Today
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                      Spine Care
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                      +2
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dr. Fatima Al-Zahra */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      alt="Dr. Fatima Al-Zahra"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. Fatima Al-Zahra
                      </h3>
                      <span className="text-blue-600 text-lg">✓</span>
                    </div>

                    <p className="text-gray-600 mt-1">
                      Sports Medicine & Rehabilitation
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-gray-600">4.8 (156)</span>
                    </div>

                    <p className="text-gray-600 mt-1 flex items-center gap-1">
                      <span>📍</span> 3.5 km away
                    </p>

                    <div className="flex items-center justify-between mt-4 text-sm">
                      <div>
                        <span className="font-bold">6 years</span>
                        <span className="text-gray-600"> Experience</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">QAR 200</span>
                        <span className="text-gray-600"> Per session</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                        View
                      </button>
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Book
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-amber-700 font-medium mb-3">
                    <span className="text-xl">🏠</span> Offers Home Visits +QAR 50
                  </div>
                  <p className="text-sm text-gray-600">
                    Home Care
                  </p>
                </div>                
              </div>
            </div>
          </div>

          {/* Clinique */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-400 to-cyan-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                    CLINIC
                  </span>
                  <button className="ml-auto text-white text-2xl hover:text-red-400 transition">
                    ♡
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <div className="w-full h-full bg-gray-200 rounded-full"></div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Elite Physo Center
                    </h3>
                  </div>

                  <p className="text-gray-600 mt-1">
                    Multi-specialist Rehabilitation Center
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-600">4.6 (234)</span>
                  </div>

                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <span>📍</span> 1.8 km away
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-bold">8 Doctors</span>
                  <p className="text-gray-600">Available</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">QAR 150</span>
                  <p className="text-gray-600">Starting from</p>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                  View
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                  Book
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                  Hydrotherapy
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                  Gym Access
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                  Massage
                </span>                
              </div>
            </div>
          </div>

          {/* Spécialiste */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="relative flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt="Dr. Omar Khalil"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Dr. Omar Khalil
                    </h3>
                    <span className="text-blue-600 text-lg">✓</span>
                  </div>

                  <p className="text-gray-600 mt-1">
                    Pain Management Specialist
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-600">4.9 (78)</span>
                  </div>

                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <span>📍</span> 4.2 km away
                  </p>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div>
                      <span className="font-bold">15 years</span>
                      <span className="text-gray-600"> Experience</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">QAR 220</span>
                      <span className="text-gray-600"> Per session</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                      View
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                      Book
                    </button>
                  </div>
                </div>
              </div>

              {/* REMPLACEMENT : Languages + Tags */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                {/* Languages */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">Languages:</span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        <span className="text-blue-600 font-semibold">AR</span>
                        <span>Arabic</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        <span className="text-blue-600 font-semibold">EN</span>
                        <span>English</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        <span className="text-blue-600 font-semibold">FR</span>
                        <span>French</span>
                    </span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <span className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200">
                    Pain Relief
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                    Acupuncture
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Étape 3: Quick Book + Reviews
    if (step === 3) {
      return (
        <div className="flex-1 px-4 py-6 md:px-8 md:py-10 max-w-4xl mx-auto w-full">
          {/* Quick Book */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">
                  Quick Book
                </h3>
              </div>
              <p className="text-base md:text-lg opacity-90">
                Skip the browsing, book instantly
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 mb-1">
                  <span className="text-xl">🕒</span>
                  <span className="font-bold text-lg">Next Available</span>
                </div>
                <p className="text-gray-600">Today 10:00 AM</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-700 mb-1">
                  <span className="text-xl">📅</span>
                  <span className="font-bold text-lg">Tomorrow</span>
                </div>
                <p className="text-gray-600">09:00 AM</p>
              </div>

              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-700 mb-1">
                  <span className="text-xl">🏠</span>
                  <span className="font-bold text-lg">Home Visit</span>
                </div>
                <p className="text-gray-600">Available</p>
              </div>
            </div>
          </div>

          {/* What Patients Say */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                What Patients Say
              </h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                      M
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Mohammed Al-Rashid
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-sm text-gray-600">5.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Dr. Sarah helped me recover from my back injury completely. Her approach was professional and the AI matching was spot on!"
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>2 days ago</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Verified patient
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Aisha Hassan
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-sm text-gray-600">4.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "The home visit service was excellent. Very convenient and the therapist was well-prepared with all equipment."
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>1 week ago</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Verified patient
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Étape 4: Insurance & Payments + Emergency + Bottom Nav
    if (step === 4) {
      return (
        <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
          {/* Carte Insurance */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-3xl">🛡️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Insurance & Payments
                </h2>
              </div>
              <p className="text-gray-600">
                We accept most insurance plans
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">💳</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Cards</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-2xl">🕒</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Next: Tomorrow 9:00 AM
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">📱</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Digital</p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Accepted Insurance
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  QNIC
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Doha Insurance
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  +3
                </span>
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-red-600 text-3xl">🚨</span>
              <h3 className="text-xl font-bold text-red-800">
                Emergency?
              </h3>
            </div>
            <p className="text-red-700 mb-6">
              For severe pain or urgent care, call 999 immediately
            </p>
            <button className="w-full bg-red-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-red-700 transition shadow-md">
              Call 999
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {this.renderStep()}

        {/* Barre de navigation fixe en bas */}
        <nav className="bg-white border-t border-gray-200 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
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
        </nav>
      </div>
    );
  }
}

export default PhysioBookingFlow;