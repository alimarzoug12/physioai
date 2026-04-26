import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentsApi } from '../services/payments';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const [status,    setStatus]    = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Stripe sends session_id, Tap sends tap_id
    const stripeSessionId = searchParams.get('session_id');
    const tapChargeId     = searchParams.get('tap_id');
    const cancelled       = searchParams.get('status') === 'cancelled';
    const chargeId        = stripeSessionId || tapChargeId;

    if (cancelled || !chargeId) {
      setStatus('failed');
      return;
    }

    paymentsApi.verifyCharge(chargeId)
      .then(result => {
        setBookingId(result.bookingId || '');
        setStatus(result.success ? 'success' : 'failed');
        if (result.success) {
          setTimeout(() => navigate('/sessions'), 3000);
        }
      })
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">

        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying payment...</h2>
            <p className="text-gray-400 text-xl">Please do not close this page</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-500 text-5xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
            <p className="text-gray-500 text-xl mb-2">Your booking is confirmed.</p>
            <p className="text-gray-400 text-lg">Redirecting to your sessions...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-5xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h2>
            <p className="text-gray-500 text-xl mb-6">
              Your booking has not been confirmed. No money was charged.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl font-semibold text-xl"
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentCallback;