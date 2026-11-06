import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LOGO_URL } from '../../../constants/navigation';

const CTA_BANNER_IMAGE_URL = 'https://ik.imagekit.io/gpuanod0d/banners/cta-banner.jpg';

export function CtaBannerSection({ onOpenBooking }) {
  const handleBooking = (e) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.querySelector('#branch-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white pt-5 sm:pt-8 md:pt-10 pb-4 sm:pb-6" id="cta-banner">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Main Panoramic Banner Card */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 border border-[#F0CDD7]/80 min-h-[155px] xs:min-h-[170px] sm:min-h-[190px] md:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#FFF3F6]">
          {/* Background Image: High-Resolution Atelier Beauty Banner */}
          <img
            src={CTA_BANNER_IMAGE_URL}
            alt="Look & Like Beauty Parlour Experience"
            className="absolute inset-0 w-full h-full object-cover object-[85%_center] xs:object-[80%_center] sm:object-right select-none pointer-events-none"
            loading="lazy"
          />

          {/* Responsive Left Ambient Scrim for Flawless Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:from-white/90 sm:via-white/45 sm:to-transparent pointer-events-none" />

          {/* PHONE LAYOUT (< sm): Stacked brand + button in the left 60%, model on right */}
          <div className="relative z-10 flex sm:hidden flex-col justify-center items-start pl-4 xs:pl-6 pr-2 max-w-[62%] h-full py-4 gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg xs:text-xl font-bold text-black tracking-tight leading-none">
                  Look &amp; Like
                </span>
                <span className="text-[7.5px] xs:text-[8.5px] uppercase tracking-[0.22em] text-black font-semibold mt-0.5">
                  Beauty Parlour
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              className="inline-flex items-center justify-center gap-1 bg-black hover:bg-neutral-800 active:bg-neutral-900 text-white font-medium text-[9px] xs:text-[10px] px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-full shadow-2xs active:scale-95 transition-all cursor-pointer whitespace-nowrap mt-1"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* DESKTOP LAYOUT (sm+): Left brand, centered button, model on right */}
          <div className="relative z-10 hidden sm:flex items-center justify-between w-full h-full px-8 md:px-12 lg:px-16">
            {/* Left: Brand Logo & Title */}
            <div className="flex flex-col items-center text-center select-none shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-1 drop-shadow-xs shrink-0">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-black tracking-tight leading-none whitespace-nowrap">
                Look &amp; Like
              </h2>
              <span className="font-sans text-[8.5px] md:text-[9.5px] lg:text-[11px] uppercase tracking-[0.28em] text-black font-semibold mt-1 whitespace-nowrap">
                Beauty Parlour
              </span>
            </div>

            {/* Center: CTA Pill Button in Premium Black */}
            <div className="flex justify-center flex-1 px-4">
              <button
                type="button"
                onClick={handleBooking}
                className="inline-flex min-h-[32px] sm:min-h-[34px] md:min-h-[36px] items-center justify-center gap-1.5 sm:gap-2 bg-black hover:bg-neutral-800 active:bg-neutral-900 text-white font-semibold text-[11px] sm:text-xs md:text-[13px] px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:scale-102 active:scale-95 cursor-pointer whitespace-nowrap group"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Spacer so model on the right remains fully visible */}
            <div className="w-24 md:w-36 lg:w-52 shrink-0 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

      </div>
    </section>
  );
}

export default CtaBannerSection;
