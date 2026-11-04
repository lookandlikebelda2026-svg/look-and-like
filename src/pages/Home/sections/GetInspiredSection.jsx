import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_INSPIRED_IMAGES, INSTAGRAM_URL } from '../../../constants/inspiration';
import { useContentStorage } from '../../../services/contentStorage';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function GetInspiredSection({ images: propImages, instagramUrl = INSTAGRAM_URL, onNavigate }) {
  const navigate = useNavigate();
  const { inspiredImages: storedImages } = useContentStorage();
  const images = propImages || storedImages || GET_INSPIRED_IMAGES;
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [activeLook, setActiveLook] = useState(0);
  const scrollRef = useRef(null);

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null || !images || images.length === 0) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, images]);

  if (!images || images.length === 0) return null;

  // Handle mobile pagination dot click
  const handleDotClick = (index) => {
    setActiveLook(index);
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index];
    if (card) {
      const targetLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  };

  // Handle mobile touch carousel scroll to update active dot
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeLook && closestIndex >= 0 && closestIndex < images.length) {
      setActiveLook(closestIndex);
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-14 scroll-mt-20 overflow-hidden" id="inspiration">
      <span id="get-inspired" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Section Heading: Centered Eyebrow + Title */}
        <div className="mb-6 sm:mb-8 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            THE LOOKBOOK
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            Get Inspired
          </h2>
        </div>

        {/* Desktop View (≥ md): 4-Column Editorial Collage
            Column 1: 1 Tall Portrait Look (Full Height)
            Column 2: 2 Stacked Looks (Half Height each)
            Column 3: 1 Tall Portrait Look (Full Height)
            Column 4: 2 Stacked Looks (Half Height each)
        */}
        <div className="hidden md:grid md:grid-cols-4 gap-3.5 lg:gap-4.5 w-full select-none h-[460px] lg:h-[520px] xl:h-[560px] rounded-2xl lg:rounded-3xl overflow-hidden">
          {/* Column 1: Tall Look 1 */}
          {images[0] && (
            <div
              onClick={() => setActiveLightboxIndex(0)}
              className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out h-full w-full"
              title="Click to preview full screen"
            >
              <img
                src={images[0].imageUrl}
                alt={images[0].alt || "Lookbook Look 1"}
                loading="lazy"
                className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
              />
              <div className="absolute inset-4 lg:inset-5 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
            </div>
          )}

          {/* Column 2: Stacked Pair (Look 2 & Look 3) */}
          <div className="flex flex-col gap-3.5 lg:gap-4.5 h-full">
            {images[1] && (
              <div
                onClick={() => setActiveLightboxIndex(1)}
                className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out flex-1 h-1/2 w-full"
                title="Click to preview full screen"
              >
                <img
                  src={images[1].imageUrl}
                  alt={images[1].alt || "Lookbook Look 2"}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
                />
                <div className="absolute inset-3.5 lg:inset-4 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
              </div>
            )}
            {images[2] && (
              <div
                onClick={() => setActiveLightboxIndex(2)}
                className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out flex-1 h-1/2 w-full"
                title="Click to preview full screen"
              >
                <img
                  src={images[2].imageUrl}
                  alt={images[2].alt || "Lookbook Look 3"}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
                />
                <div className="absolute inset-3.5 lg:inset-4 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
              </div>
            )}
          </div>

          {/* Column 3: Tall Look 4 */}
          {images[3] && (
            <div
              onClick={() => setActiveLightboxIndex(3)}
              className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out h-full w-full"
              title="Click to preview full screen"
            >
              <img
                src={images[3].imageUrl}
                alt={images[3].alt || "Lookbook Look 4"}
                loading="lazy"
                className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
              />
              <div className="absolute inset-4 lg:inset-5 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
            </div>
          )}

          {/* Column 4: Stacked Pair (Look 5 & Look 6) */}
          <div className="flex flex-col gap-3.5 lg:gap-4.5 h-full">
            {images[4] && (
              <div
                onClick={() => setActiveLightboxIndex(4)}
                className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out flex-1 h-1/2 w-full"
                title="Click to preview full screen"
              >
                <img
                  src={images[4].imageUrl}
                  alt={images[4].alt || "Lookbook Look 5"}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
                />
                <div className="absolute inset-3.5 lg:inset-4 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
              </div>
            )}
            {images[5] && (
              <div
                onClick={() => setActiveLightboxIndex(5)}
                className="group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-500 ease-out flex-1 h-1/2 w-full"
                title="Click to preview full screen"
              >
                <img
                  src={images[5].imageUrl}
                  alt={images[5].alt || "Lookbook Look 6"}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_top] transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
                />
                <div className="absolute inset-3.5 lg:inset-4 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile View (< md): Touch-Snap Carousel with Peek */}
        <div className="-mx-4 md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => setActiveLightboxIndex(idx)}
                className="w-[82%] xs:w-[76%] max-w-[300px] flex-none snap-center group cursor-pointer"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#F0CDD7]/80 shadow-xs bg-[#FFF3F6]">
                  <img
                    src={img.imageUrl}
                    alt={img.alt || "Lookbook Look"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeLook === idx
                    ? 'w-6 bg-[#D6204E]'
                    : 'w-2 bg-[#F0CDD7] hover:bg-[#D6204E]/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Clean Dedicated Action Button Placed Below the Gallery */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/inspiration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black hover:bg-neutral-800 text-white px-4.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium tracking-wide shadow-2xs hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer group whitespace-nowrap"
          >
            <span>Explore Lookbook</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
          </button>
        </div>

      </div>

      {/* Full-Screen Pure Image Lightbox for Desktop & Mobile */}
      {activeLightboxIndex !== null && images[activeLightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 cursor-zoom-out animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Navigation Controls */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 p-2.5 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Active Image */}
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[activeLightboxIndex].imageUrl} 
              alt={images[activeLightboxIndex].alt || "Lookbook Look"} 
              className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
            />
            {images[activeLightboxIndex].alt && (
              <p className="mt-2.5 text-center text-xs sm:text-sm text-white/80 max-w-md px-4">
                {images[activeLightboxIndex].alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default GetInspiredSection;
