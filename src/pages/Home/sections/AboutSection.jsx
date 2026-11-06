import React, { useState } from 'react';
import { Sparkles, GraduationCap, Award, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../../../components/icons';
import { SOCIAL_LINKS } from '../../../constants/navigation';
import { useBannerMedia } from '../../../services/bannerFirebaseService';
import { AboutCarouselSkeleton } from '../../../components/common/Skeleton';

export function AboutSection() {
  const { aboutPhotos, loading } = useBannerMedia();
  const photos = Array.isArray(aboutPhotos) ? aboutPhotos : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const safeIndex = photos.length > 0 ? Math.min(currentIndex, photos.length - 1) : 0;

  const prevSlide = () => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev <= 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev >= photos.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile finger slide
  const minSwipeDistance = 40;

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      nextSlide(); // Finger slide left -> next
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Finger slide right -> prev
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };


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

        {/* Framing Grid */}
        <div className={`grid grid-cols-1 ${loading || photos.length > 0 ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-8 sm:gap-12 items-center`}>
          {/* Photo Slider / Carousel Column (or Skeleton while loading) */}
          {loading ? (
            <AboutCarouselSkeleton />
          ) : photos.length > 0 ? (
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Main Interactive Carousel Card */}
              <div
                className="relative w-full h-[380px] xs:h-[430px] sm:h-[480px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#F0CDD7] select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Slides Track */}
                <div
                  className="w-full h-full flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${safeIndex * 100}%)` }}
                >
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="w-full h-full shrink-0 relative flex items-center justify-center bg-[#1A1215] overflow-hidden"
                    >
                      {/* Ambient blurred background layer for aspect ratio perfection */}
                      <img
                        src={photo.url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
                      />

                      {/* Crisp foreground image */}
                      <img
                        className="relative z-10 max-h-full max-w-full object-contain mx-auto select-none pointer-events-none drop-shadow-md"
                        alt={photo.alt || 'Founder photo'}
                        src={photo.url}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>

                {/* Slide Counter Chip (Top-Right) */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold tracking-wider">
                  {safeIndex + 1} / {photos.length}
                </div>

                {/* Laptop / Desktop Navigation Arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous photo"
                      className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/90 hover:bg-white text-deep-espresso hover:text-[#D6204E] shadow-xl items-center justify-center border border-[#F0CDD7] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-hidden"
                    >
                      <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next photo"
                      className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/90 hover:bg-white text-deep-espresso hover:text-[#D6204E] shadow-xl items-center justify-center border border-[#F0CDD7] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-hidden"
                    >
                      <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Indicators Strip */}
              {photos.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 w-full">
                  {photos.map((photo, idx) => {
                    const isActive = idx === safeIndex;
                    return (
                      <button
                        key={photo.id || idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`relative rounded-lg overflow-hidden transition-all duration-300 border focus:outline-hidden ${
                          isActive
                            ? 'w-12 sm:w-14 h-12 sm:h-14 ring-2 ring-[#D6204E] border-[#D6204E] shadow-md scale-105'
                            : 'w-9 sm:w-10 h-9 sm:h-10 border-[#F0CDD7] opacity-60 hover:opacity-100 hover:scale-100'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.alt || `Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#D6204E]/15" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* Narrative / Points Content */}
          <div className={`${loading || photos.length > 0 ? 'lg:col-span-6 lg:pl-6' : 'w-full'} flex flex-col items-start`}>
            <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
              FOUNDER &amp; MASTER BEAUTICIAN
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-deep-espresso leading-tight mb-4 sm:mb-6">
              Shiuli Giri Maity
            </h3>

            {/* Key Information Points */}
            <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8 w-full">
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#4A3E42] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </span>
                <span>
                  <strong>Shiuli Giri Maity</strong>, wife of Manaskam Maity, is a professional beautician based in <strong>Belda, West Bengal</strong>.
                </span>
              </li>

              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#4A3E42] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                </span>
                <span>
                  <strong>Educational Qualification:</strong> Master of Arts (M.A.).
                </span>
              </li>

              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#4A3E42] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-3 h-3" />
                </span>
                <span>
                  <strong>Specialization:</strong> Professional beauty services, makeup artistry, nail &amp; celebrity makeup.
                </span>
              </li>

              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#4A3E42] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-3 h-3" />
                </span>
                <span>
                  With a passion for beauty, creativity, and style, dedicated to providing professional beauty and makeup services.
                </span>
              </li>
            </ul>

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
