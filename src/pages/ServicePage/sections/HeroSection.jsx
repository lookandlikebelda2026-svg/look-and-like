import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.24em] uppercase text-[#D6204E] mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              — COMPLETE SALON ATELIER MENU —
            </span>

            <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-deep-espresso tracking-tight leading-[1.1]">
              Our Services,{' '}
              <span className="italic font-normal text-[#D6204E] font-serif">
                by Category
              </span>
            </h1>
          </div>

          <div className="pb-1">
            <button
              type="button"
              onClick={() => {
                navigate('/inspiration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#F0CDD7] bg-[#FFF3F6] hover:bg-[#FFE8EF] text-[#D6204E] text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <span>Explore Lookbook Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
