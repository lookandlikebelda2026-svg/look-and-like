import React, { useState } from 'react';
import { useContentStorage } from '../../../../services/contentStorage';
import { PartnersSkeleton } from '../../../../components/common/Skeleton';
import { getOptimizedImageUrl } from '../../../../services/imagekit';

export function PartnersSection() {
  const [isPaused, setIsPaused] = useState(false);
  const { partners = [], loadingPartners } = useContentStorage();

  if (loadingPartners) {
    return <PartnersSkeleton />;
  }

  if (!partners || partners.length === 0) return null;

  // Duplicate the partners array to create an infinite, seamless loop
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="w-full bg-white py-3.5 sm:py-6 md:py-8 border-border-warm/30 overflow-hidden" id="brand-partners">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-5">
          <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.24em] uppercase text-black">
            TRUSTED BEAUTY PARTNERS
          </span>
        </div>

        {/* Carousel Container with Side Gradient Blurs */}
        <div className="relative w-full overflow-hidden py-1 sm:py-1.5">
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
            className="flex w-max gap-2.5 sm:gap-3.5 lg:gap-4.5 animate-marquee-continuous select-none"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {marqueePartners.map((partner, index) => {
              const optimizedUrl = getOptimizedImageUrl(partner.logoUrl, {
                width: 140,
                height: 60,
                quality: 65,
                format: 'webp',
              }) || partner.logoUrl;

              return (
                <div
                  key={`${partner.name}-${index}`}
                  className="shrink-0 w-20 h-10 xs:w-24 xs:h-11 sm:w-28 sm:h-12 md:w-32 md:h-13 bg-[#FFF3F6] rounded-lg sm:rounded-xl border border-[#F0CDD7]/80 shadow-2xs hover:shadow-xs hover:border-[#D6204E]/40 transition-all duration-300 flex items-center justify-center p-1 xs:p-1.5 sm:p-2 group cursor-default"
                >
                  <div className="w-full h-full flex items-center justify-center py-1 px-1.5 sm:py-1.5 sm:px-2 bg-[#FFF3F6] rounded-md sm:rounded-lg group-hover:bg-white transition-colors duration-300">
                    <img
                      src={optimizedUrl}
                      alt="Brand Partner logo"
                      className="max-h-4 xs:max-h-5 sm:max-h-6 md:max-h-7 max-w-[60px] xs:max-w-[70px] sm:max-w-[85px] md:max-w-[100px] object-contain transition-transform duration-300 group-hover:scale-105 filter contrast-125"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }
                      }}
                    />
                    <span className="hidden text-[10px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso">
                      Partner
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
