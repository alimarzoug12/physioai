import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import {
  FaArrowLeft, FaWallet, FaEye, FaEyeSlash, FaShieldHalved, FaPlus,
  FaDownload, FaCreditCard, FaCcVisa, FaCcMastercard, FaBuildingColumns,
  FaUserDoctor, FaCircleCheck, FaFileInvoiceDollar, FaStar, FaFingerprint,
  FaLock, FaHouse, FaCalendar, FaRobot, FaUser, FaGift, FaApplePay,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { MdNotifications } from 'react-icons/md';
import { TbCashBanknoteMove } from 'react-icons/tb';
import { TiHome } from 'react-icons/ti';
import { api } from '../services/api';

const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => (
  <Icon className={className} />
);

// ── Types ─────────────────────────────────────────────────────────
interface WalletData {
  balance: number;
  currency: string;
  rewardPoints: number;
}

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'BANK' | 'DIGITAL_WALLET';
  label: string;
  sublabel: string;
  last4?: string;
  expiry?: string;
  holderName?: string;
  provider?: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  title: string;
  subtitle: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
}

interface SpendingCategory {
  category: string;
  label: string;
  amount: number;
  percent: number;
}

interface SpendingData {
  categories: SpendingCategory[];
  total: number;
}

interface State {
  wallet: WalletData | null;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  spending: SpendingData | null;
  loading: boolean;
  error: string | null;
  balanceVisible: boolean;
}

interface WalletProps {
  navigate?: (path: string | number) => void;
}

// ── Helpers ───────────────────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  const abs = Math.abs(amount).toFixed(2);
  const formatted = parseFloat(abs).toLocaleString('en-QA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${currency} ${formatted}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86_400_000);

  if (days === 0) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (days === 1) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Map category → icon + colors
const CATEGORY_META: Record<string, { icon: any; bg: string; clr: string }> = {
  SESSION:        { icon: FaUserDoctor,       bg: 'bg-green-500',  clr: 'text-white' },
  TOP_UP:         { icon: FaPlus,             bg: 'bg-blue-500',   clr: 'text-white' },
  HOME_VISIT:     { icon: TiHome,             bg: 'bg-purple-500', clr: 'text-white' },
  REFERRAL:       { icon: FaGift,             bg: 'bg-orange-500', clr: 'text-white' },
  REHABILITATION: { icon: FaFileInvoiceDollar, bg: 'bg-gray-200',   clr: 'text-gray-700' },
  WITHDRAWAL:     { icon: FaDownload,         bg: 'bg-red-500',    clr: 'text-white' },
  OTHER:          { icon: FaArrowLeft,        bg: 'bg-gray-400',   clr: 'text-white' },
};

const SPENDING_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
const SPENDING_DOTS   = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];

// Map provider → card icon component
function PaymentIcon({ method }: { method: PaymentMethod }) {
  if (method.type === 'CARD') {
    if (method.provider === 'visa')       return <IconWrapper icon={FaCcVisa}       className="text-white text-4xl" />;
    if (method.provider === 'mastercard') return <IconWrapper icon={FaCcMastercard} className="text-white text-4xl" />;
    return <IconWrapper icon={FaCreditCard} className="text-white text-2xl" />;
  }
  if (method.type === 'BANK')           return <IconWrapper icon={FaBuildingColumns} />;
  if (method.provider === 'apple')      return <IconWrapper icon={FaApplePay}        className="text-white text-4xl" />;
  return <IconWrapper icon={FaWallet} />;
}

// ── Component ─────────────────────────────────────────────────────
class WalletPage extends React.Component<WalletProps, State> {
  state: State = {
    wallet:         null,
    paymentMethods: [],
    transactions:   [],
    spending:       null,
    loading:        true,
    error:          null,
    balanceVisible: true,
  };

  async componentDidMount() {
    const token = localStorage.getItem('token') ?? '';
    try {
      const [wallet, paymentMethods, transactions, spending] = await Promise.all([
        api.getWallet(token),
        api.getPaymentMethods(token),
        api.getTransactions(token),
        api.getWalletSpending(token),
      ]);
      this.setState({ wallet, paymentMethods, transactions, spending, loading: false });
    } catch (err: any) {
      this.setState({ error: err.message || 'Failed to load wallet', loading: false });
    }
  }

  toggleBalance = () => this.setState(s => ({ balanceVisible: !s.balanceVisible }));

  // ── Render helpers ─────────────────────────────────────────────

