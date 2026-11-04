import React from 'react';
import { ABOUT_ASSETS } from '../../../constants/team';

export function AboutSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-16 scroll-mt-20" id="about-us">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading: Centered Eyebrow + Title */}
        <div className="mb-6 sm:mb-10 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            KNOW MORE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            About Us
          </h2>
        </div>

        {/* Story Narrative & Architectural Framing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Interior Architecture Photo Cluster */}
          <div className="lg:col-span-6 relative">
            <div className="w-full h-[280px] sm:h-[380px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#F0CDD7]/80">
              <img
                className="w-full h-full object-cover"
                alt={ABOUT_ASSETS.interiorAlt}
                src={ABOUT_ASSETS.interiorUrl}
                loading="lazy"
              />
            </div>

            {/* Overlapping Secondary Detail Card */}
            <div className="absolute -bottom-5 sm:-bottom-7 -right-3 sm:-right-6 w-44 sm:w-60 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl hidden sm:block border border-[#F0CDD7]">
              <div className="w-full h-24 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden mb-2">
                <img
                  className="w-full h-full object-cover"
                  alt={ABOUT_ASSETS.suiteAlt}
                  src={ABOUT_ASSETS.suiteUrl}
                  loading="lazy"
                />
              </div>
              <p className="font-bold text-xs sm:text-sm text-deep-espresso">Private Suites</p>
              <p className="text-[10px] sm:text-[11px] text-[#7A6B70] leading-snug">
                Uninterrupted peace for mindful restoration.
              </p>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pl-6">
            <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
              OUR STUDIO PHILOSOPHY
            </span>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-deep-espresso leading-tight mb-3 sm:mb-4">
              A sanctuary for  
              <span className="italic font-normal text-black font-serif"> your</span> beauty ritual
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#5C4D52] mb-3 sm:mb-4 leading-relaxed">
              Look &amp; Like was created for people who want salon results without the salon rush. Private styling stations, premium international products, and artists who truly listen.
            </p>
            <p className="text-xs sm:text-sm text-[#7A6B70] mb-5 sm:mb-6 leading-relaxed">
              Sip a warm herbal infusion or artisanal espresso, unwind in acoustic tranquility, and leave feeling like the most radiant version of yourself.
            </p>

            {/* 3 Stats Counters */}
            <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-6 w-full pt-5 border-t border-[#F0CDD7]/70">
              <div className="text-center sm:text-left">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#D6204E] font-bold block leading-none">
                  8+
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#5C4D52] uppercase tracking-wider block mt-1.5 font-semibold leading-tight">
                  Years of Excellence
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#D6204E] font-bold block leading-none">
                  18+
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#5C4D52] uppercase tracking-wider block mt-1.5 font-semibold leading-tight">
                  Master Artists
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-2xl sm:text-3xl lg:text-4xl text-[#D6204E] font-bold block leading-none">
                  45k+
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#5C4D52] uppercase tracking-wider block mt-1.5 font-semibold leading-tight">
                  Happy Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
