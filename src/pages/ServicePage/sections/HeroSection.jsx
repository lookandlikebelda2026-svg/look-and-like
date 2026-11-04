import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export function HeroSection({ onOpenBooking }) {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-4 pb-2 sm:pt-6 sm:pb-4">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto pt-2">
          {/* Eyebrow Capsule Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black mb-3">
            Complete Salon Atelier Menu
          </span>

          {/* Centered Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-deep-espresso tracking-tight">
            Our Services,{' '}
            <span className="italic font-normal text-black font-serif">
              by Category
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-2 text-xs sm:text-sm text-[#7A6B70] max-w-lg mx-auto leading-relaxed">
            Explore our curated salon menu of bespoke hair care, glowing clinical facials, couture nail art, and bridal rituals crafted by master artists.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-3.5 sm:mt-5 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 max-w-full px-1">
            <button
              type="button"
              onClick={() => {
                navigate('/inspiration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex min-h-[26px] xs:min-h-[28px] sm:min-h-[32px] items-center justify-center gap-1 sm:gap-1.5 px-2.5 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full border border-border-warm bg-white hover:border-deep-espresso text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-medium text-deep-espresso transition-all hover:bg-neutral-50 cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
            >
              <span className="sm:hidden">Lookbook</span>
              <span className="hidden sm:inline">Explore Lookbook &amp; Gallery</span>
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
      </div>
    </section>
  );
}

export default HeroSection;