  renderPaymentCard(method: PaymentMethod, index: number) {
    // Primary card (default CARD type) gets the gradient treatment
    if (method.type === 'CARD' && method.isDefault) {
      return (
        <div key={method.id} className="bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl p-6 mb-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 mb-6">
            <IconWrapper icon={FaCreditCard} className="text-white text-3xl" />
            <p className="text-white font-semibold text-xl">Primary Card</p>
            <div className="ml-auto">
              <PaymentIcon method={method} />
            </div>
          </div>
          <p className="text-white text-2xl font-medium tracking-widest mb-3">
            •••• •••• •••• {method.last4 ?? '----'}
          </p>
          <div className="flex justify-between">
            <p className="text-white/80 text-xl">{method.holderName ?? ''}</p>
            <p className="text-white/80 text-xl">{method.expiry ?? ''}</p>
          </div>
        </div>
      );
    }

    // Bank / digital wallet — flat card
    const iconBg: Record<string, string> = {
      qnb:   'bg-green-500',
      apple: 'bg-gradient-to-br from-purple-500 to-blue-500',
    };

    return (
      <div key={method.id} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-4 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
        <div className={`w-16 h-16 ${iconBg[method.provider ?? ''] ?? 'bg-gray-500'} rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0`}>
          <PaymentIcon method={method} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xl">{method.label}</p>
          <p className="text-gray-500 text-lg">{method.sublabel}</p>
        </div>
        <div className={`flex items-center gap-1 text-xl font-medium ${method.isVerified ? 'text-green-500' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full ${method.isVerified ? 'bg-green-500' : 'bg-gray-400'}`} />
          {method.isVerified ? 'Verified' : 'Pending'}
        </div>
      </div>
    );
  }

