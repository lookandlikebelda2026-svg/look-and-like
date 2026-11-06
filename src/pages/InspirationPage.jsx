import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowRight, Calendar, ArrowUp } from 'lucide-react';
import { useContentStorage } from '../services/contentStorage';
import { InspirationMasonrySkeleton } from '../components/common/Skeleton';

const INITIAL_BATCH_SIZE = 12;
const LOAD_MORE_BATCH_SIZE = 12;

export function InspirationPage({ onOpenBooking, onNotify }) {
  const navigate = useNavigate();
  const { inspiredImages = [], loadingLookbook } = useContentStorage();
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Infinite scroll pagination state
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTargetRef = useRef(null);

  // Touch gestures for mobile finger sliding in Lightbox
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchDeltaX(0);
      setIsSwiping(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    const swipeThreshold = 45;
    if (touchDeltaX < -swipeThreshold) {
      setActiveLightboxIndex((prev) => {
        const next = prev === inspiredImages.length - 1 ? 0 : prev + 1;
        if (next >= visibleCount) {
          setVisibleCount((curr) => Math.min(inspiredImages.length, Math.max(curr, next + 1)));
        }
        return next;
      });
    } else if (touchDeltaX > swipeThreshold) {
      setActiveLightboxIndex((prev) => (prev === 0 ? inspiredImages.length - 1 : prev - 1));
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Clamp visibleCount if items list size shrinks
  useEffect(() => {
    if (inspiredImages.length > 0 && visibleCount > inspiredImages.length) {
      setVisibleCount(Math.min(inspiredImages.length, Math.max(INITIAL_BATCH_SIZE, inspiredImages.length)));
    }
  }, [inspiredImages.length, visibleCount]);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeLightboxIndex]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= inspiredImages.length) return;
    setIsLoadingMore(true);

    // Brief delay for silky-smooth visual feedback
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_BATCH_SIZE, inspiredImages.length));
      setIsLoadingMore(false);
    }, 280);
  }, [isLoadingMore, visibleCount, inspiredImages.length]);

  // IntersectionObserver for Infinite Scrolling
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || visibleCount >= inspiredImages.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '300px', // Preload before reaching the exact bottom
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [loadMore, visibleCount, inspiredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLightboxIndex === null || !inspiredImages || inspiredImages.length === 0) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => {
          const next = prev === inspiredImages.length - 1 ? 0 : prev + 1;
          // Auto-expand visibleCount if user browses forward past the currently rendered images
          if (next >= visibleCount) {
            setVisibleCount((curr) => Math.min(inspiredImages.length, Math.max(curr, next + 1)));
          }
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => 
          prev === 0 ? inspiredImages.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, inspiredImages, visibleCount]);

  const visibleImages = (inspiredImages || []).slice(0, visibleCount);
  const currentLightboxItem = activeLightboxIndex !== null && inspiredImages ? inspiredImages[activeLightboxIndex] : null;
  const hasMore = visibleCount < (inspiredImages?.length || 0);

  return (
    <div className="w-full bg-white py-4 sm:py-8 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-8">
        {/* Gallery Header & Navigation Bar */}
        <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto pt-2">
          {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black mb-3">
            Editorial Lookbook &amp; Inspiration
          </span> */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-deep-espresso tracking-tight">
            Curated Atelier Looks
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#7A6B70] max-w-lg mx-auto leading-relaxed">
            Browse our hand-selected archive of hairstyles, glowing facials, couture nail art and bridal looks crafted by our master stylists.
          </p>

          {/* Quick Counter Badge */}
          {inspiredImages && inspiredImages.length > 0 && (
            <p className="mt-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-[#A59299]">
              Showing {visibleImages.length} of {inspiredImages.length} looks
            </p>
          )}

          <div className="mt-3.5 sm:mt-5 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 max-w-full px-1">
            <button
              type="button"
              onClick={() => {
                navigate('/services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex min-h-[26px] xs:min-h-[28px] sm:min-h-[32px] items-center justify-center gap-1 sm:gap-1.5 px-2.5 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full border border-border-warm bg-white hover:border-deep-espresso text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-medium text-deep-espresso transition-all hover:bg-neutral-50 cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
            >
              <span className="sm:hidden">Services &amp; Menu</span>
              <span className="hidden sm:inline">Explore Services &amp; Menu</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => onOpenBooking?.()}
              className="inline-flex min-h-[26px] xs:min-h-[28px] sm:min-h-[32px] items-center justify-center gap-1 sm:gap-1.5 px-2.5 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full bg-[#D6204E] hover:bg-[#B81942] text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-medium text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span className="sm:hidden">Reserve Chair</span>
              <span className="hidden sm:inline">Reserve Your Chair</span>
            </button>
          </div>
        </div>

        {/* Pure Images Masonry Gallery or Skeleton / Empty State */}
        {loadingLookbook ? (
          <InspirationMasonrySkeleton />
        ) : (!inspiredImages || inspiredImages.length === 0) ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl bg-[#FAF8F5] border border-[#F0CDD7] my-8">
            <span className="text-[#D6204E] text-2xl font-serif">✦</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-espresso mt-2 mb-2">
              Lookbook In Preparation
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B70] leading-relaxed mb-6">
              Our curated gallery is being updated with fresh seasonal looks. Explore our services or reserve a consultation with our master stylists.
            </p>
            <button
              type="button"
              onClick={() => onOpenBooking?.()}
              className="inline-flex items-center justify-center gap-2 bg-[#D6204E] hover:bg-[#B81942] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
            >
              <span>Reserve Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Infinite Scroll Responsive Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-4 md:gap-5 space-y-2.5 sm:space-y-4 md:space-y-5">
              {visibleImages.map((image, idx) => (
                <div
                  key={image.id || idx}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="break-inside-avoid relative rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 cursor-pointer group bg-stone-900 border border-[#F0CDD7]/40"
                  title="Click to preview full screen"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.alt || `Curated Look ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-103 select-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Subtle luxury hover overlay with frame indicator */}
                  <div className="absolute inset-2.5 sm:inset-3.5 border border-white/70 rounded-lg sm:rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-[0_0_12px_rgba(0,0,0,0.3)]" />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger Sentinel & Loading Feedback */}
            {hasMore && (
              <div
                ref={observerTargetRef}
                className="w-full py-10 sm:py-14 flex flex-col items-center justify-center"
              >
                {isLoadingMore ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-[#D6204E]/20 border-t-[#D6204E] animate-spin" />
                    <p className="text-[11px] sm:text-xs font-serif tracking-widest uppercase text-[#7A6B70]">
                      Curating More Looks...
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={loadMore}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full border border-[#F0CDD7] bg-white hover:bg-[#FFF3F6] text-xs sm:text-sm font-medium text-deep-espresso transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>Load More Looks</span>
                    <span className="text-[10px] sm:text-xs text-[#A59299]">
                      ({visibleImages.length} of {inspiredImages.length})
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* End of Gallery Atelier Message */}
            {!hasMore && inspiredImages.length > INITIAL_BATCH_SIZE && (
              <div className="mt-12 mb-8 text-center py-8 border-t border-[#F0CDD7]/60">
                <p className="text-xs sm:text-sm font-serif tracking-widest uppercase text-[#7A6B70] flex items-center justify-center gap-2">
                  <span className="text-[#D6204E]">✦</span>
                  <span>You have viewed all {inspiredImages.length} curated looks</span>
                  <span className="text-[#D6204E]">✦</span>
                </p>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-[#D6204E] hover:text-[#B81942] font-semibold transition-colors cursor-pointer group"
                >
                  <span>Back to top</span>
                  <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full-Screen Pure Image Lightbox */}
      {currentLightboxItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 cursor-zoom-out animate-fade-in select-none touch-pan-y"
          onClick={() => setActiveLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Navigation Controls */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev === 0 ? inspiredImages.length - 1 : prev - 1));
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => {
                const next = prev === inspiredImages.length - 1 ? 0 : prev + 1;
                if (next >= visibleCount) {
                  setVisibleCount((curr) => Math.min(inspiredImages.length, Math.max(curr, next + 1)));
                }
                return next;
              });
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Close Action */}
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Display with Finger Sliding Touch Gestures */}
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center cursor-default will-change-transform"
            style={{
              transform: `translateX(${touchDeltaX}px)`,
              transition: isSwiping ? 'none' : 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentLightboxItem.imageUrl}
              alt="Lookbook Look"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl select-none pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InspirationPage;
