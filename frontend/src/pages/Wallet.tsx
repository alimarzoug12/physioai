import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { FaArrowLeft, FaWallet, FaEye, FaShieldHalved, FaPlus, FaDownload, FaCreditCard, FaCcVisa, FaBuildingColumns, FaUserDoctor, FaCircleCheck, FaFileInvoiceDollar, FaStar, FaFingerprint, FaLock, FaHouse, FaCalendar, FaRobot, FaUser, FaGift, FaDumbbell, FaArrowRightArrowLeft, FaApplePay } from 'react-icons/fa6';
import { MdNotifications } from 'react-icons/md';
import { TbCashBanknoteMove } from 'react-icons/tb';
import { TiHome } from 'react-icons/ti';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};
interface WalletProps {
  navigate?: (path: string) => void;
}
//Page 9 src/pages/Wallet.tsx
class Wallet extends React.Component<WalletProps> {
  render() {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10 mb-8">
          <button onClick={() => this.props.navigate?.(-1 as any)} className="text-gray-600 text-2xl">
            <span className=""><IconWrapper icon={FaArrowLeft} /></span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">My Wallet</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-1">
              <span className="w-3 h-3 rounded-full animate-[colorCycle_2s_ease-in-out_infinite]"></span>
              Secure & Protected
            </p>
          </div>
          <button className="text-gray-600 text-3xl">
            <span className=""><IconWrapper icon={MdNotifications} /></span>
          </button>
        </header>

        {/* Balance Card */}
        <div className="m-6 mb-10 shadow-[0_0_28px_rgba(0,0,0,0.3)] rounded-3xl shadow-blue-300">
          <div className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-8 right-8 flex flex-col gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">
                <span className=""><IconWrapper icon={FaWallet} /></span>
              </div>
            </div>
            <p className="text-white/80 text-xl mb-1">Available Balance</p>
            <h1 className="text-5xl font-bold text-white mb-6 mt-2">QAR 2,450.00</h1>
            <div className='flex justify-between'>
              <div className="flex items-center gap-2 text-white/80 text-xl mb-2">
                <span className=""><IconWrapper icon={FaShieldHalved} className="text-white/80" /></span>
                <span>Protected by 256-bit encryption</span>
              </div>
              <button className="flex items-center justify-center text-white text-3xl hover:text-white/70 transition-colors">
                <span className=""><IconWrapper icon={FaEye} /></span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="m-6 mb-10 grid grid-cols-4 gap-4">
          {[
            { icon: FaPlus, bg: 'bg-blue-500', label: 'Add Funds', textColor: 'text-white' },
            { icon: TbCashBanknoteMove, bg: 'bg-gray-100', label: 'Send Money', textColor: 'text-gray-500' },
            { icon: FaDownload, bg: 'bg-purple-500', label: 'Withdraw', textColor: 'text-white' },
            { icon: FaHistory, bg: 'bg-orange-500', label: 'History', textColor: 'text-white' },
          ].map(({ icon, bg, label, textColor }) => (
            <div key={label} className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
              <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-2xl ${textColor}`}>
                <span className=""><IconWrapper icon={icon} /></span>
              </div>
              <p className="text-xl text-gray-700 font-medium text-center">{label}</p>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="m-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Payment Methods</h3>
            <button className="text-blue-500 text-xl">+ Add New</button>
          </div>

          {/* Primary Card */}
          <div className="bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl p-6 mb-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-white text-3xl"><IconWrapper icon={FaCreditCard} /></span>
              <p className="text-white font-semibold text-xl">Primary Card</p>
              <div className="ml-auto py-1">
                <span className="font-bold text-4xl text-white"><IconWrapper icon={FaCcVisa} /></span>
              </div>
            </div>
            <p className="text-white text-2xl font-medium tracking-widest mb-3">•••• •••• •••• 4532</p>
            <div className="flex justify-between">
              <p className="text-white/80 text-xl">Ahmed Al-Rashid</p>
              <p className="text-white/80 text-xl">12/26</p>
            </div>
          </div>

          {/* Qatar National Bank */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-4 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
              <span className=""><IconWrapper icon={FaBuildingColumns} /></span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-xl">Qatar National Bank</p>
              <p className="text-gray-500 text-lg">Account ending in 8901</p>
            </div>
            <div className="flex items-center gap-1 text-green-500 text-xl font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Verified
            </div>
          </div>

          {/* Apple Pay */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              <IconWrapper icon={FaApplePay} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-xl">Apple Pay</p>
              <p className="text-gray-500 text-lg">Touch ID enabled</p>
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-xl font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Active
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>

          <div className="space-y-5">
            {[
              { icon: FaUserDoctor, bg: 'bg-green-500', clr: 'text-white', name: 'Dr. Sarah Al-Mahmoud', sub: 'Physiotherapy Session', date: 'Today, 2:30 PM', amount: '-QAR 180.00', positive: false },
              { icon: FaPlus, bg: 'bg-blue-500', clr: 'text-white', name: 'Wallet Top-up', sub: 'Bank Transfer', date: 'Yesterday, 10:15 AM', amount: '+QAR 500.00', positive: true },
              { icon: TiHome, bg: 'bg-purple-500', clr: 'text-white', name: 'Home Visit Session', sub: 'Dr. Omar Khalil', date: 'Dec 28, 4:00 PM', amount: '-QAR 250.00', positive: false },
              { icon: FaGift, bg: 'bg-orange-500', clr: 'text-white', name: 'Referral Bonus', sub: 'Friend joined Physio AI', date: 'Dec 27, 9:30 AM', amount: '+QAR 50.00', positive: true },
              { icon: FaFileInvoiceDollar, bg: 'bg-gray-200', clr: 'text-gray-700', name: 'Rehab Program Payment', sub: '4-week package', date: 'Dec 25, 1:20 PM', amount: '-QAR 720.00', positive: false },
            ].map(({ icon, bg, clr, name, sub, date, amount, positive }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center ${clr} text-2xl flex-shrink-0`}>
                  <span className=""><IconWrapper icon={icon} /></span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xl">{name}</p>
                  <p className="text-gray-500 text-lg">{sub}</p>
                  <p className="text-gray-400 text-lg">{date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-xl ${positive ? 'text-green-500' : 'text-red-500'}`}>{amount}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <span className="text-green-500 text-lg"><IconWrapper icon={FaCircleCheck} /></span>
                    <span className="text-green-500 text-lg">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* This Month's Spending */}
        <div className="m-6 mb-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">This Month's Spending</h3>
            <button className="text-blue-500 text-xl">Details</button>
          </div>

          <div className="space-y-6 mb-5">
            {[
              { label: 'Physiotherapy', amount: 'QAR 1,280', color: 'bg-blue-500', dot: 'bg-blue-500', width: 'w-[70%]' },
              { label: 'Home Visits', amount: 'QAR 750', color: 'bg-purple-500', dot: 'bg-purple-500', width: 'w-[40%]' },
              { label: 'Rehabilitation', amount: 'QAR 720', color: 'bg-orange-500', dot: 'bg-gray-300', width: 'w-[35%]' },
            ].map(({ label, amount, color, dot, width }) => (
              <div key={label}>
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${dot}`}></span>
                    <span className="text-gray-700 text-2xl">{label}</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-xl">{amount}</span>
                </div>
                <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full ${width}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <p className="text-gray-700 text-xl font-semibold">Total Spent</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">QAR 2,750</p>
          </div>
        </div>

        {/* Rewards Points */}
        <div className="m-6 mb-10 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500 text-3xl"><IconWrapper icon={FaStar} /></span>
              <h3 className="font-bold text-2xl text-gray-900 ">Rewards Points</h3>
            </div>
            <p className="text-orange-500 text-xl font-semibold">2,450 pts</p>
          </div>
          <p className="text-gray-600 text-lg mb-4">Earn 1 point for every QAR spent. Redeem for discounts and free sessions!</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 rounded-2xl text-xl font-semibold">Redeem Points</button>
            <button className="bg-white border border-orange-200 text-orange-600 py-3 rounded-2xl text-xl font-semibold">View Rewards</button>
          </div>
        </div>

        {/* Security & Protection */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Protection</h3>
          <div className="space-y-5">
            {[
              { icon: FaFingerprint, bg: 'bg-green-600', label: 'Biometric Authentication', sub: 'Touch ID & Face ID enabled', checked: true },
              { icon: FaShieldHalved, bg: 'bg-blue-600', label: 'Transaction Alerts', sub: 'Instant notifications for all payments', checked: true },
              { icon: FaLock, bg: 'bg-purple-600', label: 'Auto-Lock Wallet', sub: 'Lock after 5 minutes of inactivity', checked: false },
            ].map(({ icon, bg, label, sub, checked }) => (
              <div key={label} className="flex items-center gap-4 space-y-2">
                <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                  <span className=""><IconWrapper icon={icon} /></span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xl">{label}</p>
                  <p className="text-gray-500 text-lg">{sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaHouse, label: 'Home', active: false },
              { icon: FaCalendar, label: 'Bookings', active: false },
              { icon: FaRobot, label: 'AI Chat', active: false, center: true },
              { icon: FaWallet, label: 'Wallet', active: true },
              { icon: FaUser, label: 'Profile', active: false },
            ].map(({ icon, label, active, center }) => (
              <button key={label} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-500' : 'text-gray-400'}`}>
                {center ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl -mt-4 shadow-md">
                    <span className=""><IconWrapper icon={icon} /></span>
                  </div>
                ) : (
                  <span className="text-xl"><IconWrapper icon={icon} /></span>
                )}
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </nav>

      </div>
    );
  }
}

function WalletWithRouter() {
  const navigate = useNavigate();
  return <Wallet navigate={navigate} />;
}

export default WalletWithRouter;