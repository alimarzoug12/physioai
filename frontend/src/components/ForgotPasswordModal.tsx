import React, { useState } from 'react';
import { api } from '../services/api';

interface Props {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔑</span>
          </div>
        </div>

        {!sent ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-xl text-center mb-8">
              Enter your email and we'll send you a reset link
            </p>

            <label className="block text-xl font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 mb-5"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-500 text-lg text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-xl rounded-2xl mb-4 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 bg-gray-100 text-gray-600 font-medium text-xl rounded-2xl hover:bg-gray-200 transition"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Check your email
            </h2>
            <p className="text-gray-500 text-xl text-center mb-2">
              We sent a password reset link to
            </p>
            <p className="text-blue-600 font-semibold text-xl text-center mb-8">{email}</p>
            <p className="text-gray-400 text-lg text-center mb-8">
              Click the link in the email to reset your password. The link expires in 1 hour.
            </p>
            <button
              onClick={onClose}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-xl rounded-2xl"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;