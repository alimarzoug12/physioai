import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props { doctorId: string; }

const DoctorReviews: React.FC<Props> = ({ doctorId }) => {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);

  const load = async (p: number) => {
    setLoading(true);
    try {
      const result = await api.getDoctorReviews(doctorId, p);
      setData(result);
      setPage(p);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(1); }, [doctorId]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return null;

  const { reviews, summary, pagination } = data;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">

      {/* Summary */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{summary.averageRating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center my-1">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`text-2xl ${s <= Math.round(summary.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <p className="text-gray-400 text-lg">{summary.totalReviews} reviews</p>
        </div>

        {/* Star breakdown */}
        <div className="flex-1 space-y-1">
          {[5,4,3,2,1].map(star => {
            const count = summary.starCounts[star] ?? 0;
            const pct   = summary.totalReviews > 0
              ? Math.round((count / summary.totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-lg text-gray-500 w-4">{star}</span>
                <span className="text-yellow-400 text-lg">★</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400 text-lg w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-400 text-xl py-6">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="border-b border-gray-50 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-gray-900 text-xl">{r.patientName}</p>
                <p className="text-gray-400 text-lg">
                  {new Date(r.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-xl ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              {r.comment && <p className="text-gray-600 text-xl">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => load(page - 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-lg disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-gray-500 text-lg">
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => load(page + 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-lg disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorReviews;