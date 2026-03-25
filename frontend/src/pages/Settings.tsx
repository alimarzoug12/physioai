import React from 'react';

//page 11 src/pages/Settings.jsx
class Settings extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* n1: Settings */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <button className="text-gray-500 text-xl">&lt;</button>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <button className="text-gray-500">🔍</button>
          </div>
          <p className="text-gray-500 text-sm mb-6">Manage your preferences</p>
          <div className="flex items-center mb-6">
            <img src="placeholder-user.jpg" alt="Ahmed Al-Mansouri" className="w-12 h-12 rounded-full mr-3" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ahmed Al-Mansouri</p>
              <p className="text-sm text-gray-600">ahmed.almansouri@email.com</p>
              <div className="flex gap-2 mt-1">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Verified</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">Premium</span>
              </div>
            </div>
            <button className="text-gray-500">✏️</button>
          </div>
          <div className="flex justify-around text-center mb-6">
            <div>
              <p className="text-2xl font-bold text-blue-500">12</p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">4.9</p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">8mo</p>
              <p className="text-sm text-gray-500">Member</p>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">👤</span>
              <p className="font-semibold text-gray-900">Edit Profile</p>
              <p className="text-sm text-gray-600">Update personal info</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">🔒</span>
              <p className="font-semibold text-gray-900">Privacy</p>
              <p className="text-sm text-gray-600">Security settings</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">💳</span>
              <p className="font-semibold text-gray-900">Payment</p>
              <p className="text-sm text-gray-600">Cards & billing</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center relative">
              <span className="text-2xl mb-2 block">🔔</span>
              <p className="font-semibold text-gray-900">Notifications</p>
              <p className="text-sm text-gray-600">Alerts & updates</p>
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
            </div>
          </div>
        </div>

        {/* n2: Personal Information */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">👤</span>
                <div>
                  <p className="font-semibold text-gray-900">Full Name</p>
                  <p className="text-sm text-gray-600">Ahmed Al-Mansouri</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">✉️</span>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">ahmed.almansouri@email.com</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Phone Number</p>
                  <p className="text-sm text-gray-600">+974 5555 1234</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">🎂</span>
                <div>
                  <p className="font-semibold text-gray-900">Date of Birth</p>
                  <p className="text-sm text-gray-600">March 15, 1990</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">⚥</span>
                <div>
                  <p className="font-semibold text-gray-900">Gender</p>
                  <p className="text-sm text-gray-600">Male</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">Doha, Qatar</p>
                </div>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
          </div>
        </div>

        {/* n3: Health Profile */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Health Profile</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-pink-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">❤️</span>
                <div>
                  <p className="font-semibold text-gray-900">Medical Conditions</p>
                  <p className="text-sm text-gray-600">Lower back issues, Previous sports injury</p>
                </div>
              </div>
              <button className="text-red-500">Update</button>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">💊</span>
                <div>
                  <p className="font-semibold text-gray-900">Current Medications</p>
                  <p className="text-sm text-gray-600">Ibuprofen 400mg (as needed)</p>
                </div>
              </div>
              <button className="text-green-500">Update</button>
            </div>
            <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">🤚</span>
                <div>
                  <p className="font-semibold text-gray-900">Allergies</p>
                  <p className="text-sm text-gray-600">None reported</p>
                </div>
              </div>
              <button className="text-blue-500">Update</button>
            </div>
            <div className="flex justify-between items-center bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">⬆️</span>
                <div>
                  <p className="font-semibold text-gray-900">Activity Level</p>
                  <p className="text-sm text-gray-600">Moderately active, 3x/week gym</p>
                </div>
              </div>
              <button className="text-purple-500">Update</button>
            </div>
          </div>
        </div>

        {/* n4: Language */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Language & Region</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">A²</span>
                <div>
                  <p className="font-semibold text-gray-900">App Language</p>
                  <p className="text-sm text-gray-600">English (US)</p>
                </div>
              </div>
              <button className="text-blue-600">English ▾</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">🌍</span>
                <div>
                  <p className="font-semibold text-gray-900">Region</p>
                  <p className="text-sm text-gray-600">Qatar (QR)</p>
                </div>
              </div>
              <button className="text-blue-600">Qatar ▾</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">Currency</p>
                  <p className="text-sm text-gray-600">Qatari Riyal (QAR)</p>
                </div>
              </div>
              <button className="text-blue-600">QAR ▾</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">⏰</span>
                <div>
                  <p className="font-semibold text-gray-900">Time Format</p>
                  <p className="text-sm text-gray-600">12-hour (AM/PM)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* n5: Notification Settings */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs mb-4 inline-block">3 New</span>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">🔔</span>
                <div>
                  <p className="font-semibold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive alerts on your device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">Appointment Reminders</p>
                  <p className="text-sm text-gray-600">24h and 1h before sessions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">🤖</span>
                <div>
                  <p className="font-semibold text-gray-900">AI Health Tips</p>
                  <p className="text-sm text-gray-600">Daily wellness recommendations</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-xl">💳</span>
                <div>
                  <p className="font-semibold text-gray-900">Payment Updates</p>
                  <p className="text-sm text-gray-600">Billing and transaction alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-xl">★</span>
                <div>
                  <p className="font-semibold text-gray-900">Session Feedback</p>
                  <p className="text-sm text-gray-600">Rate your therapist after sessions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* n6: Email Notification */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-xl">✉️</span>
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Weekly summary and updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* n7: Privacy */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy & Security</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">👆</span>
                <div>
                  <p className="font-semibold text-gray-900">Biometric Login</p>
                  <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Extra security for your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-600">Share health insights with providers</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">Location Services</p>
                  <p className="text-sm text-gray-600">Find nearby physiotherapists</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-xl">🔑</span>
                <div>
                  <p className="font-semibold text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">Privacy Policy</p>
                  <p className="text-sm text-gray-600">Review how we protect your data</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* n8: App Preferences */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">App Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">🌙</span>
                <div>
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">🎨</span>
                <div>
                  <p className="font-semibold text-gray-900">App Theme</p>
                  <p className="text-sm text-gray-600">Blue & Mint (Default)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">Tt</span>
                <div>
                  <p className="font-semibold text-gray-900">Font Size</p>
                  <p className="text-sm text-gray-600">Medium (Recommended)</p>
                </div>
              </div>
              <button className="text-blue-600">Medium ▾</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">🔍</span>
                <div>
                  <p className="font-semibold text-gray-900">Compact Mode</p>
                  <p className="text-sm text-gray-600">Show more content on screen</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-xl">📶</span>
                <div>
                  <p className="font-semibold text-gray-900">Auto-Download</p>
                  <p className="text-sm text-gray-600">Download content on WiFi only</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* n9: Support */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Support & Help</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">❓</span>
                <div>
                  <p className="font-semibold text-gray-900">FAQ & Help Center</p>
                  <p className="text-sm text-gray-600">Find answers to common questions</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-900">Live Chat Support</p>
                  <p className="text-sm text-gray-600">Chat with our support team</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Online</span>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Call Support</p>
                  <p className="text-sm text-gray-600">+974 4000 1234 (24/7)</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">🐞</span>
                <div>
                  <p className="font-semibold text-gray-900">Report a Bug</p>
                  <p className="text-sm text-gray-600">Help us improve the app</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-xl">★</span>
                <div>
                  <p className="font-semibold text-gray-900">Rate the App</p>
                  <p className="text-sm text-gray-600">Share your experience</p>
                </div>
              </div>
              <div className="text-yellow-500">★★★★★</div>
              <button className="text-blue-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* n10: About */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">About & Legal</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">ℹ️</span>
                <div>
                  <p className="font-semibold text-gray-900">About Physio AI</p>
                  <p className="text-sm text-gray-600">Version 2.1.3 (Build 2103)</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">Terms of Service</p>
                  <p className="text-sm text-gray-600">User agreement and conditions</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-purple-500 text-xl">🛡️</span>
                <div>
                  <p className="font-semibold text-gray-900">Privacy Policy</p>
                  <p className="text-sm text-gray-600">How we handle your data</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-xl">📜</span>
                <div>
                  <p className="font-semibold text-gray-900">Licenses</p>
                  <p className="text-sm text-gray-600">Open source acknowledgments</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* n11: Data Management */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">↓</span>
                <div>
                  <p className="font-semibold text-gray-900">Export My Data</p>
                  <p className="text-sm text-gray-600">Download your health records</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-xl">🔄</span>
                <div>
                  <p className="font-semibold text-gray-900">Sync Data</p>
                  <p className="text-sm text-gray-600">Last sync: 2 hours ago</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">🗑️</span>
                <div>
                  <p className="font-semibold text-gray-900">Clear Cache</p>
                  <p className="text-sm text-gray-600">Free up 128 MB of storage</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* n12: Account Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-xl">➡️</span>
                <div>
                  <p className="font-semibold text-gray-900">Sign Out</p>
                  <p className="text-sm text-gray-600">Log out from this device</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="flex justify-between items-center bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">✖️</span>
                <div>
                  <p className="font-semibold text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-600">Permanently remove your account</p>
                </div>
              </div>
              <button className="text-blue-600">&gt;</button>
            </div>
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <p className="font-semibold">Important Notice</p>
              </div>
              <p className="text-sm mt-2">Deleting your account will permanently remove all your health data, session history, and cannot be undone.</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-blue-500 mb-2">🤖</div>
            <p className="font-semibold text-gray-900">Physio AI</p>
            <p className="text-sm text-gray-600">Your trusted AI-powered physiotherapy companion</p>
            <p className="text-sm text-gray-500 mt-2">Version 2.1.3 • Made in Qatar • © 2024</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;