  renderTransaction(txn: Transaction) {
    const meta = CATEGORY_META[txn.category] ?? CATEGORY_META.OTHER;
    const isCredit = txn.type === 'CREDIT';

    return (
      <div key={txn.id} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
        <div className={`w-16 h-16 ${meta.bg} rounded-full flex items-center justify-center ${meta.clr} text-2xl flex-shrink-0`}>
          <IconWrapper icon={meta.icon} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xl">{txn.title}</p>
          <p className="text-gray-500 text-lg">{txn.subtitle}</p>
          <p className="text-gray-400 text-lg">{formatDate(txn.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-xl ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
            {formatAmount(txn.amount, 'QAR')}
          </p>
          <div className="flex items-center gap-1 justify-end mt-1">
            {txn.status === 'COMPLETED' && (
              <>
                <IconWrapper icon={FaCircleCheck} className="text-green-500 text-lg" />
                <span className="text-green-500 text-lg">Completed</span>
              </>
            )}
            {txn.status === 'PENDING' && (
              <span className="text-yellow-500 text-lg">Pending</span>
            )}
            {txn.status === 'FAILED' && (
              <>
                <IconWrapper icon={FaTriangleExclamation} className="text-red-400 text-lg" />
                <span className="text-red-400 text-lg">Failed</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { wallet, paymentMethods, transactions, spending, loading, error, balanceVisible } = this.state;

    // ── Loading ──────────────────────────────────────────────────
    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl text-gray-500">Loading wallet...</p>
        </div>
      </div>
    );

    // ── Error ────────────────────────────────────────────────────
    if (error || !wallet) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-500 text-xl mb-4">{error ?? 'Wallet not found'}</p>
          <button
            onClick={() => this.props.navigate?.(-1)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

    const balanceDisplay = balanceVisible
      ? wallet.balance.toLocaleString('en-QA', { minimumFractionDigits: 2 })
      : '••••••';

    return (
      <div className="min-h-screen bg-gray-50 pb-24">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10 mb-8">
          <button onClick={() => this.props.navigate?.(-1)} className="text-gray-600 text-2xl">
            <IconWrapper icon={FaArrowLeft} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-500 mb-2">My Wallet</h1>
            <p className="text-lg text-gray-500 flex items-center justify-center gap-1">
              Secure & Protected
            </p>
          </div>
          <button className="text-gray-600 text-3xl">
            <IconWrapper icon={MdNotifications} />
          </button>
        </header>

        {/* Balance Card */}
        <div className="m-6 mb-10 shadow-[0_0_28px_rgba(0,0,0,0.3)] rounded-3xl shadow-blue-300">
          <div className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-8 right-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">
                <IconWrapper icon={FaWallet} />
              </div>
            </div>
            <p className="text-white/80 text-xl mb-1">Available Balance</p>
            <h1 className="text-5xl font-bold text-white mb-6 mt-2">
              {wallet.currency} {balanceDisplay}
            </h1>
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-white/80 text-xl mb-2">
                <IconWrapper icon={FaShieldHalved} className="text-white/80" />
                <span>Protected by 256-bit encryption</span>
              </div>
              <button onClick={this.toggleBalance} className="text-white text-3xl hover:text-white/70 transition-colors">
                <IconWrapper icon={balanceVisible ? FaEye : FaEyeSlash} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="m-6 mb-10 grid grid-cols-4 gap-4">
          {[
            { icon: FaPlus,            bg: 'bg-blue-500',   label: 'Add Funds',  textColor: 'text-white'     },
            { icon: TbCashBanknoteMove, bg: 'bg-gray-100',   label: 'Send Money', textColor: 'text-gray-500'  },
            { icon: FaDownload,        bg: 'bg-purple-500', label: 'Withdraw',   textColor: 'text-white'     },
            { icon: FaHistory,         bg: 'bg-orange-500', label: 'History',    textColor: 'text-white'     },
          ].map(({ icon, bg, label, textColor }) => (
            <div key={label} className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
              <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-2xl ${textColor}`}>
                <IconWrapper icon={icon} />
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
          {paymentMethods.length > 0
            ? paymentMethods.map((m, i) => this.renderPaymentCard(m, i))
            : <p className="text-gray-400 text-xl text-center py-4">No payment methods added yet.</p>
          }
        </div>

        {/* Recent Transactions */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-500 text-xl">View All</button>
          </div>
          <div className="space-y-5">
            {transactions.length > 0
              ? transactions.map(t => this.renderTransaction(t))
              : <p className="text-gray-400 text-xl text-center py-8">No transactions yet.</p>
            }
          </div>
        </div>

        {/* This Month's Spending */}
        {spending && spending.categories.length > 0 && (
          <div className="m-6 mb-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">This Month's Spending</h3>
              <button className="text-blue-500 text-xl">Details</button>
            </div>
            <div className="space-y-6 mb-5">
              {spending.categories.map(({ label, amount, percent }, i) => (
                <div key={label}>
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${SPENDING_DOTS[i % SPENDING_DOTS.length]}`} />
                      <span className="text-gray-700 text-2xl">{label}</span>
                    </div>
                    <span className="text-gray-900 font-semibold text-xl">
                      {wallet.currency} {amount.toLocaleString('en-QA', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`${SPENDING_COLORS[i % SPENDING_COLORS.length]} h-full rounded-full transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <p className="text-gray-700 text-xl font-semibold">Total Spent</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                {wallet.currency} {spending.total.toLocaleString('en-QA', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Rewards Points */}
        <div className="m-6 mb-10 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 mb-4">
              <IconWrapper icon={FaStar} className="text-orange-500 text-3xl" />
              <h3 className="font-bold text-2xl text-gray-900">Rewards Points</h3>
            </div>
            <p className="text-orange-500 text-xl font-semibold">
              {wallet.rewardPoints.toLocaleString('en-QA')} pts
            </p>
          </div>
          <p className="text-gray-600 text-lg mb-4">
            Earn 1 point for every {wallet.currency} spent. Redeem for discounts and free sessions!
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 rounded-2xl text-xl font-semibold">
              Redeem Points
            </button>
            <button className="bg-white border border-orange-200 text-orange-600 py-3 rounded-2xl text-xl font-semibold">
              View Rewards
            </button>
          </div>
        </div>

        {/* Security & Protection — UI-only, no DB needed */}
        <div className="m-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_0_28px_rgba(0,0,0,0.1)]">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Protection</h3>
          <div className="space-y-5">
            {[
              { icon: FaFingerprint, bg: 'bg-green-600',  label: 'Biometric Authentication', sub: 'Touch ID & Face ID enabled',            checked: true  },
              { icon: FaShieldHalved, bg: 'bg-blue-600',  label: 'Transaction Alerts',        sub: 'Instant notifications for all payments', checked: true  },
              { icon: FaLock,        bg: 'bg-purple-600', label: 'Auto-Lock Wallet',           sub: 'Lock after 5 minutes of inactivity',    checked: false },
            ].map(({ icon, bg, label, sub, checked }) => (
              <div key={label} className="flex items-center gap-4 space-y-2">
                <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                  <IconWrapper icon={icon} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-xl">{label}</p>
                  <p className="text-gray-500 text-lg">{sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        {/* <nav className="bg-white border-t border-gray-100 py-3 px-4 fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            {[
              { icon: FaHouse,    label: 'Home',     active: false, path: '/patient-home' },
              { icon: FaCalendar, label: 'Bookings', active: false, path: '/sessions'     },
              { icon: FaRobot,    label: 'AI Chat',  active: false, path: '/ai-assistant', center: true },
              { icon: FaWallet,   label: 'Wallet',   active: true,  path: '/wallet'       },
              { icon: FaUser,     label: 'Profile',  active: false, path: '/settings'     },
            ].map(({ icon, label, active, path, center }) => (
              <button
                key={label}
                onClick={() => this.props.navigate?.(path)}
                className={`flex flex-col items-center gap-1 ${active ? 'text-blue-500' : 'text-gray-400'}`}
              >
                {center ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl -mt-4 shadow-md">
                    <IconWrapper icon={icon} />
                  </div>
                ) : (
                  <span className="text-xl"><IconWrapper icon={icon} /></span>
                )}
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </nav> */}

      </div>
    );
  }
}

function WalletWithRouter() {
  const navigate = useNavigate();
  return <WalletPage navigate={navigate as any} />;
}

export default WalletWithRouter;