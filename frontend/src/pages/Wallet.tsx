import React from 'react';

//page 9 src/pages/Wallet.tsx
class Wallet extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        {/* n1: My Wallet */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <button className="text-white text-xl">&lt;</button>
            <h2 className="text-lg font-semibold">My Wallet</h2>
            <div className="flex items-center gap-2">
              <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-xs">Secure & Protected</span>
              <button className="text-white">🔔</button>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">QAR 2,450.00</h1>
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-sm opacity-80 mt-2 flex items-center gap-1">
            <span className="text-xl">🛡️</span> Protected by 256-bit encryption
          </p>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-white text-2xl">+</span>
              </div>
              <p className="text-sm">Add Funds</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-white text-2xl">→</span>
              </div>
              <p className="text-sm">Send Money</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-white text-2xl">↓</span>
              </div>
              <p className="text-sm">Withdraw</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-white text-2xl">📜</span>
              </div>
              <p className="text-sm">History</p>
            </div>
          </div>
        </div>

        {/* n2: Payment Methods */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button className="text-blue-600 text-sm">+ Add New</button>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl p-4 mb-4 flex items-center">
            <span className="text-2xl mr-2">💳</span>
            <div className="flex-1">
              <p className="font-semibold">Primary Card</p>
              <p className="text-sm opacity-80">Ahmed Al-Rashid **** 4532</p>
            </div>
            <span className="bg-white text-purple-700 px-2 py-1 rounded font-semibold text-xs">VISA</span>
            <p className="ml-2 text-sm opacity-80">12/26</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center">
            <div className="bg-green-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
              <span>🏦</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Qatar National Bank</p>
              <p className="text-sm text-gray-600">Account ending in 8901</p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Verified</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center">
            <div className="bg-purple-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
              <span>🍎</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Apple Pay</p>
              <p className="text-sm text-gray-600">Touch ID & Face ID enabled</p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Active</span>
          </div>
        </div>

        {/* n3: Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="bg-green-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                <span>👩‍⚕️</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Dr. Sarah Al-Mahmoud</p>
                <p className="text-sm text-gray-600">Physiotherapy Session</p>
                <p className="text-sm text-gray-600">Today, 2:30 PM</p>
              </div>
              <div className="text-right">
                <p className="text-red-600 font-semibold">-QAR 180.00</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="bg-blue-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                <span>+</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Wallet Top-up</p>
                <p className="text-sm text-gray-600">Bank Transfer</p>
                <p className="text-sm text-gray-600">Yesterday, 10:15 AM</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">+QAR 500.00</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="bg-purple-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                <span>🏠</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Home Visit Session</p>
                <p className="text-sm text-gray-600">Dr. Omar Khalil</p>
                <p className="text-sm text-gray-600">Dec 28, 4:00 PM</p>
              </div>
              <div className="text-right">
                <p className="text-red-600 font-semibold">-QAR 250.00</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="bg-orange-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                <span>🎁</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Referral Bonus</p>
                <p className="text-sm text-gray-600">Friend joined Physio AI</p>
                <p className="text-sm text-gray-600">Dec 27, 9:30 AM</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">+QAR 50.00</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
              </div>
            </div>
            {/* n4: Rehab Program */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center">
              <div className="bg-blue-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                <span>💪</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Rehab Program Payment</p>
                <p className="text-sm text-gray-600">4-week package</p>
                <p className="text-sm text-gray-600">Dec 25, 1:20 PM</p>
              </div>
              <div className="text-right">
                <p className="text-red-600 font-semibold">-QAR 720.00</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* n5: Total Spent */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">This Month's Spending</h3>
            <button className="text-blue-600 text-sm">Details</button>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="bg-blue-500 w-3 h-3 rounded-full mr-3"></div>
              <p className="flex-1 text-gray-900">Physiotherapy</p>
              <p className="text-gray-900 font-semibold">QAR 1,280</p>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-500 h-2 rounded-full w-[70%]"></div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-500 w-3 h-3 rounded-full mr-3"></div>
              <p className="flex-1 text-gray-900">Home Visits</p>
              <p className="text-gray-900 font-semibold">QAR 750</p>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-purple-500 h-2 rounded-full w-[40%]"></div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-300 w-3 h-3 rounded-full mr-3"></div>
              <p className="flex-1 text-gray-900">Rehabilitation</p>
              <p className="text-gray-900 font-semibold">QAR 720</p>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-300 h-2 rounded-full w-[35%]"></div>
            </div>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <p className="text-gray-900">Total Spent</p>
            <p className="text-teal-500">QAR 2,750</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 mt-6 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-orange-500 text-xl mr-2">★</span>
                <p className="font-semibold text-gray-900">Reward Points</p>
              </div>
              <p className="text-orange-500">2,450 pts</p>
            </div>
            <p className="text-sm text-gray-600">Earn 1 point for every QAR spent. Redeem for discounts and free sessions!</p>
            <div className="flex gap-4 mt-4">
              <button className="bg-orange-500 text-white py-3 rounded-xl flex-1 font-medium">Redeem Points</button>
              <button className="bg-white border border-orange-500 text-orange-500 py-3 rounded-xl flex-1 font-medium">View Rewards</button>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Protection</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                  <span>👆</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Biometric Authentication</p>
                  <p className="text-sm text-gray-600">Touch ID & Face ID enabled</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                  <span>🔔</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Transaction Alerts</p>
                  <p className="text-sm text-gray-600">Instant notifications for all payments</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-500 w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white">
                  <span>🔒</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Auto-Lock Wallet</p>
                  <p className="text-sm text-gray-600">Lock after 5 minutes of inactivity</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around items-center text-gray-600 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl">🏠</span>
              <p>Home</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🗓️</span>
              <p>Bookings</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🤖</span>
              <p>AI Chat</p>
            </div>
            <div className="flex flex-col items-center text-blue-600">
              <span className="text-2xl">💳</span>
              <p>Wallet</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">👤</span>
              <p>Profile</p>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Wallet;