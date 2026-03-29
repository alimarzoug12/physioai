import React, { useState } from 'react';
import { FaArrowLeft, FaHeart, FaHospital, FaCheck, FaLocationDot, FaPlus, FaSun, FaMoon, FaClock, FaWallet, FaCreditCard, FaMobileScreenButton, FaMoneyBillWave, FaTag, FaTriangleExclamation, FaStar } from 'react-icons/fa6';
import { TiHome } from 'react-icons/ti';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

class BookSession extends React.Component {
  state = {
    selectedDate: '4',
    selectedTime: '10:30 AM',
    sessionType: 'clinic',
    sessionDuration: '60',
    paymentMethod: 'wallet',
    showPromo: false,
    promoCode: '',
  };

  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays = [
    { day: 30, faded: true }, { day: 31, faded: true },
    { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
    { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, faded: true },
    { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19, faded: true },
    { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26, faded: true },
    { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 },
    { day: 1, faded: true }, { day: 2, faded: true },
  ];

  timeSlots = {
    morning: [
      { time: '9:00 AM', status: 'available' },
      { time: '10:30 AM', status: 'available' },
      { time: '11:00 AM', status: 'booked' },
    ],
    afternoon: [
      { time: '2:00 PM', status: 'available' },
      { time: '3:30 PM', status: 'available' },
      { time: '5:00 PM', status: 'available' },
    ],
    evening: [
      { time: '6:30 PM', status: 'available' },
      { time: '7:00 PM', status: 'available' },
      { time: '8:00 PM', status: 'booked' },
    ],
  };

  render() {
    const { selectedDate, selectedTime, sessionType, sessionDuration, paymentMethod, showPromo, promoCode } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-32">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 z-10">
          <button className="text-gray-700 text-2xl hover:text-gray-800">
            <span className=""><IconWrapper icon={FaArrowLeft} /></span>
          </button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-cyan-500">Book Session</h1>
            <p className="text-xl text-gray-500">Dr. Sarah Al-Mahmoud</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 text-2xl">
            <span className=""><IconWrapper icon={FaHeart} /></span>
          </button>
        </header>

        {/* Steps */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-300 text-white flex items-center justify-center font-bold text-lg">1</div>
              <span className="text-xl font-medium text-gray-800">Date & Time</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg">2</div>
              <span className="text-xl text-gray-500">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg">3</div>
              <span className="text-xl text-gray-500">Confirm</span>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Dr. Sarah Al-Mahmoud"
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-white flex items-center justify-center" style={{ border: '3px solid white' }}>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Dr. Sarah Al-Mahmoud</h2>
              <p className="text-gray-500 text-xl">Musculoskeletal Physiotherapist</p>
              <div className="flex items-center gap-2 mt-1 text-xl text-gray-500">
                <span className="text-yellow-400"><IconWrapper icon={FaStar} /></span>
                <span>4.9</span>
                <span className="text-gray-400 ml-1"><IconWrapper icon={FaClock} /></span>
                <span>8 years exp</span>
                <span className="text-gray-400 ml-1"><IconWrapper icon={FaLocationDot} /></span>
                <span>1.2 km</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                200 QAR
              </div>
              <div className="text-lg text-gray-500">per session</div>
            </div>
          </div>

          {/* Session Type */}
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-5">Session Type</h3>
          <div className="space-y-3">
            <button
              onClick={() => this.setState({ sessionType: 'clinic' })}
              className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition ${sessionType === 'clinic' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white'}`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-50 flex items-center justify-center text-white text-2xl">
                <span className=""><IconWrapper icon={FaHospital} /></span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-2xl text-gray-900">Clinic Visit</div>
                <div className="text-xl text-gray-500">Visit our modern clinic facility</div>
                <div className="flex items-center gap-2 text-xl text-gray-400 mt-1">
                  <span className="text-xl"><IconWrapper icon={FaLocationDot} /></span>
                  <span>Al Sadd Medical Center</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl">200 QAR</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${sessionType === 'clinic' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {sessionType === 'clinic' && <span className="text-white text-xs"><IconWrapper icon={FaCheck} /></span>}
                </div>
              </div>
            </button>

            <button
              onClick={() => this.setState({ sessionType: 'home' })}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${sessionType === 'home' ? 'border-purple-500 bg-purple-50  text-purple-600' : 'border-gray-100 bg-white'}`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl">
                <span className=""><IconWrapper icon={TiHome} /></span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-2xl text-gray-900">Home Visit</div>
                <div className="text-xl text-gray-500">Convenient treatment at your location</div>
                <div className="flex items-center gap-2 text-xl text-green-500 mt-1">
                  <span className="text-xl"><IconWrapper icon={FaPlus} /></span>
                  <span>Travel fee included</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl">280 QAR</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${sessionType === 'home' ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
                  {sessionType === 'home' && <span className="text-white text-xs"><IconWrapper icon={FaCheck} /></span>}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Select Date */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
            <div className="flex items-center gap-3">
              <button className=" text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowBack} /></span>
              </button>
              <span className="text-xl font-medium text-gray-700">November 2024</span>
              <button className="text-gray-400 hover:text-gray-700">
                <span className="text-2xl"><IconWrapper icon={IoIosArrowForward} /></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {this.days.map(day => (
              <div key={day} className="text-gray-400 text-lg font-medium py-2">{day}</div>
            ))}
            {this.calendarDays.map((item, idx) => (
              <button
                key={idx}
                onClick={() => !item.faded && this.setState({ selectedDate: item.day.toString() })}
                className={`py-5 rounded-xl text-xl font-medium transition ${item.day.toString() === selectedDate && !item.faded
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

        {/* Time Slots */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Available Time Slots</h3>
          {[
            { label: 'Morning', icon: FaSun, iconClass: 'text-yellow-400 text-xl', slots: this.timeSlots.morning },
            { label: 'Afternoon', icon: FaSun, iconClass: 'text-orange-400 text-xl', slots: this.timeSlots.afternoon },
            { label: 'Evening', icon: FaMoon, iconClass: 'text-indigo-400 text-xl', slots: this.timeSlots.evening },
          ].map(({ label, icon, iconClass, slots }) => (
            <div key={label} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={iconClass}><IconWrapper icon={icon} /></span>
                <span className="font-semibold text-gray-800">{label}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {slots.map(slot => (
                  <button
                    key={slot.time}
                    disabled={slot.status === 'booked'}
                    onClick={() => slot.status !== 'booked' && this.setState({ selectedTime: slot.time })}
                    className={`py-4 rounded-2xl text-center transition ${slot.status === 'booked'
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : selectedTime === slot.time
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="font-semibold">{slot.time}</div>
                    <div className="text-sm mt-0.5">{slot.status === 'booked' ? 'Booked' : 'Available'}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Session Duration */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Session Duration</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => this.setState({ sessionDuration: '60' })}
              className={`p-6 border-2 rounded-2xl text-center transition ${sessionDuration === '60' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
            >
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl bg-gradient-to-br from-blue-400 to-cyan-300">
                <span className=""><IconWrapper icon={FaClock} /></span>
              </div>
              <div className="font-bold text-gray-900 text-base">60 Minutes</div>
              <div className="text-sm text-gray-500 mt-1">Standard session</div>
              <div className={`w-6 h-6 rounded-full mx-auto mt-3 flex items-center justify-center ${sessionDuration === '60' ? 'bg-blue-500' : 'border-2 border-gray-300'}`}>
                {sessionDuration === '60' && <span className="text-white text-xs"><IconWrapper icon={FaCheck} /></span>}
              </div>
            </button>

            <button
              onClick={() => this.setState({ sessionDuration: '90' })}
              className={`p-6 border-2 rounded-2xl text-center transition ${sessionDuration === '90' ? 'border-purple-500 bg-purple-50' : 'border-gray-100'}`}
            >
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl bg-gradient-to-br from-purple-500 to-pink-400">
                <span className=""><IconWrapper icon={FaClock} /></span>
              </div>
              <div className="font-bold text-gray-900 text-base">90 Minutes</div>
              <div className="text-sm text-gray-500 mt-1">Extended session</div>
              <div className="text-green-500 text-sm font-medium mt-1">+100 QAR</div>
              <div className={`w-6 h-6 rounded-full mx-auto mt-2 flex items-center justify-center ${sessionDuration === '90' ? 'bg-purple-500' : 'border-2 border-gray-300'}`}>
                {sessionDuration === '90' && <span className="text-white text-xs"><IconWrapper icon={FaCheck} /></span>}
              </div>
            </button>
          </div>
        </div>

        {/* Special Requirements */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Special Requirements</h3>
          <div className="space-y-4 mb-6">
            {[
              'Wheelchair accessible facility needed',
              'Arabic translation assistance',
              'Specialized equipment required',
              'Companion/caregiver will attend',
            ].map(req => (
              <label key={req} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 accent-blue-500" />
                <span className="text-gray-700">{req}</span>
              </label>
            ))}
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] text-gray-600 placeholder-gray-300"
            placeholder="Any specific concerns or requests..."
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            {[
              { id: 'wallet', icon: FaWallet, bg: 'bg-green-500', label: 'Physio AI Wallet', sub: 'Balance: 450 QAR' },
              { id: 'card', icon: FaCreditCard, bg: 'bg-blue-600', label: 'Credit/Debit Card', sub: 'Visa, Mastercard accepted' },
              { id: 'sadad', icon: FaMobileScreenButton, bg: 'bg-purple-600', label: 'Sadad Payment', sub: "Qatar's national payment system" },
              { id: 'cash', icon: FaMoneyBillWave, bg: 'bg-gray-800', label: 'Cash Payment', sub: 'Pay at the clinic' },
            ].map(method => (
              <label
                key={method.id}
                onClick={() => this.setState({ paymentMethod: method.id })}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === method.id ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-green-50' : 'border-gray-100'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full ${method.bg} flex items-center justify-center text-white text-xl`}>
                  <span className=""><IconWrapper icon={method.icon} /></span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-500">{method.sub}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {paymentMethod === method.id && <span className="text-white text-xs"><IconWrapper icon={FaCheck} /></span>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Promo Code</h3>
            <button
              onClick={() => this.setState({ showPromo: !showPromo })}
              className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:underline"
            >
              <span className="text-blue-400"><IconWrapper icon={FaTag} /></span> Add Code
            </button>
          </div>
          {showPromo && (
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                value={promoCode}
                onChange={e => this.setState({ promoCode: e.target.value })}
                placeholder="Enter promo code (e.g. FIRST20)"
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <button className="bg-blue-500 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 space-y-3">
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Session Fee (60 min)</span>
              <span>200 QAR</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Platform Fee</span>
              <span>15 QAR</span>
            </div>
            <div className="flex justify-between text-green-500 text-sm">
              <span>Promo Discount (FIRST20)</span>
              <span>-43 QAR</span>
            </div>
            <div className="border-t border-blue-100 pt-3 flex justify-between font-bold text-base">
              <span>Total Amount</span>
              <span className="text-blue-500 text-xl">172 QAR</span>
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-red-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-red-500 text-lg mt-0.5"><IconWrapper icon={FaTriangleExclamation} /></span>
            <div>
              <p className="text-red-600 font-medium text-sm">Need immediate medical attention?</p>
              <a href="tel:999" className="text-red-500 underline text-sm">Call Emergency: 999</a>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300 accent-blue-500" />
              <span className="text-sm text-gray-600">
                I agree to the <span className="text-blue-500">Terms of Service</span> and{' '}
                <span className="text-blue-500">Privacy Policy</span>. I understand the cancellation policy and payment terms.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300 accent-blue-500" />
              <span className="text-sm text-gray-600">
                I consent to share my health information with the selected physiotherapist for treatment purposes.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition">
              Back to Chat
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition">
              Continue to Payment
            </button>
          </div>
        </div>

      </div>
    );
  }
}

export default BookSession;