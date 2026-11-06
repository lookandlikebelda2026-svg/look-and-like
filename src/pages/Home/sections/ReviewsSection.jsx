import React, { useState } from 'react';
import { Star, MessageSquarePlus, Sparkles, Check, Heart, ArrowRight } from 'lucide-react';
import { useReviews } from '../../../services/reviewFirebaseService';
import { Modal } from '../../../components/common/Modal';
import { ReviewsSkeleton } from '../../../components/common/Skeleton';

/**
 * Helper to format date strings cleanly
 */
function formatReviewDate(dateString) {
  if (!dateString) return 'Recently';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

/**
 * StarRatingDisplay Component (Minimalist static star display)
 */
function StarRatingDisplay({ rating = 5, size = 'w-4 h-4' }) {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < fullStars ? 'fill-amber-400 text-amber-400' : 'text-stone-300 fill-stone-100'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Client Reviews Section
 * Positioned immediately after AboutSection.
 * Displays verified reviews with smooth horizontal marquee scroll animation (like brand partners),
 * with a "Show All" button to view and browse all reviews manually in a clean modal dialog.
 */
export function ReviewsSection({ onNotify }) {
  const { verifiedReviews, loading, addReview } = useReviews();

  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [modalRatingFilter, setModalRatingFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Calculate average rating
  const avgRating =
    verifiedReviews.length > 0
      ? (
          verifiedReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) /
          verifiedReviews.length
        ).toFixed(1)
      : '5.0';

  const ratingDescriptions = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const activeRatingDisplay = hoverRating || formData.rating;

  // Prepare infinite smooth loop items (like brand partners marquee)
  let baseList = [...verifiedReviews];
  while (baseList.length < 6 && baseList.length > 0) {
    baseList = [...baseList, ...verifiedReviews];
  }
  const marqueeReviews = [...baseList, ...baseList];

  // Filtered reviews for Show All modal
  const filteredModalReviews = verifiedReviews.filter((review) => {
    if (modalRatingFilter === 'all') return true;
    return Number(review.rating) === Number(modalRatingFilter);
  });

  const handleOpenModal = () => {
    setIsSubmittedSuccess(false);
    setFormData({ name: '', rating: 5, comment: '' });
    setHoverRating(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmittedSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.comment.trim()) {
      if (onNotify) {
        onNotify('Please enter your name and a brief review.', 'error');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addReview({
        name: formData.name.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
      });

      if (res.success) {
        setIsSubmittedSuccess(true);
        if (onNotify) {
          onNotify(
            'Thank you! Your review has been submitted successfully.',
            'success'
          );
        }
      } else {
        if (onNotify) {
          onNotify(res.error || 'Failed to submit review. Please try again.', 'error');
        }
      }
    } catch (err) {
      if (onNotify) {
        onNotify('An error occurred. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ReviewsSkeleton />;
  }

  return (
    <section
      className="w-full bg-[#FAF8F5] py-10 sm:py-14 lg:py-18 border-y border-[#F0CDD7]/60 scroll-mt-20 overflow-hidden"
      id="reviews"
    >
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header: Minimal & Editorial */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <span className="mb-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D6204E] leading-tight">
              CLIENT VOICES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-deep-espresso tracking-tight">
              Loved by Our Guests
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Authentic stories and experiences from guests who trust Look &amp; Like for bridal
              artistry, skin rituals, and hair transformations.
            </p>
          </div>

          {/* Action & Stats Pill */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Average Rating Badge (Only shown when reviews exist) */}
            {verifiedReviews.length > 0 && (
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#F0CDD7] shadow-2xs">
                <StarRatingDisplay rating={Math.round(Number(avgRating))} size="w-3.5 h-3.5" />
                <span className="text-xs font-bold text-deep-espresso">{avgRating}</span>
                <span className="text-[11px] text-stone-500 font-medium">
                  ({verifiedReviews.length})
                </span>
              </div>
            )}

            {/* Leave Review Button */}
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-[#D6204E] hover:bg-[#8F1232] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Continuous Marquee Scroll Animation (Like Brand Partners) */}
      {verifiedReviews.length > 0 ? (
        <>
          <div className="relative w-full overflow-hidden py-3">
            {/* Left Gradient Blur */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
              aria-hidden="true"
            />

            {/* Right Gradient Blur */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10"
              aria-hidden="true"
            />

            {/* Continuously Moving Marquee Track */}
            <div
              className="flex w-max gap-4 sm:gap-6 animate-marquee-continuous select-none"
              style={{
                animationPlayState: isPaused ? 'paused' : 'running',
                animationDuration: '42s',
              }}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {marqueeReviews.map((review, index) => {
                const initials = (review.name || 'G')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={`${review.id}-${index}`}
                    className="shrink-0 w-[280px] xs:w-[320px] sm:w-[360px] md:w-[390px] bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/90 shadow-2xs hover:shadow-lg hover:border-[#D6204E]/50 transition-all duration-300 flex flex-col justify-between group cursor-default"
                  >
                    <div>
                      {/* Top Row: Stars & Date */}
                      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-3.5">
                        <StarRatingDisplay rating={review.rating || 5} size="w-4 h-4" />
                        <span className="text-[11px] text-stone-400 font-medium">
                          {formatReviewDate(review.createdAt)}
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-5 font-normal line-clamp-4">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Bottom: Client Profile */}
                    <div className="pt-3.5 sm:pt-4 border-t border-stone-100 flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-deep-espresso truncate">
                        {review.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Show All Reviews Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsAllReviewsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF3F6] text-deep-espresso hover:text-[#D6204E] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-2xl border border-[#F0CDD7] shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95"
            >
              <span>Show All Reviews ({verifiedReviews.length})</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-[#F0CDD7]/80 max-w-lg mx-auto">
            <Heart className="w-10 h-10 text-[#D6204E] mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg font-bold text-deep-espresso mb-1">
              Be the First to Review
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-5">
              Have you visited Look &amp; Like? Share your experience with us and help others discover
              our bespoke artistry.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-[#D6204E] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#8F1232] transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Your Review</span>
            </button>
          </div>
        </div>
      )}

      {/* Show All Reviews Modal Dialog (Browse All Reviews Manually) */}
      <Modal
        isOpen={isAllReviewsModalOpen}
        onClose={() => {
          setIsAllReviewsModalOpen(false);
          setModalRatingFilter('all');
        }}
        title="Guest Reviews & Experiences"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 pt-1">
          {/* Top Summary & Rating Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-[#FFF3F6] px-3 py-1 rounded-xl border border-[#F0CDD7]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-deep-espresso">{avgRating}</span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {verifiedReviews.length} total reviews
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setModalRatingFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  modalRatingFilter === 'all'
                    ? 'bg-[#D6204E] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({verifiedReviews.length})
              </button>
              <button
                type="button"
                onClick={() => setModalRatingFilter('5')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  modalRatingFilter === '5'
                    ? 'bg-[#D6204E] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                5 Stars ({verifiedReviews.filter((r) => Number(r.rating) === 5).length})
              </button>
            </div>
          </div>

          {/* Scrollable list of reviews */}
          <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1 [scrollbar-width:thin]">
            {filteredModalReviews.length > 0 ? (
              filteredModalReviews.map((review) => {
                const initials = (review.name || 'G')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={review.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0CDD7]/80 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <StarRatingDisplay rating={review.rating || 5} size="w-3.5 h-3.5" />
                      <span className="text-[11px] text-stone-400 font-medium">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <div className="w-7 h-7 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <span className="font-semibold text-xs text-deep-espresso">
                        {review.name}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-stone-500">
                No reviews found for this rating filter.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsAllReviewsModalOpen(false);
                handleOpenModal();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6204E] hover:underline cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAllReviewsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Submission Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isSubmittedSuccess ? '' : 'Share Your Experience'}
        maxWidth="max-w-md"
      >
        {isSubmittedSuccess ? (
          <div className="text-center py-6 sm:py-8 px-2 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-deep-espresso mb-2">
              Thank You, {formData.name || 'Valued Guest'}!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-sm leading-relaxed">
              Your review has been successfully submitted and will appear on the website once approved by our team.
            </p>
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full bg-[#D6204E] hover:bg-[#8F1232] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <p className="text-xs text-stone-600 leading-relaxed">
              We value your genuine feedback. Your review helps us continue providing world-class
              beauty care.
            </p>

            {/* Rating Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Rating
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= activeRatingDisplay
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  {ratingDescriptions[activeRatingDisplay] || ''}
                </span>
              </div>
            </div>

            {/* Guest Name Input */}
            <div>
              <label
                htmlFor="review-name"
                className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1"
              >
                Your Full Name <span className="text-[#D6204E]">*</span>
              </label>
              <input
                id="review-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Sanchita Mukherjee"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:border-[#D6204E] focus:ring-1 focus:ring-[#D6204E] outline-none transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Review Comment Textarea */}
            <div>
              <label
                htmlFor="review-comment"
                className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1"
              >
                Your Review <span className="text-[#D6204E]">*</span>
              </label>
              <textarea
                id="review-comment"
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell us about the services you received, the artists, cleanliness, or your overall experience..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:border-[#D6204E] focus:ring-1 focus:ring-[#D6204E] outline-none transition-all placeholder:text-stone-400 resize-none"
              />
            </div>

            {/* Moderation note */}
            <div className="bg-[#FFF3F6] p-3 rounded-xl border border-[#F0CDD7]/80 text-[11px] text-stone-600 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#D6204E] shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Newly submitted reviews undergo a quick review by our team before appearing on the website.
              </span>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-[#D6204E] hover:bg-[#8F1232] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
}

export default ReviewsSection;
