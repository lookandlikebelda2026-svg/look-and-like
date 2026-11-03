import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import skinCareImg from '../../../../asset/services/service-skin.png';
import hairCareImg from '../../../../asset/services/service-hair.png';
import nailCareImg from '../../../../asset/services/service-nails.png';
import makeUpImg from '../../../../asset/services/service-makeup.png';
import spaImg from '../../../../asset/services/service-spa.png';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
  SpaWellnessIcon,
} from '../../../../components/icons';

/**
 * 4 Core Service Showcase Cards matching the dedicated atelier service card design
 */
const SERVICE_CARDS = [
  {
    id: 'skin-care',
    categoryKey: 'skin',
    title: 'Skin Care',
    subtitle: 'Facials, Cleanups, Anti-Aging & More',
    tagline: 'Clinical Bio-Active & Radiant Glow Facials',
    image: skinCareImg,
    startingPrice: '₹1,999',
    treatmentCount: '4 TREATMENTS',
    icon: <LotusIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'hair-care',
    categoryKey: 'hair',
    title: 'Hair Care',
    subtitle: 'Haircuts, Styling, Spa, Smoothening & More',
    tagline: 'Architectural Cuts, Balayage & Keratin Infusion',
    image: hairCareImg,
    startingPrice: '₹1,499',
    treatmentCount: '5 TREATMENTS',
    icon: <HairShearsIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'nail-care',
    categoryKey: 'nails',
    title: 'Nail Care',
    subtitle: 'Manicure, Pedicure, Nail Art & More',
    tagline: 'Russian BIAB, Couture Extensions & Spa Pedicures',
    image: nailCareImg,
    startingPrice: '₹999',
    treatmentCount: '4 TREATMENTS',
    icon: <NailCareIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'make-up',
    categoryKey: 'makeup',
    title: 'Make Up',
    subtitle: 'Bridal, Party, HD Makeup & More',
    tagline: 'Haute Bridal Glamour, Party HD & Editorial Looks',
    image: makeUpImg,
    startingPrice: '₹3,999',
    treatmentCount: '4 TREATMENTS',
    icon: <MakeUpBrushIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  }
];

export function ServicesSection({ onSelectService, onNavigate }) {
  const navigate = useNavigate();

  const handleCardClick = (categoryKey) => {
    navigate(`/services#category-${categoryKey}`);
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white py-6 sm:py-10 scroll-mt-20" id="services">
      <span id="curated-services" className="sr-only" aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header: Centered Title with Right-Aligned "View All →" */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="w-14 sm:w-24 shrink-0" aria-hidden="true" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight text-center flex-1">
            Our Services
          </h2>
          <div className="w-14 sm:w-24 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-[#D6204E] hover:text-[#B81942] font-semibold text-xs sm:text-sm md:text-[15px] flex items-center gap-1 transition-colors group cursor-pointer whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 4 Core Services Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-5">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.categoryKey)}
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer w-full"
            >
              {/* Card Image Banner */}
              <div className="relative w-full h-48 xs:h-52 sm:h-48 md:h-52 bg-[#FFF3F6] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                {/* Highly Visible Circular White Badge overlapping bottom-left */}
                <div className="absolute left-3.5 sm:left-4 -bottom-4.5 sm:-bottom-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border-2 border-white ring-1 ring-[#F0CDD7] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {card.icon}
                </div>

                {/* Tag on Image matching screenshot */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full border border-white/80 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6204E]" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D6204E]">
                    {card.treatmentCount}
                  </span>
                </div>
              </div>

              {/* Card Details: Title, Subtitle, Starting Price, Reserve Category */}
              <div className="pt-6 sm:pt-7 pb-4 px-3.5 sm:px-4 flex flex-col flex-1 justify-between bg-white relative z-10">
                <div>
                  <div className="flex items-baseline justify-between gap-1 mb-1">
                    <h3 className="font-bold text-base sm:text-lg text-deep-espresso group-hover:text-[#D6204E] transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <span className="text-[11px] sm:text-xs font-serif italic font-semibold text-[#D6204E] whitespace-nowrap">
                      Starting from {card.startingPrice}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#7A6B70] leading-snug mb-2.5 line-clamp-2">
                    {card.subtitle}
                  </p>

                  <p className="text-[10px] sm:text-[11px] text-[#5C4D52] bg-[#FAF8F5] p-2 rounded-xl border border-border-warm/60 mb-3 leading-normal font-sans line-clamp-1">
                    ✦ {card.tagline}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card.categoryKey);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-3 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer mt-1"
                >
                  <span>Reserve {card.title} Chair</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
