import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const EmailVerificationBanner: React.FC = () => {
  const { user }                          = useAuth();
  const [loading,   setLoading]           = useState(false);
  const [sent,      setSent]              = useState(false);
  const [error,     setError]             = useState('');
  const [dismissed, setDismissed]         = useState(false);

  const justRegistered = sessionStorage.getItem('justRegistered') === 'true';
  if (!user || user.emailVerified || dismissed || !justRegistered) return null;

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      // ✅ pass user.email — backend expects email
      await api.resendVerification(user.email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-amber-500 text-xl flex-shrink-0">✉</span>
        <div>
          <p className="text-amber-800 text-lg font-medium">Please verify your email address</p>
          {error && <p className="text-red-500 text-lg">{error}</p>}
          {sent  && <p className="text-green-600 text-lg">Verification code sent! Check your inbox.</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {!sent && (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-amber-700 border border-amber-400 rounded-xl px-3 py-1.5 text-lg font-medium hover:bg-amber-100 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend'}
          </button>
        )}
        <button
          onClick={() => { setDismissed(true); sessionStorage.removeItem('justRegistered'); }}
          className="text-amber-500 text-xl hover:text-amber-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;