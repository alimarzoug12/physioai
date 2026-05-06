import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Props {
  bookingId: string;
  onCancelled: () => void;
  onClose:     () => void;
}

const CancelBookingModal: React.FC<Props> = ({ bookingId, onCancelled, onClose }) => {
  const [policy,  setPolicy]  = useState<any>(null);
  const [reason,  setReason]  = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error,   setError]   = useState('');

  // Load cancellation policy on open
  useEffect(() => {
    api.getCancellationPolicy(bookingId)
      .then(p  => { setPolicy(p);  setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [bookingId]);

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      await api.cancelBooking(bookingId, reason);
      onCancelled();
    } catch (e: any) {
      setError(e.message);
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Cancel Booking
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : policy ? (
          <>
            {/* Refund policy info */}
            <div className={`rounded-2xl p-5 mb-6 border-2 ${
              policy.refundPercent === 100
                ? 'bg-green-50 border-green-200'
                : policy.refundPercent === 50
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {policy.refundPercent === 100 ? '✅' : policy.refundPercent === 50 ? '⚠️' : '❌'}
                </span>
                <p className={`text-xl font-bold ${
                  policy.refundPercent === 100
                    ? 'text-green-700'
                    : policy.refundPercent === 50
                      ? 'text-yellow-700'
                      : 'text-red-700'
                }`}>
                  {policy.refundPercent}% Refund
                </p>
              </div>
              <p className="text-gray-600 text-lg">{policy.policyLabel}</p>
              {policy.refundPercent > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-600 text-lg">Refund amount:</span>
                  <span className="font-bold text-xl text-gray-900">
                    {policy.refundAmount} QAR
                  </span>
                </div>
              )}
            </div>

            {/* Session info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-gray-500 text-lg">Session scheduled for:</p>
              <p className="font-semibold text-gray-900 text-xl mt-1">
                {new Date(policy.sessionDate).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })} at {policy.sessionTime}
              </p>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-xl font-semibold text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Why are you cancelling?"
                className="w-full p-4 border border-gray-200 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[100px]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-600 text-lg text-center">
                {error}
              </div>
            )}

            {/* Buttons */}
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full h-16 bg-red-500 hover:bg-red-600 text-white font-semibold text-xl rounded-2xl mb-3 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {cancelling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </>
              ) : (
                `Confirm Cancellation${policy.refundPercent > 0 ? ` — Get ${policy.refundAmount} QAR back` : ''}`
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 bg-gray-100 text-gray-600 font-medium text-xl rounded-2xl hover:bg-gray-200 transition"
            >
              Keep Booking
            </button>
          </>
        ) : (
          <p className="text-red-500 text-center text-xl">{error}</p>
        )}
      </div>
    </div>
  );
};

export default CancelBookingModal;