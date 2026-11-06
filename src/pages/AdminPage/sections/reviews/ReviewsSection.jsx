import React, { useState } from 'react';
import { Star, CheckCircle2, Clock, Trash2, ShieldCheck, EyeOff } from 'lucide-react';

function formatAdminDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Admin ReviewsSection
 * Minimalist, clean management panel for verifying and moderating client reviews.
 */
export function ReviewsSection({
  reviews = [],
  pendingCount = 0,
  verifyReview,
  deleteReview,
  onNotify,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'verified'

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.verified;
    if (filter === 'verified') return Boolean(review.verified);
    return true;
  });

  const verifiedCount = reviews.filter((r) => r.verified).length;

  const handleToggleVerification = async (review, nextStatus) => {
    try {
      const res = await verifyReview(review.id, nextStatus);
      if (res.success) {
        onNotify?.(
          nextStatus ? `Verified review from ${review.name}!` : `Unverified review from ${review.name}.`,
          'success'
        );
      } else {
        onNotify?.('Failed to update review status.', 'error');
      }
    } catch (err) {
      onNotify?.('Error updating review.', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await deleteReview(reviewId);
      if (res.success) {
        onNotify?.('Review deleted.', 'info');
      } else {
        onNotify?.('Failed to delete review.', 'error');
      }
    } catch (err) {
      onNotify?.('Error deleting review.', 'error');
    }
  };

  return (
    <div className="w-full">
      {/* Clean Action Bar matching Lookbook and Partners */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#F0CDD7]">
        <div className="flex items-center gap-2.5">
          <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso">
            Client Reviews
          </h4>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2.5 py-0.5 rounded-full shrink-0">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#D6204E] text-white shadow-2xs'
                : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
            }`}
          >
            All ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  filter === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-600 text-white'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
            }`}
          >
            Verified ({verifiedCount})
          </button>
        </div>
      </div>

      {/* Reviews Cards */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredReviews.map((review) => {
            const initials = (review.name || 'G')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={review.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-2xs flex flex-col justify-between ${
                  !review.verified
                    ? 'border-amber-300 bg-gradient-to-br from-white to-amber-50/20 ring-1 ring-amber-200/70'
                    : 'border-[#F0CDD7]'
                }`}
              >
                <div>
                  {/* Top Bar: Reviewer details & Status badge */}
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                          review.verified
                            ? 'bg-[#FFF3F6] border-[#F0CDD7] text-[#D6204E]'
                            : 'bg-amber-100 border-amber-300 text-amber-800'
                        }`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs sm:text-sm text-deep-espresso truncate">
                          {review.name}
                        </h5>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {formatAdminDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    {review.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(review.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {!review.verified ? (
                    <button
                      type="button"
                      onClick={() => handleToggleVerification(review, true)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify Review</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleVerification(review, false)}
                      className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Unverify</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-stone-200">
          <p className="text-xs text-stone-500">
            {filter === 'pending'
              ? 'No reviews are currently pending verification.'
              : 'No client reviews found.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
