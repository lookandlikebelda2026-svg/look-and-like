import React from 'react';
import ctaBannerImage from '../../../asset/CTA.png';
import { ArrowRight } from 'lucide-react';
import { LotusIcon } from '../../../components/icons';

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
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 border border-[#F0CDD7]/80 min-h-[140px] xs:min-h-[160px] sm:min-h-[190px] md:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#FFF3F6]">
          {/* Background Image from Assets */}
          <img
            src={ctaBannerImage}
            alt="Look & Like Beauty Salon Experience"
            className="absolute inset-0 w-full h-full object-fit object-[80%_center] xs:object-[82%_center] sm:object-center select-none pointer-events-none"
            loading="lazy"
          />

          {/* Soft Left Ambient Gradient for logo readability on all viewports */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/25 to-transparent sm:from-transparent pointer-events-none" />

          {/* Left Element: Brand Logo & Title */}
          <div className="absolute left-2.5 xs:left-4 sm:left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 flex flex-col items-center text-center select-none z-10">
            <LotusIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#D6204E] mb-0.5 sm:mb-1 drop-shadow-xs" />
            <h2 className="font-serif text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-[2.6rem] font-bold text-[#D6204E] tracking-tight leading-none whitespace-nowrap">
              Look &amp; Like
            </h2>
            <span className="font-sans text-[6.5px] xs:text-[7.5px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.22em] xs:tracking-[0.26em] sm:tracking-[0.32em] text-[#8F2946] font-semibold mt-0.5 sm:mt-1 whitespace-nowrap">
              Beauty Salon
            </span>
          </div>

          {/* Center Element: Pill CTA Button (Dead Center of the banner) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button
              type="button"
              onClick={handleBooking}
              className="inline-flex min-h-[36px] xs:min-h-[40px] sm:min-h-[46px] items-center justify-center gap-1.5 sm:gap-2.5 bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white font-medium text-[10px] xs:text-xs sm:text-sm md:text-[15px] px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95 group whitespace-nowrap"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Decorative Lotus Flower Divider matching mockup */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10 select-none" aria-hidden="true">
          <div className="h-[1px] w-16 sm:w-36 md:w-48 bg-[#F0CDD7]" />
          <LotusIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#D6204E]" />
          <div className="h-[1px] w-16 sm:w-36 md:w-48 bg-[#F0CDD7]" />
        </div>
      </div>
    </section>
  );
}
