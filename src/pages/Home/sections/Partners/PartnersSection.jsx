import React, { useState } from 'react';
import { useContentStorage } from '../../../../services/contentStorage';

export function PartnersSection() {
  const [isPaused, setIsPaused] = useState(false);
  const { partners } = useContentStorage();

  // Duplicate the partners array to create an infinite, seamless loop
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="w-full bg-white py-6 sm:py-10 md:py-12 border-border-warm/30 overflow-hidden" id="brand-partners">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-7">
          <span className="inline-block text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-black">
            TRUSTED BEAUTY PARTNERS
          </span>
        </div>

        {/* Carousel Container with Side Gradient Blurs */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Left Gradient Blur */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-r from-white via-white/85 to-transparent z-10"
            aria-hidden="true"
          />

          {/* Right Gradient Blur */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-l from-white via-white/85 to-transparent z-10"
            aria-hidden="true"
          />

          {/* Continuously Moving Marquee Track */}
          <div
            className="flex w-max gap-3 sm:gap-5 lg:gap-6 animate-marquee-continuous select-none"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {marqueePartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="shrink-0 w-28 h-14 xs:w-32 xs:h-16 sm:w-40 sm:h-20 bg-[#FFF3F6] rounded-xl sm:rounded-2xl border border-[#F0CDD7]/90 shadow-2xs hover:shadow-md hover:border-[#D6204E]/50 transition-all duration-300 flex items-center justify-center p-2 sm:p-3 group cursor-default"
              >
                <div className="w-full h-full flex items-center justify-center py-1.5 px-2.5 sm:py-2 sm:px-3 bg-[#FFF3F6] rounded-lg sm:rounded-xl group-hover:bg-white transition-colors duration-300">
                  <img
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    className="max-h-6 xs:max-h-7 sm:max-h-8 md:max-h-9 max-w-[85px] xs:max-w-[100px] sm:max-w-[125px] object-contain transition-transform duration-300 group-hover:scale-105 filter contrast-125"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }
                    }}
                  />
                  <span className="hidden text-xs sm:text-sm font-bold uppercase tracking-wider text-deep-espresso">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
