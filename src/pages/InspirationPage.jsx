import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { useContentStorage } from '../services/contentStorage';

export function InspirationPage({ onOpenBooking, onNotify }) {
  const navigate = useNavigate();
  const { inspiredImages } = useContentStorage();
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => 
          prev === inspiredImages.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => 
          prev === 0 ? inspiredImages.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, inspiredImages.length]);

  const currentLightboxItem = activeLightboxIndex !== null ? inspiredImages[activeLightboxIndex] : null;

  return (
    <div className="w-full bg-white py-4 sm:py-8 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-8">
        {/* Gallery Header & Navigation Bar */}
        <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black mb-3">

            Editorial Lookbook &amp; Inspiration
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-deep-espresso tracking-tight">
            Curated Atelier Looks
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#7A6B70] max-w-lg mx-auto leading-relaxed">
            Browse our hand-selected archive of hairstyles, glowing facials, couture nail art and bridal looks crafted by our master stylists.
          </p>

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

        {/* Pure Images Masonry Gallery */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-5 space-y-3 sm:space-y-4 md:space-y-5">
          {inspiredImages.map((image, idx) => (
            <div
              key={image.id || idx}
              onClick={() => setActiveLightboxIndex(idx)}
              className="break-inside-avoid relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 cursor-pointer group bg-stone-50"
            >
              <img
                src={image.imageUrl}
                alt=""
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-103 select-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Pure Image Lightbox */}
      {currentLightboxItem && (
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
              setActiveLightboxIndex((prev) => (prev === inspiredImages.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Central Image */}
          <div 
            className="relative max-w-5xl max-h-[92vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentLightboxItem.imageUrl}
              alt=""
              className="max-h-[90vh] max-w-full w-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
