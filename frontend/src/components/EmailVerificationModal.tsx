import React, { useState } from 'react';
import { api } from '../services/api';

interface Props {
  email:      string;
  onVerified: () => void;
  onClose:    () => void;  // called when code is correct → show login form
}

const EmailVerificationModal: React.FC<Props> = ({ email, onVerified, onClose }) => {
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);

  const handleVerify = async () => {
    if (code.trim().length < 4) { setError('Please enter the verification code'); return; }
    setLoading(true);
    setError('');
    try {
      await api.verifyEmail(email, code.trim());
      onVerified();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setResent(false);
    try {
      await api.resendVerification(email);
      setResent(true);
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
          aria-label="Close"
        >
          ×
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✉️</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Check your email
        </h2>
        <p className="text-gray-500 text-xl text-center mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-blue-600 font-semibold text-xl text-center mb-8">
          {email}
        </p>

        {/* Code input */}
        <label className="block text-xl font-semibold text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyPress={e => e.key === 'Enter' && handleVerify()}
          placeholder="000000"
          maxLength={6}
          className="w-full px-5 py-5 text-3xl text-center tracking-[0.6em] border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-mono mb-5"
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-500 text-lg text-center">{error}</p>
          </div>
        )}

        {/* Resent */}
        {resent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <p className="text-green-600 text-lg text-center">
              New code sent! Check your inbox.
            </p>
          </div>
        )}

        {/* Verify */}
        <button
          onClick={handleVerify}
          disabled={loading || code.length < 4}
          className="w-full h-16 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-xl rounded-2xl mb-4 disabled:opacity-50 transition"
        >
          {loading ? 'Verifying...' : 'Verify & Continue to Login'}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            Didn't receive it?{' '}
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
            >
              Resend code
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default EmailVerificationModal;