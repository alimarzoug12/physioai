import React, { useState } from 'react';
import { api } from '../services/api';

interface Props {
  bookingId:  string;
  doctorName: string;
  onDone:     () => void;
  onClose:    () => void;
}

const ReviewModal: React.FC<Props> = ({ bookingId, doctorName, onDone, onClose }) => {
  const [rating,    setRating]    = useState(0);
  const [hover,     setHover]     = useState(0);
  const [comment,   setComment]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return; }
    console.log('Submitting review:', { bookingId, rating, comment });
    setLoading(true);
    setError('');
    try {
      await api.submitReview({ bookingId, rating, comment: comment.trim() || undefined });
      setSubmitted(true);
      setTimeout(() => { onDone(); }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const labels: Record<number, string> = {
    1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-500 text-xl">Your review has been submitted.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl">
                ⭐
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Rate Your Session
            </h2>
            <p className="text-gray-500 text-xl text-center mb-6">
              How was your session with Dr. {doctorName}?
            </p>

            {/* Star selector */}
            <div className="flex justify-center gap-3 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-5xl transition-transform hover:scale-110"
                >
                  <span className={
                    star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'
                  }>★</span>
                </button>
              ))}
            </div>

            {/* Label */}
            <p className="text-center text-xl font-medium text-gray-600 mb-6 h-7">
              {hover > 0 ? labels[hover] : rating > 0 ? labels[rating] : ''}
            </p>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={3}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-xl focus:outline-none focus:border-blue-500 mb-5 resize-none"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-500 text-lg text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="w-full h-16 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold text-xl rounded-2xl mb-3 disabled:opacity-50 transition hover:opacity-90"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>

            <button
              onClick={onClose}
              className="w-full h-14 bg-gray-100 text-gray-600 font-medium text-xl rounded-2xl hover:bg-gray-200 transition"
            >
              Maybe Later
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;