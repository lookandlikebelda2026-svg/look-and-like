import React from 'react';
import { ArrowRight, Star, MapPin, Heart } from 'lucide-react';
import { useBannerMedia } from '../../../services/bannerFirebaseService';

export function HeroSection({ onNavigate, onOpenBooking }) {
  const { heroBannerUrl, loading } = useBannerMedia();
  const tickerItems = [
    "Haircuts", "Balayage & Gloss", "Japanese Head Spa",
    "Hydra Glow Facials", "Russian BIAB Nails", "Editorial Bridal Glam",
    "Keratin Smoothing"
  ];

  const stats = [
    {
      value: "10K+",
      label: "Happy Clients",
      icon: Heart,
      iconClassName: "h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5 fill-[#D6204E] text-[#D6204E]"
    },
    {
      value: "4.8",
      label: "Rating",
      icon: Star,
      iconClassName: "h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5 fill-[#D6204E] text-[#D6204E]"
    },
    {
      value: "3",
      label: "Branches",
      icon: MapPin,
      iconClassName: "h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5 fill-[#D6204E]/20 text-[#D6204E]"
    }
  ];

  return (
    <section id="hero" className="w-full overflow-hidden bg-white">
      {/* MOBILE / TABLET VIEW (< lg): Heading & Compact Action Buttons Overlaid on Left of Photo */}
      <div className="lg:hidden flex flex-col bg-[#FFF3F6]">
        {/* Hero image with "A More Beautiful You" and Action Buttons directly overlaid */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[220px] xs:min-h-[240px] overflow-hidden bg-[#FFF3F6]">
          {loading ? (
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-[#FFF3F6] via-[#FCECEF] to-[#FFF3F6]" />
          ) : heroBannerUrl ? (
            <img
              src={heroBannerUrl}
              alt="Look & Like Luxury Beauty Parlour Experience"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover object-[78%_center] xs:object-center select-none"
            />
          ) : null}

          {/* Soft gradient wash on left and bottom of image for crystal-clear heading contrast */}
          {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FFF3F6] via-[#FFF3F6]/85 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-[#FFF3F6]/90 via-[#FFF3F6]/45 to-transparent" /> */}

          {/* "A More Beautiful You" + Action Buttons overlaid on the left of the photo */}
          <div className="absolute inset-0 flex flex-col justify-end items-start text-left px-4 xs:px-5 pb-3 xs:pb-4 z-10">
            <h1 className="flex flex-col items-start leading-[1.05] tracking-tight max-w-[75%]">
              <span className="font-serif text-[20px] xs:text-[23px] sm:text-2xl font-bold text-black drop-shadow-xs">
                A More
              </span>
              <span className="mt-0.5 font-script text-[30px] xs:text-[34px] sm:text-4xl text-[#D6204E] drop-shadow-xs">
                Beautiful You
              </span>
            </h1>

            {/* CTA Buttons directly below "Beautiful You" text */}
            <div className="mt-2 xs:mt-2.5 flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenBooking?.()}
                className="group inline-flex min-h-[28px] xs:min-h-[30px] sm:min-h-[32px] items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] px-3 xs:px-3.5 py-1 text-[9.5px] xs:text-[10px] font-semibold text-white shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Book appointment</span>
                <ArrowRight className="h-2.5 w-2.5 xs:h-3 xs:w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
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
                className="group inline-flex min-h-[28px] xs:min-h-[30px] sm:min-h-[32px] items-center justify-center gap-1 rounded-full border border-[#D6204E]/40 hover:border-[#D6204E] bg-white/95 hover:bg-white backdrop-blur-xs px-3 xs:px-3.5 py-1 text-[9.5px] xs:text-[10px] font-semibold text-deep-espresso hover:text-[#D6204E] active:scale-95 cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <span>Explore Services</span>
                <ArrowRight className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-[#D6204E]/70 group-hover:text-[#D6204E] transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard Card below the photo */}
        <div className="flex flex-col items-start px-4 xs:px-5 pt-2.5 pb-4 bg-[#FFF3F6]">
          <div className="w-full max-w-xs xs:max-w-sm rounded-2xl bg-white/95 backdrop-blur-xs shadow-xs py-2 px-3">
            <div className="flex items-center justify-between">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <React.Fragment key={idx}>

                    <div className="flex flex-1 items-center justify-center gap-1.5 xs:gap-2 px-0.5">
                      <div className="flex h-7 w-7 xs:h-8 xs:w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF3F6] to-[#FFE8EF] shrink-0">
                        <IconComponent className={stat.iconClassName} />
                      </div>
                      <div className="min-w-0 text-left flex flex-col justify-center">
                        <span className="block text-xs xs:text-sm font-bold leading-tight text-[#D6204E] tracking-tight">
                          {stat.value}
                        </span>
                        <span className="block text-[7.5px] xs:text-[8.5px] font-semibold uppercase tracking-wider text-black whitespace-nowrap leading-none mt-0">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (lg+): Full-screen luxury background banner */}
      <div className="relative isolate hidden lg:flex min-h-[calc(100vh-64px)] min-h-[calc(100dvh-64px)] items-center justify-center overflow-hidden bg-[#FFF3F6]">
        {/* Background Image */}
        {loading ? (
          <div className="absolute inset-0 -z-20 h-full w-full animate-pulse bg-gradient-to-r from-[#FFF3F6] via-[#FCECEF] to-[#FFF3F6]" />
        ) : heroBannerUrl ? (
          <img
            src={heroBannerUrl}
            alt="Look & Like Luxury Beauty Parlour Experience"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full select-none object-cover sm:object-center"
          />
        ) : null}

        {/* Responsive Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />

        {/* Content Container */}
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start px-12 py-16 text-left">
          {/* Heading */}
          <h1 className="mb-4 flex flex-col items-start leading-[1.06] tracking-tight">
            <span className="font-serif text-5xl lg:text-6xl font-bold text-black">
              A More
            </span>
            <span className="mt-1 font-script text-6xl lg:text-7xl text-[#D6204E]">
              Beautiful You
            </span>
          </h1>

          {/* CTA Action Buttons */}
          <div className="mb-10 flex gap-3.5 justify-start">
            <button
              type="button"
              onClick={() => onOpenBooking?.()}
              className="group inline-flex min-h-[34px] sm:min-h-[36px] items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-[#D6204E] to-[#B81942] px-4 sm:px-4.5 py-1.5 sm:py-2 text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-[#B81942] hover:to-[#961234] active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Book appointment</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
              className="group inline-flex min-h-[34px] sm:min-h-[36px] items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[#D6204E]/40 hover:border-[#D6204E] bg-white/95 hover:bg-white backdrop-blur-xs px-4 sm:px-4.5 py-1.5 sm:py-2 text-xs font-semibold text-deep-espresso hover:text-[#D6204E] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4 text-[#D6204E]/80 group-hover:text-[#D6204E] transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
            </a>
          </div>

          {/* Statistics Dashboard Card */}
          <div className="inline-flex items-center rounded-2xl bg-white/90 backdrop-blur-md shadow-sm px-6 py-3.5">
            <div className="flex items-center gap-6">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <React.Fragment key={idx}>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF3F6] to-[#FFE8EF] shrink-0">
                        <IconComponent className={stat.iconClassName} />
                      </div>
                      <div className="min-w-0 text-left flex flex-col justify-center">
                        <span className="block text-xl font-bold leading-tight text-[#D6204E] tracking-tight">
                          {stat.value}
                        </span>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-black whitespace-nowrap leading-none mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
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
        <div className="animate-ticker inline-flex w-max items-center gap-4 xs:gap-5 sm:gap-8 whitespace-nowrap text-[9.5px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-black">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="hover:text-[#D6204E] transition-colors">{item}</span>
              <span className="text-[#D6204E] text-xs">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
