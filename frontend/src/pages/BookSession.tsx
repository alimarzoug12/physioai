// src/components/BookSession.tsx
import React, { useState } from 'react';

//page 6 src/components/BookSession.tsx
const BookSession: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('4'); // Dec 4 sélectionné
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [sessionDuration, setSessionDuration] = useState('60'); // 60 ou 90
  const [paymentMethod, setPaymentMethod] = useState('cash');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button className="text-gray-700 text-2xl hover:text-gray-900">←</button>
        <h1 className="text-xl font-bold text-gray-900">Book Session</h1>
        <button className="text-gray-700 hover:text-red-500 text-2xl">♡</button>
      </header>

      {/* 1. Book Session - Infos docteur */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              alt="Dr. Sarah Al-Mahmoud"
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Dr. Sarah Al-Mahmoud
            </h2>
            <p className="text-gray-600">Musculoskeletal Physiotherapist</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-gray-600">4.9 • 8 years exp • 1.2 km</span>
            </div>
          </div>

          <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-gray-900">200 QAR</div>
            <div className="text-sm text-gray-600">per session</div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-blue-700 font-medium">Clinic Visit</div>
            <div className="text-sm text-gray-600 mt-1">Visit our modern clinic facility</div>
            <div className="text-blue-600 font-bold mt-2">200 QAR</div>
          </div>

          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 text-center opacity-70">
            <div className="text-purple-700 font-medium">Home Visit</div>
            <div className="text-sm text-gray-600 mt-1">Convenient treatment at your location</div>
            <div className="text-purple-600 font-bold mt-2">280 QAR</div>
          </div>
        </div>
      </div>

      {/* 2. Select Date - Calendrier */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Select Date</h3>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">←</button>
            <span className="font-medium">November 2024</span>
            <button className="text-gray-600 hover:text-gray-900">→</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}

          {/* Jours vides avant le 1er */}
          <div className="py-3"></div>
          <div className="py-3"></div>
          <div className="py-3"></div>
          <div className="py-3"></div>

          {/* Exemple de jours */}
          {[30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2].map((day, idx) => (
            <button
              key={idx}
              className={`py-3 rounded-full text-sm ${
                day === 4
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDate(day.toString())}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Available Time Slots */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Available Time Slots</h3>

        {/* Morning */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-yellow-500 text-xl">☀️</span>
            <h4 className="font-semibold text-gray-900">Morning</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">9:00 AM</button>
            <button className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium">
              10:30 AM
            </button>
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">11:00 AM</button>
          </div>
        </div>

        {/* Afternoon */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-orange-500 text-xl">☀️</span>
            <h4 className="font-semibold text-gray-900">Afternoon</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">2:00 PM</button>
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">3:30 PM</button>
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">5:00 PM</button>
          </div>
        </div>

        {/* Evening */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-indigo-500 text-xl">🌙</span>
            <h4 className="font-semibold text-gray-900">Evening</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">6:30 PM</button>
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700">7:00 PM</button>
            <button className="px-5 py-3 bg-gray-100 rounded-lg text-gray-700 opacity-50 cursor-not-allowed">
              8:00 PM (Booked)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Session Duration */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Session Duration</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-5 border-2 rounded-xl text-center transition ${
              sessionDuration === '60'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSessionDuration('60')}
          >
            <div className="text-2xl mb-2">60 Minutes</div>
            <div className="text-gray-600">Standard session</div>
            {sessionDuration === '60' && (
              <div className="mt-2 text-blue-600">✓ Selected</div>
            )}
          </button>

          <button
            className={`p-5 border-2 rounded-xl text-center transition ${
              sessionDuration === '90'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSessionDuration('90')}
          >
            <div className="text-2xl mb-2">90 Minutes</div>
            <div className="text-gray-600">Extended session</div>
            <div className="text-purple-600 mt-1">+100 QAR</div>
            {sessionDuration === '90' && (
              <div className="mt-2 text-purple-600">✓ Selected</div>
            )}
          </button>
        </div>
      </div>

      {/* 5. Additional Notes + Requirements */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Special Requirements</h3>

        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
            <span className="text-gray-700">Wheelchair accessible facility needed</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
            <span className="text-gray-700">Arabic translation assistance</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
            <span className="text-gray-700">Specialized equipment required</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
            <span className="text-gray-700">Companion/caregiver will attend (+100 QAR)</span>
          </label>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          placeholder="Any specific concerns or requests..."
        ></textarea>
      </div>

      {/* 6. Payment Method - Cash sélectionné */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer bg-blue-50 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Cash Payment</div>
                <div className="text-sm text-gray-600">Pay at the clinic</div>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
              className="w-6 h-6"
            />
          </label>

          <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">💳</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Credit/Debit Card</div>
                <div className="text-sm text-gray-600">Visa, Mastercard accepted</div>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              className="w-6 h-6"
            />
          </label>

          <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📱</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Sadad Payment</div>
                <div className="text-sm text-gray-600">Qatar's national payment system</div>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              className="w-6 h-6"
            />
          </label>
        </div>
      </div>

      {/* 7. Promo Code */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Promo Code</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter promo code (e.g. FIRST20)"
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition">
            Add Code
          </button>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white p-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-700">
            <span>Session Fee (60 min)</span>
            <span>200 QAR</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Platform Fee</span>
            <span>15 QAR</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Promo Discount (FIRST20)</span>
            <span>-43 QAR</span>
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-3">
            <span>Total Amount</span>
            <span className="text-blue-600">172 QAR</span>
          </div>
        </div>

        {/* Avertissement urgence */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Need immediate medical attention? Call Emergency: 999
          </p>
        </div>

        {/* CGU */}
        <label className="flex items-start gap-3 mb-4">
          <input type="checkbox" className="w-5 h-5 mt-1 rounded border-gray-300" />
          <span className="text-sm text-gray-600">
            I agree to the <span className="text-blue-600">Terms of Service</span> and{' '}
            <span className="text-blue-600">Privacy Policy</span>. I understand the cancellation policy and payment terms.
          </span>
        </label>

        <label className="flex items-start gap-3 mb-8">
          <input type="checkbox" className="w-5 h-5 mt-1 rounded border-gray-300" />
          <span className="text-sm text-gray-600">
            I consent to share my health information with the selected physiotherapist for treatment purposes.
          </span>
        </label>

        {/* Boutons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-200 text-gray-800 py-4 rounded-xl font-medium hover:bg-gray-300 transition">
            Back to Chat
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSession;