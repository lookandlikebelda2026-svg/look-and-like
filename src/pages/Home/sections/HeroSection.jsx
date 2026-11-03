import React from 'react';
import heroBgImage from '../../../asset/Hero.png';
import { ArrowRight, Star, MapPin, Sparkles } from 'lucide-react';

export function HeroSection({ onNavigate, onOpenBooking }) {
  const tickerItems = [
    "Haircuts", "Balayage & Gloss", "Japanese Head Spa",
    "Hydra Glow Facials", "Russian BIAB Nails", "Editorial Bridal Glam",
    "Keratin Smoothing"
  ];

  const stats = [
    {
      value: "10K+",
      label: "Happy Clients",
      icon: Sparkles,
      iconClassName: "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 shrink-0 text-[#D6204E]"
    },
    {
      value: "4.8",
      label: "Google Rating",
      icon: Star,
      iconClassName: "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 shrink-0 fill-[#D6204E]/20 text-[#D6204E]"
    },
    {
      value: "3",
      label: "Branches",
      icon: MapPin,
      iconClassName: "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 shrink-0 text-[#D6204E]"
    }
  ];

  return (
    <section id="hero" className="w-full overflow-hidden bg-white">
      {/* Hero Banner */}
      <div className="relative isolate flex min-h-[500px] xs:min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] items-center justify-center overflow-hidden bg-[#FFF3F6]">
        {/* Background Image */}
        <img
          src={heroBgImage}
          alt="Look & Like Luxury Beauty Salon Experience"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full select-none object-cover object-[75%_center] sm:object-center"
        />

        {/* Responsive Overlay */}
        <div className="" />

        {/* Content Container */}
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 xs:py-10 sm:px-8 sm:py-14 lg:items-start lg:px-12 lg:py-16 text-center lg:text-left">
          {/* Eyebrow Badge */}
          <span className="mb-2.5 xs:mb-3 sm:mb-4 inline-flex items-center gap-1.5 xs:gap-2 rounded-full border border-[#D6204E]/20 bg-white/85 backdrop-blur-xs px-3 py-1 xs:py-1.5 text-[9.5px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] xs:tracking-[0.2em] text-[#D6204E] shadow-2xs">
            <Sparkles className="h-3 w-3 xs:h-3.5 w-3.5" />
            Top Rated Salon
          </span>

          {/* Heading */}
          <h1 className="mb-2.5 xs:mb-3 sm:mb-4 flex flex-col items-center leading-[1.06] tracking-tight lg:items-start">
            <span className="font-serif text-[28px] xs:text-3xl sm:text-5xl lg:text-6xl font-bold text-deep-espresso">
              A More
            </span>
            <span className="mt-0.5 sm:mt-1 font-script text-[36px] xs:text-4xl sm:text-6xl lg:text-7xl text-[#D6204E]">
              Beautiful You
            </span>
          </h1>

          {/* Description */}
          <p className="mb-5 sm:mb-6 lg:mb-8 max-w-[280px] xs:max-w-sm sm:max-w-md text-xs xs:text-sm sm:text-base leading-relaxed text-[#5C4D52]">
            Expert beauty treatments for skin, hair, nails and wellness.
          </p>

          {/* CTA Action Buttons */}
          <div className="mb-6 xs:mb-7 sm:mb-8 lg:mb-10 flex w-full max-w-xs xs:max-w-sm sm:max-w-none  xs:flex-row gap-2.5 xs:gap-3.5 sm:justify-center lg:justify-start">
            <button
              type="button"
              onClick={() => onOpenBooking?.()}
              className="group inline-flex min-h-[44px] xs:min-h-12 w-full xs:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D6204E] to-[#B81942] px-5 xs:px-6 py-2.5 xs:py-3 text-xs xs:text-sm font-semibold text-white shadow-md shadow-[#D6204E]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#B81942] hover:to-[#961234] hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Book appointment</span>
              <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <a
              href="#services"
              onClick={(e) => {
                const el = document.getElementById('services');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                } else if (onNavigate) {
                  e.preventDefault();
                  onNavigate("services");
                }
              }}
              className="inline-flex min-h-[44px] xs:min-h-12 w-full xs:w-auto items-center justify-center rounded-full border border-[#F0CDD7] bg-white/90 backdrop-blur-xs px-5 xs:px-6 py-2.5 xs:py-3 text-xs xs:text-sm font-semibold text-deep-espresso transition-all duration-300 hover:border-[#D6204E] hover:bg-white hover:text-[#D6204E] active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Explore Services
            </a>
          </div>

          {/* Statistics Dashboard Card */}
          <div className=" rounded-2xl  bg-white border border-[#F0CDD7]/80 shadow-xs p-3 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none sm:p-0">
            <div className="flex gap-5  ">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2.5 lg:justify-start px-1 sm:px-0"
                  >
                    <IconComponent className={stat.iconClassName} />
                    <div className="min-w-0 text-center sm:text-left">
                      <span className="block text-sm xs:text-base sm:text-xl font-bold leading-none text-deep-espresso">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-[7.5px] xs:text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#6B5A60] whitespace-nowrap">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Decorative Floating Text */}
        <div className="pointer-events-none absolute bottom-6 right-8 z-10 hidden select-none flex-col items-center text-center text-white drop-shadow-lg xl:flex">
          <span className="font-script text-3xl leading-tight">
            Beauty Beyond Boundaries
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em]">
            LOOK &amp; LIKE
          </span>
        </div>

        {/* Decorative Accent */}
        <span className="pointer-events-none absolute bottom-4 right-5 hidden select-none text-sm text-[#D6204E]/80 sm:block">
          ✦
        </span>
      </div>

      {/* Seamless Continuous Ticker Ribbon */}
      <div className="overflow-hidden border-y border-border-warm bg-white py-2.5 sm:py-3.5 shadow-2xs">
        <div className="animate-ticker inline-flex w-max items-center gap-4 xs:gap-5 sm:gap-8 whitespace-nowrap text-[9.5px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-deep-espresso">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              <span className="text-[#D6204E] text-xs">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
